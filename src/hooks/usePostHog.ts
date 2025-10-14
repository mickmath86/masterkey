'use client'

import { useCallback } from 'react'
import { posthog } from '@/lib/posthog'

export interface PostHogEventProperties {
  // Form tracking properties
  form_type?: string
  user_flow?: 'curious' | 'selling'
  step_number?: number
  step_name?: string
  completion_percentage?: number
  completion_time?: number
  total_steps?: number
  
  // Property tracking properties
  property_location?: string
  property_type?: string
  has_improvements?: boolean
  improvement_count?: number
  has_questionnaire_data?: boolean
  
  // Error tracking properties
  field?: string
  error_type?: string
  
  // UTM parameters (automatically captured by PostHog)
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  
  // Custom properties
  [key: string]: any
}

export function usePostHog() {
  const trackEvent = useCallback((eventName: string, properties?: PostHogEventProperties) => {
    if (typeof window !== 'undefined') {
      posthog.capture(eventName, {
        timestamp: Date.now(),
        ...properties
      })
      console.log(`📊 PostHog Event: ${eventName}`, properties)
    }
  }, [])

  const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, properties)
      console.log(`👤 PostHog User Identified: ${userId}`, properties)
    }
  }, [])

  const setUserProperties = useCallback((properties: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.setPersonProperties(properties)
      console.log(`👤 PostHog User Properties Set:`, properties)
    }
  }, [])

  const resetUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      posthog.reset()
      console.log(`👤 PostHog User Reset`)
    }
  }, [])

  return {
    trackEvent,
    identifyUser,
    setUserProperties,
    resetUser,
    posthog
  }
}

// Questionnaire-specific tracking hooks
export function useQuestionnaireTracking() {
  const { trackEvent } = usePostHog()

  const trackQuestionnaireStart = useCallback((formData: any) => {
    trackEvent('Form Started', {
      form_type: 'listing_presentation',
      user_flow: formData.sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling',
      total_steps: 9
    })
  }, [trackEvent])

  const trackStepComplete = useCallback((stepNumber: number, stepName: string, formData: any) => {
    trackEvent(`Step ${stepNumber} Completed`, {
      form_type: 'listing_presentation',
      step_number: stepNumber,
      step_name: stepName,
      completion_percentage: Math.round((stepNumber / 9) * 100),
      user_flow: formData.sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling'
    })
  }, [trackEvent])

  const trackFormComplete = useCallback((formData: any, completionTime: number) => {
    trackEvent('Form Completed', {
      form_type: 'listing_presentation',
      user_flow: formData.sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling',
      completion_time: completionTime,
      property_location: formData.propertyAddress,
      has_improvements: formData.propertyImprovements?.length > 0,
      improvement_count: formData.propertyImprovements?.length || 0,
      property_type: formData.propertyType || 'unknown'
    })
  }, [trackEvent])

  const trackFormAbandon = useCallback((stepNumber: number, stepName: string, formData: any) => {
    trackEvent('Form Abandoned', {
      form_type: 'listing_presentation',
      step_number: stepNumber,
      step_name: stepName,
      completion_percentage: Math.round((stepNumber / 9) * 100),
      user_flow: formData.sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling'
    })
  }, [trackEvent])

  const trackButtonClick = useCallback((buttonName: string, properties?: PostHogEventProperties) => {
    trackEvent('Button Clicked', {
      button_name: buttonName,
      ...properties
    })
  }, [trackEvent])

  return {
    trackQuestionnaireStart,
    trackStepComplete,
    trackFormComplete,
    trackFormAbandon,
    trackButtonClick,
    trackEvent
  }
}
