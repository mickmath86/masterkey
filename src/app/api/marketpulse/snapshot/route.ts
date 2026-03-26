/**
 * GET /api/marketpulse/snapshot?submarket=thousand-oaks
 *
 * Data strategy (accuracy + speed):
 *
 * 1. READ from Supabase first (fast, sub-100ms, always available)
 *    - marketpulse_snapshots   → metrics + AI summary
 *    - marketpulse_price_history → chart data
 *    - marketpulse_comps         → listings table
 *
 * 2. If Supabase data is stale (> 6 hours) OR missing:
 *    → Trigger a background ingest for this submarket
 *    → Return whatever is in Supabase immediately (no user-facing wait)
 *    → Next page load will have fresh data
 *
 * 3. If Supabase is completely empty (first ever load):
 *    → Fall back to live Rentcast + Perplexity fetch, write to Supabase, return
 *
 * The nightly cron job at 2am keeps Supabase warm for all 6 submarkets so
 * cold-start fallback should rarely trigger in practice.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { SubmarketKey, MarketSnapshotResponse } from "@/lib/types";
import { ingestSubmarket } from "../ingest/route";

// ─── Submarket config ─────────────────────────────────────────────────────────
const SUBMARKET_LABELS: Record<SubmarketKey, string> = {
  "thousand-oaks": "Thousand Oaks",
  "newbury-park":  "Newbury Park",
  ventura:         "Ventura",
  camarillo:       "Camarillo",
  westlake:        "Westlake Village",
  oxnard:          "Oxnard",
};

const VALID_SUBMARKETS = new Set(Object.keys(SUBMARKET_LABELS));

// ─── Supabase anon client (public read) ───────────────────────────────────────
function getSupabase() {
  const url  = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ─── In-memory L1 cache (avoids hammering Supabase on every request) ─────────
const memCache = new Map<string, { data: MarketSnapshotResponse; timestamp: number }>();
const MEM_CACHE_TTL = 1000 * 60 * 10; // 10 minutes — Supabase is refreshed hourly by cron
const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 6; // 6 hours — trigger background refresh

// ─── Read from Supabase ───────────────────────────────────────────────────────
async function readFromSupabase(submarket: SubmarketKey): Promise<MarketSnapshotResponse | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Fetch snapshot, price history, and comps in parallel
  const [snapResult, histResult, compsResult] = await Promise.all([
    supabase
      .from("marketpulse_snapshots")
      .select("*")
      .eq("submarket", submarket)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .single(),

    supabase
      .from("marketpulse_price_history")
      .select("*")
      .eq("submarket", submarket)
      .order("month", { ascending: true }),

    supabase
      .from("marketpulse_comps")
      .select("*")
      .eq("submarket", submarket)
      .order("fetched_at", { ascending: false })
      .limit(10),
  ]);

  const snap = snapResult.data;
  if (!snap) return null; // Nothing in DB yet

  const history = histResult.data ?? [];
  const comps = compsResult.data ?? [];

  return {
    submarket,
    label: SUBMARKET_LABELS[submarket],
    medianPrice: snap.median_price,
    medianPriceChangePct: snap.median_price_change_pct,
    avgDaysOnMarket: snap.avg_days_on_market,
    activeListings: snap.active_listings,
    pricePerSqft: snap.price_per_sqft,
    monthsOfSupply: snap.months_of_supply,
    marketBalance: snap.market_balance ?? "balanced",
    aiSummary: snap.ai_summary ?? "",
    priceHistory: history.map((h) => ({
      month: h.month,
      sfr: h.sfr_price,
      condo: h.condo_price,
      townhome: h.townhome_price,
    })),
    comps: comps.map((c) => ({
      address: c.address,
      price: c.price ?? 0,
      sqft: c.sqft,
      pricePerSqft: c.price_per_sqft,
      bedrooms: c.bedrooms,
      bathrooms: c.bathrooms,
      daysOld: c.days_on_market,
      status: (c.status as "Active" | "Sold" | "Pending") ?? "Active",
      propertyType: c.property_type,
    })),
    fetchedAt: snap.updated_at ?? snap.created_at,
  };
}

// ─── Check if data is stale ───────────────────────────────────────────────────
function isStale(fetchedAt: string): boolean {
  return Date.now() - new Date(fetchedAt).getTime() > STALE_THRESHOLD_MS;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("submarket") ?? "thousand-oaks";
  const submarket: SubmarketKey = VALID_SUBMARKETS.has(raw)
    ? (raw as SubmarketKey)
    : "thousand-oaks";

  // L1: in-memory cache check
  const cached = memCache.get(submarket);
  if (cached && Date.now() - cached.timestamp < MEM_CACHE_TTL) {
    return NextResponse.json(cached.data, { headers: { "X-Cache": "MEM" } });
  }

  // L2: Supabase read
  try {
    const dbData = await readFromSupabase(submarket);

    if (dbData) {
      // Store in L1 cache
      memCache.set(submarket, { data: dbData, timestamp: Date.now() });

      // If stale: trigger background refresh (don't await — return stale data immediately)
      if (isStale(dbData.fetchedAt)) {
        console.log(`[snapshot] ${submarket} is stale — triggering background ingest`);
        ingestSubmarket(submarket).catch((e) =>
          console.error(`[snapshot] background ingest failed for ${submarket}:`, e)
        );
      }

      return NextResponse.json(dbData, { headers: { "X-Cache": "DB" } });
    }

    // L3: Supabase empty — cold start, fetch live and write to DB
    console.log(`[snapshot] ${submarket} not in DB — running cold-start ingest`);
    await ingestSubmarket(submarket);

    const freshData = await readFromSupabase(submarket);
    if (freshData) {
      memCache.set(submarket, { data: freshData, timestamp: Date.now() });
      return NextResponse.json(freshData, { headers: { "X-Cache": "COLD" } });
    }

    return NextResponse.json({ error: "No data available" }, { status: 503 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[snapshot] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
