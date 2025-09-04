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
  location: string;
  homeType: string;
}

const homeTypes = [
  'Single Family Home',
  'Townhouse',
  'Condominium',
  'Multi-Family Home',
  'Manufactured Home',
  'Land/Lot'
];

export default function RealEstateBuyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    homeType: ''
  });

  const totalSteps = 2;

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
        return formData.location.trim() !== '';
      case 2:
        return formData.homeType !== '';
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
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Home</h1>
            <p className="text-xl opacity-90 max-w-md">
              Let us help you discover the perfect property that matches your lifestyle and budget.
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
              Tell us about your needs
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
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Where are you looking to buy?
                </h3>
                <p className="text-gray-600 mb-8">
                  Enter the city, state, or ZIP code where you'd like to find your new home.
                </p>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA or 94102"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What type of home are you looking for?
                </h3>
                <p className="text-gray-600 mb-8">
                  Select the type of property that best fits your needs.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {homeTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, homeType: type })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.homeType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{type}</span>
                      {formData.homeType === type && (
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