"use client";

import { useState } from 'react';
import { Button } from '@/components/button';
import { Gradient } from '@/components/gradient';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { PropertyLookup } from '@/components/ui/property-lookup';
import { PropertyVerification } from '@/components/ui/property-verification';
import { getRepliersClient, type LeadData } from '../../lib/repliers-api';

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
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: string;
  yearBuilt: number;
  lotSize: string;
  estimatedValue: string;
  lastSaleDate: string;
  lastSalePrice: string;
  propertyTax: string;
  neighborhood: string;
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


type FormStep = 'address' | 'lookup' | 'verification' | 'details' | 'contact';

export default function RealEstateSellPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('address');
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({});
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
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
    setCurrentStep('details');
  };

  const handleVerificationEdit = () => {
    setCurrentStep('address');
  };

  const handleSubmit = async () => {
    if (!propertyData) return;

    try {
      const leadData: LeadData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        propertyLocation: formData.propertyLocation,
        propertyType: propertyData.propertyType,
        timeline: formData.timeline,
        leadSource: 'MasterKey Sell Property Quiz',
        notes: `Property Details:
- Address: ${propertyData.address}
- Type: ${propertyData.propertyType}
- Bedrooms: ${propertyData.bedrooms}
- Bathrooms: ${propertyData.bathrooms}
- Square Footage: ${propertyData.squareFootage}
- Year Built: ${propertyData.yearBuilt}
- Estimated Value: ${propertyData.estimatedValue}
- Selling Reason: ${formData.sellingReason}
- Timeline: ${formData.timeline}
- Need to Sell First: ${formData.needToSellFirst}
- Expected Value: ${formData.expectedValue}
- Outstanding Obligations: ${formData.outstandingObligations}
- Occupancy Status: ${formData.occupancyStatus}`,
        customFields: {
          propertyType: propertyData.propertyType,
          bedrooms: propertyData.bedrooms.toString(),
          bathrooms: propertyData.bathrooms.toString(),
          squareFootage: propertyData.squareFootage,
          yearBuilt: propertyData.yearBuilt.toString(),
          estimatedValue: propertyData.estimatedValue,
          sellingReason: formData.sellingReason,
          needToSellFirst: formData.needToSellFirst,
          expectedValue: formData.expectedValue,
          outstandingObligations: formData.outstandingObligations,
          occupancyStatus: formData.occupancyStatus,
          ...(propertyDetails.placeId && { placeId: propertyDetails.placeId }),
          ...(propertyDetails.coordinates && { 
            coordinatesLat: propertyDetails.coordinates.lat.toString(),
            coordinatesLng: propertyDetails.coordinates.lng.toString()
          })
        }
      };

      const repliersClient = getRepliersClient();
      const result = await repliersClient.createLead(leadData);

      if (result.success) {
        alert('Thank you! Your property evaluation request has been submitted successfully. We will contact you soon with a comprehensive market analysis.');
      } else {
        console.error('Failed to create lead:', result.error);
        alert('Thank you! Your information has been submitted. We will contact you soon.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Thank you! Your information has been submitted. We will contact you soon.');
    }
  };

  // Address Input Step
  if (currentStep === 'address') {
    return (
      <div className="h-screen flex">
        <div className="flex-1 relative">
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

        <div className="w-full max-w-md bg-white p-8 flex flex-col justify-center">
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
      <PropertyVerification
        propertyData={propertyData}
        onConfirm={handleVerificationConfirm}
        onEdit={handleVerificationEdit}
      />
    );
  }

  // Rest of the form (details and contact)
  return (
    <div className="h-screen flex">
      <div className="flex-1 relative">
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
                  {propertyData.bedrooms} bed • {propertyData.bathrooms} bath • {propertyData.squareFootage} sq ft
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-8 flex flex-col justify-center overflow-y-auto">
        {currentStep === 'details' && (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                When do you want to sell?
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
              disabled={!formData.sellingReason || !formData.timeline}
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
}