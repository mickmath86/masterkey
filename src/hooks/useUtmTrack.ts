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
export function getUtmContext(): Record<string, string> {
  try {
    console.log('🍪 All cookies:', document.cookie);
    
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith("masterkey_utms="))
      ?.split("=")[1];
    
    console.log('🍪 Raw UTM cookie:', raw);
    
    if (!raw) {
      console.log('❌ No UTM cookie found');
      return {};
    }

    const utms = JSON.parse(decodeURIComponent(raw));
    console.log('🍪 Parsed UTM data:', utms);
    
    // Only return properties that have actual values (not undefined/null)
    const context: Record<string, string> = {};
    
    if (utms.utm_source) context.utm_source = String(utms.utm_source);
    if (utms.utm_medium) context.utm_medium = String(utms.utm_medium);
    if (utms.utm_campaign) context.utm_campaign = String(utms.utm_campaign);
    if (utms.utm_term) context.utm_term = String(utms.utm_term);
    if (utms.utm_content) context.utm_content = String(utms.utm_content);
    if (utms.gclid) context.gclid = String(utms.gclid);
    
    if (utms.first_seen && utms.last_updated) {
      context.attribution_type = utms.first_seen === utms.last_updated ? 'first_touch' : 'multi_touch';
    }
    
    return context;
  } catch (error) {
    return {};
  }
}

// Enhanced track function that automatically includes UTM context
export function trackWithUtm(eventName: string, eventData: Record<string, any> = {}) {
  const utmContext = getUtmContext();
  
  // Debug logging
  console.log('🔍 UTM Context Debug:', {
    utmContext,
    hasUtmData: Object.keys(utmContext).length > 0,
    eventData,
    eventName
  });
  
  // Only spread UTM context if it has values
  const finalEventData = Object.keys(utmContext).length > 0 
    ? { ...eventData, ...utmContext }
    : eventData;
  
  track(eventName, finalEventData);
  
  console.log(`📊 Tracked "${eventName}" with final data:`, finalEventData);
}
