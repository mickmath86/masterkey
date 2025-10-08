"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

export function useUtmTrackOnce() {
  useEffect(() => {
    // Only fire once per session to avoid duplicate events
    const FLAG = "masterkey_utms_tracked";
    if (sessionStorage.getItem(FLAG)) return;

    try {
      // Look for the MasterKey UTM cookie
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("masterkey_utms="))
        ?.split("=")[1];
      
      if (!raw) return;

      const utms = JSON.parse(decodeURIComponent(raw));

      // Send a one-time attribution event to Vercel Analytics
      track("utm_attribution", {
        utm_source: utms.utm_source || "(none)",
        utm_medium: utms.utm_medium || "(none)",
        utm_campaign: utms.utm_campaign || "(none)",
        utm_term: utms.utm_term || "",
        utm_content: utms.utm_content || "",
        gclid: utms.gclid || "",
        fbclid: utms.fbclid || "",
        msclkid: utms.msclkid || "",
        ttclid: utms.ttclid || "",
        li_fat_id: utms.li_fat_id || "",
        first_seen: utms.first_seen || "",
        last_updated: utms.last_updated || "",
        attribution_type: utms.first_seen === utms.last_updated ? 'first_touch' : 'multi_touch',
        // Add MasterKey-specific context
        business_type: "real_estate",
        tracking_version: "1.0"
      });

      // Mark as tracked for this session
      sessionStorage.setItem(FLAG, "1");

      // Optional: Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('MasterKey UTM Attribution tracked:', utms);
      }

    } catch (error) {
      // Silently fail - don't break the app if UTM tracking fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('UTM tracking error:', error);
      }
    }
  }, []);
}

// New function to get current UTM data for custom events
export function getUtmContext() {
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith("masterkey_utms="))
      ?.split("=")[1];
    
    if (!raw) return {};

    const utms = JSON.parse(decodeURIComponent(raw));
    
    return {
      utm_source: utms.utm_source || "(none)",
      utm_medium: utms.utm_medium || "(none)", 
      utm_campaign: utms.utm_campaign || "(none)",
      utm_term: utms.utm_term || "",
      utm_content: utms.utm_content || "",
      gclid: utms.gclid || "",
      attribution_type: utms.first_seen === utms.last_updated ? 'first_touch' : 'multi_touch'
    };
  } catch (error) {
    return {};
  }
}

// Enhanced track function that automatically includes UTM context
export function trackWithUtm(eventName: string, eventData: Record<string, any> = {}) {
  const utmContext = getUtmContext();
  
  track(eventName, {
    ...eventData,
    ...utmContext
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Tracked "${eventName}" with UTM context:`, { ...eventData, ...utmContext });
  }
}
