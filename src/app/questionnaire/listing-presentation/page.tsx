"use client";

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/button';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, StarIcon, XMarkIcon } from '@heroicons/react/16/solid';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePropertyData } from '@/contexts/PropertyDataContext';
import { useQuestionnaireTracking } from '@/hooks/usePostHog';
import { createFormAnalytics } from '@/lib/analytics';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { track } from '@vercel/analytics';
import { webhookService, type SimplifiedWebhookData } from '@/lib/webhook-api';
import posthog from "posthog-js";

interface ImprovementDetail {
  improvement: string;
  yearsAgo?: number;
  cost?: number;
}

interface FormData {
  propertyAddress: string;
  sellingIntent: string;
  sellingTimeline: string;
  sellingMotivation: string;
  propertyCondition: string;
  propertyImprovements: string[];
  improvementDetails: ImprovementDetail[];
  priceExpectation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  privacyPolicyConsent: boolean;
  // New fields for simplified Step 9
  contactMethod: string; // 'email' or 'phone'
  priceUpdates: boolean;
}

const sellingIntentOptions = [
  'I am looking to sell my property',
  'I am just curious about market conditions'
];

const timelineOptions = [
  'ASAP (within 30 days)',
  'Within 3 months',
  'Within 6 months',
  'Within a year',
  'Just exploring my options'
];

const motivationOptions = [
  'Relocating for work',
  'Upgrading to a larger home',
  'Downsizing',
  'Financial reasons',
  'Life changes (divorce, retirement, etc.)',
  'Investment property liquidation',
  'Other'
];

const conditionOptions = [
  { text: 'Excellent - Move-in ready', stars: 5 },
  { text: 'Good - Minor updates needed', stars: 4 },
  { text: 'Fair - Some renovations required', stars: 3 },
  { text: 'Needs work - Major repairs needed', stars: 2 },
  { text: 'Fixer-upper - Extensive renovation required', stars: 1 }
];

const priceExpectationOptions = [
  'Maximum market value',
  'Quick sale, competitive price',
  'Not sure - need professional guidance'
];

const improvementOptions = [
  'Kitchen remodel',
  'Bathroom renovation',
  'Room addition',
  'Basement finishing',
  'Attic conversion',
  'New flooring',
  'Fresh paint (interior)',
  'Fresh paint (exterior)',
  'New roof',
  'HVAC system upgrade',
  'Windows replacement',
  'Deck/patio addition',
  'Landscaping improvements',
  'Garage addition/renovation',
  'Electrical upgrades',
  'Plumbing upgrades',
  'Insulation improvements',
  'Driveway replacement',
  'Fence installation',
  'Pool installation',
  'Solar panels',
  'Smart home features'
];

// Traffic switching function for A/B testing Step 9 versions
const useSimplifiedStep9 = () => {
  // You can modify this logic to control traffic distribution
  // Options:
  // 1. Always use simplified: return true
  // 2. Always use original: return false
  // 3. Random 50/50: return Math.random() < 0.5
  // 4. URL parameter: return searchParams.get('simple') === 'true'
  // 5. User ID based: return userId % 2 === 0
  
  // Always use simplified Step 9 (100% of traffic)
  return true;
};

function RealEstateSellPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prefetchPropertyData, isLoading, setQuestionnaireData, propertyData, propertyTypeError, setPropertyTypeError } = usePropertyData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // A/B test flag for Step 9 version
  const isSimplifiedStep9 = useSimplifiedStep9();
  
  // Analytics tracking
  const [analytics] = useState(() => createFormAnalytics());
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
  const [webhookSent, setWebhookSent] = useState(false);
  const { trackQuestionnaireStart, trackStepComplete, trackFormComplete, trackFormAbandon, trackButtonClick } = useQuestionnaireTracking();
  const [formData, setFormData] = useState<FormData>({
    propertyAddress: '',
    sellingIntent: '',
    sellingTimeline: '',
    sellingMotivation: '',
    propertyCondition: '',
    propertyImprovements: [],
    improvementDetails: [],
    priceExpectation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    privacyPolicyConsent: false,
    // New fields for simplified Step 9
    contactMethod: '',
    priceUpdates: false
  });
  const [improvementSearch, setImprovementSearch] = useState('');
  const [showImprovementDropdown, setShowImprovementDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && !target.closest('.improvement-dropdown')) {
        setShowImprovementDropdown(false);
      }
    };
    
    if (showImprovementDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showImprovementDropdown]);

  // Handle URL parameters for pre-filling address and setting step
  useEffect(() => {
    const address = searchParams.get('address');
    const step = searchParams.get('step');
    
    if (address) {
      setFormData(prev => ({ ...prev, propertyAddress: decodeURIComponent(address) }));
    }
    
    if (step) {
      const stepNumber = parseInt(step, 10);
      if (stepNumber >= 1 && stepNumber <= totalSteps) {
        setCurrentStep(stepNumber);
      }
    }
  }, [searchParams]);

  const totalSteps = 9;

  // Helper function to get step name for analytics
  const getStepName = (step: number): string => {
    const stepNames = {
      1: 'property_address',
      2: 'selling_intent', 
      3: 'selling_timeline',
      4: 'selling_motivation',
      5: 'property_condition',
      6: 'property_improvements',
      7: 'improvement_details',
      8: 'price_expectations',
      9: 'contact_information'
    };
    return stepNames[step as keyof typeof stepNames] || `step_${step}`;
  };

  // Track form start when component mounts
  useEffect(() => {
    if (!hasTrackedFormStart) {
      analytics.trackFormStart();
      trackQuestionnaireStart(formData);
      setHasTrackedFormStart(true);
    }
  }, [analytics, hasTrackedFormStart, trackQuestionnaireStart, formData]);

  // Track page visibility changes to detect abandonment
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentStep < totalSteps) {
        // User is leaving the page before completion
        analytics.trackFormAbandon(currentStep, formData);
        trackFormAbandon(currentStep, getStepName(currentStep), formData);
      }
    };

    const handleBeforeUnload = () => {
      if (currentStep < totalSteps) {
        analytics.trackFormAbandon(currentStep, formData);
        trackFormAbandon(currentStep, getStepName(currentStep), formData);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, totalSteps, formData, analytics]);
  
  // Note: Simple webhook removed - using comprehensive webhook in property-data-module instead

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      const previousStep = currentStep;
      
      // Track step completion before advancing
      analytics.trackStepComplete(currentStep, formData);
      trackStepComplete(currentStep, getStepName(currentStep), formData);
      
      // If we're on step 1 (address entry), prefetch property data and validate
      if (currentStep === 1 && formData.propertyAddress.trim()) {
        setIsTransitioning(true);
        
        try {
          console.log('Prefetching property data for address:', formData.propertyAddress);
          const result = await prefetchPropertyData(formData.propertyAddress);
          
          // If property type is not supported, the modal will show automatically via propertyTypeError
          // Only proceed if we got valid property data and no property type error
          if (result && !propertyTypeError) {
            // Proceed to next step
            setTimeout(() => {
              const nextStep = currentStep + 1;
              analytics.trackStepNavigation(previousStep, nextStep, 'forward', formData);
              setCurrentStep(nextStep);
              setIsTransitioning(false);
            }, 150);
          } else if (propertyTypeError) {
            // Property type error - stop here and show modal
            analytics.trackValidationError(currentStep, 'propertyAddress', 'Unsupported property type', formData);
            setIsTransitioning(false);
            return;
          } else {
            // API error - still allow progression but log it
            console.warn('Property data prefetch failed, but allowing progression');
            analytics.trackValidationError(currentStep, 'propertyAddress', 'Property data prefetch failed', formData);
            setTimeout(() => {
              const nextStep = currentStep + 1;
              analytics.trackStepNavigation(previousStep, nextStep, 'forward', formData);
              setCurrentStep(nextStep);
              setIsTransitioning(false);
            }, 150);
          }
        } catch (error) {
          console.error('Error during property data prefetch:', error);
          analytics.trackValidationError(currentStep, 'propertyAddress', 'Property validation error', formData);
          // Allow progression even if prefetch fails
          setTimeout(() => {
            const nextStep = currentStep + 1;
            analytics.trackStepNavigation(previousStep, nextStep, 'forward', formData);
            setCurrentStep(nextStep);
            setIsTransitioning(false);
          }, 150);
        }
      } else {
        // Normal progression for other steps
        setIsTransitioning(true);
        setTimeout(() => {
          let nextStep = currentStep + 1;
          
          // Skip improvement details if no improvements selected on step 6
          if (currentStep === 6 && formData.propertyImprovements.length === 0) {
            nextStep = 8; // Skip step 7 (improvement details) and go to step 8 (pricing)
          }
          
          analytics.trackStepNavigation(previousStep, nextStep, 'forward', formData);
          setCurrentStep(nextStep);
          setIsTransitioning(false);
        }, 150);
      }
    }
  };

  const handleOptionSelect = (field: keyof FormData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // Track option selection
    trackButtonClick(`${field}_${value}`, {
      step_number: currentStep,
      step_name: getStepName(currentStep),
      field: field,
      form_type: 'listing_presentation',
      user_flow: field === 'sellingIntent' ? (value === 'I am just curious about market conditions' ? 'curious' : 'selling') : undefined
    });
    
    // Auto-advance to next step with fade animation (except for the last step)
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      setTimeout(() => {
        let nextStep = currentStep + 1;
        
        // Handle conditional flow based on selling intent
        if (field === 'sellingIntent') {
          if (value === 'I am just curious about market conditions') {
            // Skip timeline (step 3), motivation (step 4), and pricing (step 6), go to condition (step 5)
            nextStep = 5;
          } else {
            // Normal flow to timeline step
            nextStep = 3;
          }
        }
        
        // Skip pricing step for curious users
        if (currentStep === 7 && formData.sellingIntent === 'I am just curious about market conditions') {
          nextStep = 9; // Skip step 8 (pricing) and go directly to step 9 (contact)
        }
        
        // Skip improvement details if no improvements selected
        if (currentStep === 6 && formData.propertyImprovements.length === 0) {
          nextStep = 8; // Skip step 7 (improvement details) and go to step 8 (pricing)
        }
        
        setCurrentStep(nextStep);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const previousStep = currentStep;
      const nextStep = currentStep - 1;
      
      // Track backward navigation
      trackButtonClick('previous_step', {
        step_number: previousStep,
        step_name: getStepName(previousStep),
        form_type: 'listing_presentation',
        user_flow: formData.sellingIntent === 'I am just curious about market conditions' ? 'curious' : 'selling'
      });
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(nextStep);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Simple webhook function that fires immediately on form submission
  const sendImmediateWebhook = async () => {
    // Prevent duplicate webhook calls
    if (webhookSent) {
      console.log('📤 Webhook already sent, skipping duplicate call');
      return;
    }

    const isSimplifiedStep9 = useSimplifiedStep9();
    const webhookUrl = isSimplifiedStep9 
      ? 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/602fd6b7-653d-4692-8538-21203b1075fd'
      : 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/0972671d-e4b7-46c5-ad30-53d734b97e8c';

    // Mark webhook as being sent to prevent duplicates
    setWebhookSent(true);

    try {
      const webhookData = {
        timestamp: new Date().toISOString(),
        source: 'questionnaire_completed',
        formVersion: isSimplifiedStep9 ? 'simplified' : 'original',
        questionnaire: {
          propertyAddress: formData.propertyAddress,
          sellingIntent: formData.sellingIntent,
          sellingTimeline: formData.sellingTimeline,
          propertyCondition: formData.propertyCondition,
          propertyImprovements: formData.propertyImprovements,
          improvementDetails: formData.improvementDetails,
          priceExpectation: formData.priceExpectation,
          contactInfo: isSimplifiedStep9 ? {
            contactMethod: formData.contactMethod,
            email: formData.contactMethod === 'email' ? formData.email : null,
            phone: formData.contactMethod === 'phone' ? formData.phone : null,
            priceUpdates: formData.priceUpdates
          } : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }
        }
      };

      console.log('📤 Sending immediate webhook on form submission:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        console.log('✅ Immediate webhook sent successfully');
      } else {
        console.error('❌ Immediate webhook failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Immediate webhook error:', error);
    }
  };

  // New handler specifically for step 9 contact form submission
  const handleStep9Submit = async () => {
    setIsSubmitting(true);
    
    // Track PostHog event for step 9 final submit
    try {
      posthog.capture('report_retrieved', {
        address: formData.propertyAddress,
        step: 'contact_form_submission',
        user_flow: formData.sellingIntent,
        form_type: 'real-estate-sell',
        contact_method: formData.contactMethod,
        email: formData.email,
        phone: formData.phone
      });
    } catch (error) {
      console.log('PostHog capture failed:', error);
    }
    
    // Track step 9 specific conversion event
    analytics.trackStepComplete(9, formData);
    trackStepComplete(9, getStepName(9), formData);
    
    // Track specific conversion event for final submit button click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_form_submit', {
        event_category: 'conversion',
        event_label: 'step_9_final_submit',
        value: 1
      });
      console.log('📊 Google Analytics conversion event fired for step 9 final submit');
    }
    
    // Track Plausible Analytics conversion event
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Step 9 Final Submit', {
        props: {
          form_type: 'real-estate-sell',
          step_name: 'contact_form',
          step_number: 9,
          user_flow: formData.sellingIntent || 'unknown',
          conversion_type: 'final_submit'
        }
      });
      console.log('📊 Plausible Analytics step 9 conversion event fired');
    }
    
    // Track Facebook Pixel specific conversion for step 9
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_name: 'Step 9 Contact Form',
        status: 'completed'
      });
      console.log('📊 Facebook Pixel CompleteRegistration event fired for step 9');
    }
    
    // Track form completion
    const completionTime = Date.now() - (analytics as any).startTime;
    analytics.trackFormComplete(formData);
    trackFormComplete(formData, completionTime);
    
    // Send webhook immediately when form is submitted
    await sendImmediateWebhook();
    
    await handleFinalSubmission();
  };

  const handleFinalSubmission = async () => {
    
    // Fire Facebook Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
      console.log('📊 Facebook Meta Pixel Lead event fired for questionnaire submission:', formData.propertyAddress);
    }
    
    try {
      // Prepare form data for submission
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        formType: 'real-estate-sell',
        source: 'questionnaire'
      };

      // Note: Webhook will be sent from property-data-module after analysis completes
      // This includes comprehensive property data for both original and simplified Step 9

      // Store questionnaire data in context for use by presentation API
      setQuestionnaireData({
        propertyAddress: submissionData.propertyAddress,
        sellingIntent: submissionData.sellingIntent,
        sellingTimeline: submissionData.sellingTimeline,
        propertyType: '', // Will be populated from Zillow API data when available
        propertyCondition: submissionData.propertyCondition,
        propertyImprovements: submissionData.propertyImprovements,
        improvementDetails: submissionData.improvementDetails,
        name: isSimplifiedStep9 ? '' : `${submissionData.firstName} ${submissionData.lastName}`.trim(), // No names in simplified version
        // Add simplified Step 9 specific data to context
        contactMethod: isSimplifiedStep9 ? formData.contactMethod : undefined,
        priceUpdates: isSimplifiedStep9 ? formData.priceUpdates : undefined,
        formVersion: isSimplifiedStep9 ? 'simplified' : 'original',
        email: submissionData.email,
        phone: isSimplifiedStep9 && formData.contactMethod === 'phone' ? formatPhoneWithCountryCode(submissionData.phone) : submissionData.phone
      });

      console.log(`Form submitted with ${isSimplifiedStep9 ? 'simplified' : 'original'} Step 9 - comprehensive webhook will be triggered after property analysis completes`);
      
      // Prefetch images and value data before redirecting for faster loading
      try {
        if (propertyData?.zpid) {
          console.log('Prefetching images and value data for zpid:', propertyData.zpid);
          
          // Prefetch images
          const imagePromise = fetch(`/api/zillow/images?zpid=${encodeURIComponent(propertyData.zpid)}`);
          
          // Prefetch value data
          const valuePromise = fetch(`/api/zillow/values?zpid=${encodeURIComponent(propertyData.zpid)}`);
          
          // Wait for both requests to complete
          const [imageResponse, valueResponse] = await Promise.all([imagePromise, valuePromise]);
          
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log('Images prefetched successfully:', imageData);
          } else {
            console.log('Image prefetch failed, but continuing with redirect');
          }
          
          if (valueResponse.ok) {
            const valueData = await valueResponse.json();
            console.log('Value data prefetched successfully:', valueData);
          } else {
            console.log('Value data prefetch failed, but continuing with redirect');
          }
        }
      } catch (prefetchError) {
        console.error('Prefetch error:', prefetchError);
        // Continue with redirect even if prefetch fails
      }
      
      // Redirect to property-profile with address and contact information as query parameters
      // Property data is already prefetched via PropertyDataContext
      const queryParams = new URLSearchParams({
        address: submissionData.propertyAddress,
        first_name: `${submissionData.firstName}`.trim(),
        last_name: `${submissionData.lastName}`.trim(),
        email: submissionData.email,
        phone: isSimplifiedStep9 && formData.contactMethod === 'phone' ? formatPhoneWithCountryCode(submissionData.phone) : submissionData.phone
      });
      
      router.push(`/property-profile?${queryParams.toString()}`);
      // Don't set isSubmitting to false here - let the redirect happen with loading state
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Limit to 10 digits max
    const limitedDigits = digits.slice(0, 10);
    
    // Format as XXX-XXX-XXXX
    if (limitedDigits.length >= 10) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
    } else if (limitedDigits.length >= 6) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    } else if (limitedDigits.length >= 3) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    }
    return limitedDigits;
  };

  // Function to format phone with +1 country code for submission
  const formatPhoneWithCountryCode = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    // Only add +1 if it doesn't already start with 1 and has 10+ digits
    if (digits.length >= 10 && !digits.startsWith('1')) {
      return `+1${digits}`;
    } else if (digits.length >= 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    return `+1${digits}`;
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    if (email.trim() && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      // Track validation error
      trackButtonClick('email_validation_error', {
        step_number: currentStep,
        step_name: getStepName(currentStep),
        field: 'email',
        error_type: 'invalid_format',
        form_type: 'listing_presentation'
      });
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (phone: string) => {
    // Allow empty string for complete deletion
    if (phone === '') {
      setFormData({ ...formData, phone: '' });
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    setFormData({ ...formData, phone: formattedPhone });
  };

  // Improvement selection functions
  const handleImprovementSelect = (improvement: string) => {
    if (!formData.propertyImprovements.includes(improvement)) {
      setFormData({
        ...formData,
        propertyImprovements: [...formData.propertyImprovements, improvement]
      });
    }
    setImprovementSearch('');
    setShowImprovementDropdown(false);
  };

  const handleImprovementRemove = (improvement: string) => {
    setFormData({
      ...formData,
      propertyImprovements: formData.propertyImprovements.filter(item => item !== improvement)
    });
  };

  const handleCustomImprovementAdd = () => {
    const customImprovement = improvementSearch.trim();
    if (customImprovement && !formData.propertyImprovements.includes(customImprovement)) {
      setFormData({
        ...formData,
        propertyImprovements: [...formData.propertyImprovements, customImprovement]
      });
    }
    setImprovementSearch('');
    setShowImprovementDropdown(false);
  };

  const getFilteredImprovements = () => {
    return improvementOptions.filter(option => 
      option.toLowerCase().includes(improvementSearch.toLowerCase()) &&
      !formData.propertyImprovements.includes(option)
    );
  };

  const getNextButtonText = () => {
    if (currentStep === 6) {
      return formData.propertyImprovements.length > 0 ? 'Next' : 'Skip';
    }
    if (currentStep === 7) {
      const hasDetails = formData.improvementDetails.some(detail => 
        detail.yearsAgo !== undefined || detail.cost !== undefined
      );
      return hasDetails ? 'Next' : 'Skip';
    }
    return 'Next';
  };

  // Initialize improvement details when improvements are selected
  useEffect(() => {
    if (formData.propertyImprovements.length > 0) {
      const newDetails = formData.propertyImprovements.map(improvement => ({
        improvement,
        yearsAgo: undefined,
        cost: undefined
      }));
      setFormData(prev => ({ ...prev, improvementDetails: newDetails }));
    } else {
      setFormData(prev => ({ ...prev, improvementDetails: [] }));
    }
  }, [formData.propertyImprovements]);

  // Update improvement detail
  const updateImprovementDetail = (index: number, field: 'yearsAgo' | 'cost', value: number | undefined) => {
    const updatedDetails = [...formData.improvementDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setFormData({ ...formData, improvementDetails: updatedDetails });
  };

  // Format currency for display
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Parse currency input (remove formatting)
  const parseCurrencyInput = (value: string): number | undefined => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue) : undefined;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyAddress.trim() !== '';
      case 2:
        return formData.sellingIntent !== '';
      case 3:
        return formData.sellingTimeline !== '';
      case 4:
        return formData.sellingMotivation !== '';
      case 5:
        return formData.propertyCondition !== '';
      case 6:
        return true; // Improvements step is optional
      case 7:
        return true; // Improvement details step is optional
      case 8:
        return formData.priceExpectation !== '';
      case 9:
        if (isSimplifiedStep9) {
          // Simplified Step 9: Only require contact method and corresponding field
          if (formData.contactMethod === 'email') {
            return formData.email.trim() !== '' && validateEmail(formData.email);
          } else if (formData.contactMethod === 'phone') {
            return formData.phone.trim() !== '' && formData.phone.length >= 10;
          }
          return false;
        } else {
          // Original Step 9: Require all fields
          return formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && 
                 formData.email.trim() !== '' && validateEmail(formData.email) && formData.phone.trim() !== '' &&
                 formData.privacyPolicyConsent;
        }
      default:
        return false;
    }
  };

  const handlePrivacyPolicyConsentChange = (consent: boolean) => {
    setFormData({ ...formData, privacyPolicyConsent: consent });
    
    // Track privacy policy consent
    // trackStep removed - clean start with GTM
  };
  return (
    <div className="h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden md:flex flex-1 relative">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)'
          }}
        />
        {/* Black overlay with 80% opacity */}
        <div className="absolute inset-0 bg-black opacity-80" />
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="secondary"
            href="/"
            className="flex items-center gap-2 text-sm bg-white/90 backdrop-blur-sm"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center mx-auto flex flex-col items-center text-white">
            <Image 
              src="/logos/masterkey-inline-white.png"
              alt="Hero Image"
              width={300}
              height={100}
              className="mb-6"
            />
            
            <h1 className="text-5xl font-bold mb-6">Discover the true value of your property</h1>
            <p className="text-xl mx-auto opacity-90 max-w-md">
              Get maximum value for your property with our expert guidance and proven marketing strategies.
            </p>
            <p className="mt-4 text-sm mx-auto opacity-90 max-w-md">DRE# 02250486</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex flex-col overflow-scroll relative">
        
        {/* Progress Bar */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Tell us about your selling goals
            </h2>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Stepper value={currentStep} className="w-full sticky top-0">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <StepperItem key={step} step={step} className="flex-1">
                <StepperTrigger>
                  <StepperIndicator>{step}</StepperIndicator>
                </StepperTrigger>
                {step < totalSteps && <StepperSeparator />}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        {/* Form Content */}
        <div className={`flex-1 p-8 flex flex-col justify-center transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What's the address of the property you want to sell?
                </h3>
                <p className="text-gray-600 mb-8">
                  Enter the full address so we can provide you with accurate market insights and pricing guidance.
                </p>
              </div>
              
              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address
                </label>
                <GooglePlacesInput
                  value={formData.propertyAddress}
                  onChange={(address) => setFormData({ ...formData, propertyAddress: address })}
                  placeholder="e.g., 123 Main Street, San Francisco, CA 94102"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What brings you here today?
                </h3>
                <p className="text-gray-600 mb-8">
                  Help us understand your current situation so we can provide the most relevant information.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {sellingIntentOptions.map((intent) => (
                  <button
                    key={intent}
                    onClick={() => handleOptionSelect('sellingIntent', intent)}
                    className={`step-2-button p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.sellingIntent === intent
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{intent}</span>
                      {formData.sellingIntent === intent && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  When are you looking to sell?
                </h3>
                <p className="text-gray-600 mb-8">
                  Understanding your timeline helps us create the right marketing strategy for your situation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {timelineOptions.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => handleOptionSelect('sellingTimeline', timeline)}
                    className={`step-3-button p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.sellingTimeline === timeline
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{timeline}</span>
                      {formData.sellingTimeline === timeline && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What's motivating you to sell?
                </h3>
                <p className="text-gray-600 mb-8">
                  This helps us understand your priorities and tailor our approach to meet your specific needs.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {motivationOptions.map((motivation) => (
                  <button
                    key={motivation}
                    onClick={() => handleOptionSelect('sellingMotivation', motivation)}
                    className={`step-4-button p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.sellingMotivation === motivation
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{motivation}</span>
                      {formData.sellingMotivation === motivation && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What's the current condition of your home?
                </h3>
                <p className="text-gray-600 mb-8">
                  This helps us advise on any improvements that could maximize your sale price and determine the best marketing approach.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {conditionOptions.map((condition) => (
                  <button
                    key={condition.text}
                    onClick={() => handleOptionSelect('propertyCondition', condition.text)}
                    className={`step-5-button p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.propertyCondition === condition.text
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{condition.text}</span>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < condition.stars ? 'text-black' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {formData.propertyCondition === condition.text && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Have you made any improvements to your property?
                </h3>
                <p className="text-gray-600 mb-8">
                  Tell us about any renovations, upgrades, or improvements you've made during your ownership. This helps us highlight value-adding features to potential buyers.
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Selected improvements */}
                {formData.propertyImprovements.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Selected Improvements:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.propertyImprovements.map((improvement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{improvement}</span>
                          <button
                            onClick={() => handleImprovementRemove(improvement)}
                            className="step-6-button text-blue-600 hover:text-blue-800"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search input */}
                <div className="relative improvement-dropdown">
                  <label htmlFor="improvementSearch" className="block text-sm font-medium text-gray-700 mb-2">
                    Search or add improvements:
                  </label>
                  <input
                    type="text"
                    id="improvementSearch"
                    value={improvementSearch}
                    onChange={(e) => {
                      setImprovementSearch(e.target.value);
                      setShowImprovementDropdown(true);
                    }}
                    onFocus={() => setShowImprovementDropdown(true)}
                    placeholder="Type to search improvements or add your own..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* Dropdown */}
                  {showImprovementDropdown && (improvementSearch.length > 0 || getFilteredImprovements().length > 0) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredImprovements().map((improvement, index) => (
                        <button
                          key={index}
                          onClick={() => handleImprovementSelect(improvement)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                          {improvement}
                        </button>
                      ))}
                      
                      {/* Custom option */}
                      {improvementSearch.trim() && 
                       !improvementOptions.some(option => 
                         option.toLowerCase() === improvementSearch.toLowerCase()
                       ) && 
                       !formData.propertyImprovements.includes(improvementSearch.trim()) && (
                        <button
                          onClick={handleCustomImprovementAdd}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600 font-medium"
                        >
                          + Add "{improvementSearch.trim()}"
                        </button>
                      )}
                      
                      {getFilteredImprovements().length === 0 && !improvementSearch.trim() && (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          Start typing to search improvements...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick select common improvements */}
                {formData.propertyImprovements.length === 0 && !improvementSearch && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Common improvements:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {improvementOptions.slice(0, 6).map((improvement) => (
                        <button
                          key={improvement}
                          onClick={() => handleImprovementSelect(improvement)}
                          className="p-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left"
                        >
                          {improvement}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 7 && formData.propertyImprovements.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Tell us more about your improvements
                </h3>
                <p className="text-gray-600 mb-8">
                  Help us better understand the value of your improvements by providing additional details. This information is optional but helps with accurate valuation.
                </p>
              </div>
              
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Improvement</TableHead>
                      <TableHead className="w-[30%]">Years Ago</TableHead>
                      <TableHead className="w-[30%]">Approximate Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.improvementDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {detail.improvement}
                        </TableCell>
                        <TableCell>
                          <select
                            value={detail.yearsAgo || ''}
                            onChange={(e) => updateImprovementDetail(
                              index, 
                              'yearsAgo', 
                              e.target.value ? parseInt(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select...</option>
                            <option value="0">Less than 1 year</option>
                            <option value="1">1 year ago</option>
                            <option value="2">2 years ago</option>
                            <option value="3">3 years ago</option>
                            <option value="4">4 years ago</option>
                            <option value="5">5 years ago</option>
                            <option value="6">6-10 years ago</option>
                            <option value="11">More than 10 years ago</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={detail.cost ? formatCurrency(detail.cost) : ''}
                            onChange={(e) => updateImprovementDetail(
                              index, 
                              'cost', 
                              parseCurrencyInput(e.target.value)
                            )}
                            placeholder="$0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="text-sm text-gray-500 mt-4">
                  <p>💡 <strong>Tip:</strong> Providing this information helps us give you a more accurate property valuation and highlight value-adding improvements to potential buyers.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What's your pricing priority?
                </h3>
                <p className="text-gray-600 mb-8">
                  Understanding your pricing goals helps us develop the right strategy for your sale.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {priceExpectationOptions.map((expectation) => (
                  <button
                    key={expectation}
                    onClick={() => handleOptionSelect('priceExpectation', expectation)}
                    className={`step-8-button p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.priceExpectation === expectation
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{expectation}</span>
                      {formData.priceExpectation === expectation && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-6">
              {isSimplifiedStep9 ? (
                // Simplified Step 9 Version
                <>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                      Where would you like us to send your report?
                    </h3>
                    <p className="text-gray-600 mb-2">
                      We'll send you a comprehensive market analysis and selling strategy for your property.
                    </p>
                    <p className="text-sm text-gray-500">
                      We respect your privacy and will NOT spam you. You'll only receive the report you requested.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Contact Method Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, contactMethod: 'email', phone: '' })}
                        className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                          formData.contactMethod === 'email'
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-gray-400 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">📧 Email</div>
                            <div className="text-sm text-gray-500">Send via email</div>
                          </div>
                          {formData.contactMethod === 'email' && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setFormData({ ...formData, contactMethod: 'phone', email: '' })}
                        className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                          formData.contactMethod === 'phone'
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-gray-400 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">📱 Text Message</div>
                            <div className="text-sm text-gray-500">Send via SMS</div>
                          </div>
                          {formData.contactMethod === 'phone' && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Email Input */}
                    {formData.contactMethod === 'email' && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          placeholder="john.doe@example.com"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            emailError ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {emailError && (
                          <p className="text-red-600 text-sm mt-1">{emailError}</p>
                        )}
                      </div>
                    )}

                    {/* Phone Input */}
                    {formData.contactMethod === 'phone' && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-lg mr-2">🇺🇸</span>
                            <span className="text-gray-500 text-sm">+1</span>
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="555-123-4567"
                            className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          We'll send you a text message with a link to your report
                        </p>
                      </div>
                    )}

                    {/* Optional Price Updates Checkbox */}
                    {(formData.contactMethod === 'email' || formData.contactMethod === 'phone') && (
                      <div className="animate-in slide-in-from-top-2 duration-300 delay-150">
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
                          <input
                            type="checkbox"
                            id="priceUpdates"
                            checked={formData.priceUpdates}
                            onChange={(e) => setFormData({ ...formData, priceUpdates: e.target.checked })}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="priceUpdates" className="text-sm text-gray-700">
                            <span className="font-medium">📈 Yes, I'd like to receive updates on price movements for my home</span>
                            <br />
                            <span className="text-gray-500">
                              <span className="underline">We promise never to spam you.</span> Get notified when your home's estimated value changes (optional)
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Original Step 9 Version
                <>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                      Let's get your contact information
                    </h3>
                    <p className="text-gray-600 mb-8">
                      We'll use this information to provide you with a customized market analysis and selling strategy.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="john.doe@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          emailError ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {emailError && (
                        <p className="text-red-600 text-sm mt-1">{emailError}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="555-123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Privacy Policy Consent */}
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="privacyConsent"
                        checked={formData.privacyPolicyConsent}
                        onChange={(e) => handlePrivacyPolicyConsentChange(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="privacyConsent" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a 
                          href="/privacy-policy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Privacy Policy
                        </a>{' '}
                        and consent to the collection and use of my personal information as described therein. *
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </Button>
            
            {currentStep < 9 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || (currentStep === 1 && isLoading)}
                className="flex items-center gap-2"
              >
                {currentStep === 1 && isLoading ? (
                  <>
                    <span>Loading...</span>
                    <Spinner className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    {getNextButtonText()}
                    <ChevronRightIcon className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStep9Submit}
                disabled={!isStepValid() || isSubmitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 font-semibold"
                id="step-9-final-submit"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get my Report
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Thank you for your submission!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              We've received your property information and will be in touch soon with a customized market analysis and selling strategy.
            </DialogDescription>
          </DialogHeader>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong>Within 24 hours:</strong> Our real estate team will review your submission and contact you.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong>Market analysis:</strong> We'll prepare a comprehensive market analysis for your property.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong>Selling strategy:</strong> Receive a detailed plan to maximize your home's value and minimize time on market.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                setShowCompletionModal(false);
                router.push('/');
              }}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Property Type Error Modal */}
      <Dialog open={!!propertyTypeError} onOpenChange={() => setPropertyTypeError(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XMarkIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Property Type Not Supported
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {propertyTypeError}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <h4 className="font-semibold text-gray-900 mb-2">We currently support:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                Single Family Residences
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                Condominiums
              </li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setPropertyTypeError(null)}
              className="bg-sky-500 hover:bg-sky-600 text-white"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}

export default function RealEstateSellPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealEstateSellPageContent />
    </Suspense>
  );
}