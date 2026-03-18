/**
 * POST /api/homevalue/sign-token
 *
 * Receives the home value form data after a successful valuation,
 * signs it with HMAC-SHA256 using HOMEVALUE_TOKEN_SECRET, and returns
 * a URL-safe token valid for 30 days.
 *
 * Token format: base64url(payload) + "." + base64url(signature)
 *
 * The secret never leaves the server.
 */

import { createHmac } from "crypto";

const TOKEN_TTL_DAYS = 30;

function toBase64url(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(request: Request) {
  const secret = process.env.HOMEVALUE_TOKEN_SECRET;
  if (!secret) {
    return Response.json({ error: "Token secret not configured" }, { status: 500 });
  }

  try {
    const formData = await request.json();

    const now = Math.floor(Date.now() / 1000);
    const exp = now + TOKEN_TTL_DAYS * 24 * 60 * 60;

    const payload = JSON.stringify({ iss: now, exp, d: formData });
    const encodedPayload = toBase64url(payload);

    const sig = createHmac("sha256", secret).update(encodedPayload).digest();
    const encodedSig = sig
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const token = `${encodedPayload}.${encodedSig}`;

    return Response.json({ token, exp });
  } catch (err) {
    console.error("[sign-token] error:", err);
    return Response.json({ error: "Failed to sign token" }, { status: 500 });
  }
}
