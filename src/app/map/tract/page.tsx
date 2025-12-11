"use client";

import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface PropertyData {
  Address: string;
  "Unit #": string;
  City: string;
  State: string;
  Zip: number;
  "Carrier Route": string;
  County: string;
  coordinates?: [number, number] | null;
}

interface FormData {
  propertyAddress: string;
  sellingIntent: string;
  sellingTimeline: string;
  sellingMotivation: string;
  propertyCondition: string;
  propertyImprovements: string[];
  priceExpectation: string;
  contactMethod: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  priceUpdates: boolean;
  privacyPolicyConsent: boolean;
}

export default function TractMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-119.0);
  const [lat, setLat] = useState(34.4);
  const [zoom, setZoom] = useState(10);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  // Load property data
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        const response = await fetch('/data/farmdata-sorted.json');
        const data: PropertyData[] = await response.json();
        
        // Increase limit - you can adjust this number
        const PROPERTY_LIMIT = 500; // Increased from 100 to 500
        const limitedData = data.slice(0, PROPERTY_LIMIT);
        setTotalProperties(limitedData.length);
        
        console.log(`Loading ${limitedData.length} properties...`);
        
        // Batch geocoding to avoid rate limits
        const BATCH_SIZE = 10; // Process 10 addresses at a time
        const DELAY_MS = 100; // 100ms delay between batches
        
        const geocodedData: PropertyData[] = [];
        
        for (let i = 0; i < limitedData.length; i += BATCH_SIZE) {
          const batch = limitedData.slice(i, i + BATCH_SIZE);
          
          const batchResults = await Promise.all(
            batch.map(async (property) => {
              try {
                const fullAddress = `${property.Address}, ${property.City}, ${property.State} ${property.Zip}`;
                const coords = await geocodeAddress(fullAddress);
                return {
                  ...property,
                  coordinates: coords
                };
              } catch (error) {
                console.warn(`Failed to geocode: ${property.Address}`, error);
                return property;
              }
            })
          );
          
          geocodedData.push(...batchResults);
          
          // Update progress
          const processed = Math.min(i + BATCH_SIZE, limitedData.length);
          setLoadingProgress(processed);
          console.log(`Geocoded ${processed} of ${limitedData.length} properties`);
          
          // Add delay between batches to respect rate limits
          if (i + BATCH_SIZE < limitedData.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }
        }
        
        setProperties(geocodedData.filter(p => p.coordinates));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading property data:', error);
        setIsLoading(false);
      }
    };

    loadPropertyData();
  }, []);

  // Geocoding function
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-119.0, 34.4], // Ventura County, CA
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Update coordinates on map move
    map.current.on('move', () => {
      if (map.current) {
        setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
        setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(map.current.getZoom().toFixed(2)));
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add property markers to map
  useEffect(() => {
    if (!map.current || properties.length === 0) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each property
    properties.forEach((property) => {
      if (!property.coordinates) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'property-marker';
      el.innerHTML = `
        <div class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg cursor-pointer hover:bg-blue-700 border-2 border-white">
          📍
        </div>
      `;

      // Create popup content
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-sm mb-1">${property.Address}</h3>
          <p class="text-xs text-gray-600 mb-1">${property.City}, ${property.State} ${property.Zip}</p>
          ${property["Carrier Route"] ? `<p class="text-xs text-gray-500">Carrier Route: ${property["Carrier Route"]}</p>` : ''}
          <p class="text-xs text-gray-500">County: ${property.County}</p>
        </div>
      `;

      // Add marker to map with popup
      new mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupContent)
        )
        .addTo(map.current!);
    });

    // Fit map to show all properties
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(property => {
        if (property.coordinates) {
          bounds.extend(property.coordinates);
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
        maxZoom: 15
      });
    }
  }, [properties]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Simple Tract Map</h1>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainer} 
          className="w-full h-full"
        />
        
        {/* Map Info */}
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600">
            <div>Longitude: {lng}</div>
            <div>Latitude: {lat}</div>
            <div>Zoom: {zoom}</div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              {isLoading ? (
                <div className="text-blue-600">
                  <div>Loading properties...</div>
                  <div className="text-xs mt-1">
                    {loadingProgress} / {totalProperties} geocoded
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${totalProperties > 0 ? (loadingProgress / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>Properties: {properties.length}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}