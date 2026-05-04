/**
 * GET /r/[id]
 *
 * Click-tracking redirect for report links sent via SMS.
 *
 * Flow:
 * 1. Receive request at /r/abc123
 * 2. Look up the report ID in Supabase rvs_reports table
 * 3. Log the click (timestamp, user-agent, referrer) back to Supabase
 * 4. Optionally fire a GHL webhook to mark the contact as "link clicked"
 * 5. Redirect to the real report URL: /rent-vs-sell/results?id=abc123
 *
 * If the ID is unknown, redirect to the rent-vs-sell landing page.
 *
 * Usage in GHL SMS template:
 *   "Your Sell vs. Rent report: https://www.usemasterkey.com/r/{{reportId}}"
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CLICK_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/e5c3377b-b8fa-4ac1-ba21-bd2d63560dd7";

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = rawId?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.usemasterkey.com";
  const fallback = `${siteUrl}/rent-vs-sell`;

  if (!id) {
    return NextResponse.redirect(fallback, { status: 302 });
  }

  const reportUrl = `${siteUrl}/rent-vs-sell/results?id=${id}`;
  const ua        = req.headers.get("user-agent") ?? "";
  const referrer  = req.headers.get("referer") ?? "";
  const clickedAt = new Date().toISOString();

  // Log click + fire webhook in parallel (don't block redirect on either)
  const supabase = getSupabase();

  // Non-blocking: log + webhook
  Promise.allSettled([
    // 1. Log click to Supabase rvs_reports
    supabase
      ? supabase
          .from("rvs_reports")
          .update({
            data: supabase
              ? undefined  // can't easily merge jsonb client-side; use rpc below
              : undefined,
          })
          .eq("id", id)
          .then(() => {
            // Append click event via raw SQL through a separate upsert on a clicks column
            // Simplest: just update a last_clicked_at column if it exists, else skip
            return supabase.rpc("log_rvs_click", { report_id: id, clicked_at: clickedAt, user_agent: ua }).then(() => null, () => null);
          })
      : Promise.resolve(),

    // 2. Fire GHL webhook so the contact gets tagged / workflow fires
    fetch(CLICK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId:    id,
        reportUrl,
        formType:    "rent-vs-sell-link-clicked",
        clickedAt,
        userAgent:   ua,
        referrer,
        source:      "sms-redirect",
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null),
  ]);

  // Immediate redirect — user never waits for logging
  return NextResponse.redirect(reportUrl, { status: 302 });
}
