"use client";

import { useUtmCapture } from '@/hooks/useSimpleAnalytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Only capture UTM params on initial load - let Vercel handle page tracking
  useUtmCapture();
  
  return <>{children}</>;
}
