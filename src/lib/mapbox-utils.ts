import mapboxgl from 'mapbox-gl';

// FormData interface for type safety
interface FormData {
  propertyAddress: string;
  sellingIntent: string;
  sellingTimeline: string;
  sellingMotivation: string;
  propertyCondition: string;
  propertyImprovements: string[];
  improvementDetails: Array<{
    improvement: string;
    yearsAgo?: number;
    cost?: number;
  }>;
  priceExpectation: string;
  contactMethod: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  priceUpdates: boolean;
  privacyPolicyConsent: boolean;
}

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

/**
 * Geocode an address using Mapbox Geocoding API
 * @param address - The address to geocode
 * @returns Promise<[longitude, latitude] | null>
 */
export const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
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

/**
 * Create a FormData marker on a Mapbox map
 * @param map - Mapbox map instance
 * @param formData - FormData object containing address and contact info
 * @returns Promise<mapboxgl.Marker | null>
 */
export const createFormDataMarker = async (
  map: mapboxgl.Map, 
  formData: FormData
): Promise<mapboxgl.Marker | null> => {
  if (!formData.propertyAddress || !map) return null;

  try {
    const coordinates = await geocodeAddress(formData.propertyAddress);
    if (!coordinates) return null;

    // Create marker element
    const el = document.createElement('div');
    el.className = 'formdata-marker';
    el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjMTBCOTgxIi8+Cjwvc3ZnPgo=)';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundSize = '100%';
    el.style.border = '3px solid #10B981';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = 'white';
    el.style.cursor = 'pointer';

    // Create popup content
    const popupContent = `
      <div class="p-3">
        <h3 class="font-semibold text-green-600">FormData Address</h3>
        <p class="text-sm">${formData.propertyAddress}</p>
        <p class="text-xs text-gray-500 mt-1">Contact: ${formData.firstName} ${formData.lastName}</p>
        <div class="text-xs text-gray-400 mt-2">
          <div>Email: ${formData.email}</div>
          <div>Phone: ${formData.phone}</div>
          <div>Intent: ${formData.sellingIntent}</div>
          <div>Timeline: ${formData.sellingTimeline}</div>
        </div>
      </div>
    `;

    // Create and return marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(popupContent))
      .addTo(map);

    return marker;
  } catch (error) {
    console.error('Error creating FormData marker:', error);
    return null;
  }
};

/**
 * Center map on FormData address
 * @param map - Mapbox map instance
 * @param formData - FormData object containing address
 * @param zoom - Optional zoom level (default: 16)
 * @returns Promise<boolean> - Success status
 */
export const centerMapOnFormData = async (
  map: mapboxgl.Map, 
  formData: FormData, 
  zoom: number = 16
): Promise<boolean> => {
  if (!formData.propertyAddress || !map) return false;

  try {
    const coordinates = await geocodeAddress(formData.propertyAddress);
    if (!coordinates) return false;

    map.flyTo({
      center: coordinates,
      zoom: zoom,
      duration: 2000
    });

    return true;
  } catch (error) {
    console.error('Error centering map on FormData:', error);
    return false;
  }
};

/**
 * Filter properties by carrier route
 * @param properties - Array of property data
 * @param carrierRoute - Carrier route to filter by (empty string for all)
 * @returns Filtered properties array
 */
export const filterPropertiesByCarrierRoute = <T extends { "Carrier Route": string }>(
  properties: T[], 
  carrierRoute: string
): T[] => {
  if (!carrierRoute) return properties;
  return properties.filter(property => property["Carrier Route"] === carrierRoute);
};

/**
 * Get unique carrier routes from properties data
 * @param properties - Array of property data
 * @returns Sorted array of unique carrier routes
 */
export const getUniqueCarrierRoutes = <T extends { "Carrier Route": string }>(
  properties: T[]
): string[] => {
  return [...new Set(properties.map(p => p["Carrier Route"]).filter(Boolean))].sort();
};

/**
 * Create a standard property marker
 * @param map - Mapbox map instance
 * @param property - Property data object
 * @param onClick - Optional click handler
 * @returns mapboxgl.Marker
 */
export const createPropertyMarker = (
  map: mapboxgl.Map,
  property: any,
  onClick?: (property: any) => void
): mapboxgl.Marker | null => {
  if (!property.coordinates) return null;

  const el = document.createElement('div');
  el.className = 'property-marker';
  el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjRUY0NDQ0Ii8+Cjwvc3ZnPgo=)';
  el.style.width = '24px';
  el.style.height = '24px';
  el.style.backgroundSize = '100%';
  el.style.cursor = 'pointer';

  // Add click handler if provided
  if (onClick) {
    el.addEventListener('click', () => onClick(property));
  }

  // Create hover popup
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  el.addEventListener('mouseenter', () => {
    popup
      .setLngLat(property.coordinates)
      .setHTML(`
        <div class="p-2">
          <h3 class="font-semibold">${property.Address}</h3>
          <p class="text-sm text-gray-600">${property.City}, ${property.State} ${property.Zip}</p>
          <p class="text-sm">Carrier Route: ${property["Carrier Route"] || 'N/A'}</p>
        </div>
      `)
      .addTo(map);
  });

  el.addEventListener('mouseleave', () => {
    popup.remove();
  });

  return new mapboxgl.Marker(el)
    .setLngLat(property.coordinates)
    .addTo(map);
};

/**
 * Batch geocode addresses with rate limiting
 * @param addresses - Array of addresses to geocode
 * @param batchSize - Number of addresses to process at once (default: 10)
 * @param delay - Delay between batches in ms (default: 1000)
 * @returns Promise<Array<[number, number] | null>>
 */
export const batchGeocodeAddresses = async (
  addresses: string[],
  batchSize: number = 10,
  delay: number = 1000
): Promise<Array<[number, number] | null>> => {
  const results: Array<[number, number] | null> = [];
  
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(address => geocodeAddress(address))
    );
    results.push(...batchResults);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < addresses.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
};

export type { FormData };
