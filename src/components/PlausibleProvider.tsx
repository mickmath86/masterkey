"use client";

import { useEffect } from 'react';
import Plausible from '@plausible-analytics/tracker';

interface PlausibleProviderProps {
  children: React.ReactNode;
  domain?: string;
  trackLocalhost?: boolean;
  apiHost?: string;
}

export function PlausibleProvider({ 
  children, 
  domain = 'usemasterkey.com', // Replace with your actual domain
  trackLocalhost = false,
  apiHost = 'https://plausible.io'
}: PlausibleProviderProps) {
  
  useEffect(() => {
    // Initialize Plausible
    Plausible.init({
      domain,
      trackLocalhost,
      apiHost
    });

    console.log('📊 Plausible Analytics initialized for domain:', domain);
  }, [domain, trackLocalhost, apiHost]);

  return <>{children}</>;
}
