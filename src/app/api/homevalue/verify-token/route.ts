/**
 * POST /api/homevalue/verify-token
 *
 * Receives a token string, verifies the HMAC-SHA256 signature using
 * HOMEVALUE_TOKEN_SECRET, checks expiry, and returns the decoded form data.
 *
 * Returns:
 *   { valid: true, data: { ...formFields } }
 *   { valid: false, reason: "expired" | "invalid" }
 */

import { createHmac, timingSafeEqual } from "crypto";

function fromBase64url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

export async function POST(request: Request) {
  const secret = process.env.HOMEVALUE_TOKEN_SECRET;
  if (!secret) {
    return Response.json({ valid: false, reason: "invalid" }, { status: 500 });
  }

  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return Response.json({ valid: false, reason: "invalid" });
    }

    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) {
      return Response.json({ valid: false, reason: "invalid" });
    }

    const encodedPayload = token.slice(0, dotIndex);
    const encodedSig = token.slice(dotIndex + 1);

    // Re-compute expected signature
    const expectedSigB64 = createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Constant-time comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expectedSigB64);
    const receivedBuf = Buffer.from(encodedSig);

    if (
      expectedBuf.length !== receivedBuf.length ||
      !timingSafeEqual(expectedBuf, receivedBuf)
    ) {
      return Response.json({ valid: false, reason: "invalid" });
    }

    // Decode and parse payload
    let parsed: { iss: number; exp: number; d: Record<string, unknown> };
    try {
      parsed = JSON.parse(fromBase64url(encodedPayload));
    } catch {
      return Response.json({ valid: false, reason: "invalid" });
    }

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (!parsed.exp || now > parsed.exp) {
      return Response.json({ valid: false, reason: "expired" });
    }

    return Response.json({ valid: true, data: parsed.d, exp: parsed.exp });
  } catch (err) {
    console.error("[verify-token] error:", err);
    return Response.json({ valid: false, reason: "invalid" });
  }
}
