"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

// Simple UTM parameter extraction
function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  // Standard UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  return utmParams;
}

// Store UTM params in sessionStorage for persistence
function storeUtmParams(params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  
  if (Object.keys(params).length > 0) {
    sessionStorage.setItem('utm_params', JSON.stringify(params));
    console.log('📊 Stored UTM params:', params);
  }
}

// Get stored UTM params
export function getStoredUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Hook to capture UTM params on page load
export function useUtmCapture() {
  useEffect(() => {
    const currentUtms = getUtmParams();
    
    if (Object.keys(currentUtms).length > 0) {
      storeUtmParams(currentUtms);
      
      // Only send a simple attribution event - let Vercel handle page views
      track('utm_attribution', {
        utm_source: currentUtms.utm_source,
        utm_medium: currentUtms.utm_medium,
        utm_campaign: currentUtms.utm_campaign,
        utm_term: currentUtms.utm_term || '',
        utm_content: currentUtms.utm_content || '',
        initial_page: window.location.pathname,
        timestamp: Date.now()
      });
      
      console.log('✅ UTM attribution tracked (Vercel will handle page views):', currentUtms);
    } else {
      console.log('📊 No UTM parameters found - Vercel will track regular page views');
    }
  }, []);
}

// Note: Page view tracking is handled automatically by Vercel Analytics
// UTM parameters are automatically included in Vercel's built-in page tracking
// We only need to track custom events (buttons, forms, etc.) with UTM context

// Simple tracking function that includes UTM context
export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  const utmParams = getStoredUtmParams();
  
  const eventData = {
    ...properties,
    // Explicitly set UTM parameters as individual properties
    utm_source: utmParams.utm_source || '',
    utm_medium: utmParams.utm_medium || '',
    utm_campaign: utmParams.utm_campaign || '',
    utm_term: utmParams.utm_term || '',
    utm_content: utmParams.utm_content || '',
    has_utm_context: Object.keys(utmParams).length > 0,
    timestamp: Date.now()
  };
  
  track(eventName, eventData);
  
  if (Object.keys(utmParams).length > 0) {
    console.log(`📊 Event tracked with UTMs: ${eventName}`, { 
      event: eventName,
      utm_campaign: utmParams.utm_campaign,
      utm_source: utmParams.utm_source,
      ...properties 
    });
  } else {
    console.log(`📊 Event tracked (no UTMs): ${eventName}`, properties);
  }
}

// Hook for questionnaire step tracking
export function useQuestionnaireTracking() {
  const trackStep = (stepNumber: number, stepName: string, action: string, data?: Record<string, any>) => {
    trackEvent('questionnaire_step', {
      step_number: stepNumber,
      step_name: stepName,
      action: action, // 'start', 'complete', 'back', 'abandon'
      ...data
    });
  };
  
  const trackFormComplete = (formData: Record<string, any>) => {
    trackEvent('questionnaire_complete', {
      completion_time: Date.now(),
      ...formData
    });
  };
  
  const trackButtonClick = (buttonText: string, stepNumber: number, stepName: string) => {
    trackEvent('button_click', {
      button_text: buttonText,
      step_number: stepNumber,
      step_name: stepName,
      page: window.location.pathname
    });
  };
  
  return {
    trackStep,
    trackFormComplete,
    trackButtonClick
  };
}
