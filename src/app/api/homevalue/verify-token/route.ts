/**
 * POST /api/homevalue/verify-token
 *
 * Receives a short token (sig.id), verifies the HMAC signature,
 * fetches form data from Supabase, and checks expiry.
 *
 * Returns:
 *   { valid: true, data: { ...formFields } }
 *   { valid: false, reason: "expired" | "invalid" }
 */

import { createHmac, timingSafeEqual } from "crypto";

function toBase64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signId(id: string, secret: string): string {
  const sig = createHmac("sha256", secret).update(id).digest();
  return toBase64url(sig);
}

export async function POST(request: Request) {
  const secret = process.env.HOMEVALUE_TOKEN_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !supabaseUrl || !supabaseKey) {
    return Response.json({ valid: false, reason: "invalid" }, { status: 500 });
  }

  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return Response.json({ valid: false, reason: "invalid" });
    }

    // Token format: sig.id (sig is base64url of HMAC, id is UUID)
    const dotIndex = token.indexOf(".");
    if (dotIndex === -1) {
      return Response.json({ valid: false, reason: "invalid" });
    }

    const receivedSig = token.slice(0, dotIndex);
    const id = token.slice(dotIndex + 1);

    // Verify HMAC signature
    const expectedSig = signId(id, secret);
    const expectedBuf = Buffer.from(expectedSig);
    const receivedBuf = Buffer.from(receivedSig);

    if (
      expectedBuf.length !== receivedBuf.length ||
      !timingSafeEqual(expectedBuf, receivedBuf)
    ) {
      return Response.json({ valid: false, reason: "invalid" });
    }

    // Fetch form data from Supabase
    const dbRes = await fetch(
      `${supabaseUrl}/rest/v1/homevalue_sessions?id=eq.${encodeURIComponent(id)}&select=form_data,expires_at`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!dbRes.ok) {
      console.error("[verify-token] Supabase fetch failed:", await dbRes.text());
      return Response.json({ valid: false, reason: "invalid" });
    }

    const rows = await dbRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return Response.json({ valid: false, reason: "invalid" });
    }

    const { form_data, expires_at } = rows[0];

    // Check expiry
    if (!expires_at || Date.now() > new Date(expires_at).getTime()) {
      return Response.json({ valid: false, reason: "expired" });
    }

    return Response.json({ valid: true, data: form_data });
  } catch (err) {
    console.error("[verify-token] error:", err);
    return Response.json({ valid: false, reason: "invalid" });
  }
}
