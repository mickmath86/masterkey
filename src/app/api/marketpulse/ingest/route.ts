/**
 * POST /api/marketpulse/ingest
 *
 * Fetches fresh data from Rentcast + Perplexity for one or all submarkets
 * and writes it to Supabase. Called by:
 *   1. The Vercel cron job (nightly, all submarkets)
 *   2. The snapshot route (on-demand, single submarket, when Supabase is stale)
 *
 * Auth: requires CRON_SECRET header (set in Vercel env) so it can't be
 * triggered by random public requests.
 *
 * Body: { submarket?: SubmarketKey }
 *   - If submarket is omitted, ingests ALL 6 submarkets sequentially.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { SubmarketKey } from "@/lib/types";

// ─── Submarket config ─────────────────────────────────────────────────────────
const SUBMARKETS: Record<SubmarketKey, { label: string; zip: string }> = {
  "thousand-oaks": { label: "Thousand Oaks", zip: "91360" },
  "newbury-park":  { label: "Newbury Park",  zip: "91320" },
  ventura:         { label: "Ventura",        zip: "93001" },
  camarillo:       { label: "Camarillo",      zip: "93010" },
  westlake:        { label: "Westlake Village", zip: "91361" },
  oxnard:          { label: "Oxnard",         zip: "93030" },
};

// ─── Supabase service client (bypasses RLS) ───────────────────────────────────
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

// ─── Rentcast fetch ───────────────────────────────────────────────────────────
async function fetchRentcast(zip: string) {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) throw new Error("RENTCAST_API_KEY not configured");

  const [statsRes, listingsRes] = await Promise.allSettled([
    fetch(
      `https://api.rentcast.io/v1/markets?zipCode=${zip}&dataType=Sale&historyRange=12`,
      { headers: { "X-Api-Key": apiKey, Accept: "application/json" } }
    ),
    fetch(
      `https://api.rentcast.io/v1/listings/sale?zipCode=${zip}&status=Active&limit=10`,
      { headers: { "X-Api-Key": apiKey, Accept: "application/json" } }
    ),
  ]);

  let statsData: Record<string, unknown> = {};
  let listingsData: unknown[] = [];

  if (statsRes.status === "fulfilled" && statsRes.value.ok) {
    statsData = await statsRes.value.json();
  } else {
    console.error(`[ingest] Rentcast stats failed for ${zip}:`,
      statsRes.status === "fulfilled" ? statsRes.value.status : statsRes.reason);
  }

  if (listingsRes.status === "fulfilled" && listingsRes.value.ok) {
    const raw = await listingsRes.value.json();
    listingsData = Array.isArray(raw) ? raw
      : Array.isArray((raw as Record<string, unknown>)?.listings)
      ? (raw as Record<string, unknown[]>).listings
      : [];
  }

  return { statsData, listingsData };
}

// ─── Perplexity AI summary ────────────────────────────────────────────────────
async function fetchAISummary(
  label: string,
  metrics: {
    medianPrice: number | null;
    avgDom: number | null;
    activeListings: number | null;
    pricePerSqft: number | null;
    monthsOfSupply: number | null;
  }
): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return "AI summary unavailable.";

  const prompt = `You are a concise real estate market analyst. Write a 3–4 sentence market summary for ${label}, CA (Ventura County).

Current data:
- Median sale price: ${metrics.medianPrice ? `$${metrics.medianPrice.toLocaleString()}` : "N/A"}
- Avg days on market: ${metrics.avgDom ?? "N/A"} days
- Active listings: ${metrics.activeListings ?? "N/A"}
- Price per sqft: ${metrics.pricePerSqft ? `$${metrics.pricePerSqft}` : "N/A"}
- Months of supply: ${metrics.monthsOfSupply ?? "N/A"}

Rules:
- When you cite a percentage change, wrap the number in backticks like: \`+4.2%\` or \`-1.8%\`. Add a ↑ or ↓ arrow immediately after based on direction.
- Keep it factual, data-driven, and professional.
- Do NOT include a title or header.`;

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });
    if (!res.ok) return "AI summary temporarily unavailable.";
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "AI summary unavailable.";
  } catch {
    return "AI summary temporarily unavailable.";
  }
}

// ─── Core ingest function for a single submarket ─────────────────────────────
export async function ingestSubmarket(submarket: SubmarketKey): Promise<void> {
  const config = SUBMARKETS[submarket];
  const supabase = getSupabase();

  console.log(`[ingest] Starting ${submarket} (${config.zip})`);

  const { statsData, listingsData } = await fetchRentcast(config.zip);
  const sale = (statsData?.saleData ?? {}) as Record<string, unknown>;

  // ── Parse core metrics ────────────────────────────────────────────────────
  const medianPrice        = typeof sale.medianPrice === "number" ? sale.medianPrice : null;
  const avgDom             = typeof sale.averageDaysOnMarket === "number" ? Math.round(sale.averageDaysOnMarket) : null;
  const activeListings     = typeof sale.totalListings === "number" ? sale.totalListings : null;
  const pricePerSqft       = typeof sale.averagePricePerSquareFoot === "number" ? Math.round(sale.averagePricePerSquareFoot) : null;
  const totalSales         = typeof sale.totalSales === "number" ? sale.totalSales : null;

  // Months of supply: active ÷ (total sold last month)
  // Rentcast totalSales = cumulative over historyRange (12 months) → divide by 12 for monthly rate
  let monthsOfSupply: number | null = null;
  if (activeListings && totalSales && totalSales > 0) {
    const monthlySalesRate = totalSales / 12;
    monthsOfSupply = parseFloat((activeListings / monthlySalesRate).toFixed(1));
  }

  const marketBalance: "buyers" | "balanced" | "sellers" =
    monthsOfSupply === null ? "balanced"
    : monthsOfSupply < 4 ? "sellers"
    : monthsOfSupply > 6 ? "buyers"
    : "balanced";

  // ── Median price change from history ────────────────────────────────────
  const rawHistory = sale.history;
  type HistoryEntry = { month: string; averagePrice: number };
  let historyArr: HistoryEntry[] = [];

  if (Array.isArray(rawHistory)) {
    historyArr = rawHistory as HistoryEntry[];
  } else if (rawHistory && typeof rawHistory === "object") {
    historyArr = Object.entries(rawHistory as Record<string, { averagePrice?: number; average?: number }>)
      .map(([month, val]) => ({ month, averagePrice: val?.averagePrice ?? val?.average ?? 0 }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  let medianPriceChangePct: number | null = null;
  if (historyArr.length >= 2) {
    const oldest = historyArr[0].averagePrice;
    const newest = historyArr[historyArr.length - 1].averagePrice;
    if (oldest > 0) medianPriceChangePct = parseFloat((((newest - oldest) / oldest) * 100).toFixed(2));
  }

  // ── Property type ratios ─────────────────────────────────────────────────
  const rawByType = sale.dataByPropertyType;
  const dataByType = Array.isArray(rawByType)
    ? (rawByType as { propertyType: string; averagePrice: number }[])
    : [];

  const sfrEntry   = dataByType.find((d) => d.propertyType?.toLowerCase().includes("single"));
  const condoEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("condo"));
  const townEntry  = dataByType.find((d) => d.propertyType?.toLowerCase().includes("town"));

  const sfrRatio   = sfrEntry   && medianPrice ? sfrEntry.averagePrice   / medianPrice : 1.05;
  const condoRatio = condoEntry && medianPrice ? condoEntry.averagePrice  / medianPrice : 0.78;
  const townRatio  = townEntry  && medianPrice ? townEntry.averagePrice   / medianPrice : 0.88;

  // ── AI summary ───────────────────────────────────────────────────────────
  const aiSummary = await fetchAISummary(config.label, {
    medianPrice, avgDom, activeListings, pricePerSqft, monthsOfSupply,
  });

  // ── Write snapshot to Supabase ───────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const { error: snapError } = await supabase
    .from("marketpulse_snapshots")
    .upsert(
      {
        submarket,
        snapshot_date: today,
        median_price: medianPrice,
        median_price_change_pct: medianPriceChangePct,
        avg_days_on_market: avgDom,
        active_listings: activeListings,
        price_per_sqft: pricePerSqft,
        total_sales: totalSales,
        months_of_supply: monthsOfSupply,
        market_balance: marketBalance,
        ai_summary: aiSummary,
        ai_summary_generated_at: new Date().toISOString(),
        rentcast_zip: config.zip,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "submarket,snapshot_date" }
    );

  if (snapError) console.error(`[ingest] snapshot upsert error (${submarket}):`, snapError.message);
  else console.log(`[ingest] ✓ snapshot saved for ${submarket} on ${today}`);

  // ── Write price history to Supabase ─────────────────────────────────────
  if (historyArr.length > 0) {
    const historyRows = historyArr.map((h) => ({
      submarket,
      month: h.month,
      avg_price: Math.round(h.averagePrice),
      sfr_price: medianPrice ? Math.round(h.averagePrice * sfrRatio) : null,
      condo_price: medianPrice ? Math.round(h.averagePrice * condoRatio) : null,
      townhome_price: medianPrice ? Math.round(h.averagePrice * townRatio) : null,
      updated_at: new Date().toISOString(),
    }));

    const { error: histError } = await supabase
      .from("marketpulse_price_history")
      .upsert(historyRows, { onConflict: "submarket,month" });

    if (histError) console.error(`[ingest] price history upsert error (${submarket}):`, histError.message);
    else console.log(`[ingest] ✓ ${historyRows.length} history rows saved for ${submarket}`);
  }

  // ── Replace comps in Supabase ────────────────────────────────────────────
  // Delete old comps for this submarket, then insert fresh ones
  const compsArr = (listingsData as Record<string, unknown>[]).slice(0, 10);
  if (compsArr.length > 0) {
    await supabase.from("marketpulse_comps").delete().eq("submarket", submarket);

    const compsRows = compsArr.map((c) => {
      const price = typeof c.price === "number" ? c.price
        : typeof c.listPrice === "number" ? c.listPrice : null;
      const sqft = typeof c.squareFootage === "number" ? c.squareFootage : null;
      return {
        submarket,
        address: (c.formattedAddress as string) ?? (c.address as string) ?? "Unknown",
        price,
        sqft,
        price_per_sqft: sqft && price ? Math.round(price / sqft) : null,
        bedrooms: typeof c.bedrooms === "number" ? c.bedrooms : null,
        bathrooms: typeof c.bathrooms === "number" ? c.bathrooms : null,
        days_on_market: typeof c.daysOnMarket === "number" ? c.daysOnMarket : null,
        status: "Active",
        property_type: typeof c.propertyType === "string" ? c.propertyType : null,
        rentcast_zip: config.zip,
        fetched_at: new Date().toISOString(),
      };
    });

    const { error: compsError } = await supabase.from("marketpulse_comps").insert(compsRows);
    if (compsError) console.error(`[ingest] comps insert error (${submarket}):`, compsError.message);
    else console.log(`[ingest] ✓ ${compsRows.length} comps saved for ${submarket}`);
  }
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
function isAuthorized(request: NextRequest): boolean {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) return true; // No secret configured → open (dev mode)

  // Vercel cron: Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${expectedSecret}`) return true;

  // Manual POST with x-cron-secret header
  const xSecret = request.headers.get("x-cron-secret");
  if (xSecret === expectedSecret) return true;

  return false;
}

// ─── Shared ingest runner ─────────────────────────────────────────────────────
async function runIngest(submarkets: SubmarketKey[]) {
  const results: Record<string, string> = {};
  for (const submarket of submarkets) {
    try {
      await ingestSubmarket(submarket);
      results[submarket] = "ok";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      console.error(`[ingest] failed for ${submarket}:`, msg);
      results[submarket] = `error: ${msg}`;
    }
  }
  return results;
}

// ─── GET handler (Vercel cron) ────────────────────────────────────────────────
// Vercel cron jobs always call GET. Auth via: Authorization: Bearer <CRON_SECRET>
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cron always ingests all 6 submarkets
  const allSubmarkets = Object.keys(SUBMARKETS) as SubmarketKey[];
  const results = await runIngest(allSubmarkets);
  return NextResponse.json({ results, ingestedAt: new Date().toISOString() });
}

// ─── POST handler (manual trigger / snapshot cold-start) ─────────────────────
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { submarket?: SubmarketKey } = {};
  try { body = await request.json(); } catch { /* empty body is fine */ }

  const submarkets: SubmarketKey[] = body.submarket
    ? [body.submarket]
    : (Object.keys(SUBMARKETS) as SubmarketKey[]);

  const results = await runIngest(submarkets);
  return NextResponse.json({ results, ingestedAt: new Date().toISOString() });
}
