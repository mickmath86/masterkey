/**
 * POST /api/assessments/pricing-strategy/submit
 *
 * Server-side submission handler:
 * 1. Validates payload
 * 2. Scores assessment
 * 3. Saves report to Supabase
 * 4. Dispatches webhook
 * 5. Returns { reportToken, reportUrl }
 *
 * All Supabase access uses the service role key (server-only).
 * Webhook URL and service key never reach the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scoreAssessment } from "@/lib/pricing-strategy/scoring";
import type { AssessmentSubmission } from "@/lib/pricing-strategy/types";

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/84d41ffb-2d68-447e-b80c-15636254e2a9";

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key);
}

function generateToken(length = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.usemasterkey.com")
  );
}

export async function POST(req: NextRequest) {
  // ── Parse + validate body ────────────────────────────────────────────────
  let body: AssessmentSubmission;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { lead, responses } = body;
  if (!lead?.firstName?.trim() || !lead?.email?.trim()) {
    return NextResponse.json(
      { error: "firstName and email are required" },
      { status: 400 }
    );
  }
  if (!Array.isArray(responses) || responses.length === 0) {
    return NextResponse.json(
      { error: "responses are required" },
      { status: 400 }
    );
  }

  // ── Score the assessment ──────────────────────────────────────────────────
  const { strategyResult, derivedInsights } = scoreAssessment(responses);

  const reportSummary = {
    strategyResult,
    derivedInsights,
    responses,
    generatedAt: new Date().toISOString(),
  };

  // ── Generate unique token ─────────────────────────────────────────────────
  const reportToken = generateToken();
  const reportUrl = `${getSiteUrl()}/pricing-strategy/report/${reportToken}`;
  const now = new Date().toISOString();

  // ── Save to Supabase ──────────────────────────────────────────────────────
  const supabase = getSupabase();
  let webhookStatus: "delivered" | "failed" | "skipped" = "skipped";
  let webhookError: string | null = null;

  if (supabase) {
    const { error: dbError } = await supabase.from("assessment_reports").insert({
      report_token:          reportToken,
      assessment_type:       "pricing-strategy",
      first_name:            lead.firstName.trim(),
      email:                 lead.email.trim().toLowerCase(),
      phone:                 lead.phone?.trim() ?? null,
      property_address:      lead.propertyAddress?.trim() ?? null,
      city_or_zip:           lead.cityOrZip?.trim() ?? null,
      responses_json:        responses,
      scoring_json:          {
        strategyType:  strategyResult.strategyType,
        strategyLabel: strategyResult.strategyLabel,
        confidenceBand: strategyResult.confidenceBand,
      },
      derived_insights_json: derivedInsights,
      report_summary_json:   reportSummary,
      source_path:           body.sourcePath ?? "/pricing-strategy",
      utm_json: {
        utmSource:   body.utmSource ?? null,
        utmMedium:   body.utmMedium ?? null,
        utmCampaign: body.utmCampaign ?? null,
        utmTerm:     body.utmTerm ?? null,
        utmContent:  body.utmContent ?? null,
      },
      user_agent:            body.userAgent ?? req.headers.get("user-agent") ?? null,
      landing_page_version:  "v1",
      webhook_status:        "pending",
    });

    if (dbError) {
      console.error("[pricing-strategy/submit] Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save report. Please try again." },
        { status: 500 }
      );
    }
  } else {
    console.warn("[pricing-strategy/submit] Supabase not configured — skipping DB write");
  }

  // ── Dispatch webhook ──────────────────────────────────────────────────────
  const webhookPayload = {
    assessmentType: "pricing-strategy",
    createdAt: now,
    reportToken,
    reportUrl,
    lead: {
      firstName:       lead.firstName.trim(),
      email:           lead.email.trim().toLowerCase(),
      phone:           lead.phone?.trim() ?? null,
      propertyAddress: lead.propertyAddress?.trim() ?? null,
      cityOrZip:       lead.cityOrZip?.trim() ?? null,
    },
    responses,
    scoring: {
      strategyType:   strategyResult.strategyType,
      strategyLabel:  strategyResult.strategyLabel,
      confidenceBand: strategyResult.confidenceBand,
    },
    derivedInsights,
    meta: {
      sourcePath:          body.sourcePath ?? "/pricing-strategy",
      landingPageVersion:  "v1",
      userAgent:           body.userAgent ?? req.headers.get("user-agent") ?? null,
      utmSource:           body.utmSource ?? null,
      utmMedium:           body.utmMedium ?? null,
      utmCampaign:         body.utmCampaign ?? null,
      utmTerm:             body.utmTerm ?? null,
      utmContent:          body.utmContent ?? null,
    },
  };

  try {
    const webhookRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
      signal: AbortSignal.timeout(8000),
    });
    webhookStatus = webhookRes.ok ? "delivered" : "failed";
    if (!webhookRes.ok) {
      webhookError = `HTTP ${webhookRes.status}`;
    }
  } catch (err) {
    webhookStatus = "failed";
    webhookError = err instanceof Error ? err.message : "Unknown error";
    console.error("[pricing-strategy/submit] Webhook error:", webhookError);
  }

  // Update webhook status in Supabase
  if (supabase) {
    await supabase
      .from("assessment_reports")
      .update({
        webhook_status:       webhookStatus,
        webhook_attempted_at: new Date().toISOString(),
        webhook_error:        webhookError,
      })
      .eq("report_token", reportToken);
  }

  return NextResponse.json({
    success: true,
    reportToken,
    reportUrl,
    strategyType:  strategyResult.strategyType,
    strategyLabel: strategyResult.strategyLabel,
    webhookStatus,
  });
}
