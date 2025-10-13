'use client'

import { useEffect } from 'react'
import { init } from '@plausible-analytics/tracker'

export function PlausibleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Plausible with your domain
    init({
      domain: 'usemasterkey.com',
      // Optional: enable automatic page view tracking
      autoCapturePageviews: true,
      // Optional: API host if using custom domain
      // endpoint: 'https://plausible.io/api/event'
    })
    
    console.log('📊 Plausible Analytics initialized for domain: usemasterkey.com')
  }, [])

  return <>{children}</>
}
