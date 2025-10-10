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
function getStoredUtmParams(): Record<string, string> {
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
      
      // Send initial attribution event
      track('utm_attribution', {
        ...currentUtms,
        page: window.location.pathname,
        timestamp: Date.now()
      });
      
      console.log('✅ UTM attribution tracked:', currentUtms);
    }
  }, []);
}

// Hook to track page views with UTM context on route changes
export function usePageTracking(pathname: string) {
  useEffect(() => {
    // Always send page view with stored UTM context (if any)
    const storedUtms = getStoredUtmParams();
    
    track('page_view', {
      page: pathname,
      timestamp: Date.now(),
      ...storedUtms
    });
    
    if (Object.keys(storedUtms).length > 0) {
      console.log('📊 Page view with UTM context:', { page: pathname, ...storedUtms });
    } else {
      console.log('📊 Page view (no UTM context):', { page: pathname });
    }
  }, [pathname]);
}

// Simple tracking function that includes UTM context
export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  const utmParams = getStoredUtmParams();
  
  const eventData = {
    ...properties,
    ...utmParams, // Include UTM params in every event
    timestamp: Date.now()
  };
  
  track(eventName, eventData);
  
  console.log(`📊 Event tracked: ${eventName}`, eventData);
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
