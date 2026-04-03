/**
 * GET  /api/marketpulse/ingest  — Vercel cron (runs all 6 submarkets nightly at 2am PT)
 * POST /api/marketpulse/ingest  — Manual trigger or cold-start call from snapshot route
 *
 * Both handlers require: Authorization: Bearer <CRON_SECRET>
 * POST additionally accepts body: { submarket?: SubmarketKey } to ingest a single market.
 *
 * Data sources:
 *  - Rentcast /v1/markets  → metrics, price history, property-type breakdowns
 *  - Rentcast /v1/listings → active comps (top 10)
 *  - Perplexity sonar      → AI market summary (uses real-time web search)
 *
 * Rentcast field notes (confirmed from live API):
 *  - saleData.totalListings    = active listings on market right now
 *  - saleData.newListings      = new to market this period
 *  - saleData.history          = keyed object { "2025-04": { newListings, totalListings, medianPrice, ... } }
 *  - saleData.dataByPropertyType = array of { propertyType, averagePrice, medianPrice, ... }
 *  - NO totalSales field exists — months of supply uses newListings as absorption proxy
 *
 * Months of supply formula:
 *   activeListings / avg(newListings over last 3 history months)
 *   <4 = sellers market | 4-6 = balanced | >6 = buyers market
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

// ─── Supabase service client (bypasses RLS — write access) ───────────────────
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

// ─── Rentcast types ───────────────────────────────────────────────────────────
interface RentcastHistoryMonth {
  date: string;
  averagePrice: number;
  medianPrice: number;
  newListings: number;
  totalListings: number;
  dataByPropertyType?: { propertyType: string; averagePrice: number; medianPrice: number }[];
}

interface RentcastPropertyType {
  propertyType: string;
  averagePrice: number;
  medianPrice: number;
}

interface RentcastSaleData {
  medianPrice?: number;
  averagePrice?: number;
  averagePricePerSquareFoot?: number;
  medianPricePerSquareFoot?: number;
  averageDaysOnMarket?: number;
  medianDaysOnMarket?: number;
  totalListings?: number;   // active listings right now
  newListings?: number;     // new to market this period
  history?: Record<string, RentcastHistoryMonth>;
  dataByPropertyType?: RentcastPropertyType[];
}

// ─── Rentcast fetch ───────────────────────────────────────────────────────────
async function fetchRentcast(zip: string): Promise<{
  saleData: RentcastSaleData;
  listingsData: Record<string, unknown>[];
}> {
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

  let saleData: RentcastSaleData = {};
  let listingsData: Record<string, unknown>[] = [];

  if (statsRes.status === "fulfilled" && statsRes.value.ok) {
    const raw = await statsRes.value.json();
    saleData = (raw?.saleData ?? {}) as RentcastSaleData;
  } else {
    console.error(
      `[ingest] Rentcast stats failed for ${zip}:`,
      statsRes.status === "fulfilled" ? statsRes.value.status : statsRes.reason
    );
  }

  if (listingsRes.status === "fulfilled" && listingsRes.value.ok) {
    const raw = await listingsRes.value.json();
    listingsData = Array.isArray(raw) ? raw
      : Array.isArray((raw as Record<string, unknown>)?.listings)
      ? (raw as { listings: Record<string, unknown>[] }).listings
      : [];
  }

  return { saleData, listingsData };
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
    priceChangePct: number | null;
  }
): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return "AI summary unavailable.";

  const prompt = `You are a concise real estate market analyst. Write a 3–4 sentence market summary for ${label}, CA (Ventura County).

Current data:
- Median sale price: ${metrics.medianPrice ? `$${metrics.medianPrice.toLocaleString()}` : "N/A"}
- Price change (12 months): ${metrics.priceChangePct !== null ? `${metrics.priceChangePct > 0 ? "+" : ""}${metrics.priceChangePct}%` : "N/A"}
- Avg days on market: ${metrics.avgDom ?? "N/A"} days
- Active listings: ${metrics.activeListings ?? "N/A"}
- Price per sqft: ${metrics.pricePerSqft ? `$${metrics.pricePerSqft}` : "N/A"}
- Months of supply: ${metrics.monthsOfSupply ?? "N/A"}

Rules:
- When you cite a percentage change, wrap the number in backticks like: \`+4.2%\` or \`-1.8%\`. Add a ↑ or ↓ arrow immediately after based on direction.
- Keep it factual, data-driven, and professional.
- Do NOT include a title or header.
- Do NOT hallucinate — only use the data provided above.`;

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
        temperature: 0.2,
      }),
    });
    if (!res.ok) return "AI summary temporarily unavailable.";
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "AI summary unavailable.";
  } catch {
    return "AI summary temporarily unavailable.";
  }
}

// ─── Core ingest for a single submarket ──────────────────────────────────────
export async function ingestSubmarket(submarket: SubmarketKey): Promise<void> {
  const config = SUBMARKETS[submarket];
  const supabase = getSupabase();

  console.log(`[ingest] Starting ${submarket} (${config.zip})`);

  const { saleData, listingsData } = await fetchRentcast(config.zip);

  // ── Core metrics ─────────────────────────────────────────────────────────
  const medianPrice    = saleData.medianPrice    ?? null;
  const avgDom         = saleData.averageDaysOnMarket != null
    ? Math.round(saleData.averageDaysOnMarket) : null;
  const activeListings = saleData.totalListings  ?? null;
  const pricePerSqft   = saleData.averagePricePerSquareFoot != null
    ? Math.round(saleData.averagePricePerSquareFoot) : null;

  // ── History: normalize keyed-object → sorted array ───────────────────────
  const rawHistory = saleData.history ?? {};
  const historyArr = Object.entries(rawHistory)
    .map(([month, val]) => ({ month, ...val }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // ── Months of supply ─────────────────────────────────────────────────────
  // Formula: activeListings / avg(newListings over last 3 months)
  // newListings = homes newly listed each month ≈ monthly absorption rate
  // Rentcast does NOT have a "totalSales" field — newListings is the best proxy
  let monthsOfSupply: number | null = null;
  if (activeListings && historyArr.length > 0) {
    const last3 = historyArr.slice(-3);
    const avgNewListings = last3.reduce((sum, h) => sum + (h.newListings ?? 0), 0) / last3.length;
    if (avgNewListings > 0) {
      monthsOfSupply = parseFloat((activeListings / avgNewListings).toFixed(1));
    }
  }

  const marketBalance: "buyers" | "balanced" | "sellers" =
    monthsOfSupply === null ? "balanced"
    : monthsOfSupply < 4 ? "sellers"
    : monthsOfSupply > 6 ? "buyers"
    : "balanced";

  // ── Median price change % (oldest → newest history month) ────────────────
  let medianPriceChangePct: number | null = null;
  if (historyArr.length >= 2) {
    const oldest = historyArr[0].medianPrice ?? historyArr[0].averagePrice ?? 0;
    const newest = historyArr[historyArr.length - 1].medianPrice ?? historyArr[historyArr.length - 1].averagePrice ?? 0;
    if (oldest > 0) {
      medianPriceChangePct = parseFloat((((newest - oldest) / oldest) * 100).toFixed(2));
    }
  }

  // ── Property type price ratios (for chart lines) ──────────────────────────
  // Use top-level dataByPropertyType for current ratios vs median
  const dataByType = saleData.dataByPropertyType ?? [];
  const sfrEntry   = dataByType.find((d) => d.propertyType?.toLowerCase().includes("single"));
  const condoEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("condo"));
  const townEntry  = dataByType.find((d) => d.propertyType?.toLowerCase().includes("town"));

  // Ratio = property type median / overall median (used to scale history prices)
  const base         = medianPrice ?? 1;
  const sfrRatio     = sfrEntry   ? (sfrEntry.medianPrice   / base) : 1.13;
  const condoRatio   = condoEntry ? (condoEntry.medianPrice  / base) : 0.45;
  const townRatio    = townEntry  ? (townEntry.medianPrice   / base) : 0.85;

  // ── AI summary ───────────────────────────────────────────────────────────
  const aiSummary = await fetchAISummary(config.label, {
    medianPrice, avgDom, activeListings, pricePerSqft, monthsOfSupply, priceChangePct: medianPriceChangePct,
  });

  // ── Upsert snapshot ───────────────────────────────────────────────────────
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
        total_sales: null,          // field reserved; Rentcast doesn't provide closed sales count
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
  else console.log(`[ingest] ✓ snapshot saved for ${submarket} — medianPrice: ${medianPrice}, MOS: ${monthsOfSupply}, balance: ${marketBalance}`);

  // ── Upsert price history ──────────────────────────────────────────────────
  if (historyArr.length > 0) {
    const historyRows = historyArr.map((h) => ({
      submarket,
      month: h.month,
      avg_price: h.averagePrice ? Math.round(h.averagePrice) : null,
      sfr_price: h.medianPrice ? Math.round(h.medianPrice * sfrRatio) : null,
      condo_price: h.medianPrice ? Math.round(h.medianPrice * condoRatio) : null,
      townhome_price: h.medianPrice ? Math.round(h.medianPrice * townRatio) : null,
      updated_at: new Date().toISOString(),
    }));

    const { error: histError } = await supabase
      .from("marketpulse_price_history")
      .upsert(historyRows, { onConflict: "submarket,month" });

    if (histError) console.error(`[ingest] price history upsert error (${submarket}):`, histError.message);
    else console.log(`[ingest] ✓ ${historyRows.length} history rows saved for ${submarket}`);
  }

  // ── Replace comps ─────────────────────────────────────────────────────────
  const compsArr = listingsData.slice(0, 10);
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
        status: "Active" as const,
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

// ─── Shared runner ────────────────────────────────────────────────────────────
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

// ─── GET (Vercel cron — ingests all 6 submarkets) ─────────────────────────────
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const allSubmarkets = Object.keys(SUBMARKETS) as SubmarketKey[];
  const results = await runIngest(allSubmarkets);
  return NextResponse.json({ results, ingestedAt: new Date().toISOString() });
}

// ─── POST (manual trigger / cold-start from snapshot route) ──────────────────
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
