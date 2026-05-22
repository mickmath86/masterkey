/**
 * POST /api/rent-vs-sell/report
 *   Body: { form, results, monthlyRent }
 *   Returns: { id, url, expiresAt }
 *   Stores report in Supabase with 30-day TTL
 *
 * GET /api/rent-vs-sell/report?id=xxx
 *   Returns: { form, results, monthlyRent, expiresAt } or 404/410
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Generate a short random alphanumeric ID, e.g. "a3x9k2m7" */
function generateId(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (const byte of array) {
    id += chars[byte % chars.length];
  }
  return id;
}

// ─── POST: save a new report ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { form, results, monthlyRent } = body;
  if (!form || !results) {
    return NextResponse.json({ error: "form and results are required" }, { status: 400 });
  }

  // Generate a unique ID (retry up to 3 times on collision)
  let id = generateId();
  for (let attempt = 0; attempt < 3; attempt++) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("rvs_reports").insert({
      id,
      data: { form, results, monthlyRent: monthlyRent ?? null },
      expires_at: expiresAt,
    });

    if (!error) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mathiasregroup.com";
      const reportUrl = `${siteUrl}/rent-vs-sell/results?id=${id}`;
      return NextResponse.json({ id, url: reportUrl, expiresAt });
    }

    // If duplicate ID, generate a new one and retry
    if (error.code === "23505") {
      id = generateId();
      continue;
    }

    console.error("[rvs/report] insert error:", error);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }

  return NextResponse.json({ error: "Failed to generate unique ID" }, { status: 500 });
}

// ─── GET: fetch a report by ID ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("rvs_reports")
    .select("id, data, created_at, expires_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Check expiry
  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "Report expired", expiredAt: data.expires_at }, { status: 410 });
  }

  return NextResponse.json({
    id: data.id,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
    ...data.data,
  });
}
