/**
 * GET /api/marketpulse/snapshot?submarket=thousand-oaks
 *
 * Data strategy:
 * 1. Hard metrics (median price, active listings, DOM, price/sf, months supply, etc.)
 *    → Google Sheets (InfoSparks data, manually maintained by Mike)
 *    → Cached in memory for 10 min, Google caches the CSV for 1hr
 *
 * 2. AI market summary → Perplexity (unchanged)
 *    → Cached in Supabase by submarket + month
 *    → Re-generated if stale (>24hr)
 *
 * Rentcast is no longer used.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { SubmarketKey, MarketSnapshotResponse } from "@/lib/types";
import type { SheetsDataResponse } from "../sheets-data/route";

const SUBMARKET_LABELS: Record<SubmarketKey, string> = {
  "thousand-oaks": "Thousand Oaks",
  "newbury-park":  "Newbury Park",
  ventura:         "Ventura",
  camarillo:       "Camarillo",
  westlake:        "Westlake Village",
  oxnard:          "Oxnard",
};
const VALID_SUBMARKETS = new Set(Object.keys(SUBMARKET_LABELS));

// ─── Supabase (AI summary cache only) ────────────────────────────────────────
function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ─── L1 in-memory cache ───────────────────────────────────────────────────────
const memCache = new Map<string, { data: MarketSnapshotResponse; ts: number }>();
const MEM_TTL = 1000 * 60 * 10; // 10 min

// ─── Fetch sheets data (calls our own sheets-data route internally) ───────────
async function fetchSheetsData(submarket: SubmarketKey, baseUrl: string): Promise<SheetsDataResponse | null> {
  try {
    const res = await fetch(`${baseUrl}/api/marketpulse/sheets-data?submarket=${submarket}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return await res.json() as SheetsDataResponse;
  } catch { return null; }
}

// ─── Get or generate AI summary from Supabase + Perplexity ───────────────────
async function getAiSummary(submarket: SubmarketKey, label: string): Promise<string> {
  const supabase = getSupabase();
  const currentMonth = new Date().toISOString().slice(0, 7); // "2026-04"

  // Check Supabase cache
  if (supabase) {
    const { data } = await supabase
      .from("marketpulse_snapshots")
      .select("ai_summary, snapshot_date")
      .eq("submarket", submarket)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .single();

    if (data?.ai_summary && data.snapshot_date?.slice(0, 7) === currentMonth) {
      return data.ai_summary;
    }
  }

  // Generate fresh summary via Perplexity
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return `Market data for ${label} sourced from MLS records.`;

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "sonar",
        messages: [{
          role: "user",
          content: `Write a concise 2-3 sentence real estate market summary for ${label}, California for ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. Focus on current buyer/seller conditions, price trends, and inventory. Be factual and specific to this local market.`,
        }],
        max_tokens: 200,
      }),
    });
    const j = await res.json();
    const summary = j?.choices?.[0]?.message?.content ?? `${label} market data updated monthly from MLS records.`;

    // Cache in Supabase
    if (supabase) {
      await supabase.from("marketpulse_snapshots").upsert({
        submarket,
        snapshot_date: new Date().toISOString().slice(0, 10),
        ai_summary: summary,
        market_balance: "balanced",
        updated_at: new Date().toISOString(),
      }, { onConflict: "submarket,snapshot_date" });
    }

    return summary;
  } catch {
    return `${label} market data sourced from MLS records and updated monthly.`;
  }
}

// ─── Determine market balance from months of supply ───────────────────────────
function getMarketBalance(mos: number | null): "buyers" | "balanced" | "sellers" {
  if (mos === null) return "balanced";
  if (mos < 3) return "sellers";
  if (mos > 6) return "buyers";
  return "balanced";
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("submarket") ?? "thousand-oaks";
  const submarket: SubmarketKey = VALID_SUBMARKETS.has(raw) ? (raw as SubmarketKey) : "thousand-oaks";
  const label = SUBMARKET_LABELS[submarket];

  // L1: memory cache
  const cached = memCache.get(submarket);
  if (cached && Date.now() - cached.ts < MEM_TTL) {
    return NextResponse.json(cached.data, { headers: { "X-Cache": "MEM" } });
  }

  // Derive base URL for internal fetch
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    // Fetch sheets data + AI summary in parallel
    const [sheets, aiSummary] = await Promise.all([
      fetchSheetsData(submarket, baseUrl),
      getAiSummary(submarket, label),
    ]);

    if (!sheets) {
      return NextResponse.json({ error: "Sheet data unavailable" }, { status: 503 });
    }

    const { latest, medianPrice } = sheets;

    // Build priceHistory from median price sheet (SFR only from this sheet)
    const priceHistory = medianPrice
      .filter(r => r.value !== null)
      .map(r => ({
        month: r.month,
        sfr: r.value,
        condo: null,
        townhome: null,
      }));

    const response: MarketSnapshotResponse = {
      submarket,
      label,
      medianPrice: latest.medianPrice,
      medianPriceChangePct: latest.medianPriceChangePct,
      avgDaysOnMarket: latest.daysOnMarket,
      activeListings: latest.activeListings,
      pricePerSqft: latest.pricePerSf,
      monthsOfSupply: latest.monthsSupply,
      marketBalance: getMarketBalance(latest.monthsSupply),
      aiSummary,
      priceHistory,
      comps: [], // Comps removed — no longer from Rentcast
      fetchedAt: new Date().toISOString(),
      // Extended sheets data for multi-metric chart tabs
      sheetsData: {
        medianPrice: sheets.medianPrice,
        newListings: sheets.newListings,
        activeListings: sheets.activeListings,
        closedSales: sheets.closedSales,
        daysOnMarket: sheets.daysOnMarket,
        pricePerSf: sheets.pricePerSf,
        monthsSupply: sheets.monthsSupply,
        showsToContract: sheets.showsToContract,
        pctOfOrigPrice: sheets.pctOfOrigPrice,
      },
    };

    memCache.set(submarket, { data: response, ts: Date.now() });
    return NextResponse.json(response, { headers: { "X-Cache": "SHEETS" } });
  } catch (err) {
    console.error("[snapshot] error:", err);
    return NextResponse.json({ error: "Failed to load snapshot" }, { status: 500 });
  }
}
