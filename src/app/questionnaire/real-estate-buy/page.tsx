"use client";

import { useState } from 'react';
import { Button } from '@/components/button';
import { Gradient } from '@/components/gradient';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, HomeIcon, PhoneIcon, EnvelopeIcon, XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/16/solid';
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
import Link from 'next/link';

interface FormData {
  location: string;
  homeType: string;
  amenities: string[];
  budget: string;
  timeline: string;
  bedrooms: string;
  financing: string;
  priorities: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: string;
}

const homeTypes = [
  'Single Family Home',
  'Townhouse',
  'Condominium',
  'Multi-Family Home',
  'Manufactured Home',
  'Land/Lot'
];

const budgetRanges = [
  'Under $300,000',
  '$300,000 - $500,000',
  '$500,000 - $750,000',
  '$750,000 - $1,000,000',
  '$1,000,000 - $1,500,000',
  'Over $1,500,000'
];

const timelineOptions = [
  'Immediately (0-3 months)',
  'Soon (3-6 months)',
  'Within a year (6-12 months)',
  'More than a year',
  'Just browsing'
];

const bedroomOptions = [
  '1 bedroom',
  '2 bedrooms',
  '3 bedrooms',
  '4 bedrooms',
  '5+ bedrooms'
];

const financingOptions = [
  'Pre-approved for a mortgage',
  'Need help getting pre-approved',
  'Paying cash',
  'Need financing guidance',
  'Other'
];

const priorityOptions = [
  'Good schools',
  'Low crime rate',
  'Close to work',
  'Public transportation',
  'Shopping and dining',
  'Parks and recreation',
  'Low maintenance',
  'Investment potential'
];

const contactMethods = [
  'Email',
  'Phone call',
  'Text message',
  'No preference'
];

// Conditional amenities based on home type
const getAmenitiesForHomeType = (homeType: string): string[] => {
  switch (homeType) {
    case 'Single Family Home':
      return [
        'Swimming Pool', 'Large Backyard', 'Garage', 'Fireplace', 'Hardwood Floors',
        'Updated Kitchen', 'Master Suite', 'Home Office', 'Basement', 'Deck/Patio',
        'Walk-in Closets', 'Laundry Room', 'Central Air', 'Security System', 'Fenced Yard'
      ];
    case 'Townhouse':
      return [
        'Garage', 'Patio/Balcony', 'Fireplace', 'Updated Kitchen', 'Hardwood Floors',
        'Master Suite', 'Home Office', 'Walk-in Closets', 'Central Air', 'Storage Space',
        'Laundry Room', 'Security System', 'HOA Amenities', 'Guest Parking', 'End Unit'
      ];
    case 'Condominium':
      return [
        'Balcony/Terrace', 'City Views', 'Concierge', 'Fitness Center', 'Pool',
        'Parking Space', 'Storage Unit', 'In-unit Laundry', 'Updated Kitchen', 'Hardwood Floors',
        'High Ceilings', 'Natural Light', 'Security', 'Elevator', 'Rooftop Access'
      ];
    case 'Multi-Family Home':
      return [
        'Separate Entrances', 'Parking Spaces', 'Large Lot', 'Updated Units', 'Laundry Facilities',
        'Storage Space', 'Fenced Property', 'Investment Potential', 'Good Rental History', 'Low Maintenance',
        'Separate Utilities', 'Outdoor Space', 'Security Features', 'Proximity to Transit', 'Zoning Compliance'
      ];
    case 'Manufactured Home':
      return [
        'Large Lot', 'Covered Parking', 'Deck/Patio', 'Storage Shed', 'Updated Interior',
        'Central Air', 'Fireplace', 'Fenced Yard', 'Community Amenities', 'Low HOA Fees',
        'Pet-Friendly', 'Garden Space', 'Workshop Area', 'RV Parking', 'Quiet Neighborhood'
      ];
    case 'Land/Lot':
      return [
        'Utilities Available', 'Level Terrain', 'Tree Coverage', 'Water Access', 'Mountain Views',
        'Privacy', 'Road Access', 'Buildable', 'No HOA', 'Large Acreage',
        'Zoning Flexibility', 'Natural Features', 'Investment Potential', 'Development Ready', 'Mineral Rights'
      ];
    default:
      return [];
  }
};

export default function RealEstateBuyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    homeType: '',
    amenities: [],
    budget: '',
    timeline: '',
    bedrooms: '',
    financing: '',
    priorities: [],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: ''
  });
  const [amenitySearch, setAmenitySearch] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');

  const totalSteps = 8;
  
  // Webhook URL - you can customize this
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/63dbb140-9990-4cb4-8954-e6d59f3813ce';

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data for webhook
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        formType: 'real-estate-buy',
        source: 'questionnaire'
      };

      // Submit to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        console.log('Form submitted successfully:', submissionData);
        setShowCompletionModal(true);
      } else {
        console.error('Form submission failed:', response.statusText);
        // Still show success modal for user experience
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Still show success modal for user experience
      setShowCompletionModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.location.trim() !== '';
      case 2:
        return formData.homeType !== '';
      case 3:
        return true; // Amenities are optional
      case 4:
        return formData.budget !== '';
      case 5:
        return formData.timeline !== '';
      case 6:
        return formData.bedrooms !== '';
      case 7:
        return formData.financing !== '';
      case 8:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && 
               formData.email.trim() !== '' && formData.phone.trim() !== '';
      default:
        return false;
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAmenityRemove = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const getFilteredAmenities = () => {
    const availableAmenities = getAmenitiesForHomeType(formData.homeType);
    if (!amenitySearch.trim()) return availableAmenities;
    
    return availableAmenities.filter(amenity =>
      amenity.toLowerCase().includes(amenitySearch.toLowerCase())
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmedAmenity = customAmenity.trim();
    if (trimmedAmenity && !formData.amenities.includes(trimmedAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, trimmedAmenity]
      }));
      setCustomAmenity('');
    }
  };

  const handleCustomAmenityKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomAmenity();
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

          {currentStep === 3 && formData.homeType && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What amenities are important to you?
                </h3>
                <p className="text-gray-600 mb-8">
                  Search and select the features that matter most for your {formData.homeType.toLowerCase()}. You can skip this step if you prefer.
                </p>
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={amenitySearch}
                  onChange={(e) => setAmenitySearch(e.target.value)}
                  placeholder="Search amenities..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Custom Amenity Input */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add your own amenity:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyPress={handleCustomAmenityKeyPress}
                    placeholder="e.g., Wine cellar, Home theater, etc."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={handleAddCustomAmenity}
                    disabled={!customAmenity.trim() || formData.amenities.includes(customAmenity.trim())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add
                  </button>
                </div>
                {customAmenity.trim() && formData.amenities.includes(customAmenity.trim()) && (
                  <p className="text-xs text-amber-600 mt-1">This amenity is already selected</p>
                )}
              </div>

              {/* Selected Amenities */}
              {formData.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {amenity}
                        <button
                          onClick={() => handleAmenityRemove(amenity)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Amenities */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {amenitySearch ? 'Search results:' : 'Popular amenities for your home type:'}
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {getFilteredAmenities().map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      disabled={formData.amenities.includes(amenity)}
                      className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                        formData.amenities.includes(amenity)
                          ? 'border-blue-500 bg-blue-50 text-blue-900 opacity-50 cursor-not-allowed'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm">{amenity}</span>
                    </button>
                  ))}
                </div>
                
                {getFilteredAmenities().length === 0 && amenitySearch && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No amenities found matching "{amenitySearch}"
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  What's your budget range?
                </h3>
                <p className="text-gray-600 mb-8">
                  Select the price range that works best for your situation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {budgetRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setFormData({ ...formData, budget: range })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.budget === range
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{range}</span>
                      {formData.budget === range && (
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
                  When are you looking to buy?
                </h3>
                <p className="text-gray-600 mb-8">
                  Let us know your timeline so we can prioritize your needs.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {timelineOptions.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => setFormData({ ...formData, timeline })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.timeline === timeline
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{timeline}</span>
                      {formData.timeline === timeline && (
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
                  How many bedrooms do you need?
                </h3>
                <p className="text-gray-600 mb-8">
                  Select the number of bedrooms that fits your household.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {bedroomOptions.map((bedroom) => (
                  <button
                    key={bedroom}
                    onClick={() => setFormData({ ...formData, bedrooms: bedroom })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.bedrooms === bedroom
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{bedroom}</span>
                      {formData.bedrooms === bedroom && (
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
                  What's your financing situation?
                </h3>
                <p className="text-gray-600 mb-8">
                  This helps us understand how we can best assist you.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {financingOptions.map((financing) => (
                  <button
                    key={financing}
                    onClick={() => setFormData({ ...formData, financing })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.financing === financing
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{financing}</span>
                      {formData.financing === financing && (
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

          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Let's get your contact information
                </h3>
                <p className="text-gray-600 mb-8">
                  We'll use this information to send you personalized property recommendations and market updates.
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                
                <div>
                  <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    id="preferredContact"
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your preference</option>
                    {contactMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
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
              We've received your information and will be in touch soon with personalized property recommendations.
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
                    <strong>Within 24 hours:</strong> Our team will review your preferences and contact you.
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
                    <strong>Property matching:</strong> We'll send you curated listings that match your criteria.
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
                    <strong>Schedule viewings:</strong> We'll coordinate property tours at your convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">Need immediate assistance?</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                <a href="tel:+1-555-123-4567" className="text-blue-600 hover:text-blue-800 text-sm">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                <a href="mailto:info@masterkey.com" className="text-blue-600 hover:text-blue-800 text-sm">
                  info@masterkey.com
                </a>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <Link href="/" className="w-full">
              <Button className="w-full flex items-center justify-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <Link href="/buy" className="w-full">
                <Button variant="secondary" className="w-full">
                  Buying Services
                </Button>
              </Link>
              
              <Link href="/property-lookup" className="w-full">
                <Button variant="secondary" className="w-full">
                  Search Properties
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}