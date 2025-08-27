"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { GithubGlobe } from './github-globe';

interface LookupStep {
  id: string;
  label: string;
  duration: number;
  completed: boolean;
}

interface PropertyLookupProps {
  address: string;
  onComplete: (propertyData: any) => void;
}

export function PropertyLookup({ address, onComplete }: PropertyLookupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<LookupStep[]>([
    { id: 'address', label: 'Confirming address', duration: 2000, completed: false },
    { id: 'property', label: 'Getting property details', duration: 2500, completed: false },
    { id: 'bedrooms', label: 'Analyzing bed & bath count', duration: 2000, completed: false },
    { id: 'valuation', label: 'Calculating property value', duration: 3000, completed: false },
  ]);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        
        setSteps(prevSteps => 
          prevSteps.map((step, index) => 
            index === i ? { ...step, completed: true } : step
          )
        );
        
        setCurrentStep(i + 1);
      }

      // Simulate property data retrieval
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock property data - in real implementation, this would come from API
      const mockPropertyData = {
        address: address,
        propertyType: 'Single Family Home',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: '1,850',
        yearBuilt: 1995,
        lotSize: '0.25 acres',
        estimatedValue: '$485,000',
        lastSaleDate: '2018',
        lastSalePrice: '$425,000',
        propertyTax: '$4,200/year',
        neighborhood: 'Maple Heights',
      };

      onComplete(mockPropertyData);
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
