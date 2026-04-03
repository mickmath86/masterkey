/**
 * POST /api/homevalue/sign-token
 *
 * Saves form data to Supabase with a short UUID session ID,
 * signs the ID with HMAC-SHA256, and returns a compact token.
 *
 * Token format: base64url(HMAC-SHA256(id)) + "." + id
 * Example: xK9mP2qR_abc123  (~50 chars vs ~800 chars previously)
 *
 * The full form data lives in Supabase — the token just proves
 * the ID hasn't been tampered with.
 */

import { createHmac, randomUUID } from "crypto";

const TOKEN_TTL_DAYS = 30;

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
    return Response.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const formData = await request.json();

    const id = randomUUID(); // e.g. "550e8400-e29b-41d4-a716-446655440000"
    const now = Math.floor(Date.now() / 1000);
    const exp = now + TOKEN_TTL_DAYS * 24 * 60 * 60;
    const expiresAt = new Date(exp * 1000).toISOString();

    // Save to Supabase
    const dbRes = await fetch(
      `${supabaseUrl}/rest/v1/homevalue_sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ id, form_data: formData, expires_at: expiresAt }),
      }
    );

    if (!dbRes.ok) {
      const errText = await dbRes.text();
      console.error("[sign-token] Supabase insert failed:", errText);
      return Response.json({ error: "Failed to save session" }, { status: 500 });
    }

    // Sign the ID — token = sig.id
    const sig = signId(id, secret);
    const token = `${sig}.${id}`;

    return Response.json({ token, exp });
  } catch (err) {
    console.error("[sign-token] error:", err);
    return Response.json({ error: "Failed to sign token" }, { status: 500 });
  }
}
