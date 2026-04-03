/**
 * POST /api/validate-email
 *
 * Server-side proxy for AbstractAPI Email Reputation.
 * Keeps the API key off the client entirely.
 *
 * Body: { email: string }
 *
 * Returns:
 *   { valid: true }
 *   { valid: false, reason: string }
 *   { valid: true, skipped: true }   ← API unavailable, fail open
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ valid: false, reason: "Email address is required." }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    // Layer 1: local format check (free, instant)
    if (!EMAIL_REGEX.test(trimmed)) {
      return Response.json({ valid: false, reason: "Please enter a valid email address." });
    }

    // Layer 2: AbstractAPI Email Reputation
    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
    if (!apiKey) {
      console.warn("[validate-email] ABSTRACT_EMAIL_API_KEY not set — skipping reputation check");
      return Response.json({ valid: true, skipped: true });
    }

    const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(trimmed)}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!res.ok) {
      console.warn("[validate-email] AbstractAPI returned", res.status, "— failing open");
      return Response.json({ valid: true, skipped: true });
    }

    const data = await res.json();

    const status: string = (data?.email_deliverability?.status ?? "unknown").toLowerCase();
    const isFormatValid: boolean = data?.email_deliverability?.is_format_valid ?? true;
    const isMxValid: boolean = data?.email_deliverability?.is_mx_valid ?? true;
    const isDisposable: boolean = data?.email_quality?.is_disposable ?? false;
    const addressRisk: string = (data?.email_risk?.address_risk_status ?? "low").toLowerCase();
    const domainRisk: string = (data?.email_risk?.domain_risk_status ?? "low").toLowerCase();

    // Block bad format (shouldn't reach here after regex, but belt-and-suspenders)
    if (!isFormatValid) {
      return Response.json({ valid: false, reason: "Please enter a valid email address." });
    }

    // Block if domain has no MX records (fake/non-existent domain)
    if (!isMxValid) {
      return Response.json({ valid: false, reason: "That email domain doesn't appear to exist. Please check your address." });
    }

    // Block if explicitly undeliverable
    if (status === "undeliverable") {
      return Response.json({ valid: false, reason: "That email address appears to be undeliverable. Please use a different address." });
    }

    // Block disposable addresses
    if (isDisposable) {
      return Response.json({ valid: false, reason: "Disposable email addresses aren't accepted. Please use your real email." });
    }

    // Block high-risk addresses
    if (addressRisk === "high" || domainRisk === "high") {
      return Response.json({ valid: false, reason: "We couldn't verify that email address. Please use a different one." });
    }

    return Response.json({ valid: true });
  } catch (err) {
    // Network timeout or parse error — fail open so real leads aren't blocked
    console.warn("[validate-email] error, failing open:", err);
    return Response.json({ valid: true, skipped: true });
  }
}
