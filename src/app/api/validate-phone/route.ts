/**
 * POST /api/validate-phone
 *
 * Server-side proxy for AbstractAPI Phone Intelligence.
 * Keeps the API key off the client entirely.
 *
 * Body: { phone: string }
 *
 * Returns:
 *   { valid: true }
 *   { valid: false, reason: string }
 *   { valid: true, skipped: true }   ← API unavailable, fail open
 */

// Known obviously-fake US patterns to reject client-side style before
// spending an API call.
const FAKE_PATTERNS = [
  /^(\d)\1{9}$/,           // 0000000000, 1111111111, etc.
  /^1234567890$/,
  /^0987654321$/,
  /^1234554321$/,
];

function stripToDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function localFormatCheck(digits: string): { ok: boolean; reason?: string } {
  // Strip leading country code if present (1XXXXXXXXXX → XXXXXXXXXX)
  const local = digits.startsWith("1") && digits.length === 11
    ? digits.slice(1)
    : digits;

  if (local.length !== 10) {
    return { ok: false, reason: "Please enter a valid 10-digit US phone number." };
  }

  // Area code can't start with 0 or 1
  if (local[0] === "0" || local[0] === "1") {
    return { ok: false, reason: "Please enter a valid phone number." };
  }

  for (const pattern of FAKE_PATTERNS) {
    if (pattern.test(local)) {
      return { ok: false, reason: "Please enter a valid phone number." };
    }
  }

  return { ok: true };
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || typeof phone !== "string") {
      return Response.json({ valid: false, reason: "Phone number is required." }, { status: 400 });
    }

    const digits = stripToDigits(phone);

    // Layer 1: local format check (free, instant)
    const fmt = localFormatCheck(digits);
    if (!fmt.ok) {
      return Response.json({ valid: false, reason: fmt.reason });
    }

    // Layer 2: AbstractAPI carrier lookup
    const apiKey = process.env.ABSTRACT_PHONE_API_KEY;
    if (!apiKey) {
      // Key not configured — fail open so real leads aren't blocked
      console.warn("[validate-phone] ABSTRACT_PHONE_API_KEY not set — skipping carrier check");
      return Response.json({ valid: true, skipped: true });
    }

    // Normalise to E.164-ish for US numbers
    const e164 = digits.startsWith("1") ? digits : `1${digits}`;

    const url = `https://phoneintelligence.abstractapi.com/v1/?api_key=${apiKey}&phone=${e164}&country=US`;

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) {
      // API error — fail open
      console.warn("[validate-phone] AbstractAPI returned", res.status, "— failing open");
      return Response.json({ valid: true, skipped: true });
    }

    const data = await res.json();

    const isValid: boolean = data?.phone_validation?.is_valid ?? true;
    const lineStatus: string = (data?.phone_validation?.line_status ?? "").toLowerCase();
    const isDisposable: boolean = data?.phone_risk?.is_disposable ?? false;
    const riskLevel: string = (data?.phone_risk?.risk_level ?? "low").toLowerCase();

    // Block if explicitly invalid or inactive or disposable or high-risk
    if (!isValid) {
      return Response.json({ valid: false, reason: "That doesn't appear to be a valid phone number. Please double-check and try again." });
    }
    if (lineStatus === "inactive") {
      return Response.json({ valid: false, reason: "That number appears to be inactive. Please use an active phone number." });
    }
    if (isDisposable) {
      return Response.json({ valid: false, reason: "Disposable phone numbers aren't accepted. Please use your real number." });
    }
    if (riskLevel === "high") {
      return Response.json({ valid: false, reason: "We couldn't verify that phone number. Please use a different number." });
    }

    return Response.json({ valid: true });
  } catch (err) {
    // Network timeout or parse error — fail open
    console.warn("[validate-phone] error, failing open:", err);
    return Response.json({ valid: true, skipped: true });
  }
}
