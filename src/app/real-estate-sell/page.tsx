"use client";

import { useState } from 'react';
import { Button } from '@/components/button';
import { Gradient } from '@/components/gradient';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

interface FormData {
  propertyLocation: string;
  propertyType: string;
  propertyCondition: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  recentRenovations: string;
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

const propertyTypes = [
  'Single Family Home',
  'Townhouse',
  'Condominium',
  'Multi-Family Home',
  'Manufactured Home',
  'Land/Lot'
];

const propertyConditions = [
  'Excellent',
  'Good', 
  'Fair',
  'Needs Work'
];

const sellingReasons = [
  'Relocating for work',
  'Upgrading to larger home',
  'Downsizing',
  'Financial reasons',
  'Divorce/separation',
  'Inherited property',
  'Investment property sale',
  'Other'
];

const timelines = [
  'ASAP (within 30 days)',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Flexible/No rush'
];

const occupancyStatuses = [
  'Currently living in the home',
  'Vacant - ready to show',
  'Tenant occupied',
  'Partially occupied'
];

export default function RealEstateSellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    propertyLocation: '',
    propertyType: '',
    propertyCondition: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    recentRenovations: '',
    sellingReason: '',
    timeline: '',
    needToSellFirst: '',
    expectedValue: '',
    outstandingObligations: '',
    occupancyStatus: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyLocation.trim() !== '' && formData.propertyType !== '';
      case 2:
        return formData.propertyCondition !== '' && formData.bedrooms !== '' && formData.bathrooms !== '';
      case 3:
        return formData.squareFootage.trim() !== '' && formData.recentRenovations !== '';
      case 4:
        return formData.sellingReason !== '' && formData.timeline !== '';
      case 5:
        return formData.needToSellFirst !== '' && formData.expectedValue.trim() !== '' && formData.outstandingObligations !== '' && formData.occupancyStatus !== '';
      case 6:
        return formData.firstName.trim() !== '' && 
               formData.lastName.trim() !== '' && 
               formData.email.trim() !== '' && 
               formData.phone.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="flex-1 relative">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://d1xt9s86fx9r45.cloudfront.net/assets/hl-production/assets/hlca/home/hero_desktop_wide-5b3707a057fa6298422d5dd72baea5c852a16db63d806cb0ea75eac6f86b6a7f.webp)'
          }}
        />
        {/* Gradient overlay */}
        <Gradient className="absolute inset-0 opacity-90" />
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Sell Your Property</h1>
            <p className="text-xl opacity-90 max-w-md">
              Get the best value for your property with our expert guidance and market insights.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Back Button */}
        <div className="p-6 border-b border-gray-100">
          <Button
            variant="secondary"
            href="/"
            className="flex items-center gap-2 text-sm"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Tell us about your property
            </h2>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Stepper value={currentStep} className="w-full">
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
        <div className="flex-1 p-8 flex flex-col justify-center">
          {/* Step 1: Location & Property Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Property Location & Type
                </h3>
                <p className="text-gray-600 mb-8">
                  Tell us where your property is located and what type it is.
                </p>
              </div>
              
              <div>
                <label htmlFor="propertyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Location
                </label>
                <input
                  type="text"
                  id="propertyLocation"
                  value={formData.propertyLocation}
                  onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                  placeholder="e.g., San Francisco, CA or 94102"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg mb-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, propertyType: type })}
                      className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                        formData.propertyType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{type}</span>
                        {formData.propertyType === type && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Property Details
                </h3>
                <p className="text-gray-600 mb-8">
                  Help us understand your property's current condition and layout.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Condition
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {propertyConditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setFormData({ ...formData, propertyCondition: condition })}
                      className={`p-3 text-center border rounded-lg transition-all duration-200 ${
                        formData.propertyCondition === condition
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6+">6+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Size & Renovations */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Size & Improvements
                </h3>
                <p className="text-gray-600 mb-8">
                  Tell us about your property's size and any recent improvements.
                </p>
              </div>
              
              <div>
                <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Square Footage
                </label>
                <input
                  type="text"
                  id="squareFootage"
                  value={formData.squareFootage}
                  onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                  placeholder="e.g., 2,500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Major renovations or improvements in the last 5 years?
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFormData({ ...formData, recentRenovations: 'Yes' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.recentRenovations === 'Yes'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    Yes, we've made significant improvements
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, recentRenovations: 'No' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.recentRenovations === 'No'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    No major renovations
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Selling Motivation & Timeline */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Selling Motivation & Timeline
                </h3>
                <p className="text-gray-600 mb-8">
                  Help us understand your reasons and timeline for selling.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary reason for selling
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {sellingReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setFormData({ ...formData, sellingReason: reason })}
                      className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                        formData.sellingReason === reason
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ideal timeline for selling
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {timelines.map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => setFormData({ ...formData, timeline: timeline })}
                      className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                        formData.timeline === timeline
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900'
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Financial & Logistics */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Financial & Logistics
                </h3>
                <p className="text-gray-600 mb-8">
                  Final details about your property and situation.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you need to sell before buying your next home?
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFormData({ ...formData, needToSellFirst: 'Yes' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.needToSellFirst === 'Yes'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    Yes, I need to sell first
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, needToSellFirst: 'No' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.needToSellFirst === 'No'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    No, I can buy before selling
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, needToSellFirst: 'Not buying' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.needToSellFirst === 'Not buying'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    I'm not buying another home
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="expectedValue" className="block text-sm font-medium text-gray-700 mb-2">
                  What do you think your home is worth?
                </label>
                <input
                  type="text"
                  id="expectedValue"
                  value={formData.expectedValue}
                  onChange={(e) => setFormData({ ...formData, expectedValue: e.target.value })}
                  placeholder="e.g., $750,000 or $700k-800k"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Outstanding liens, mortgages, or financial obligations?
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFormData({ ...formData, outstandingObligations: 'Yes' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.outstandingObligations === 'Yes'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    Yes, there are outstanding obligations
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, outstandingObligations: 'No' })}
                    className={`w-full p-3 text-left border rounded-lg transition-all duration-200 ${
                      formData.outstandingObligations === 'No'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    No outstanding obligations
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current occupancy status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {occupancyStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFormData({ ...formData, occupancyStatus: status })}
                      className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                        formData.occupancyStatus === status
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Contact Information */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-8">
                  Please provide your contact details so we can get in touch with you.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
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
                    Last Name
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
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
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
                disabled={!isStepValid()}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}