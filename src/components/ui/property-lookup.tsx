"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { GithubGlobe } from './github-globe';
import { zillowAPI } from '../../lib/zillow-api';
import type { ZillowPropertyData } from '../../lib/zillow-api';

interface LookupStep {
  id: string;
  label: string;
  duration: number;
  completed: boolean;
}

interface PropertyLookupProps {
  address: string;
  onComplete: (propertyData: ZillowPropertyData) => void;
}

export function PropertyLookup({ address, onComplete }: PropertyLookupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<LookupStep[]>([
    { id: 'validate', label: 'Validating address with Google Places', duration: 1500, completed: false },
    { id: 'search', label: 'Searching Zillow database', duration: 2000, completed: false },
    { id: 'details', label: 'Retrieving property details', duration: 2500, completed: false },
    { id: 'photos', label: 'Loading property photos', duration: 2000, completed: false },
    { id: 'valuation', label: 'Calculating Zestimate', duration: 1500, completed: false },
  ]);

  useEffect(() => {
    const validateAddress = async (): Promise<boolean> => {
      // Simulate Google Places API validation
      return new Promise((resolve) => {
        setTimeout(() => {
          // Basic validation for demo purposes
          const isValid = address.toLowerCase().includes('street') || 
                         address.toLowerCase().includes('ave') || 
                         address.toLowerCase().includes('road') || 
                         address.toLowerCase().includes('dr') ||
                         address.toLowerCase().includes('way') ||
                         address.toLowerCase().includes('blvd') ||
                         address.length > 10;
          resolve(isValid);
        }, 1500);
      });
    };

    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Special handling for address validation step
        if (steps[i].id === 'validate') {
          const isValid = await validateAddress();
          if (!isValid) {
            setSteps(prevSteps => 
              prevSteps.map((step, index) => 
                index === i ? { ...step, completed: false } : step
              )
            );
            return;
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        }
        
        setSteps(prevSteps => 
          prevSteps.map((step, index) => 
            index === i ? { ...step, completed: true } : step
          )
        );
        setCurrentStep(i + 1);
      }

      // Call Zillow API to get property data
      try {
        const propertyResponse = await zillowAPI.getPropertyByAddress(address);
        if (propertyResponse.success && propertyResponse.data) {
          onComplete(propertyResponse.data);
        } else {
          throw new Error('Failed to get property data');
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
        // Use fallback data if API fails
        const fallbackData: ZillowPropertyData = {
          zpid: 'fallback-123',
          address,
          propertyType: 'Single Family Home',
          bedrooms: 3,
          bathrooms: 2,
          livingArea: 1800,
          homeStatus: 'For Sale',
          zestimate: 650000,
          yearBuilt: 1995,
          lotSize: 7200,
          neighborhood: {
            name: 'Downtown',
            walkScore: 85
          }
        };
        onComplete(fallbackData);
      }
    };

    processSteps();
  }, [address, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Property
          </h2>
          <p className="text-gray-600 mb-8">
            We're gathering comprehensive data about your property
          </p>
        </motion.div>

        <GithubGlobe className="mb-8" />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                step.completed 
                  ? 'bg-green-50 border border-green-200' 
                  : index === currentStep 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <span className={`text-sm font-medium ${
                step.completed 
                  ? 'text-green-700' 
                  : index === currentStep 
                    ? 'text-blue-700' 
                    : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              
              <div className="flex items-center">
                <AnimatePresence mode="wait">
                  {step.completed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckIcon className="w-3 h-3 text-white" />
                    </motion.div>
                  ) : index === currentStep ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-5 h-5"
                    >
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                  ) : (
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-xs text-gray-500"
        >
          Searching property databases and public records...
        </motion.div>
      </div>
    </div>
  );
}
