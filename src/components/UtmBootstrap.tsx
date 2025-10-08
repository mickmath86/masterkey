"use client";

import { useUtmTrackOnce } from "@/hooks/useUtmTrack";
import { useEffect } from "react";

export default function UtmBootstrap() {
  // Track UTMs to Vercel Analytics (once per session)
  useUtmTrackOnce();

  // Also push to GTM/GA4 dataLayer (every page load)
  useEffect(() => {
    try {
      // FALLBACK: If no cookie exists, try to capture UTMs from current URL
      let utms: any = null;
      
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("masterkey_utms="))
        ?.split("=")[1];

      if (raw) {
        utms = JSON.parse(decodeURIComponent(raw));
        console.log("📊 Found UTMs in cookie:", utms);
      } else {
        // Fallback: Check URL for UTMs and create cookie client-side
        const urlParams = new URLSearchParams(window.location.search);
        const foundUtms: any = {};
        
        const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid", "ttclid", "li_fat_id"];
        
        UTM_KEYS.forEach(key => {
          const value = urlParams.get(key);
          if (value) foundUtms[key] = value;
        });
        
        if (Object.keys(foundUtms).length > 0) {
          console.log("🔥 FALLBACK: Found UTMs in URL, creating cookie:", foundUtms);
          
          const utmData = {
            ...foundUtms,
            first_seen: Date.now(),
            last_updated: Date.now()
          };
          
          // Set cookie client-side
          document.cookie = `masterkey_utms=${encodeURIComponent(JSON.stringify(utmData))}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
          utms = utmData;
        }
      }

      if (!utms) return;

      // Initialize dataLayer if it doesn't exist (GTM should do this, but ensure it exists)
      (window as any).dataLayer = (window as any).dataLayer || [];
      
      // Debug: Log dataLayer status
      if (process.env.NODE_ENV === 'development') {
        console.log('DataLayer status:', {
          exists: !!(window as any).dataLayer,
          length: (window as any).dataLayer?.length || 0,
          contents: (window as any).dataLayer
        });
      }
      
      // Push UTM data to dataLayer for Google Analytics/Tag Manager
      (window as any).dataLayer.push({
        event: "utm_loaded",
        utm_source: utms.utm_source || null,
        utm_medium: utms.utm_medium || null,
        utm_campaign: utms.utm_campaign || null,
        utm_term: utms.utm_term || null,
        utm_content: utms.utm_content || null,
        gclid: utms.gclid || null,
        fbclid: utms.fbclid || null,
        msclkid: utms.msclkid || null,
        ttclid: utms.ttclid || null,
        li_fat_id: utms.li_fat_id || null,
        first_seen: utms.first_seen || null,
        last_updated: utms.last_updated || null,
        attribution_type: utms.first_seen === utms.last_updated ? 'first_touch' : 'multi_touch'
      });

      // Also push to gtag if available (for Google Analytics 4)
      if ((window as any).gtag) {
        (window as any).gtag('event', 'utm_attribution', {
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign,
          utm_term: utms.utm_term,
          utm_content: utms.utm_content,
          custom_parameter_1: utms.gclid || 'none',
          custom_parameter_2: utms.fbclid || 'none'
        });
      }

      // Optional: Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('MasterKey UTM Attribution:', utms);
      }

    } catch (error) {
      // Silently fail - don't break the app if UTM parsing fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('UTM Bootstrap error:', error);
      }
    }
  }, []);

  return null;
}
