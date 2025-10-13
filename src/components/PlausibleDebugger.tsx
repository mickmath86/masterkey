'use client'

import { useEffect, useState } from 'react'
import { usePlausibleAnalytics } from '@/hooks/usePlausibleAnalytics'

export function PlausibleDebugger() {
  const [utmParams, setUtmParams] = useState<any>({})
  const { trackEvent, getUtmParameters } = usePlausibleAnalytics()

  useEffect(() => {
    // Get current UTM parameters
    const params = getUtmParameters()
    setUtmParams(params)
  }, [getUtmParameters])

  const testEvent = () => {
    trackEvent('Debug Test Event', {
      value: 'debug_value',
      field: 'debug_button'
    })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Plausible Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Status:</strong> ✅ Initialized
        </div>
        
        <div>
          <strong>Domain:</strong> usemasterkey.com
        </div>
        
        <div>
          <strong>UTM Parameters:</strong>
          {Object.keys(utmParams).length > 0 ? (
            <div className="mt-1 space-y-1">
              {Object.entries(utmParams).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="font-mono">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 mt-1">None detected</div>
          )}
        </div>
        
        <button
          onClick={testEvent}
          className="w-full mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Send Test Event
        </button>
        
        <div className="text-xs text-gray-500 mt-2">
          Check browser console for event logs
        </div>
      </div>
    </div>
  )
}
