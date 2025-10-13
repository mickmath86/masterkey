'use client'

import { useCallback, useEffect } from 'react'
// Dynamic imports to prevent SSR issues

export interface PlausibleEventProps {
  // Form tracking properties
  form_type?: string
  field?: string
  error_type?: string
  step_name?: string
  value?: string | number
  user_flow?: 'curious' | 'selling'
  
  // Progress tracking
  step_number?: number
  completion_percentage?: number
  completion_time?: number
  total_steps?: number
  
  // Property specific
  has_improvements?: boolean
  improvement_count?: number
  property_location?: string
  property_type?: string
  has_questionnaire_data?: boolean
  
  // UTM parameters (automatically added)
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  
  // General
  timestamp?: string
}

/**
 * Plausible Analytics Hook with UTM Parameter Support
 * Follows official npm package documentation
 */
export function usePlausibleAnalytics() {
  // Initialize Plausible on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initPlausible = async () => {
        try {
          const { init } = await import('@plausible-analytics/tracker')
          init({
            domain: 'usemasterkey.com'
          })
          console.log('📊 Plausible Analytics initialized for usemasterkey.com')
        } catch (error) {
          console.error('Failed to initialize Plausible:', error)
        }
      }
      
      initPlausible()
    }
  }, [])

  // Get UTM parameters from URL or sessionStorage
  const getUtmParameters = useCallback((): Partial<PlausibleEventProps> => {
    if (typeof window === 'undefined') return {}

    // First try to get from current URL
    const urlParams = new URLSearchParams(window.location.search)
    const utmParams: Partial<PlausibleEventProps> = {}

    // Check URL parameters
    if (urlParams.get('utm_source')) utmParams.utm_source = urlParams.get('utm_source')!
    if (urlParams.get('utm_medium')) utmParams.utm_medium = urlParams.get('utm_medium')!
    if (urlParams.get('utm_campaign')) utmParams.utm_campaign = urlParams.get('utm_campaign')!
    if (urlParams.get('utm_term')) utmParams.utm_term = urlParams.get('utm_term')!
    if (urlParams.get('utm_content')) utmParams.utm_content = urlParams.get('utm_content')!

    // If found in URL, store in sessionStorage for persistence
    if (Object.keys(utmParams).length > 0) {
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams))
      console.log('📊 UTM parameters captured and stored:', utmParams)
      return utmParams
    }

    // Fallback to sessionStorage
    try {
      const stored = sessionStorage.getItem('utm_params')
      if (stored) {
        const parsedParams = JSON.parse(stored)
        console.log('📊 UTM parameters retrieved from storage:', parsedParams)
        return parsedParams
      }
    } catch (error) {
      console.warn('Failed to parse stored UTM parameters:', error)
    }

    console.log('📊 No UTM parameters found')
    return {}
  }, [])

  // Track custom events with automatic UTM inclusion
  const trackEvent = useCallback(async (eventName: string, props?: PlausibleEventProps) => {
    if (typeof window === 'undefined') return

    try {
      // Get UTM parameters
      const utmParams = getUtmParameters()
      
      // Merge props with UTM parameters and timestamp
      const eventProps: PlausibleEventProps = {
        ...utmParams,
        ...props,
        timestamp: new Date().toISOString()
      }

      console.log(`📊 Plausible Event: ${eventName}`, eventProps)

      // Track with Plausible - convert to Record<string, string>
      const stringProps: Record<string, string> = {}
      Object.entries(eventProps).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          stringProps[key] = String(value)
        }
      })
      
      const { track } = await import('@plausible-analytics/tracker')
      track(eventName, {
        props: stringProps
      })

    } catch (error) {
      console.error('📊 Plausible tracking error:', error)
    }
  }, [getUtmParameters])

  // Track pageviews with UTM parameters
  const trackPageview = useCallback(async (url?: string, options?: { props?: PlausibleEventProps }) => {
    if (typeof window === 'undefined') return

    try {
      const utmParams = getUtmParameters()
      const pageProps = {
        ...utmParams,
        ...options?.props,
        timestamp: new Date().toISOString()
      }

      console.log('📊 Plausible Pageview:', url || window.location.pathname, pageProps)

      // Convert props to string format
      const stringProps: Record<string, string> = {}
      Object.entries(pageProps).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          stringProps[key] = String(value)
        }
      })

      const { track } = await import('@plausible-analytics/tracker')
      track('pageview', {
        props: stringProps
      })

    } catch (error) {
      console.error('📊 Plausible pageview tracking error:', error)
    }
  }, [getUtmParameters])

  // Form Events (Goals for Plausible dashboard)
  const trackFormStarted = useCallback((props?: PlausibleEventProps) => {
    trackEvent('Form Started', props)
  }, [trackEvent])

  const trackFormCompleted = useCallback((props?: PlausibleEventProps) => {
    trackEvent('Form Completed', props)
  }, [trackEvent])

  const trackFormAbandoned = useCallback((props?: PlausibleEventProps) => {
    trackEvent('Form Abandoned', props)
  }, [trackEvent])

  // Step tracking for questionnaire
  const trackStepCompleted = useCallback((stepNumber: number, stepName: string, additionalProps?: PlausibleEventProps) => {
    // Track generic step completed
    trackEvent('Step Completed', {
      step_number: stepNumber,
      step_name: stepName,
      ...additionalProps
    })
    
    // Track specific step goals for Plausible dashboard
    trackEvent(`Step ${stepNumber} Completed`, {
      step_name: stepName,
      ...additionalProps
    })
  }, [trackEvent])

  const trackStepStarted = useCallback((stepNumber: number, stepName: string, additionalProps?: PlausibleEventProps) => {
    trackEvent('Step Started', {
      step_number: stepNumber,
      step_name: stepName,
      ...additionalProps
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageview,
    trackFormStarted,
    trackFormCompleted,
    trackFormAbandoned,
    trackStepCompleted,
    trackStepStarted,
    getUtmParameters
  }
}

// Specialized hook for questionnaire tracking
export function useQuestionnaireTracking() {
  const { 
    trackFormStarted, 
    trackFormCompleted, 
    trackFormAbandoned, 
    trackStepCompleted,
    trackStepStarted,
    trackEvent
  } = usePlausibleAnalytics()

  const getUserFlow = (sellingIntent: string): 'curious' | 'selling' => {
    return sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling'
  }

  const trackQuestionnaireStart = useCallback((formData: any) => {
    trackFormStarted({
      form_type: 'listing_presentation',
      user_flow: getUserFlow(formData.sellingIntent || ''),
      total_steps: 9
    })
  }, [trackFormStarted])

  const trackQuestionnaireComplete = useCallback((formData: any, completionTime: number) => {
    const hasImprovements = formData.improvementDetails && formData.improvementDetails.length > 0
    
    trackFormCompleted({
      form_type: 'listing_presentation',
      user_flow: getUserFlow(formData.sellingIntent || ''),
      completion_percentage: 100,
      completion_time: completionTime,
      total_steps: 9,
      has_improvements: hasImprovements,
      improvement_count: hasImprovements ? formData.improvementDetails.length : 0,
      property_location: formData.propertyAddress || 'unknown'
    })
  }, [trackFormCompleted])

  const trackStep = useCallback((stepNumber: number, stepName: string, action: string, formData: any) => {
    const completionPercentage = Math.round((stepNumber / 9) * 100)
    const baseProps = {
      form_type: 'listing_presentation',
      completion_percentage: completionPercentage,
      user_flow: getUserFlow(formData.sellingIntent || ''),
      total_steps: 9
    }

    if (action === 'start') {
      trackStepStarted(stepNumber, stepName, baseProps)
    } else if (action === 'complete') {
      trackStepCompleted(stepNumber, stepName, baseProps)
    } else if (action === 'abandon') {
      trackFormAbandoned({
        ...baseProps,
        step_number: stepNumber,
        step_name: stepName
      })
    }
  }, [trackStepCompleted, trackStepStarted, trackFormAbandoned])

  const trackButtonClick = useCallback((buttonName: string, additionalProps?: PlausibleEventProps) => {
    trackEvent('Button Clicked', {
      value: buttonName,
      ...additionalProps
    })
  }, [trackEvent])

  // Legacy function names for compatibility
  const trackFormComplete = trackQuestionnaireComplete

  return {
    trackStep,
    trackFormComplete,
    trackButtonClick,
    trackQuestionnaireStart,
    trackQuestionnaireComplete,
    trackEvent
  }
}
