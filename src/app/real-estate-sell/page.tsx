"use client";

import { useState } from 'react';
import { Button } from '@/components/button';
import { Gradient } from '@/components/gradient';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { PropertyLookup } from '@/components/ui/property-lookup';
import { PropertyVerification } from '@/components/ui/property-verification';
import { webhookService, type WebhookSubmissionData } from '../../lib/webhook-api';
import { PropertyDataModule } from '@/components/property-data-module';

// Simplified form data - removed property details that will come from API
interface FormData {
  propertyLocation: string;
  sellingReason: string;
  timeline: string;
  needToSellFirst: string;
  expectedValue: string;
  outstandingObligations: string;
  occupancyStatus: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PropertyDetails {
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  addressComponents?: google.maps.GeocoderAddressComponent[];
}

interface PropertyData {
  zpid: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  propertyType: string;
  homeStatus: string;
  zestimate?: number;
  rentZestimate?: number;
  yearBuilt?: number;
  lotSize?: number;
  price?: number;
  priceHistory?: Array<{
    date: string;
    price: number;
    event: string;
  }>;
  photos?: string[];
  description?: string;
  schools?: Array<{
    name: string;
    rating: number;
    level: string;
  }>;
  neighborhood?: {
    name: string;
    walkScore?: number;
    transitScore?: number;
    bikeScore?: number;
  };
}

const sellingReasons = [
  'Upgrading to a larger home',
  'Downsizing',
  'Relocating for work',
  'Financial reasons',
  'Retirement',
  'Divorce/Separation',
  'Investment property sale',
  'Other'
];

const timelines = [
  'ASAP (within 30 days)',
  '1-3 months',
  '3-6 months',
  '6-12 months',
  'More than 12 months',
  'Just exploring options'
];

type FormStep = 'address' | 'lookup' | 'verification' | 'motivation' | 'timeline' |'contact' | 'success' | 'error';

export default function RealEstateSellPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('address');
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    propertyLocation: '',
    sellingReason: '',
    timeline: '',
    needToSellFirst: '',
    expectedValue: '',
    outstandingObligations: '',
    occupancyStatus: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleLocationChange = (address: string, placeDetails?: google.maps.places.PlaceResult) => {
    setFormData({ ...formData, propertyLocation: address });
    
    if (placeDetails) {
      setPropertyDetails({
        placeId: placeDetails.place_id,
        coordinates: placeDetails.geometry?.location ? {
          lat: placeDetails.geometry.location.lat(),
          lng: placeDetails.geometry.location.lng()
        } : undefined,
        addressComponents: placeDetails.address_components
      });
    }
  };

  const handleAddressSubmit = () => {
    if (formData.propertyLocation.trim()) {
      setCurrentStep('lookup');
    }
  };

  const handleLookupComplete = (data: PropertyData) => {
    setPropertyData(data);
    setCurrentStep('verification');
  };

  const handleVerificationConfirm = () => {
    setCurrentStep('motivation');
  };

  const handleVerificationEdit = () => {
    setCurrentStep('address');
  };

  const handleSubmit = async () => {
    if (!propertyData) return;

    try {
      const webhookData: WebhookSubmissionData = {
        // Contact Information
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        
        // Property Information
        propertyLocation: formData.propertyLocation,
        propertyType: propertyData.propertyType,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        livingArea: propertyData.livingArea,
        yearBuilt: propertyData.yearBuilt,
        lotSize: propertyData.lotSize,
        zestimate: propertyData.zestimate || propertyData.price,
        homeStatus: propertyData.homeStatus,
        zpid: propertyData.zpid,
        
        // Selling Details
        sellingReason: formData.sellingReason,
        timeline: formData.timeline,
        needToSellFirst: formData.needToSellFirst,
        expectedValue: formData.expectedValue,
        outstandingObligations: formData.outstandingObligations,
        occupancyStatus: formData.occupancyStatus,
        
        // Metadata
        leadSource: 'MasterKey Property Sell Form',
        notes: `Property Details:
- Address: ${propertyData.address}
- Type: ${propertyData.propertyType}
- Bedrooms: ${propertyData.bedrooms}
- Bathrooms: ${propertyData.bathrooms}
- Living Area: ${propertyData.livingArea} sq ft
- Year Built: ${propertyData.yearBuilt || 'N/A'}
- Estimated Value: $${propertyData.zestimate?.toLocaleString() || propertyData.price?.toLocaleString() || 'N/A'}
- Home Status: ${propertyData.homeStatus}

Selling Details:
- Reason: ${formData.sellingReason}
- Timeline: ${formData.timeline}
- Need to Sell First: ${formData.needToSellFirst}
- Expected Value: ${formData.expectedValue}
- Outstanding Obligations: ${formData.outstandingObligations}
- Occupancy Status: ${formData.occupancyStatus}`
      };

      const result = await webhookService.submitLead(webhookData);

      if (result.success) {
        setCurrentStep('success');
      } else {
        console.error('Failed to submit lead:', result.error);
        setSubmissionError(result.error || 'Unknown error occurred');
        setCurrentStep('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError(error instanceof Error ? error.message : 'Network error occurred');
      setCurrentStep('error');
    }
  };

  // Address Input Step
  if (currentStep === 'address') {
    return (
      <div className="h-screen flex flex-row">
        <div className=" hidden md:flex items-center justify-center w-1/2 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/hero-bg.webp)'
            }}
          />
          <Gradient className="absolute inset-0 opacity-90" />
          
          <div className="relative h-full flex items-center justify-center p-8">
            <div className="text-center text-white max-w-lg">
              <h1 className="text-5xl font-bold mb-6">
                What&apos;s Your Property Worth?
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Get an instant property valuation and connect with our expert agents
              </p>
            </div>
          </div>
        </div>

        <div className=" max-w-md bg-white p-8 flex flex-col justify-center w-full mx-auto ">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Enter Your Property Address
            </h2>
            <p className="text-gray-600">
              We&apos;ll analyze your property and provide a comprehensive market evaluation
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="propertyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Property Address
              </label>
              <GooglePlacesInput
                id="propertyLocation"
                value={formData.propertyLocation}
                onChange={handleLocationChange}
                placeholder="Enter your property's full address"
                className="mb-4"
              />
            </div>

            <Button
              onClick={handleAddressSubmit}
              disabled={!formData.propertyLocation.trim()}
              className="w-full py-4 text-lg font-semibold"
            >
              Analyze My Property
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Free • No obligation • Instant results
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Property Lookup Step
  if (currentStep === 'lookup') {
    return (
      <PropertyLookup
        address={formData.propertyLocation}
        onComplete={handleLookupComplete}
      />
    );
  }

  // Property Verification Step
  if (currentStep === 'verification' && propertyData) {
    return (
      <PropertyDataModule address={formData.propertyLocation} />
    );
  }

  // Rest of the form (details and contact)
  return (
    <div className="h-screen flex">
      <div className="hidden md:flex w-1/2 justify-center items-center relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-bg.webp)'
          }}
        />
        <Gradient className="absolute inset-0 opacity-90" />
        
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="text-center text-white max-w-lg">
            <h1 className="text-4xl font-bold mb-4">
              Almost Done!
            </h1>
            <p className="text-lg text-white/90">
              Just a few more details to complete your property evaluation
            </p>
            {propertyData && (
              <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur">
                <p className="text-sm text-white/80 mb-1">Your Property</p>
                <p className="font-semibold">{propertyData.address}</p>
                <p className="text-sm text-white/90">
                  {propertyData.bedrooms} bed • {propertyData.bathrooms} bath • {propertyData.livingArea} sq ft
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-8 flex flex-col justify-center overflow-y-auto mx-auto">
        {currentStep === 'motivation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Tell Us More
              </h3>
              <p className="text-gray-600 mb-6">
                Help us provide the most accurate evaluation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Why are you selling?
              </label>
              <div className="space-y-2">
                {sellingReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setFormData({ ...formData, sellingReason: reason })}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      formData.sellingReason === reason
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep('timeline')}
              disabled={!formData.sellingReason}
              className="w-full py-3"
            >
              Continue
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}


        {currentStep === 'timeline' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                When Do You Want to Sell?
              </h3>
              <p className="text-gray-600 mb-6">
                This helps us understand your urgency and provide better guidance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your preferred timeline
              </label>
              <div className="space-y-2">
                {timelines.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => setFormData({ ...formData, timeline })}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      formData.timeline === timeline
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {timeline}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep('contact')}
              disabled={!formData.timeline}
              className="w-full py-3"
            >
              Continue
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Get Your Results
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your contact information to receive your property evaluation
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
              className="w-full py-4 text-lg font-semibold"
            >
              Get My Property Evaluation
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive communications about your property evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Success Page
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your property evaluation request has been submitted successfully. Our team will contact you soon with a comprehensive market analysis.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>What happens next?</strong><br />
              • We'll analyze your property data<br />
              • Prepare a detailed market report<br />
              • Contact you within 24 hours
            </p>
          </div>
          
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Error Page
  if (currentStep === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Submission Error
          </h1>
          
          <p className="text-gray-600 mb-4">
            We encountered an issue submitting your information. Don't worry - your data is safe.
          </p>
          
          {submissionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {submissionError}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                setSubmissionError(null);
                setCurrentStep('contact');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Return to Home
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            If the problem persists, please contact us directly.
          </p>
        </div>
      </div>
    );
  }
}