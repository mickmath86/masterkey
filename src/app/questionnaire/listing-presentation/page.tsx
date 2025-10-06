"use client";

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/button';
import { Gradient } from '@/components/gradient';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/16/solid';
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePropertyData } from '@/contexts/PropertyDataContext';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormData {
  propertyAddress: string;
  sellingIntent: string;
  sellingTimeline: string;
  sellingMotivation: string;
  propertyCondition: string;
  priceExpectation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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

function RealEstateSellPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prefetchPropertyData, isLoading, setQuestionnaireData } = usePropertyData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    propertyAddress: '',
    sellingIntent: '',
    sellingTimeline: '',
    sellingMotivation: '',
    propertyCondition: '',
    priceExpectation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

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

  const totalSteps = 7;
  
  // LeadConnector webhook URL
  const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/0972671d-e4b7-46c5-ad30-53d734b97e8c';

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleOptionSelect = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
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
        if (currentStep === 5 && formData.sellingIntent === 'I am just curious about market conditions') {
          nextStep = 7; // Skip step 6 (pricing) and go directly to step 7 (contact)
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
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        formType: 'real-estate-sell',
        source: 'questionnaire'
      };

      // Store questionnaire data in context for use by presentation API
      setQuestionnaireData({
        propertyAddress: submissionData.propertyAddress,
        sellingIntent: submissionData.sellingIntent,
        sellingTimeline: submissionData.sellingTimeline,
        propertyType: '', // Will be populated from Zillow API data when available
        propertyCondition: submissionData.propertyCondition,
        name: `${submissionData.firstName} ${submissionData.lastName}`.trim(),
        email: submissionData.email,
        phone: submissionData.phone
      });

      // Send form data to LeadConnector webhook
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        if (response.ok) {
          console.log('Form submitted successfully to LeadConnector:', submissionData);
        } else {
          console.error('Webhook submission failed:', response.status, response.statusText);
          // Continue with redirect even if webhook fails
        }
      } catch (webhookError) {
        console.error('Webhook submission error:', webhookError);
        // Continue with redirect even if webhook fails
      }
      
      // Redirect directly to property-profile with address parameter
      // Property data is already prefetched via PropertyDataContext
      router.push(`/property-profile?address=${encodeURIComponent(submissionData.propertyAddress)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    if (email.trim() && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
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
        return formData.priceExpectation !== '';
      case 7:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && 
               formData.email.trim() !== '' && validateEmail(formData.email) && formData.phone.trim() !== '';
      default:
        return false;
    }
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
        {/* Gradient overlay */}
        <Gradient className="absolute inset-0 opacity-90" />
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
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Sell Your Home with Confidence</h1>
            <p className="text-xl mx-auto opacity-90 max-w-md">
              Get maximum value for your property with our expert guidance and proven marketing strategies.
            </p>
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
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
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
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
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
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
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
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
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
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
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

          {currentStep === 7 && (
            <div className="space-y-6">
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
              </div>
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
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
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