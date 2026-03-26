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
import type { SubmarketKey, MarketSnapshotResponse } from "@/lib/types";

// ─── Submarket config ───────────────────────────────────────────────────────

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

    // Log raw shape in production for debugging
    console.log("[snapshot] statsData keys:", Object.keys(statsData ?? {}));
    console.log("[snapshot] saleData keys:", Object.keys((statsData?.saleData ?? {}) as object));
    console.log("[snapshot] compsData type:", typeof compsData, Array.isArray(compsData) ? `array[${(compsData as unknown[]).length}]` : JSON.stringify(compsData)?.slice(0, 200));

    // Parse sale stats
    const sale = (statsData?.saleData ?? {}) as Record<string, unknown>;
    const medianPrice = typeof sale?.medianPrice === "number" ? sale.medianPrice : null;
    const avgDom = typeof sale?.averageDaysOnMarket === "number" ? Math.round(sale.averageDaysOnMarket) : null;
    const activeListings = typeof sale?.totalListings === "number" ? sale.totalListings : null;
    const pricePerSqft = typeof sale?.averagePricePerSquareFoot === "number"
      ? Math.round(sale.averagePricePerSquareFoot)
      : null;

    // Months of supply = active listings / (monthly sales rate)
    const totalSales = typeof sale?.totalSales === "number" ? sale.totalSales : null;
    let monthsOfSupply: number | null = null;
    if (activeListings && totalSales && totalSales > 0) {
      monthsOfSupply = parseFloat((activeListings / (totalSales / 12)).toFixed(1));
    }

    // Safely extract history — Rentcast may return array OR object keyed by month
    const rawHistory = sale?.history;
    let historyArr: { month: string; averagePrice: number }[] = [];
    if (Array.isArray(rawHistory)) {
      historyArr = rawHistory as { month: string; averagePrice: number }[];
    } else if (rawHistory && typeof rawHistory === "object") {
      // Keyed object: { "2024-01": { averagePrice: 750000 }, ... }
      historyArr = Object.entries(rawHistory as Record<string, { averagePrice?: number; average?: number }>)
        .map(([month, val]) => ({
          month,
          averagePrice: val?.averagePrice ?? val?.average ?? 0,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
    }

    // Median price change from history
    let medianPriceChangePct: number | null = null;
    if (historyArr.length >= 2) {
      const oldest = historyArr[0].averagePrice;
      const newest = historyArr[historyArr.length - 1].averagePrice;
      if (oldest > 0) {
        medianPriceChangePct = parseFloat(
          (((newest - oldest) / oldest) * 100).toFixed(1)
        );
      }
    }

    // Safely extract dataByPropertyType
    const rawByType = sale?.dataByPropertyType;
    const dataByType: { propertyType: string; averagePrice: number }[] = Array.isArray(rawByType)
      ? (rawByType as { propertyType: string; averagePrice: number }[])
      : [];

    const sfrEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("single"));
    const condoEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("condo"));
    const townEntry = dataByType.find((d) => d.propertyType?.toLowerCase().includes("town"));

    const sfrRatio = sfrEntry && medianPrice ? sfrEntry.averagePrice / medianPrice : 1.05;
    const condoRatio = condoEntry && medianPrice ? condoEntry.averagePrice / medianPrice : 0.78;
    const townRatio = townEntry && medianPrice ? townEntry.averagePrice / medianPrice : 0.88;

    const priceHistory = historyArr.map((h) => ({
      month: h.month,
      sfr: medianPrice ? Math.round(h.averagePrice * sfrRatio) : null,
      condo: medianPrice ? Math.round(h.averagePrice * condoRatio) : null,
      townhome: medianPrice ? Math.round(h.averagePrice * townRatio) : null,
    }));

    // Safely extract comps — Rentcast listings may return array or { listings: [...] }
    const rawComps = compsData;
    const compsArr: Record<string, unknown>[] = Array.isArray(rawComps)
      ? (rawComps as Record<string, unknown>[])
      : Array.isArray((rawComps as Record<string, unknown>)?.listings)
      ? ((rawComps as Record<string, unknown[]>).listings as Record<string, unknown>[])
      : [];

    const comps = compsArr.slice(0, 10).map((c) => {
      const price = typeof c.price === "number" ? c.price
        : typeof c.listPrice === "number" ? c.listPrice : 0;
      const sqft = typeof c.squareFootage === "number" ? c.squareFootage : null;
      return {
        address: (c.formattedAddress as string) ?? (c.address as string) ?? "Unknown",
        price,
        sqft,
        pricePerSqft: sqft && price ? Math.round(price / sqft) : null,
        bedrooms: typeof c.bedrooms === "number" ? c.bedrooms : null,
        bathrooms: typeof c.bathrooms === "number" ? c.bathrooms : null,
        daysOld: typeof c.daysOnMarket === "number" ? c.daysOnMarket : null,
        status: "Active" as const,
        propertyType: typeof c.propertyType === "string" ? c.propertyType : null,
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
