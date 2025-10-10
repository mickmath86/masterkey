"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

export function useUtmTrackOnce() {
  useEffect(() => {
    // Only fire once per session to avoid duplicate events
    const FLAG = "masterkey_utms_tracked";
    if (sessionStorage.getItem(FLAG)) {
      console.log('🚫 UTM attribution already tracked this session');
      return;
    }

    const attemptTracking = () => {
      try {
        console.log('🔍 Attempting UTM attribution tracking...');
        
        // Look for the MasterKey UTM cookie
        const raw = document.cookie
          .split("; ")
          .find((c) => c.startsWith("masterkey_utms="))
          ?.split("=")[1];
        
        console.log('🍪 UTM cookie found:', !!raw);
        
        if (!raw) {
          console.log('❌ No UTM cookie found for attribution');
          return false;
        }

        const utms = JSON.parse(decodeURIComponent(raw));
        console.log('📊 Parsed UTMs for attribution:', utms);

        // Send a one-time attribution event to Vercel Analytics
        // Only include properties with actual values (Vercel may filter empty strings)
        const attributionData: Record<string, any> = {
          business_type: "real_estate",
          tracking_version: "1.0"
        };

        // Add UTM parameters only if they have values
        if (utms.utm_source) attributionData.utm_source = utms.utm_source;
        if (utms.utm_medium) attributionData.utm_medium = utms.utm_medium;
        if (utms.utm_campaign) attributionData.utm_campaign = utms.utm_campaign;
        if (utms.utm_term) attributionData.utm_term = utms.utm_term;
        if (utms.utm_content) attributionData.utm_content = utms.utm_content;
        if (utms.gclid) attributionData.gclid = utms.gclid;
        if (utms.fbclid) attributionData.fbclid = utms.fbclid;
        if (utms.msclkid) attributionData.msclkid = utms.msclkid;
        if (utms.ttclid) attributionData.ttclid = utms.ttclid;
        if (utms.li_fat_id) attributionData.li_fat_id = utms.li_fat_id;
        
        if (utms.first_seen) attributionData.first_seen = String(utms.first_seen);
        if (utms.last_updated) attributionData.last_updated = String(utms.last_updated);
        
        if (utms.first_seen && utms.last_updated) {
          attributionData.attribution_type = utms.first_seen === utms.last_updated ? 'first_touch' : 'multi_touch';
        }

        console.log('🎯 Sending utm_attribution event to Vercel:', attributionData);
        track("utm_attribution", attributionData);

        // Mark as tracked for this session
        sessionStorage.setItem(FLAG, "1");
        console.log('✅ UTM attribution event sent successfully');

        return true;

      } catch (error) {
        console.error('❌ UTM attribution tracking error:', error);
        return false;
      }
    };

    // Try immediately
    if (!attemptTracking()) {
      // If failed, try again after a short delay (cookie might not be set yet)
      console.log('⏳ Retrying UTM attribution in 1 second...');
      setTimeout(() => {
        if (!sessionStorage.getItem(FLAG)) {
          attemptTracking();
        }
      }, 1000);
    }
  }, []);
}

// Enhanced function to get current UTM data for custom events
export function getUtmContext(): Record<string, string> {
  try {
    // More robust cookie parsing
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    console.log('🍪 All parsed cookies:', Object.keys(cookies));
    
    const raw = cookies['masterkey_utms'];
    console.log('🍪 Raw UTM cookie:', raw);
    
    if (!raw) {
      console.log('❌ No UTM cookie found');
      return {};
    }

    const utms = JSON.parse(decodeURIComponent(raw));
    console.log('🍪 Parsed UTM data:', utms);
    
    // Build context with all available UTM parameters
    const context: Record<string, string> = {};
    
    // Standard UTM parameters
    if (utms.utm_source && utms.utm_source !== '') context.utm_source = String(utms.utm_source);
    if (utms.utm_medium && utms.utm_medium !== '') context.utm_medium = String(utms.utm_medium);
    if (utms.utm_campaign && utms.utm_campaign !== '') context.utm_campaign = String(utms.utm_campaign);
    if (utms.utm_term && utms.utm_term !== '') context.utm_term = String(utms.utm_term);
    if (utms.utm_content && utms.utm_content !== '') context.utm_content = String(utms.utm_content);
    
    // Ad platform click IDs
    if (utms.gclid && utms.gclid !== '') context.gclid = String(utms.gclid);
    if (utms.fbclid && utms.fbclid !== '') context.fbclid = String(utms.fbclid);
    if (utms.msclkid && utms.msclkid !== '') context.msclkid = String(utms.msclkid);
    if (utms.ttclid && utms.ttclid !== '') context.ttclid = String(utms.ttclid);
    if (utms.li_fat_id && utms.li_fat_id !== '') context.li_fat_id = String(utms.li_fat_id);
    
    // Attribution metadata
    if (utms.first_seen && utms.last_updated) {
      context.attribution_type = utms.first_seen === utms.last_updated ? 'first_touch' : 'multi_touch';
      context.first_seen = String(utms.first_seen);
      context.last_updated = String(utms.last_updated);
    }
    
    console.log('🎯 Generated UTM context:', context);
    console.log('🔢 Context keys count:', Object.keys(context).length);
    
    return context;
  } catch (error) {
    console.error('❌ Error getting UTM context:', error);
    return {};
  }
}

// Fallback function to get UTMs from current URL if cookie is missing
function getUtmFromUrl(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search);
  const context: Record<string, string> = {};
  
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid", "ttclid", "li_fat_id"];
  
  UTM_KEYS.forEach(key => {
    const value = urlParams.get(key);
    if (value && value !== '') {
      context[key] = value;
    }
  });
  
  if (Object.keys(context).length > 0) {
    console.log('🔄 Fallback: Found UTMs in current URL:', context);
  }
  
  return context;
}

// Enhanced track function that automatically includes UTM context
export function trackWithUtm(eventName: string, eventData: Record<string, any> = {}) {
  let utmContext = getUtmContext();
  
  // Fallback: If no UTM context from cookie, try current URL
  if (Object.keys(utmContext).length === 0) {
    utmContext = getUtmFromUrl();
  }
  
  // Build final event data - only include UTM context if it has values
  const finalEventData = Object.keys(utmContext).length > 0 
    ? { ...eventData, ...utmContext }
    : eventData;
  
  // Send to Vercel Analytics
  track(eventName, finalEventData);
  
  // Always log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Tracked "${eventName}":`, finalEventData);
    console.log(`🔍 UTM Context (${Object.keys(utmContext).length} keys):`, utmContext);
    console.log(`📏 Event Size:`, JSON.stringify(finalEventData).length, 'characters');
    
    // Additional debugging for UTM attribution issues
    if (Object.keys(utmContext).length === 0) {
      console.warn('⚠️ No UTM context found for event:', eventName);
      console.log('🍪 Cookie check:', document.cookie.includes('masterkey_utms'));
      console.log('🔗 URL params:', window.location.search);
    } else {
      console.log('✅ UTM context successfully attached to event');
    }
  }
}

// Manual test function to verify Vercel Analytics is working
export function testVercelAnalytics() {
  console.log('🧪 Testing Vercel Analytics directly...');
  
  // Test 1: Simple event without UTMs
  track('test_simple_event', {
    test_type: 'simple',
    timestamp: Date.now()
  });
  console.log('✅ Sent simple test event');
  
  // Test 2: Event with UTM data
  const utmContext = getUtmContext();
  track('test_utm_event', {
    test_type: 'with_utms',
    timestamp: Date.now(),
    ...utmContext
  });
  console.log('✅ Sent UTM test event:', utmContext);
  
  // Test 3: Direct attribution event
  if (Object.keys(utmContext).length > 0) {
    track('test_attribution', {
      test_type: 'attribution',
      ...utmContext
    });
    console.log('✅ Sent attribution test event');
  }
  
  console.log('🧪 All test events sent. Check Vercel Analytics in 5-10 minutes.');
}

// Make test function available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testVercelAnalytics = testVercelAnalytics;
}
