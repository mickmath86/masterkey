"use client";

import { trackEvent } from '@/hooks/useSimpleAnalytics';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function VercelTestPage() {
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

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

    // Log what Vercel should be tracking automatically
    console.log('🔍 Vercel Analytics should automatically track:');
    console.log('  - Page view for:', window.location.pathname);
    console.log('  - URL with UTMs:', window.location.href);
    console.log('  - Stored UTM context:', utmParams);
  }, [utmParams]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Vercel Built-in Analytics Test</h1>
      
      {/* Current URL and UTM Status */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Page Info</h2>
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
        <p><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}</p>
        
        {Object.keys(utmParams).length > 0 ? (
          <div className="mt-4">
            <p className="text-green-600 font-medium mb-2">✅ UTM Parameters (should be tracked by Vercel):</p>
            {Object.entries(utmParams).map(([key, value]) => (
              <p key={key} className="text-sm">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-orange-600 mt-4">
            ⚠️ No UTM parameters - visit with ?utm_campaign=test&utm_source=debug
          </p>
        )}
      </div>

      {/* Test Custom Events (these should include UTM context) */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Test Custom Events</h2>
        <p className="text-gray-600">These custom events should include UTM context:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => trackEvent('test_button_click', { button_type: 'primary' })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Button Click
          </button>
          
          <button 
            onClick={() => trackEvent('test_interaction', { interaction_type: 'secondary' })}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Interaction
          </button>
        </div>
      </div>

      {/* Navigation Test */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Navigation Test</h2>
        <p className="text-gray-600">
          Navigate to these pages - Vercel should automatically track page views with UTM context:
        </p>
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
            href="/utm-debug"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Go to UTM Debug
          </Link>
        </div>
      </div>

      {/* How Vercel Analytics Works */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How This Should Work:</h3>
        <ol className="text-gray-700 text-sm space-y-1">
          <li>1. <strong>Vercel automatically tracks page views</strong> - no custom code needed</li>
          <li>2. <strong>UTM parameters are automatically included</strong> in page view events</li>
          <li>3. <strong>Custom events</strong> (button clicks) include UTM context via our trackEvent function</li>
          <li>4. <strong>Filter in Vercel Analytics</strong> by utm_campaign, utm_source, etc.</li>
          <li>5. <strong>All page navigation</strong> should show up with UTM context preserved</li>
        </ol>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-yellow-800 text-sm">
            <strong>Key Insight:</strong> We don't need to manually track page views. 
            Vercel's &lt;Analytics /&gt; component does this automatically and includes UTM parameters.
            We only need to track custom events (buttons, forms, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}
