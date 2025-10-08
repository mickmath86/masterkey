// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log("🚀 Middleware file loaded!");

const UTM_KEYS = [
  "utm_source",
  "utm_medium", 
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",        // Google Ads click ID
  "fbclid",       // Facebook click ID
  "msclkid",      // Microsoft Ads click ID
  "ttclid",       // TikTok click ID
  "li_fat_id",    // LinkedIn click ID
];

export function middleware(req: NextRequest) {
  console.log("🔥 MIDDLEWARE FUNCTION CALLED!", req.url);
  
  const url = new URL(req.url);
  const found: Record<string, string> = {};

  // Debug logging in development
  console.log('🔍 Middleware running for:', url.pathname);
  console.log('🔍 URL search params:', url.searchParams.toString());

  // Extract UTM parameters from URL
  UTM_KEYS.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) {
      found[key] = value;
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Found UTM: ${key} = ${value}`);
      }
    }
  });

  const res = NextResponse.next();

  // Only set cookie if we found new UTM parameters
  if (Object.keys(found).length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Setting UTM cookie with data:', found);
    }
    const existing = req.cookies.get("masterkey_utms")?.value;
    const prev = existing ? JSON.parse(existing) : {};
    
    // Merge new UTMs with existing, preserving first_seen timestamp
    const merged = { 
      ...prev, 
      ...found, 
      first_seen: prev.first_seen ?? Date.now(),
      last_updated: Date.now()
    };

    res.cookies.set("masterkey_utms", JSON.stringify(merged), {
      httpOnly: false,    // Readable client-side for analytics
      sameSite: "lax",    // CSRF protection while allowing cross-site navigation
      path: "/",          // Available across entire site
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      maxAge: 60 * 60 * 24 * 90, // 90 days retention
    });
  }

  return res;
}

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};