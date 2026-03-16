/**
 * GET /api/homevalue/property-lookup?address=<address>
 *
 * Looks up basic property facts (beds, baths, sqft, year built, type)
 * for a given address using the existing Zillow/RapidAPI integration.
 *
 * Returns a normalized PropertyFacts object, or { found: false } if
 * the address can't be resolved — callers should fall back gracefully.
 *
 * Required env var: RAPIDAPI_KEY
 */

import { NextRequest, NextResponse } from "next/server";

export interface PropertyFacts {
  found: true;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
  zpid?: string;
}

export interface PropertyFactsNotFound {
  found: false;
}

export type PropertyLookupResult = PropertyFacts | PropertyFactsNotFound;

// Simple in-memory cache — results are stable for the session
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

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    // No key configured — return not-found so the UI degrades gracefully
    return NextResponse.json({ found: false } satisfies PropertyFactsNotFound);
  }

  try {
    const qs = new URLSearchParams({ address });
    const response = await fetch(
      `https://zillow-com1.p.rapidapi.com/property?${qs}`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
        },
        // 8-second timeout — we don't want to block the user too long
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      console.warn("Zillow lookup failed:", response.status);
      return NextResponse.json({ found: false } satisfies PropertyFactsNotFound);
    }

    const raw = await response.json();

    // Normalise the Zillow response into the fields we care about
    const beds = raw.bedrooms ?? raw.resoFacts?.bedrooms ?? null;
    const baths = raw.bathrooms ?? raw.resoFacts?.bathroomsFloat ?? raw.resoFacts?.bathrooms ?? null;
    const sqft = raw.livingArea ?? raw.resoFacts?.livingArea ?? null;
    const year = raw.resoFacts?.yearBuilt ?? raw.yearBuilt ?? null;
    const type = normaliseType(raw.homeType ?? raw.propertyType ?? "");

    // If we couldn't get any useful facts, return not-found
    if (!beds && !baths && !sqft && !year) {
      const result: PropertyFactsNotFound = { found: false };
      cache.set(address, { data: result, ts: Date.now() });
      return NextResponse.json(result);
    }

    const result: PropertyFacts = {
      found: true,
      bedrooms: beds ? String(beds) : "",
      bathrooms: baths ? String(parseFloat(baths.toFixed(1))) : "",
      sqft: sqft ? String(Math.round(sqft)) : "",
      yearBuilt: year ? String(year) : "",
      propertyType: type,
      zpid: raw.zpid ? String(raw.zpid) : undefined,
    };

    cache.set(address, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Property lookup error:", err);
    return NextResponse.json({ found: false } satisfies PropertyFactsNotFound);
  }
}

// Map Zillow homeType strings to the questionnaire's property type options
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
