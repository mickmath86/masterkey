/**
 * GET /api/assessments/pricing-strategy/report?token=xxx
 *
 * Fetches a saved assessment report from Supabase by its opaque token.
 * Uses service role key (server-side only) — no PII ever exposed in the URL.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("assessment_reports")
    .select(
      "report_token, first_name, report_summary_json, scoring_json, derived_insights_json, created_at"
    )
    .eq("report_token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({
    token:         data.report_token,
    firstName:     data.first_name ?? null,
    createdAt:     data.created_at,
    reportSummary: data.report_summary_json,
    scoring:       data.scoring_json,
    derivedInsights: data.derived_insights_json,
  });
}
