// Google Maps and Places API integration
export interface PlaceDetails {
  address: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeId: string;
}

export class GoogleMapsAPI {
  public apiKey: string;
  private placesService: google.maps.places.PlacesService | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Load Google Maps JavaScript API
  async loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      
      document.head.appendChild(script);
    });
  }

  // Validate and get place details from address using Geocoding API
  async validateAddress(address: string): Promise<PlaceDetails | null> {
    try {
      await this.loadGoogleMapsAPI();

      return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const result = results[0];
            const location = result.geometry?.location;
            
            if (!location) {
              resolve(null);
              return;
            }

            // Parse address components
            let city = '';
            let state = '';
            let zipCode = '';
            let country = 'USA';

            if (result.address_components) {
              result.address_components.forEach((component) => {
                const types = component.types;
                if (types.includes('locality')) {
                  city = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                  state = component.short_name;
                } else if (types.includes('postal_code')) {
                  zipCode = component.long_name;
                } else if (types.includes('country')) {
                  country = component.long_name;
                }
              });
            }

            resolve({
              address,
              formattedAddress: result.formatted_address || address,
              lat: location.lat(),
              lng: location.lng(),
              placeId: result.place_id || '',
              city,
              state,
              zipCode,
              country,
            });
          } else {
            console.warn('Geocoding failed:', status);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error validating address:', error);
      return null;
    }
  }

  // Create map configuration for a given location
  createMapConfig(lat: number, lng: number, zoom: number = 15): MapConfig {
    return {
      center: { lat, lng },
      zoom,
      mapTypeId: 'roadmap',
    };
  }

  // Initialize map in a container element
  async initializeMap(
    container: HTMLElement,
    config: MapConfig,
    markerOptions?: { title?: string; icon?: string }
  ): Promise<google.maps.Map> {
    await this.loadGoogleMapsAPI();

    const map = new google.maps.Map(container, {
      center: config.center,
      zoom: config.zoom,
      mapTypeId: config.mapTypeId as google.maps.MapTypeId,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    // Add marker for the property
    new google.maps.Marker({
      position: config.center,
      map,
      title: markerOptions?.title || 'Property Location',
      icon: markerOptions?.icon,
    });

    return map;
  }
}

// Singleton instance
let googleMapsAPI: GoogleMapsAPI | null = null;

export function getGoogleMapsAPI(): GoogleMapsAPI {
  if (!googleMapsAPI) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable is not set');
    }
    googleMapsAPI = new GoogleMapsAPI(apiKey);
  }
  return googleMapsAPI;
}
