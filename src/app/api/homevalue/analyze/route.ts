import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

/**
 * POST /api/homevalue/analyze
 *
 * Accepts home value questionnaire answers, sends them to Perplexity
 * sonar-pro (which has live web search built in), and returns a fully
 * structured valuation report.
 *
 * Why generateText instead of generateObject:
 *   Perplexity's sonar models don't support the JSON-schema / tool-call
 *   structured-output mode that generateObject relies on. We instead ask
 *   the model to reply with a JSON code block and parse it ourselves.
 *
 * Required env var: PERPLEXITY_API_KEY
 */

const perplexity = createOpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY ?? "",
  baseURL: "https://api.perplexity.ai",
});

// ─── Types (exported so the results page can import them) ─────────────────────

export interface ValuationResult {
  estimatedValue: number;
  valueLow: number;
  valueHigh: number;
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
  comparables: {
    description: string;
    soldPrice: number;
    soldDate: string;
    distanceFromSubject: string;
    relevanceNote: string;
  }[];
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

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    if (!process.env.PERPLEXITY_API_KEY) {
      return Response.json(
        { error: "PERPLEXITY_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
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
    } = body;

    if (!propertyAddress) {
      return Response.json({ error: "propertyAddress is required" }, { status: 400 });
    }

    const featureList =
      Array.isArray(features) && features.length > 0
        ? features.join(", ")
        : "None";

    const prompt = `You are an expert real estate appraiser for Southern California. A homeowner wants a home valuation. Use your web search to find CURRENT, REAL market data for the specific address provided.

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

Search for:
1. Current median home prices in the specific city/neighborhood
2. Recent comparable sales (last 6 months) for similar homes nearby
3. Current market conditions: days on market, list-to-sale ratio, inventory
4. Year-over-year price trends for that area
5. School ratings, walkability, and neighborhood factors

Respond with ONLY a valid JSON object (no markdown, no extra text, just the raw JSON) matching this exact structure:

{
  "estimatedValue": <number: best single estimate in USD>,
  "valueLow": <number: conservative estimate>,
  "valueHigh": <number: optimistic estimate>,
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
    "medianPriceChangeYoY": <number: e.g. 4.2 for 4.2%>,
    "avgDaysOnMarket": <number>,
    "listToSaleRatio": <number: e.g. 98.5>,
    "monthsOfSupply": <number>,
    "marketCondition": "<strong_sellers|sellers|balanced|buyers|strong_buyers>",
    "marketSummary": "<2-3 sentences about current market>"
  },
  "comparables": [
    {
      "description": "<e.g. 3BD/2BA, 1,850 sqft, built 1998>",
      "soldPrice": <number>,
      "soldDate": "<e.g. Feb 2026>",
      "distanceFromSubject": "<e.g. 0.3 miles>",
      "relevanceNote": "<why this is a good comp>"
    }
  ],
  "neighborhoodInsights": [
    {
      "category": "<e.g. Schools>",
      "rating": "<excellent|good|average|below_average>",
      "detail": "<1-2 sentences>"
    }
  ],
  "sellerStrategy": {
    "recommendedListPrice": <number>,
    "pricingRationale": "<2-3 sentences>",
    "bestTimeToList": "<timing recommendation>",
    "estimatedNetProceeds": "<range string e.g. '$950K - $1.02M'>",
    "topSellingTips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>", "<tip 5>"]
  },
  "executiveSummary": "<3-4 sentences addressed directly to the homeowner>"
}

Include exactly 4-6 valueDrivers, exactly 3-5 comparables, and exactly 3-5 neighborhoodInsights. All numbers must be plain integers or decimals, no commas, no dollar signs inside JSON values.`;

    const { text } = await generateText({
      model: perplexity("sonar-pro"),
      messages: [
        {
          role: "system",
          content:
            "You are a professional real estate appraiser. Always search for current, accurate market data. Respond ONLY with a valid JSON object — no markdown fences, no explanation text, just the raw JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Strip any accidental markdown fences or whitespace
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsed: ValuationResult;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If the model wrapped it anyway, try extracting the JSON block
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error("Could not extract JSON from Perplexity response:", cleaned.slice(0, 500));
        return Response.json(
          { error: "Failed to parse AI response as JSON" },
          { status: 500 }
        );
      }
      parsed = JSON.parse(match[0]);
    }

    return Response.json({ success: true, data: parsed });
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
