'use client'

import { useEffect } from 'react'
import { usePlausibleAnalytics } from '@/hooks/usePlausibleAnalytics'

interface PlausibleProviderProps {
  children: React.ReactNode
}

export function PlausibleProvider({ children }: PlausibleProviderProps) {
  const { trackPageview } = usePlausibleAnalytics()

  // Track initial pageview with UTM parameters
  useEffect(() => {
    // Track the initial page load
    trackPageview()
  }, [trackPageview])

  return <>{children}</>
}
