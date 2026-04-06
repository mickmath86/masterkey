import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    // Only initialize PostHog if we have a valid key and we're not in development
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const isDevelopment = process.env.NODE_ENV === "development"
    
    if (posthogKey && !isDevelopment) {
      // Production: full PostHog init
      posthog.init(posthogKey, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        debug: false,
        autocapture: false,
        disable_session_recording: true,
        advanced_disable_decide: true,
      })
    } else if (isDevelopment && posthogKey) {
      // Development: init with opt-out so no data is sent,
      // but featureFlags.overrideFeatureFlags() still works for local testing
      posthog.init(posthogKey, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        disable_session_recording: true,
        advanced_disable_decide: true,
        loaded: (ph) => {
          ph.opt_out_capturing()
          console.log('[PostHog] Dev mode — capturing disabled, overrideFeatureFlags() available')
        },
      })
    } else if (isDevelopment) {
      console.log('[PostHog] Dev mode — no key set, feature flag overrides unavailable')
    }
  }
  return posthog
}

export { posthog }
