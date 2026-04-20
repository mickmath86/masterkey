/**
 * GET /api/rentcast/rent
 *
 * Fetches a long-term rental estimate from Rentcast's AVM endpoint.
 * Accepts enrichment params from a prior property-lookup call for accuracy.
 *
 * Matches the Rentcast docs example:
 * GET /v1/avm/rent/long-term?address=...&propertyType=Single+Family&bedrooms=4&bathrooms=2.5&squareFootage=2658&compCount=5
 *
 * Query params:
 *   address        (required)
 *   propertyType   (optional — display label, mapped to Rentcast format)
 *   bedrooms       (optional)
 *   bathrooms      (optional)
 *   squareFootage  (optional)
 */

import { NextRequest, NextResponse } from "next/server";

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hrs
const cache = new Map<string, { data: any; timestamp: number }>();

// Map our display labels → Rentcast expected values
const TYPE_MAP: Record<string, string> = {
  "Single Family Home":       "Single Family",
  "Condo / Townhome":         "Condo",
  "Multi-Family (2–4 units)": "Multi Family",
  "Land / Lot":               "Land",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address       = searchParams.get("address")?.trim();
  const propertyType  = searchParams.get("propertyType");
  const bedrooms      = searchParams.get("bedrooms");
  const bathrooms     = searchParams.get("bathrooms");
  const squareFootage = searchParams.get("squareFootage");

  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  const cacheKey = `rentcast:rent:${address}:${propertyType ?? ""}:${bedrooms ?? ""}:${bathrooms ?? ""}:${squareFootage ?? ""}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Rentcast API key not configured" }, { status: 500 });
  }

  const rentcastType = propertyType ? (TYPE_MAP[propertyType] ?? propertyType) : null;

  const params = new URLSearchParams({ address });
  if (rentcastType)  params.set("propertyType",  rentcastType);
  if (bedrooms)      params.set("bedrooms",       bedrooms);
  if (bathrooms)     params.set("bathrooms",      bathrooms);
  if (squareFootage) params.set("squareFootage",  squareFootage);
  params.set("compCount", "5");

  console.log(`[rentcast/rent] call: ${params.toString()}`);

  try {
    const res = await fetch(
      `https://api.rentcast.io/v1/avm/rent/long-term?${params.toString()}`,
      {
        headers: { "X-Api-Key": apiKey, accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!res.ok) {
      console.warn(`[rentcast/rent] HTTP ${res.status}`);
      return NextResponse.json({ error: `Rentcast returned ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[rentcast/rent] error:", err);
    return NextResponse.json({ error: "Failed to fetch rent estimate" }, { status: 500 });
  }
}
