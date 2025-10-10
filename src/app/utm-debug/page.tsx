"use client";

import { track } from '@vercel/analytics';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UtmDebugPage() {
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    // Get stored UTM params
    try {
      const stored = sessionStorage.getItem('utm_params');
      if (stored) {
        setUtmParams(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading UTM params:', e);
    }
  }, []);

  const sendTestEvent = (eventName: string, includeUtms: boolean = true) => {
    const eventData = includeUtms ? {
      test_type: 'manual',
      timestamp: Date.now(),
      ...utmParams
    } : {
      test_type: 'manual',
      timestamp: Date.now()
    };

    track(eventName, eventData);
    
    const logEntry = `${new Date().toLocaleTimeString()}: Sent "${eventName}" ${includeUtms ? 'WITH' : 'WITHOUT'} UTMs`;
    setEventLog(prev => [logEntry, ...prev].slice(0, 10));
    
    console.log(`🧪 Test event sent: ${eventName}`, eventData);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">UTM Debug Page</h1>
      
      {/* Current UTM Status */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Current UTM Parameters</h2>
        {Object.keys(utmParams).length > 0 ? (
          <div>
            <p className="text-green-600 font-medium mb-2">✅ UTM Parameters Found:</p>
            {Object.entries(utmParams).map(([key, value]) => (
              <p key={key} className="text-sm">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-orange-600">
            ⚠️ No UTM parameters found in sessionStorage
          </p>
        )}
      </div>

      {/* Test Different Event Names */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Test Different Event Names</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => sendTestEvent('page_view')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send "page_view"
          </button>
          <button 
            onClick={() => sendTestEvent('utm_page_view')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Send "utm_page_view"
          </button>
          <button 
            onClick={() => sendTestEvent('page_navigation')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Send "page_navigation"
          </button>
          <button 
            onClick={() => sendTestEvent('custom_page_visit')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Send "custom_page_visit"
          </button>
          <button 
            onClick={() => sendTestEvent('test_event_no_utms', false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Send WITHOUT UTMs
          </button>
          <button 
            onClick={() => sendTestEvent('simple_click')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Send "simple_click"
          </button>
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h3 className="font-semibold mb-2">Event Log (Last 10)</h3>
        {eventLog.length > 0 ? (
          <ul className="text-sm space-y-1">
            {eventLog.map((entry, index) => (
              <li key={index} className="font-mono">{entry}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No events sent yet</p>
        )}
      </div>

      {/* Navigation Test */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Navigation Test</h2>
        <p className="text-gray-600">Navigate to these pages and check if UTM context persists:</p>
        <div className="flex gap-4">
          <Link 
            href="/test-analytics"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Test Analytics
          </Link>
          <Link 
            href="/landing/listing-presentation"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Listing Presentation
          </Link>
          <Link 
            href="/questionnaire/listing-presentation"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Go to Questionnaire
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Debug Instructions:</h3>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. Visit this page with UTM parameters: <code>?utm_campaign=debug&utm_source=test</code></li>
          <li>2. Click different event test buttons</li>
          <li>3. Navigate to other pages using the links</li>
          <li>4. Check Vercel Analytics dashboard for which events appear</li>
          <li>5. Filter by utm_campaign=debug to see which events have UTM context</li>
        </ol>
      </div>
    </div>
  );
}
