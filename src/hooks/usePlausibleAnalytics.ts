"use client";

import { useEffect } from 'react';
import Plausible from '@plausible-analytics/tracker';
import { getStoredUtmParams } from './useSimpleAnalytics';

// Custom hook for Plausible Analytics with UTM context
export function usePlausibleTracking() {
  
  // Track page views with UTM context
  const trackPageView = (url?: string, options?: any) => {
    const utmParams = getStoredUtmParams();
    
    const eventProps = {
      ...options,
      ...utmParams, // Include UTM parameters
      timestamp: Date.now()
    };

    // Track page view
    Plausible.trackPageview({
      url,
      props: Object.keys(eventProps).length > 0 ? eventProps : undefined
    });

    if (Object.keys(utmParams).length > 0) {
      console.log('📊 Plausible page view tracked with UTM context:', { url, utmParams });
    } else {
      console.log('📊 Plausible page view tracked:', url || window.location.pathname);
    }
  };

  // Track custom events with UTM context
  const trackEvent = (eventName: string, options?: any) => {
    const utmParams = getStoredUtmParams();
    
    const eventProps = {
      ...options,
      ...utmParams, // Include UTM parameters
      timestamp: Date.now()
    };

    Plausible.trackEvent(eventName, {
      props: eventProps
    });

    if (Object.keys(utmParams).length > 0) {
      console.log(`📊 Plausible event tracked with UTMs: ${eventName}`, eventProps);
    } else {
      console.log(`📊 Plausible event tracked: ${eventName}`, options);
    }
  };

  // Track outbound links
  const trackOutboundLink = (url: string, options?: any) => {
    const utmParams = getStoredUtmParams();
    
    const eventProps = {
      url,
      ...options,
      ...utmParams
    };

    Plausible.trackEvent('Outbound Link: Click', {
      props: eventProps
    });

    console.log('📊 Plausible outbound link tracked:', url);
  };

  // Track file downloads
  const trackDownload = (fileName: string, fileType?: string, options?: any) => {
    const utmParams = getStoredUtmParams();
    
    const eventProps = {
      fileName,
      fileType,
      ...options,
      ...utmParams
    };

    Plausible.trackEvent('File Download', {
      props: eventProps
    });

    console.log('📊 Plausible download tracked:', fileName);
  };

  return {
    trackPageView,
    trackEvent,
    trackOutboundLink,
    trackDownload
  };
}

// Hook for automatic page view tracking on route changes
export function usePlausiblePageTracking(pathname: string) {
  const { trackPageView } = usePlausibleTracking();

  useEffect(() => {
    // Track page view on route change
    trackPageView(pathname);
  }, [pathname, trackPageView]);
}

// Specialized hook for questionnaire tracking with Plausible
export function usePlausibleQuestionnaireTracking() {
  const { trackEvent } = usePlausibleTracking();

  const trackQuestionnaireStep = (stepNumber: number, stepName: string, action: string, data?: any) => {
    trackEvent('Questionnaire Step', {
      step_number: stepNumber,
      step_name: stepName,
      action: action, // 'start', 'complete', 'back', 'abandon'
      ...data
    });
  };

  const trackQuestionnaireComplete = (formData: any) => {
    trackEvent('Questionnaire Complete', {
      completion_time: Date.now(),
      user_flow: formData.sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling',
      ...formData
    });
  };

  const trackButtonClick = (buttonText: string, stepNumber?: number, stepName?: string) => {
    trackEvent('Button Click', {
      button_text: buttonText,
      step_number: stepNumber,
      step_name: stepName,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined
    });
  };

  return {
    trackQuestionnaireStep,
    trackQuestionnaireComplete,
    trackButtonClick
  };
}
