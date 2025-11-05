import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    // Only initialize PostHog if we have a valid key and we're not in development
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const isDevelopment = process.env.NODE_ENV === "development"
    
    if (posthogKey && !isDevelopment) {
      posthog.init(posthogKey, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll handle this manually
        capture_pageleave: true,
        debug: false,
      })
    } else if (isDevelopment) {
      // In development, create a mock posthog object to prevent errors
      console.log('PostHog disabled in development environment')
    }
  }
  return posthog
}

export { posthog }
