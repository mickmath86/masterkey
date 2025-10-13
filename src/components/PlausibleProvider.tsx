'use client'

import { useEffect } from 'react'
import { usePlausibleAnalytics } from '@/hooks/usePlausibleAnalytics'

interface PlausibleProviderProps {
  children: React.ReactNode
}

export function PlausibleProvider({ children }: PlausibleProviderProps) {
  const { trackPageview, getUtmParameters } = usePlausibleAnalytics()

  // Capture UTM parameters and track initial pageview
  useEffect(() => {
    // Force UTM parameter capture on initial load
    const utmParams = getUtmParameters()
    console.log('📊 PlausibleProvider initialized with UTM params:', utmParams)
    
    // Track the initial page load with UTM parameters
    trackPageview()
  }, [trackPageview, getUtmParameters])

  return <>{children}</>
}
