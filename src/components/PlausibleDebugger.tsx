'use client'

import { useEffect, useState } from 'react'
import { usePlausibleAnalytics } from '@/hooks/usePlausibleAnalytics'
import { track } from '@plausible-analytics/tracker'

export function PlausibleDebugger() {
  const [plausibleStatus, setPlausibleStatus] = useState<string>('checking...')
  const [gtmStatus, setGtmStatus] = useState<string>('checking...')
  const { trackEvent } = usePlausibleAnalytics()

  useEffect(() => {
    const checkStatus = () => {
      // Check if GTM is loaded
      if (typeof window !== 'undefined') {
        const hasGTM = !!(window as any).google_tag_manager || !!(window as any).gtag
        setGtmStatus(hasGTM ? '✅ GTM Loaded' : '❌ GTM Not Found')
        
        // Check if Plausible tracker is available
        try {
          track('Debug Check', { props: { test: 'true' } })
          setPlausibleStatus('✅ Plausible Tracker Ready')
        } catch (error) {
          setPlausibleStatus('❌ Plausible Tracker Error')
        }
        
        console.log('🔍 Analytics Debug:', {
          gtm: hasGTM,
          plausible_tracker: 'npm package loaded',
          window_gtm: (window as any).google_tag_manager
        })
      }
    }

    // Check immediately
    checkStatus()
    
    // Check again after a delay (GTM might load async)
    const timer = setTimeout(checkStatus, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  const testPlausibleEvent = () => {
    console.log('🧪 Testing Plausible event...')
    trackEvent('Debug Test Event', {
      value: 'debug_value'
    })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Analytics Debug</h3>
      <div className="space-y-1 text-xs">
        <div>{gtmStatus}</div>
        <div>{plausibleStatus}</div>
        <button 
          onClick={testPlausibleEvent}
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Test Plausible Event
        </button>
      </div>
    </div>
  )
}
