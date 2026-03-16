/**
 * POST /api/homevalue/analyze
 *
 * Two-phase valuation:
 *
 * Phase 1 — Rentcast /avm/value
 *   Gets a real, data-backed AVM: price, priceRangeLow, priceRangeHigh,
 *   and up to 5 verified comparable sales with real addresses.
 *
 * Phase 2 — Perplexity sonar
 *   Receives the Rentcast numbers as ground truth. Its job is ONLY to
 *   generate narrative: market commentary, value drivers, neighborhood
 *   insights, seller strategy, and executive summary — all anchored to
 *   the real numbers, not invented ones.
 *
 * If Rentcast fails (key missing, address not found, etc.) we fall back
 * to Perplexity-only mode so the page never hard-errors.
 *
 * Required env vars:
 *   RENTCAST_API_KEY    — for AVM + comps
 *   PERPLEXITY_API_KEY  — for AI narrative
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface RentcastComp {
  formattedAddress: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  price: number;
  distance: number;
  daysOld: number;
  correlation: number;
  city: string;
  state: string;
  zipCode: string;
}

export interface ValuationResult {
  // ── Core value (from Rentcast when available) ──────────────────────────────
  estimatedValue: number;
  valueLow: number;
  valueHigh: number;
  valueSource: "rentcast" | "ai";

  // ── AI narrative fields ────────────────────────────────────────────────────
  confidenceScore: number;
  confidenceRationale: string;
  valueDrivers: {
    factor: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
    estimatedImpact: string;
  }[];
  market: {
    area: string;
    medianHomePrice: number;
    medianPriceChangeYoY: number;
    avgDaysOnMarket: number;
    listToSaleRatio: number;
    monthsOfSupply: number;
    marketCondition: "strong_sellers" | "sellers" | "balanced" | "buyers" | "strong_buyers";
    marketSummary: string;
  };
  // Real comps from Rentcast (may be empty if Rentcast unavailable)
  comparables: RentcastComp[];
  neighborhoodInsights: {
    category: string;
    rating: "excellent" | "good" | "average" | "below_average";
    detail: string;
  }[];
  sellerStrategy: {
    recommendedListPrice: number;
    pricingRationale: string;
    bestTimeToList: string;
    estimatedNetProceeds: string;
    topSellingTips: string[];
  };
  executiveSummary: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Phase 1: Rentcast AVM ────────────────────────────────────────────────────

interface RentcastAVMResponse {
  price: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  comparables?: RentcastComp[];
}

async function fetchRentcastAVM(
  address: string,
  beds?: string,
  baths?: string,
  sqft?: string
): Promise<RentcastAVMResponse | null> {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return null;

  try {
    const qs = new URLSearchParams({ address, compCount: "5" });
    if (beds) qs.set("bedrooms", beds);
    if (baths) qs.set("bathrooms", baths);
    if (sqft) qs.set("squareFootage", sqft);

    const res = await fetch(
      `https://api.rentcast.io/v1/avm/value?${qs}`,
      {
        headers: { "X-Api-Key": apiKey, Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!res.ok) {
      console.warn("Rentcast AVM failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    if (!data.price) return null;

    // Normalise comparables
    const comps: RentcastComp[] = (data.comparables ?? []).map((c: any) => ({
      formattedAddress: c.formattedAddress ?? c.addressLine1 ?? "Unknown address",
      bedrooms: c.bedrooms ?? 0,
      bathrooms: c.bathrooms ?? 0,
      squareFootage: c.squareFootage ?? 0,
      price: c.price ?? 0,
      distance: Math.round((c.distance ?? 0) * 10) / 10,
      daysOld: c.daysOld ?? 0,
      correlation: Math.round((c.correlation ?? 0) * 100),
      city: c.city ?? "",
      state: c.state ?? "",
      zipCode: c.zipCode ?? "",
    }));

    return {
      price: data.price,
      priceRangeLow: data.priceRangeLow ?? Math.round(data.price * 0.95),
      priceRangeHigh: data.priceRangeHigh ?? Math.round(data.price * 1.05),
      comparables: comps,
    };
  } catch (err) {
    console.error("Rentcast AVM error:", err);
    return null;
  }
}

// ─── Phase 2: Perplexity narrative ────────────────────────────────────────────

async function fetchPerplexityNarrative(
  body: Record<string, string | string[]>,
  rentcastAVM: RentcastAVMResponse | null
): Promise<Omit<ValuationResult, "estimatedValue" | "valueLow" | "valueHigh" | "valueSource" | "comparables"> | null> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return null;

  const {
    propertyAddress,
    propertyType,
    bedrooms,
    bathrooms,
    sqft,
    yearBuilt,
    condition,
    garage,
    features,
    kitchenUpdate,
    bathroomUpdate,
    roofUpdate,
    hvacUpdate,
    timeline,
    reason,
  } = body as Record<string, string>;

  const featureList =
    Array.isArray(features) && features.length > 0
      ? (features as string[]).join(", ")
      : typeof features === "string" && features
      ? features
      : "None";

  // If we have real Rentcast numbers, anchor the AI to them
  const avmAnchor = rentcastAVM
    ? `
IMPORTANT — VERIFIED AVM DATA (use these exact numbers, do not override them):
- Verified Market Value: ${fmtUSD(rentcastAVM.price)}
- Verified Range: ${fmtUSD(rentcastAVM.priceRangeLow)} – ${fmtUSD(rentcastAVM.priceRangeHigh)}
- Source: Rentcast AVM (based on real comparable sales data)
Your narrative, recommended list price, and all dollar figures must be consistent with these verified numbers.
`
    : "";

  const prompt = `You are an expert real estate agent for Southern California. A homeowner wants a home valuation report narrative.
${avmAnchor}
PROPERTY DETAILS:
- Address: ${propertyAddress}
- Type: ${propertyType || "Single Family Home"}
- Bedrooms: ${bedrooms || "Not specified"}
- Bathrooms: ${bathrooms || "Not specified"}
- Living Area: ${sqft ? sqft + " sqft" : "Not specified"}
- Year Built: ${yearBuilt || "Not specified"}
- Condition: ${condition || "Not specified"}
- Garage: ${garage || "Not specified"}
- Special Features: ${featureList}

RECENT UPDATES:
- Kitchen: ${kitchenUpdate || "Not specified"}
- Bathrooms: ${bathroomUpdate || "Not specified"}
- Roof: ${roofUpdate || "Not specified"}
- HVAC: ${hvacUpdate || "Not specified"}

SELLER CONTEXT:
- Timeline: ${timeline || "Not specified"}
- Reason: ${reason || "Not specified"}

Search for current market conditions in the specific area:
1. Current median home prices and YoY change for the city/neighborhood
2. Average days on market and list-to-sale ratio
3. Current months of inventory / supply
4. School ratings, walkability, and neighborhood factors

Respond with ONLY a valid JSON object (no markdown, no extra text) matching this exact structure:

{
  "confidenceScore": <number 0-100>,
  "confidenceRationale": "<1 sentence>",
  "valueDrivers": [
    {
      "factor": "<factor name>",
      "impact": "<positive|negative|neutral>",
      "description": "<1-2 sentences>",
      "estimatedImpact": "<e.g. +$25,000 or +2%>"
    }
  ],
  "market": {
    "area": "<neighborhood or city name>",
    "medianHomePrice": <number>,
    "medianPriceChangeYoY": <number e.g. 4.2>,
    "avgDaysOnMarket": <number>,
    "listToSaleRatio": <number e.g. 98.5>,
    "monthsOfSupply": <number>,
    "marketCondition": "<strong_sellers|sellers|balanced|buyers|strong_buyers>",
    "marketSummary": "<2-3 sentences about current market>"
  },
  "neighborhoodInsights": [
    {
      "category": "<e.g. Schools>",
      "rating": "<excellent|good|average|below_average>",
      "detail": "<1-2 sentences>"
    }
  ],
  "sellerStrategy": {
    "recommendedListPrice": <number — must be within the verified AVM range if provided>,
    "pricingRationale": "<2-3 sentences>",
    "bestTimeToList": "<timing recommendation>",
    "estimatedNetProceeds": "<range string e.g. '$950K - $1.02M'>",
    "topSellingTips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>", "<tip 5>"]
  },
  "executiveSummary": "<3-4 sentences addressed directly to the homeowner>"
}

Include exactly 4-6 valueDrivers and exactly 3-5 neighborhoodInsights. All numbers must be plain integers or decimals — no commas, no dollar signs inside JSON values.`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a professional real estate analyst. Always search for current, accurate market data. Respond ONLY with a valid JSON object — no markdown fences, no explanation text, just the raw JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error("Perplexity error:", response.status);
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) return null;
      return JSON.parse(match[0]);
    }
  } catch (err) {
    console.error("Perplexity narrative error:", err);
    return null;
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyAddress, bedrooms, bathrooms, sqft } = body;

    if (!propertyAddress) {
      return Response.json({ error: "propertyAddress is required" }, { status: 400 });
    }

    // Phase 1: Rentcast AVM — must run first so we can anchor Perplexity to real numbers
    const rentcastAVM = await fetchRentcastAVM(propertyAddress, bedrooms, bathrooms, sqft);

    // Phase 2: Perplexity narrative — receives verified AVM numbers (or null if Rentcast failed)
    const narrative = await fetchPerplexityNarrative(body, rentcastAVM);

    // If both failed entirely, return error
    if (!rentcastAVM && !narrative) {
      return Response.json(
        { error: "Failed to generate valuation — both data sources unavailable" },
        { status: 500 }
      );
    }

    // Determine value figures — Rentcast wins if available
    const estimatedValue = rentcastAVM?.price ?? (narrative as any)?.estimatedValue ?? 0;
    const valueLow = rentcastAVM?.priceRangeLow ?? (narrative as any)?.valueLow ?? Math.round(estimatedValue * 0.95);
    const valueHigh = rentcastAVM?.priceRangeHigh ?? (narrative as any)?.valueHigh ?? Math.round(estimatedValue * 1.05);

    // If Perplexity gave us a recommended list price way outside the Rentcast range, clamp it
    let recommendedListPrice = narrative?.sellerStrategy?.recommendedListPrice ?? estimatedValue;
    if (rentcastAVM && recommendedListPrice) {
      const buffer = (valueHigh - valueLow) * 0.1;
      if (recommendedListPrice < valueLow - buffer || recommendedListPrice > valueHigh + buffer) {
        recommendedListPrice = estimatedValue;
      }
    }

    const result: ValuationResult = {
      estimatedValue,
      valueLow,
      valueHigh,
      valueSource: rentcastAVM ? "rentcast" : "ai",

      confidenceScore: narrative?.confidenceScore ?? (rentcastAVM ? 82 : 60),
      confidenceRationale:
        narrative?.confidenceRationale ??
        (rentcastAVM
          ? "Estimate based on Rentcast AVM with verified comparable sales data."
          : "Estimate based on AI analysis of available market data."),

      valueDrivers: narrative?.valueDrivers ?? [],
      market: narrative?.market ?? {
        area: propertyAddress.split(",")[1]?.trim() ?? "Local Area",
        medianHomePrice: estimatedValue,
        medianPriceChangeYoY: 0,
        avgDaysOnMarket: 30,
        listToSaleRatio: 98,
        monthsOfSupply: 2,
        marketCondition: "balanced",
        marketSummary: "Market data unavailable.",
      },

      // Real Rentcast comps — empty array if Rentcast wasn't available
      comparables: rentcastAVM?.comparables ?? [],

      neighborhoodInsights: narrative?.neighborhoodInsights ?? [],
      sellerStrategy: {
        ...(narrative?.sellerStrategy ?? {
          pricingRationale: "Based on current market conditions.",
          bestTimeToList: "Spring is typically the strongest selling season.",
          estimatedNetProceeds: `${fmtUSD(Math.round(estimatedValue * 0.94))} – ${fmtUSD(Math.round(estimatedValue * 0.97))}`,
          topSellingTips: [],
        }),
        recommendedListPrice,
      },
      executiveSummary:
        narrative?.executiveSummary ??
        `Based on current market data, your home at ${propertyAddress} is estimated at ${fmtUSD(estimatedValue)}.`,
    };

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Home value analyze error:", error);
    return Response.json(
      {
        error: "Failed to generate valuation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
