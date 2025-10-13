"use client";

import { useEffect } from 'react';

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
    // Initialize Plausible using the standard script approach
    if (typeof window !== 'undefined') {
      // Set up plausible function
      window.plausible = window.plausible || function() { 
        (window.plausible.q = window.plausible.q || []).push(arguments) 
      };

      // Load the Plausible script
      const script = document.createElement('script');
      script.defer = true;
      script.src = `${apiHost}/js/script.js`;
      script.setAttribute('data-domain', domain);
      
      if (trackLocalhost) {
        script.setAttribute('data-include-localhost', 'true');
      }

      document.head.appendChild(script);

      console.log('📊 Plausible Analytics initialized for domain:', domain);

      // Cleanup function
      return () => {
        const existingScript = document.querySelector(`script[src="${apiHost}/js/script.js"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [domain, trackLocalhost, apiHost]);

  return <>{children}</>;
}

// Extend window type for TypeScript
declare global {
  interface Window {
    plausible: any;
  }
}
