'use client'

import { useCallback } from 'react'

// Plausible analytics function type
declare global {
  interface Window {
    plausible?: (eventName: string, options?: {
      props?: Record<string, any>
    }) => void
  }
}

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
  
  // General
  timestamp?: string
}

export function usePlausibleAnalytics() {
  const trackEvent = useCallback((eventName: string, props?: PlausibleEventProps) => {
    if (typeof window !== 'undefined' && window.plausible) {
      // Add timestamp to all events
      const eventProps = {
        ...props,
        timestamp: new Date().toISOString()
      }
      
      console.log(`📊 Plausible Event: ${eventName}`, eventProps)
      
      window.plausible(eventName, {
        props: eventProps
      })
    } else {
      console.log(`📊 Plausible not loaded - would track: ${eventName}`, props)
    }
  }, [])

  // Form Events (matching your dashboard goals)
  const trackFormStarted = useCallback((props: PlausibleEventProps) => {
    trackEvent('Form Started', props)
  }, [trackEvent])

  const trackFormCompleted = useCallback((props: PlausibleEventProps) => {
    trackEvent('Form Completed', props)
  }, [trackEvent])

  const trackFormAbandoned = useCallback((props: PlausibleEventProps) => {
    trackEvent('Form Abandoned', props)
  }, [trackEvent])

  // Step tracking
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

  const trackStepNavigation = useCallback((direction: 'forward' | 'back', stepNumber: number, stepName: string, additionalProps?: PlausibleEventProps) => {
    trackEvent('Step Navigation', {
      step_number: stepNumber,
      step_name: stepName,
      value: direction,
      ...additionalProps
    })
  }, [trackEvent])

  // Field interactions
  const trackFieldInteraction = useCallback((field: string, value: string | number, additionalProps?: PlausibleEventProps) => {
    trackEvent('Field Interaction', {
      field,
      value: String(value),
      ...additionalProps
    })
  }, [trackEvent])

  // Validation errors
  const trackValidationError = useCallback((field: string, errorType: string, additionalProps?: PlausibleEventProps) => {
    trackEvent('Validation Error', {
      field,
      error_type: errorType,
      ...additionalProps
    })
  }, [trackEvent])

  // 404 errors
  const track404 = useCallback((path: string) => {
    trackEvent('404', {
      value: path
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackFormStarted,
    trackFormCompleted,
    trackFormAbandoned,
    trackStepCompleted,
    trackStepNavigation,
    trackFieldInteraction,
    trackValidationError,
    track404
  }
}

// Specialized hook for questionnaire tracking
export function useQuestionnaireTracking() {
  const { 
    trackFormStarted, 
    trackFormCompleted, 
    trackFormAbandoned, 
    trackStepCompleted, 
    trackStepNavigation,
    trackFieldInteraction,
    trackValidationError 
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

  const trackQuestionnaireAbandoned = useCallback((currentStep: number, formData: any, timeSpent: number) => {
    const completionPercentage = Math.round((currentStep / 9) * 100)
    
    trackFormAbandoned({
      form_type: 'listing_presentation',
      step_number: currentStep,
      completion_percentage: completionPercentage,
      completion_time: timeSpent,
      user_flow: getUserFlow(formData.sellingIntent || ''),
      total_steps: 9
    })
  }, [trackFormAbandoned])

  const trackStep = useCallback((stepNumber: number, stepName: string, action: string, formData: any, direction?: string) => {
    const completionPercentage = Math.round((stepNumber / 9) * 100)
    const baseProps = {
      form_type: 'listing_presentation',
      completion_percentage: completionPercentage,
      user_flow: getUserFlow(formData.sellingIntent || ''),
      total_steps: 9
    }

    if (action === 'complete') {
      trackStepCompleted(stepNumber, stepName, baseProps)
    } else if (action === 'navigate' && direction) {
      trackStepNavigation(direction as 'forward' | 'back', stepNumber, stepName, baseProps)
    }
  }, [trackStepCompleted, trackStepNavigation])

  const trackFieldChange = useCallback((field: string, value: string | number, stepNumber: number, formData: any) => {
    trackFieldInteraction(field, value, {
      form_type: 'listing_presentation',
      step_number: stepNumber,
      user_flow: getUserFlow(formData.sellingIntent || '')
    })
  }, [trackFieldInteraction])

  const trackError = useCallback((field: string, errorType: string, stepNumber: number) => {
    trackValidationError(field, errorType, {
      form_type: 'listing_presentation',
      step_number: stepNumber
    })
  }, [trackValidationError])

  // Legacy function names for compatibility
  const trackFormComplete = trackQuestionnaireComplete
  const trackButtonClick = trackFieldChange

  return {
    trackQuestionnaireStart,
    trackQuestionnaireComplete,
    trackQuestionnaireAbandoned,
    trackStep,
    trackFieldChange,
    trackError,
    // Legacy compatibility
    trackFormComplete,
    trackButtonClick
  }
}
