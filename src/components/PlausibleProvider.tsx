'use client'

import { useEffect } from 'react'

export function PlausibleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize on client side with dynamic import
    if (typeof window !== 'undefined') {
      const initPlausible = async () => {
        try {
          const { init } = await import('@plausible-analytics/tracker')
          
          // Initialize Plausible with your domain
          init({
            domain: 'usemasterkey.com',
            // Optional: enable automatic page view tracking
            autoCapturePageviews: true,
            // Optional: API host if using custom domain
            // endpoint: 'https://plausible.io/api/event'
          })
          
          console.log('📊 Plausible Analytics initialized for domain: usemasterkey.com')
        } catch (error) {
          console.error('📊 Failed to initialize Plausible:', error)
        }
      }
      
      initPlausible()
    }
  }, [])

  return <>{children}</>
}
