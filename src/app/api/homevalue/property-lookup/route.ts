/**
 * GET /api/homevalue/property-lookup?address=<address>
 *
 * Looks up basic property facts (beds, baths, sqft, year built, type)
 * for a given address using Rentcast /v1/properties.
 *
 * Returns a normalized PropertyFacts object, or { found: false } if the
 * address can't be resolved — callers should degrade gracefully.
 *
 * Required env var: RENTCAST_API_KEY
 */

import { NextRequest, NextResponse } from "next/server";

export interface PropertyFacts {
  found: true;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
}

export interface PropertyFactsNotFound {
  found: false;
}

export type PropertyLookupResult = PropertyFacts | PropertyFactsNotFound;

// Simple in-memory cache — property facts don't change mid-session
const cache = new Map<string, { data: PropertyLookupResult; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 min

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.trim();

  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  // Cache hit
  const cached = cache.get(address);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    // No key — degrade gracefully, user fills step 2 manually
    return NextResponse.json({ found: false } satisfies PropertyFactsNotFound);
  }

  try {
    const qs = new URLSearchParams({ address });
    const res = await fetch(`https://api.rentcast.io/v1/properties?${qs}`, {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`Rentcast property lookup failed: ${res.status}`);
      const notFound: PropertyFactsNotFound = { found: false };
      cache.set(address, { data: notFound, ts: Date.now() });
      return NextResponse.json(notFound);
    }

    const data = await res.json();
    // Rentcast returns an array; first item is the best address match
    const prop = Array.isArray(data) ? data[0] : data;

    if (!prop) {
      const notFound: PropertyFactsNotFound = { found: false };
      cache.set(address, { data: notFound, ts: Date.now() });
      return NextResponse.json(notFound);
    }

    const beds = prop.bedrooms ?? null;
    const baths = prop.bathrooms ?? null;
    const sqft = prop.squareFootage ?? prop.livingArea ?? null;
    const year = prop.yearBuilt ?? null;
    const type = normaliseType(prop.propertyType ?? "");

    // If we got nothing useful, treat as not found
    if (beds == null && baths == null && sqft == null && year == null) {
      const notFound: PropertyFactsNotFound = { found: false };
      cache.set(address, { data: notFound, ts: Date.now() });
      return NextResponse.json(notFound);
    }

    const result: PropertyFacts = {
      found: true,
      bedrooms: beds != null ? String(beds) : "",
      bathrooms: baths != null ? String(parseFloat(Number(baths).toFixed(1))) : "",
      sqft: sqft != null ? String(Math.round(sqft)) : "",
      yearBuilt: year != null ? String(year) : "",
      propertyType: type,
    };

    cache.set(address, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Property lookup error:", err);
    const notFound: PropertyFactsNotFound = { found: false };
    return NextResponse.json(notFound);
  }
}

// Map Rentcast propertyType strings → questionnaire option labels
function normaliseType(raw: string): string {
  const t = raw.toUpperCase();
  if (t.includes("CONDO") || t.includes("TOWNHOUSE") || t.includes("TOWN_HOUSE")) {
    return "Condo / Townhome";
  }
  if (t.includes("MULTI") || t.includes("DUPLEX") || t.includes("TRIPLEX") || t.includes("FOURPLEX")) {
    return "Multi-Family (2–4 units)";
  }
  if (t.includes("LOT") || t.includes("LAND")) {
    return "Land / Lot";
  }
  return "Single Family Home";
}
