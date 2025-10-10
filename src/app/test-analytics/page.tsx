"use client";

import { track } from '@vercel/analytics';
import { useState, useEffect } from 'react';

export default function TestAnalyticsPage() {
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  // Capture UTM params on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utms: Record<string, string> = {};
    
    // Get UTM parameters
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const value = params.get(key);
      if (value) utms[key] = value;
    });
    
    setUtmParams(utms);
    
    // Store in sessionStorage for persistence
    if (Object.keys(utms).length > 0) {
      sessionStorage.setItem('utm_params', JSON.stringify(utms));
      
      // Send initial attribution event
      track('utm_attribution', {
        ...utms,
        page: '/test-analytics',
        timestamp: Date.now()
      });
      
      console.log('✅ UTM Attribution tracked:', utms);
    }
  }, []);

  // Get stored UTM params for events
  const getStoredUtms = () => {
    try {
      const stored = sessionStorage.getItem('utm_params');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  // Test button clicks with UTM context
  const handleButtonClick = (buttonName: string) => {
    const storedUtms = getStoredUtms();
    
    track('button_click', {
      button_name: buttonName,
      page: '/test-analytics',
      timestamp: Date.now(),
      ...storedUtms // Include UTM params in every event
    });
    
    console.log(`📊 Button clicked: ${buttonName}`, { buttonName, ...storedUtms });
  };

  // Test form events
  const handleFormEvent = (eventType: string, stepNumber: number) => {
    const storedUtms = getStoredUtms();
    
    track('questionnaire_event', {
      event_type: eventType,
      step_number: stepNumber,
      page: '/test-analytics',
      timestamp: Date.now(),
      ...storedUtms
    });
    
    console.log(`📊 Form event: ${eventType} - Step ${stepNumber}`, { eventType, stepNumber, ...storedUtms });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Test Page</h1>
      
      {/* UTM Status */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">UTM Parameters</h2>
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
            ⚠️ No UTM parameters found. Try visiting: 
            <br />
            <code className="bg-white px-2 py-1 rounded text-sm">
              /test-analytics?utm_source=test&utm_medium=email&utm_campaign=debug
            </code>
          </p>
        )}
      </div>

      {/* Test Buttons */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Test Button Clicks</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => handleButtonClick('get_started')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Started
          </button>
          <button 
            onClick={() => handleButtonClick('learn_more')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Learn More
          </button>
          <button 
            onClick={() => handleButtonClick('contact_us')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Test Form Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Questionnaire Steps</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="border p-4 rounded">
              <h3 className="font-medium mb-2">Step {step}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleFormEvent('step_start', step)}
                  className="bg-gray-500 text-white px-3 py-1 text-sm rounded"
                >
                  Start
                </button>
                <button 
                  onClick={() => handleFormEvent('step_complete', step)}
                  className="bg-green-500 text-white px-3 py-1 text-sm rounded"
                >
                  Complete
                </button>
                <button 
                  onClick={() => handleFormEvent('step_abandon', step)}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                >
                  Abandon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions:</h3>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. Visit this page with UTM parameters in the URL</li>
          <li>2. Click buttons and check console logs</li>
          <li>3. Navigate to other pages - UTM params should persist</li>
          <li>4. Check Vercel Analytics dashboard in 5-10 minutes</li>
          <li>5. Filter by your UTM parameters to see all events</li>
        </ol>
      </div>
    </div>
  );
}
