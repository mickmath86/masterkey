// Simple Plausible Analytics tracking utility
// Uses the global plausible function loaded via script tag

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function trackPlausibleEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.plausible) {
    try {
      if (props && Object.keys(props).length > 0) {
        window.plausible(eventName, { props });
        console.log(`📊 Plausible event tracked: ${eventName}`, props);
      } else {
        window.plausible(eventName);
        console.log(`📊 Plausible event tracked: ${eventName}`);
      }
    } catch (error) {
      console.error('Plausible tracking error:', error);
    }
  } else {
    console.log(`📊 Plausible not loaded, would track: ${eventName}`, props);
  }
}

// Questionnaire-specific tracking functions
export const plausibleQuestionnaire = {
  // Track form start
  trackFormStart: (formType: string) => {
    trackPlausibleEvent('Form Started', {
      form_type: formType,
      timestamp: Date.now()
    });
  },

  // Track step completion
  trackStepComplete: (stepNumber: number, stepName: string, formType: string, additionalProps?: Record<string, any>) => {
    trackPlausibleEvent('Step Completed', {
      step_number: stepNumber,
      step_name: stepName,
      form_type: formType,
      completion_percentage: Math.round((stepNumber / 9) * 100), // Assuming 9 total steps
      ...additionalProps
    });
  },

  // Track option selection
  trackOptionSelect: (stepNumber: number, stepName: string, field: string, value: string, additionalProps?: Record<string, any>) => {
    trackPlausibleEvent('Option Selected', {
      step_number: stepNumber,
      step_name: stepName,
      field: field,
      value: value,
      ...additionalProps
    });
  },

  // Track form completion
  trackFormComplete: (formType: string, userFlow: string, additionalProps?: Record<string, any>) => {
    trackPlausibleEvent('Form Completed', {
      form_type: formType,
      user_flow: userFlow,
      completion_time: Date.now(),
      ...additionalProps
    });
  },

  // Track form abandonment
  trackFormAbandon: (stepNumber: number, stepName: string, formType: string, additionalProps?: Record<string, any>) => {
    trackPlausibleEvent('Form Abandoned', {
      step_number: stepNumber,
      step_name: stepName,
      form_type: formType,
      completion_percentage: Math.round((stepNumber / 9) * 100),
      ...additionalProps
    });
  },

  // Track navigation (back/forward)
  trackNavigation: (fromStep: number, toStep: number, direction: 'forward' | 'back', formType: string) => {
    trackPlausibleEvent('Step Navigation', {
      from_step: fromStep,
      to_step: toStep,
      direction: direction,
      form_type: formType
    });
  },

  // Track validation errors
  trackValidationError: (stepNumber: number, field: string, errorType: string, formType: string) => {
    trackPlausibleEvent('Validation Error', {
      step_number: stepNumber,
      field: field,
      error_type: errorType,
      form_type: formType
    });
  }
};
