"use client";

import { useUtmCapture } from '@/hooks/useSimpleAnalytics';
import { usePlausiblePageTracking } from '@/hooks/usePlausibleAnalytics';
import { usePathname } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Capture UTM params on initial load (for both Vercel and Plausible)
  useUtmCapture();
  
  // Track page views with Plausible (includes UTM context)
  usePlausiblePageTracking(pathname);
  
  return <>{children}</>;
}
