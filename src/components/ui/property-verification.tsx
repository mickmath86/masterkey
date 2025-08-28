"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/button';
import { CheckIcon, XMarkIcon, HomeIcon, MapPinIcon } from '@heroicons/react/24/solid';

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

interface PropertyVerificationProps {
  propertyData: PropertyData;
  onConfirm: () => void;
  onEdit: () => void;
}

export function PropertyVerification({ propertyData, onConfirm, onEdit }: PropertyVerificationProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <HomeIcon className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Property Verification</h2>
          </div>
          <p className="text-blue-100">
            Please confirm the details we found for your property
          </p>
        </div>

        {/* Property Details */}
        <div className="p-6">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Property Address</h3>
            </div>
            <p className="text-lg text-gray-800">{propertyData.address}</p>
            <p className="text-sm text-gray-600 mt-1">{propertyData.neighborhood?.name || 'N/A'}</p>
          </motion.div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Property Type</h4>
                <p className="text-gray-900">{propertyData.propertyType}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Bedrooms & Bathrooms</h4>
                <p className="text-gray-900">{propertyData.bedrooms} bed, {propertyData.bathrooms} bath</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Living Area</h4>
                <p className="text-gray-900">{propertyData.livingArea} sq ft</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Year Built</h4>
                <p className="text-gray-900">{propertyData.yearBuilt || 'N/A'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Lot Size</h4>
                <p className="text-gray-900">{propertyData.lotSize ? `${propertyData.lotSize} sq ft` : 'N/A'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Home Status</h4>
                <p className="text-gray-900">{propertyData.homeStatus}</p>
              </div>
            </motion.div>
          </div>

          {/* Valuation Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <h4 className="font-semibold text-green-800 mb-3">Estimated Market Value</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-600">Current Estimate</p>
                <p className="text-2xl font-bold text-green-800">
                  ${(propertyData.zestimate || propertyData.price || 0).toLocaleString()}
                </p>
              </div>
              {propertyData.priceHistory && propertyData.priceHistory.length > 0 && (
                <div>
                  <p className="text-sm text-green-600">Last Sale ({propertyData.priceHistory[0].date})</p>
                  <p className="text-lg font-semibold text-green-700">
                    ${propertyData.priceHistory[0].price.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Confirmation Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <p className="text-yellow-800 text-sm">
              <strong>Is this information correct?</strong> If any details seem inaccurate, 
              please click "Edit Details" to make corrections. Otherwise, confirm to continue 
              with your property evaluation.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={onConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-5 h-5" />
              Yes, This is Correct
            </Button>
            
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              Edit Details
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
