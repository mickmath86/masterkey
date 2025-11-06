"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GooglePlacesInputProps {
  value: string;
  onChange: (value: string, placeDetails?: google.maps.places.PlaceResult) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  types?: string[]; // Add types prop for customization
  showValidation?: boolean; // Add prop to control validation display
}

interface PlaceDetails {
  formatted_address: string;
  place_id: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  address_components?: google.maps.GeocoderAddressComponent[];
}

export function GooglePlacesInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter property address",
  className = "",
  id = "places-input",
  types = ['address'], // Default to address, but allow override
  showValidation = true // Default to showing validation
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        // You'll need to replace this with your actual Google Maps API key
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (inputRef.current) {
          // Initialize legacy Autocomplete API (keeping it simple for now)
          // Note: Google deprecated the old API but it still works
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: types, // Use configurable types
              componentRestrictions: { country: 'us' }, // Restrict to US addresses
              fields: [
                'formatted_address',
                'place_id',
                'geometry',
                'address_components',
                'name'
              ]
            }
          );

          // Listen for place selection
          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            
            if (place && place.formatted_address) {
              // Only validate street number for address types
              if (types.includes('address')) {
                const hasStreetNumber = place.address_components?.some(
                  component => component.types.includes('street_number')
                );
                
                if (!hasStreetNumber) {
                  setError('Please enter a complete street address including house number');
                  setIsValidated(false);
                  onValidationChange?.(false);
                  return;
                }
              }

              setError('');
              setIsValidated(true);
              onValidationChange?.(true);
              onChange(place.formatted_address, place);
            } else {
              setError('Please select a valid location from the suggestions');
              setIsValidated(false);
              onValidationChange?.(false);
            }
          });

          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Unable to load address validation. Please enter address manually.');
        setIsLoaded(true);
      }
    };

    initializeAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear error and validation when user starts typing
    if (error) {
      setError('');
    }
    setIsValidated(false);
    onValidationChange?.(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission on Enter if autocomplete dropdown is open
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={isLoaded ? placeholder : "Loading address validation..."}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        disabled={!isLoaded}
      />
      
      {showValidation && error && (
        <div className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {showValidation && isLoaded && !error && isValidated && (
        <div className="mt-1 text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Address validated
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Start typing your property address for suggestions
      </div>
    </div>
  );
}
