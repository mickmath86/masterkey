import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

/**
 * POST /api/homevalue/analyze
 *
 * Accepts the home value questionnaire answers and uses the Perplexity
 * sonar model (web-search-backed) to produce a structured, AI-generated
 * valuation report.  No external paid property APIs required.
 *
 * Required env var: PERPLEXITY_API_KEY
 */

// Perplexity is OpenAI-protocol compatible — we just swap the base URL
const perplexity = createOpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY ?? "",
  baseURL: "https://api.perplexity.ai",
});

// ─── Response schema ──────────────────────────────────────────────────────────

const ValuationSchema = z.object({
  // Dollar estimates
  estimatedValue: z.number().describe("Best single-point estimated market value in USD"),
  valueLow: z.number().describe("Conservative low-end estimate in USD"),
  valueHigh: z.number().describe("Optimistic high-end estimate in USD"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence in the estimate 0-100"),
  confidenceRationale: z.string().describe("1-sentence explanation of confidence level"),

  // Value drivers
  valueDrivers: z.array(z.object({
    factor: z.string().describe("Factor name, e.g. 'Recent kitchen remodel'"),
    impact: z.enum(["positive", "negative", "neutral"]),
    description: z.string().describe("1-2 sentence explanation of how this affects value"),
    estimatedImpact: z.string().describe("Rough dollar or % impact, e.g. '+$25,000' or '+2%'"),
  })).describe("Top 4-6 factors driving this home's value up or down"),

  // Market context
  market: z.object({
    area: z.string().describe("Neighborhood or submarket name"),
    medianHomePrice: z.number().describe("Current median sold price in the immediate area in USD"),
    medianPriceChangeYoY: z.number().describe("Year-over-year % change in median price (e.g. 4.2)"),
    avgDaysOnMarket: z.number().describe("Average days on market for comparable homes"),
    listToSaleRatio: z.number().describe("Average list-to-sale price ratio as a percentage, e.g. 98.5"),
    monthsOfSupply: z.number().describe("Current months of housing supply"),
    marketCondition: z.enum(["strong_sellers", "sellers", "balanced", "buyers", "strong_buyers"]),
    marketSummary: z.string().describe("2-3 sentence current market narrative for this area"),
  }),

  // Comparable sales
  comparables: z.array(z.object({
    description: z.string().describe("Brief property description, e.g. '3BD/2BA, 1,850 sqft, built 1998'"),
    soldPrice: z.number().describe("Sale price in USD"),
    soldDate: z.string().describe("Approximate sold date, e.g. 'Feb 2026'"),
    distanceFromSubject: z.string().describe("Approximate distance, e.g. '0.3 miles'"),
    relevanceNote: z.string().describe("Why this comp is relevant"),
  })).min(3).max(5).describe("3-5 recent comparable sales in the area"),

  // Neighborhood insights
  neighborhoodInsights: z.array(z.object({
    category: z.string().describe("e.g. 'Schools', 'Walkability', 'Appreciation trend'"),
    rating: z.enum(["excellent", "good", "average", "below_average"]),
    detail: z.string().describe("1-2 sentence detail"),
  })).min(3).max(5),

  // Seller strategy
  sellerStrategy: z.object({
    recommendedListPrice: z.number().describe("Recommended listing price in USD"),
    pricingRationale: z.string().describe("2-3 sentence explanation of the pricing strategy"),
    bestTimeToList: z.string().describe("Optimal timing recommendation with reasoning"),
    estimatedNetProceeds: z.string().describe("Rough net proceeds range after typical closing costs (5-8%), e.g. '$1.1M – $1.18M'"),
    topSellingTips: z.array(z.string()).min(3).max(5).describe("Actionable tips to maximize sale price"),
  }),

  // Summary
  executiveSummary: z.string().describe("3-4 sentence personalized summary addressing the homeowner directly"),
});

export type ValuationResult = z.infer<typeof ValuationSchema>;

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

    // Build a detailed, structured prompt so Perplexity can search for real data
    const featureList = Array.isArray(features) && features.length > 0
      ? features.join(", ")
      : "None specified";

    const prompt = `You are an expert real estate appraiser and market analyst for Southern California.

A homeowner has submitted the following property details for a home valuation:

**PROPERTY DETAILS**
- Address: ${propertyAddress}
- Property Type: ${propertyType || "Single Family Home"}
- Bedrooms: ${bedrooms || "Not specified"}
- Bathrooms: ${bathrooms || "Not specified"}
- Living Area: ${sqft ? sqft + " sqft" : "Not specified"}
- Year Built: ${yearBuilt || "Not specified"}
- Condition: ${condition || "Not specified"}
- Garage: ${garage || "Not specified"}
- Special Features: ${featureList}

**RECENT UPDATES**
- Kitchen: ${kitchenUpdate || "Not specified"}
- Bathrooms: ${bathroomUpdate || "Not specified"}
- Roof: ${roofUpdate || "Not specified"}
- HVAC: ${hvacUpdate || "Not specified"}

**SELLER CONTEXT**
- Timeline: ${timeline || "Not specified"}
- Reason for selling: ${reason || "Not specified"}

Using your knowledge of the current Southern California real estate market and the specific details above, provide a comprehensive, accurate home valuation analysis.

Search for and use:
1. Current median home prices in the specific neighborhood/city of the address
2. Recent comparable sales (within the last 6 months) for similar homes in that area
3. Current market conditions (days on market, list-to-sale ratio, inventory levels)
4. Year-over-year price trends for that area
5. Any local factors affecting property values (school ratings, development, etc.)

Be specific and accurate with your numbers. Use real market data for the area. Account for all the property characteristics, condition, features, and recent updates when calculating the estimated value.`;

    const result = await generateObject({
      // sonar-pro has live web search built in — no external APIs needed
      model: perplexity("sonar-pro") as Parameters<typeof generateObject>[0]["model"],
      schema: ValuationSchema,
      prompt,
      system: `You are a professional real estate appraiser. Always search for current, 
accurate market data for the specific address provided. Use real comparable sales 
and current market statistics. Be precise with dollar amounts. Address the homeowner 
directly in summaries. Never invent data — if unsure, provide a reasonable range and 
explain your confidence level.`,
    });

    return Response.json({ success: true, data: result.object });
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
