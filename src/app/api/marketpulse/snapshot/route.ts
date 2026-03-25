/**
 * GET /api/marketpulse/snapshot?submarket=thousand-oaks
 *
 * Returns live market data for a given Ventura County submarket:
 *   - Rentcast market stats (median price, DOM, active listings, price/sqft, comps)
 *   - Perplexity AI market summary
 *   - Months of supply (derived → market balance heat bar)
 *   - Price history by property type (SFR, Condo, Townhome)
 *
 * Cached in-memory for 6 hours to avoid burning API quota on every page load.
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Submarket config ───────────────────────────────────────────────────────
export type SubmarketKey =
  | "thousand-oaks"
  | "newbury-park"
  | "ventura"
  | "camarillo"
  | "westlake"
  | "oxnard";

interface SubmarketConfig {
  label: string;
  zipCodes: string[]; // primary zip used for Rentcast
  city: string;
  state: string;
}

const SUBMARKETS: Record<SubmarketKey, SubmarketConfig> = {
  "thousand-oaks": {
    label: "Thousand Oaks",
    zipCodes: ["91360"],
    city: "Thousand Oaks",
    state: "CA",
  },
  "newbury-park": {
    label: "Newbury Park",
    zipCodes: ["91320"],
    city: "Newbury Park",
    state: "CA",
  },
  ventura: {
    label: "Ventura",
    zipCodes: ["93001"],
    city: "Ventura",
    state: "CA",
  },
  camarillo: {
    label: "Camarillo",
    zipCodes: ["93010"],
    city: "Camarillo",
    state: "CA",
  },
  westlake: {
    label: "Westlake Village",
    zipCodes: ["91361"],
    city: "Westlake Village",
    state: "CA",
  },
  oxnard: {
    label: "Oxnard",
    zipCodes: ["93030"],
    city: "Oxnard",
    state: "CA",
  },
};

// ─── Response shape ─────────────────────────────────────────────────────────
export interface MarketSnapshotResponse {
  submarket: SubmarketKey;
  label: string;
  // Key metrics
  medianPrice: number | null;
  medianPriceChangePct: number | null;
  avgDaysOnMarket: number | null;
  activeListings: number | null;
  pricePerSqft: number | null;
  monthsOfSupply: number | null;
  // Market balance: "buyers" | "balanced" | "sellers"
  marketBalance: "buyers" | "balanced" | "sellers";
  // AI summary text
  aiSummary: string;
  // Price history by property type
  priceHistory: {
    month: string;
    sfr: number | null;
    condo: number | null;
    townhome: number | null;
  }[];
  // Recent comps
  comps: {
    address: string;
    price: number;
    sqft: number | null;
    pricePerSqft: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    daysOld: number | null;
    status: "Active" | "Sold" | "Pending";
    propertyType: string | null;
  }[];
  fetchedAt: string;
}

// ─── In-memory cache ─────────────────────────────────────────────────────────
const cache = new Map<
  string,
  { data: MarketSnapshotResponse; timestamp: number }
>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

// ─── Market balance helper ───────────────────────────────────────────────────
function deriveMarketBalance(
  monthsOfSupply: number | null
): "buyers" | "balanced" | "sellers" {
  if (monthsOfSupply === null) return "balanced";
  if (monthsOfSupply < 4) return "sellers";
  if (monthsOfSupply > 6) return "buyers";
  return "balanced";
}

// ─── Rentcast fetch ──────────────────────────────────────────────────────────
async function fetchRentcastData(zipCode: string) {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) throw new Error("RENTCAST_API_KEY not configured");

  // Fetch market stats + listing comps in parallel
  const [statsRes, compsRes] = await Promise.allSettled([
    fetch(
      `https://api.rentcast.io/v1/markets?zipCode=${zipCode}&dataType=Sale&historyRange=12`,
      { headers: { Accept: "application/json", "X-Api-Key": apiKey } }
    ),
    fetch(
      `https://api.rentcast.io/v1/listings/sale?zipCode=${zipCode}&status=Active&limit=10`,
      { headers: { Accept: "application/json", "X-Api-Key": apiKey } }
    ),
  ]);

  let statsData: Record<string, unknown> = {};
  let compsData: unknown[] = [];

  if (statsRes.status === "fulfilled" && statsRes.value.ok) {
    statsData = await statsRes.value.json();
  }

  if (compsRes.status === "fulfilled" && compsRes.value.ok) {
    const raw = await compsRes.value.json();
    compsData = Array.isArray(raw) ? raw : [];
  }

  return { statsData, compsData };
}

// ─── Perplexity AI summary ───────────────────────────────────────────────────
async function fetchAISummary(
  submarketLabel: string,
  metrics: {
    medianPrice: number | null;
    avgDom: number | null;
    activeListings: number | null;
    pricePerSqft: number | null;
    monthsOfSupply: number | null;
  }
): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return "AI summary unavailable — PERPLEXITY_API_KEY not configured.";

  const prompt = `You are a concise real estate market analyst. Write a 3–4 sentence market summary for ${submarketLabel}, CA (Ventura County).

Current data:
- Median sale price: ${metrics.medianPrice ? `$${metrics.medianPrice.toLocaleString()}` : "N/A"}
- Avg days on market: ${metrics.avgDom ?? "N/A"} days
- Active listings: ${metrics.activeListings ?? "N/A"}
- Price per sqft: ${metrics.pricePerSqft ? `$${metrics.pricePerSqft}` : "N/A"}
- Months of supply: ${metrics.monthsOfSupply ?? "N/A"}

Rules:
- When you cite a percentage change, wrap the number in backticks like this: \`+4.2%\` or \`-1.8%\`. Add a ↑ or ↓ arrow immediately after the backtick block based on direction.
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

// ─── Main handler ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const submarketParam = searchParams.get("submarket") as SubmarketKey | null;
  const submarket: SubmarketKey = SUBMARKETS[submarketParam as SubmarketKey]
    ? (submarketParam as SubmarketKey)
    : "thousand-oaks";

  const config = SUBMARKETS[submarket];
  const zipCode = config.zipCodes[0];
  const cacheKey = `snapshot:${submarket}`;

  // Cache hit
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  try {
    const { statsData, compsData } = await fetchRentcastData(zipCode);

    // Parse sale stats
    const sale = (statsData?.saleData ?? {}) as Record<string, unknown>;
    const medianPrice = (sale?.medianPrice as number) ?? null;
    const avgDom = (sale?.averageDaysOnMarket as number) ?? null;
    const activeListings = (sale?.totalListings as number) ?? null;
    const pricePerSqft = (sale?.averagePricePerSquareFoot as number)
      ? Math.round(sale.averagePricePerSquareFoot as number)
      : null;

    // Months of supply = active listings / (monthly sales rate)
    const totalSales = (sale?.totalSales as number) ?? null;
    let monthsOfSupply: number | null = null;
    if (activeListings && totalSales && totalSales > 0) {
      monthsOfSupply = parseFloat((activeListings / (totalSales / 12)).toFixed(1));
    }

    // Median price change from history
    let medianPriceChangePct: number | null = null;
    const history = (sale?.history as { month: string; averagePrice: number }[]) ?? [];
    if (history.length >= 2) {
      const oldest = history[0].averagePrice;
      const newest = history[history.length - 1].averagePrice;
      if (oldest > 0) {
        medianPriceChangePct = parseFloat(
          (((newest - oldest) / oldest) * 100).toFixed(1)
        );
      }
    }

    // Build price history (SFR from Rentcast history, condos/townhomes are proportional estimates)
    // Rentcast returns aggregate history; we use it for SFR and apply property type breakdown ratios
    const dataByType = (sale?.dataByPropertyType as { propertyType: string; averagePrice: number }[]) ?? [];
    const sfrEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("single"));
    const condoEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("condo"));
    const townEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("town"));

    const sfrRatio = sfrEntry && medianPrice ? sfrEntry.averagePrice / medianPrice : 1.05;
    const condoRatio = condoEntry && medianPrice ? condoEntry.averagePrice / medianPrice : 0.78;
    const townRatio = townEntry && medianPrice ? townEntry.averagePrice / medianPrice : 0.88;

    const priceHistory = history.map((h) => ({
      month: h.month,
      sfr: medianPrice ? Math.round(h.averagePrice * sfrRatio) : null,
      condo: medianPrice ? Math.round(h.averagePrice * condoRatio) : null,
      townhome: medianPrice ? Math.round(h.averagePrice * townRatio) : null,
    }));

    // Build comps from listing data
    const comps = (compsData as Record<string, unknown>[]).slice(0, 10).map((c) => {
      const price = (c.price as number) ?? (c.listPrice as number) ?? 0;
      const sqft = (c.squareFootage as number) ?? null;
      return {
        address: (c.formattedAddress as string) ?? (c.address as string) ?? "Unknown",
        price,
        sqft,
        pricePerSqft: sqft && price ? Math.round(price / sqft) : null,
        bedrooms: (c.bedrooms as number) ?? null,
        bathrooms: (c.bathrooms as number) ?? null,
        daysOld: (c.daysOnMarket as number) ?? null,
        status: "Active" as const,
        propertyType: (c.propertyType as string) ?? null,
      };
    });

    const marketBalance = deriveMarketBalance(monthsOfSupply);

    // Fetch AI summary (non-blocking — if it fails, we still return data)
    const aiSummary = await fetchAISummary(config.label, {
      medianPrice,
      avgDom,
      activeListings,
      pricePerSqft,
      monthsOfSupply,
    });

    const result: MarketSnapshotResponse = {
      submarket,
      label: config.label,
      medianPrice,
      medianPriceChangePct,
      avgDaysOnMarket: avgDom,
      activeListings,
      pricePerSqft,
      monthsOfSupply,
      marketBalance,
      aiSummary,
      priceHistory,
      comps,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result, { headers: { "X-Cache": "MISS" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[marketpulse/snapshot]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
