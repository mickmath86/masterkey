"use client";

import { useUtmCapture } from '@/hooks/useSimpleAnalytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Capture UTM params on mount
  useUtmCapture();
  
  return <>{children}</>;
}
