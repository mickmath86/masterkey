"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ExternalLink } from 'lucide-react';
import { type FormData } from '@/lib/mapbox-utils';

interface MapIntegrationExampleProps {
  formData: FormData;
}

/**
 * Example component showing how to integrate FormData with the tract map
 * This can be used in other parts of the application to link to the map
 */
export default function MapIntegrationExample({ formData }: MapIntegrationExampleProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewOnMap = () => {
    setIsNavigating(true);
    
    // Store FormData in sessionStorage to pass to map page
    sessionStorage.setItem('mapFormData', JSON.stringify(formData));
    
    // Navigate to map page
    router.push('/map/tract');
  };

  const handleViewWithCarrierRoute = () => {
    setIsNavigating(true);
    
    // Store FormData and set carrier route filter
    sessionStorage.setItem('mapFormData', JSON.stringify(formData));
    
    // You could extract carrier route from address or property data
    // For now, navigate to map and let user filter
    router.push('/map/tract');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">View Property on Map</h3>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <p className="font-medium">{formData.propertyAddress}</p>
          <p>Contact: {formData.firstName} {formData.lastName}</p>
          <p>Intent: {formData.sellingIntent} • Timeline: {formData.sellingTimeline}</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleViewOnMap}
            disabled={isNavigating}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isNavigating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                View on Map
              </>
            )}
          </button>
          
          <button
            onClick={handleViewWithCarrierRoute}
            disabled={isNavigating}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Filter Area
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to retrieve FormData from sessionStorage on map page
 * Use this in the map component to automatically pin addresses from other pages
 */
export const useMapFormData = (): FormData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem('mapFormData');
    if (stored) {
      // Clear after reading to prevent stale data
      sessionStorage.removeItem('mapFormData');
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading FormData from sessionStorage:', error);
  }
  
  return null;
};
