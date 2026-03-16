/**
 * GET /api/homevalue/property-lookup?address=<address>
 *
 * Looks up basic property facts (beds, baths, sqft, year built, type)
 * for a given address.
 *
 * Strategy (waterfall):
 *   1. Rentcast /v1/properties  — preferred, already integrated in this project
 *   2. Zillow via RapidAPI      — fallback if Rentcast key is missing or fails
 *
 * Returns a normalized PropertyFacts object, or { found: false } if no
 * source can resolve the address. Callers should degrade gracefully.
 *
 * Required env vars (at least one):
 *   RENTCAST_API_KEY   — preferred
 *   RAPIDAPI_KEY       — fallback
 */

import { NextRequest, NextResponse } from "next/server";

export interface PropertyFacts {
  found: true;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
  source: "rentcast" | "zillow";
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

  // ── 1. Try Rentcast first ──────────────────────────────────────────────────
  const rentcastKey = process.env.RENTCAST_API_KEY;
  if (rentcastKey) {
    try {
      const qs = new URLSearchParams({ address });
      const res = await fetch(
        `https://api.rentcast.io/v1/properties?${qs}`,
        {
          headers: {
            "X-Api-Key": rentcastKey,
            "Accept": "application/json",
          },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Rentcast returns an array; first result is the best match
        const prop = Array.isArray(data) ? data[0] : data;

        if (prop) {
          const beds = prop.bedrooms ?? null;
          const baths = prop.bathrooms ?? null;
          const sqft = prop.squareFootage ?? prop.livingArea ?? null;
          const year = prop.yearBuilt ?? null;
          const type = normaliseType(prop.propertyType ?? "");

          if (beds || baths || sqft || year) {
            const result: PropertyFacts = {
              found: true,
              bedrooms: beds != null ? String(beds) : "",
              bathrooms: baths != null ? String(parseFloat(Number(baths).toFixed(1))) : "",
              sqft: sqft != null ? String(Math.round(sqft)) : "",
              yearBuilt: year != null ? String(year) : "",
              propertyType: type,
              source: "rentcast",
            };
            cache.set(address, { data: result, ts: Date.now() });
            return NextResponse.json(result);
          }
        }
      } else {
        console.warn(`Rentcast property lookup failed: ${res.status}`);
      }
    } catch (err) {
      console.warn("Rentcast property lookup error:", err);
    }
  }

  // ── 2. Fall back to Zillow / RapidAPI ─────────────────────────────────────
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  if (rapidApiKey) {
    try {
      const qs = new URLSearchParams({ address });
      const res = await fetch(
        `https://zillow-com1.p.rapidapi.com/property?${qs}`,
        {
          headers: {
            "x-rapidapi-key": rapidApiKey,
            "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
          },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (res.ok) {
        const raw = await res.json();

        const beds = raw.bedrooms ?? raw.resoFacts?.bedrooms ?? null;
        const baths = raw.bathrooms ?? raw.resoFacts?.bathroomsFloat ?? raw.resoFacts?.bathrooms ?? null;
        const sqft = raw.livingArea ?? raw.resoFacts?.livingArea ?? null;
        const year = raw.resoFacts?.yearBuilt ?? raw.yearBuilt ?? null;
        const type = normaliseType(raw.homeType ?? raw.propertyType ?? "");

        if (beds || baths || sqft || year) {
          const result: PropertyFacts = {
            found: true,
            bedrooms: beds != null ? String(beds) : "",
            bathrooms: baths != null ? String(parseFloat(Number(baths).toFixed(1))) : "",
            sqft: sqft != null ? String(Math.round(sqft)) : "",
            yearBuilt: year != null ? String(year) : "",
            propertyType: type,
            source: "zillow",
            zpid: raw.zpid ? String(raw.zpid) : undefined,
          };
          cache.set(address, { data: result, ts: Date.now() });
          return NextResponse.json(result);
        }
      } else {
        console.warn(`Zillow property lookup failed: ${res.status}`);
      }
    } catch (err) {
      console.warn("Zillow property lookup error:", err);
    }
  }

  // ── 3. Nothing worked ─────────────────────────────────────────────────────
  const notFound: PropertyFactsNotFound = { found: false };
  cache.set(address, { data: notFound, ts: Date.now() });
  return NextResponse.json(notFound);
}

// Map raw property type strings → questionnaire option labels
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
