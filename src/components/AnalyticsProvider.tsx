"use client";

import { useUtmCapture, usePageTracking } from '@/hooks/useSimpleAnalytics';
import { usePathname } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Capture UTM params on initial load
  useUtmCapture();
  
  // Track page views on every route change (with UTM context if available)
  usePageTracking(pathname);
  
  return <>{children}</>;
}
