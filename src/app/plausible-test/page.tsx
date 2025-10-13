"use client";

import { usePlausibleTracking, usePlausibleQuestionnaireTracking } from '@/hooks/usePlausibleAnalytics';
import { trackEvent } from '@/hooks/useSimpleAnalytics';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlausibleTestPage() {
  const { trackEvent: trackPlausibleEvent, trackOutboundLink, trackDownload } = usePlausibleTracking();
  const { trackButtonClick, trackQuestionnaireStep } = usePlausibleQuestionnaireTracking();
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
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Plausible Analytics Test</h1>
      
      {/* Current UTM Status */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Current UTM Parameters</h2>
        {Object.keys(utmParams).length > 0 ? (
          <div>
            <p className="text-green-600 font-medium mb-2">✅ UTM Parameters (will be included in Plausible events):</p>
            {Object.entries(utmParams).map(([key, value]) => (
              <p key={key} className="text-sm">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-orange-600">
            ⚠️ No UTM parameters - visit with ?utm_campaign=test&utm_source=plausible&utm_medium=test
          </p>
        )}
      </div>

      {/* Test Plausible Events */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Test Plausible Analytics Events</h2>
        <p className="text-gray-600">These events will be sent to Plausible with UTM context:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => trackPlausibleEvent('Test Button Click', { button_type: 'primary', test_source: 'plausible_test_page' })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Track Custom Event
          </button>
          
          <button 
            onClick={() => trackButtonClick('Questionnaire Test Button', 1, 'test_step')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Track Button Click
          </button>
          
          <button 
            onClick={() => trackQuestionnaireStep(2, 'property_details', 'complete', { test: true })}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Track Questionnaire Step
          </button>
          
          <button 
            onClick={() => trackOutboundLink('https://plausible.io', { link_type: 'external' })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Track Outbound Link
          </button>
          
          <button 
            onClick={() => trackDownload('test-report.pdf', 'pdf', { report_type: 'property_analysis' })}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Track Download
          </button>
        </div>
      </div>

      {/* Compare with Vercel Analytics */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Compare with Vercel Analytics</h2>
        <p className="text-gray-600">These events will be sent to Vercel Analytics:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => trackEvent('vercel_test_event', { button_type: 'primary', test_source: 'plausible_test_page' })}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Track Vercel Event
          </button>
        </div>
      </div>

      {/* Navigation Test */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Navigation Test</h2>
        <p className="text-gray-600">
          Navigate to these pages - both Plausible and Vercel should track page views with UTM context:
        </p>
        <div className="flex gap-4">
          <Link 
            href="/test-analytics"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Test Analytics
          </Link>
          <Link 
            href="/vercel-test"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Vercel Test
          </Link>
          <Link 
            href="/utm-debug"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Go to UTM Debug
          </Link>
        </div>
      </div>

      {/* Analytics Comparison */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Plausible vs Vercel Analytics:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-600 mb-2">Plausible Analytics</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Privacy-focused (no cookies)</li>
              <li>• Works in development mode</li>
              <li>• Custom event properties with UTM context</li>
              <li>• Real-time dashboard</li>
              <li>• GDPR compliant</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-600 mb-2">Vercel Analytics</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Built into Vercel platform</li>
              <li>• Only works in production</li>
              <li>• Automatic page view tracking</li>
              <li>• UTM parameter support (Pro plan)</li>
              <li>• Integrated with deployments</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-blue-800 text-sm">
            <strong>Dual Analytics Setup:</strong> You now have both Plausible and Vercel Analytics running. 
            Plausible will work in development and provide detailed event tracking, while Vercel provides 
            built-in page view analytics in production.
          </p>
        </div>
      </div>
    </div>
  );
}
