// Analytics tracking utility for form progress and funnel analysis
export interface FormAnalyticsEvent {
  event: string;
  properties: {
    form_name: string;
    step_number: number;
    step_name: string;
    user_id?: string;
    session_id: string;
    timestamp: string;
    form_data?: any;
    user_flow?: string;
    time_on_step?: number;
    previous_step?: number;
    completion_percentage?: number;
  };
}

export interface FormStepConfig {
  stepNumber: number;
  stepName: string;
  isRequired: boolean;
  isConditional: boolean;
  conditions?: string[];
}

export class FormAnalytics {
  private sessionId: string;
  private formName: string;
  private startTime: number;
  private stepStartTime: number;
  private totalSteps: number;
  private stepConfig: FormStepConfig[];

  constructor(formName: string, totalSteps: number, stepConfig: FormStepConfig[]) {
    this.formName = formName;
    this.totalSteps = totalSteps;
    this.stepConfig = stepConfig;
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.stepStartTime = Date.now();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStepConfig(stepNumber: number): FormStepConfig | undefined {
    return this.stepConfig.find(config => config.stepNumber === stepNumber);
  }

  private getUserFlow(formData: any): string {
    // Determine user flow based on form data
    if (formData.sellingIntent === 'I am just curious about market conditions') {
      return 'curious_user';
    }
    return 'selling_user';
  }

  private async trackEvent(event: FormAnalyticsEvent): Promise<void> {
    try {
      // Send to your analytics provider (Google Analytics, Mixpanel, etc.)
      console.log('📊 Form Analytics Event:', event);
      
      // Example: Send to Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', event.event, {
          custom_parameter_form_name: event.properties.form_name,
          custom_parameter_step_number: event.properties.step_number,
          custom_parameter_step_name: event.properties.step_name,
          custom_parameter_user_flow: event.properties.user_flow,
          custom_parameter_completion_percentage: event.properties.completion_percentage
        });
      }

      // Example: Send to custom analytics endpoint
      await fetch('/api/analytics/form-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(err => console.warn('Analytics tracking failed:', err));

    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  }

  // Track when user starts the form
  async trackFormStart(): Promise<void> {
    await this.trackEvent({
      event: 'form_start',
      properties: {
        form_name: this.formName,
        step_number: 1,
        step_name: 'property_address',
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        completion_percentage: 0
      }
    });
  }

  // Track step completion
  async trackStepComplete(stepNumber: number, formData: any): Promise<void> {
    const stepConfig = this.getStepConfig(stepNumber);
    const timeOnStep = Date.now() - this.stepStartTime;
    const completionPercentage = Math.round((stepNumber / this.totalSteps) * 100);

    await this.trackEvent({
      event: 'form_step_complete',
      properties: {
        form_name: this.formName,
        step_number: stepNumber,
        step_name: stepConfig?.stepName || `step_${stepNumber}`,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        form_data: this.sanitizeFormData(formData),
        user_flow: this.getUserFlow(formData),
        time_on_step: timeOnStep,
        completion_percentage: completionPercentage
      }
    });

    this.stepStartTime = Date.now(); // Reset for next step
  }

  // Track step navigation (forward/backward)
  async trackStepNavigation(fromStep: number, toStep: number, direction: 'forward' | 'backward', formData: any): Promise<void> {
    const fromStepConfig = this.getStepConfig(fromStep);
    const toStepConfig = this.getStepConfig(toStep);

    await this.trackEvent({
      event: 'form_step_navigation',
      properties: {
        form_name: this.formName,
        step_number: toStep,
        step_name: toStepConfig?.stepName || `step_${toStep}`,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        previous_step: fromStep,
        user_flow: this.getUserFlow(formData),
        completion_percentage: Math.round((toStep / this.totalSteps) * 100),
        form_data: { direction, from_step_name: fromStepConfig?.stepName }
      }
    });
  }

  // Track form abandonment
  async trackFormAbandon(currentStep: number, formData: any): Promise<void> {
    const stepConfig = this.getStepConfig(currentStep);
    const timeOnForm = Date.now() - this.startTime;
    const completionPercentage = Math.round((currentStep / this.totalSteps) * 100);

    await this.trackEvent({
      event: 'form_abandon',
      properties: {
        form_name: this.formName,
        step_number: currentStep,
        step_name: stepConfig?.stepName || `step_${currentStep}`,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        form_data: this.sanitizeFormData(formData),
        user_flow: this.getUserFlow(formData),
        time_on_step: Date.now() - this.stepStartTime,
        completion_percentage: completionPercentage
      }
    });
  }

  // Track successful form completion
  async trackFormComplete(formData: any): Promise<void> {
    const totalTime = Date.now() - this.startTime;

    await this.trackEvent({
      event: 'form_complete',
      properties: {
        form_name: this.formName,
        step_number: this.totalSteps,
        step_name: 'completion',
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        form_data: this.sanitizeFormData(formData),
        user_flow: this.getUserFlow(formData),
        time_on_step: totalTime,
        completion_percentage: 100
      }
    });
  }

  // Track validation errors
  async trackValidationError(stepNumber: number, fieldName: string, errorMessage: string, formData: any): Promise<void> {
    const stepConfig = this.getStepConfig(stepNumber);

    await this.trackEvent({
      event: 'form_validation_error',
      properties: {
        form_name: this.formName,
        step_number: stepNumber,
        step_name: stepConfig?.stepName || `step_${stepNumber}`,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        form_data: { field_name: fieldName, error_message: errorMessage },
        user_flow: this.getUserFlow(formData),
        completion_percentage: Math.round((stepNumber / this.totalSteps) * 100)
      }
    });
  }

  // Sanitize form data for analytics (remove PII)
  private sanitizeFormData(formData: any): any {
    const sanitized = { ...formData };
    
    // Remove or hash PII fields
    if (sanitized.email) sanitized.email = this.hashEmail(sanitized.email);
    if (sanitized.phone) sanitized.phone = 'xxx-xxx-' + sanitized.phone.slice(-4);
    if (sanitized.firstName) sanitized.firstName = sanitized.firstName.charAt(0) + '***';
    if (sanitized.lastName) sanitized.lastName = sanitized.lastName.charAt(0) + '***';
    if (sanitized.propertyAddress) {
      // Keep city/state but remove specific address
      const parts = sanitized.propertyAddress.split(',');
      sanitized.propertyAddress = parts.length > 2 ? parts.slice(-2).join(',').trim() : 'address_provided';
    }

    return sanitized;
  }

  private hashEmail(email: string): string {
    // Simple hash for analytics (use proper hashing in production)
    return email.split('@')[1] || 'email_provided';
  }
}

// Step configuration for the listing presentation form
export const LISTING_FORM_STEPS: FormStepConfig[] = [
  { stepNumber: 1, stepName: 'property_address', isRequired: true, isConditional: false },
  { stepNumber: 2, stepName: 'selling_intent', isRequired: true, isConditional: false },
  { stepNumber: 3, stepName: 'selling_timeline', isRequired: true, isConditional: true, conditions: ['selling_user'] },
  { stepNumber: 4, stepName: 'selling_motivation', isRequired: true, isConditional: true, conditions: ['selling_user'] },
  { stepNumber: 5, stepName: 'property_condition', isRequired: true, isConditional: false },
  { stepNumber: 6, stepName: 'property_improvements', isRequired: false, isConditional: false },
  { stepNumber: 7, stepName: 'improvement_details', isRequired: false, isConditional: true, conditions: ['has_improvements'] },
  { stepNumber: 8, stepName: 'price_expectations', isRequired: true, isConditional: true, conditions: ['selling_user'] },
  { stepNumber: 9, stepName: 'contact_information', isRequired: true, isConditional: false }
];

// Utility function to create analytics instance
export function createFormAnalytics(): FormAnalytics {
  return new FormAnalytics('listing_presentation_questionnaire', 9, LISTING_FORM_STEPS);
}
