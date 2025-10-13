'use client'

import { useState } from 'react'
import { Button } from '@/components/button'

// Simple GTM dataLayer function for Plausible events
function trackPlausibleEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Ensure dataLayer exists
    if (!window.dataLayer) {
      window.dataLayer = []
    }

    console.log(`📊 GTM Plausible Event: ${eventName}`, properties)

    // Push to GTM dataLayer - your GTM Plausible tag should pick this up
    window.dataLayer.push({
      event: 'plausible_event',
      plausible_event_name: eventName,
      plausible_event_props: properties || {}
    })
  }
}

export default function PlausibleTestPage() {
  const [eventCount, setEventCount] = useState(0)

  const handleFormStarted = () => {
    trackPlausibleEvent('Form Started', {
      form_type: 'test_form',
      user_flow: 'testing',
      timestamp: new Date().toISOString()
    })
    setEventCount(prev => prev + 1)
  }

  const handleButtonClick = () => {
    trackPlausibleEvent('Button Clicked', {
      button_name: 'test_button',
      click_count: eventCount + 1,
      timestamp: new Date().toISOString()
    })
    setEventCount(prev => prev + 1)
  }

  const handleFormCompleted = () => {
    trackPlausibleEvent('Form Completed', {
      form_type: 'test_form',
      completion_time: Math.random() * 1000,
      user_flow: 'testing',
      timestamp: new Date().toISOString()
    })
    setEventCount(prev => prev + 1)
  }

  const handleCustomEvent = () => {
    trackPlausibleEvent('Custom Test Event', {
      custom_property: 'test_value',
      event_number: eventCount + 1,
      page_location: 'plausible-test',
      timestamp: new Date().toISOString()
    })
    setEventCount(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Plausible Analytics Test Page
          </h1>
          
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              GTM DataLayer Integration
            </h2>
            <p className="text-blue-800">
              This page tests Plausible events via GTM dataLayer. Each button sends an event to GTM 
              which should trigger your Plausible tag.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Events sent: <span className="font-bold">{eventCount}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Form Events</h3>
              
              <Button 
                onClick={handleFormStarted}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                🚀 Form Started Event
              </Button>
              
              <Button 
                onClick={handleFormCompleted}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                ✅ Form Completed Event
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Interaction Events</h3>
              
              <Button 
                onClick={handleButtonClick}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                👆 Button Click Event
              </Button>
              
              <Button 
                onClick={handleCustomEvent}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                ⭐ Custom Event
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Debug Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>GTM Container:</strong> GTM-WTJD5VKJ</p>
              <p><strong>Domain:</strong> usemasterkey.com</p>
              <p><strong>DataLayer Event:</strong> plausible_event</p>
              <p><strong>Check Console:</strong> Events are logged for debugging</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Expected GTM Setup
            </h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>Trigger:</strong> Custom Event = "plausible_event"</p>
              <p><strong>Tag:</strong> Your Plausible Analytics tag</p>
              <p><strong>Variables:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Event Name: {`{{plausible_event_name}}`}</li>
                <li>Event Properties: {`{{plausible_event_props}}`}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
