# Google Maps API Setup Guide

## Overview
The MasterKey real estate platform now includes Google Maps Places API integration for property location validation in the sell property quiz. This ensures accurate address entry and validation.

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** and **Maps JavaScript API**
4. Go to **Credentials** and create an API key
5. Restrict the API key for security:
   - **Application restrictions**: HTTP referrers (web sites)
   - **Website restrictions**: Add your domain(s)
   - **API restrictions**: Restrict to Places API and Maps JavaScript API

### 2. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Add your Google Maps API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 3. Features Implemented

#### GooglePlacesInput Component
- **Location**: `/src/components/ui/google-places-input.tsx`
- **Features**:
  - Real-time address autocomplete
  - Address validation (requires street number)
  - US-only address restriction
  - Error handling and user feedback
  - Place details extraction (coordinates, place ID, address components)

#### Integration Points
- **Sell Property Quiz**: First step now uses Google Places autocomplete
- **Property Details**: Captures place ID, coordinates, and address components
- **Validation**: Ensures complete street addresses with house numbers

### 4. Usage Example
```tsx
import { GooglePlacesInput } from '@/components/ui/google-places-input';

function MyComponent() {
  const [address, setAddress] = useState('');
  const [placeDetails, setPlaceDetails] = useState(null);

  const handleLocationChange = (address, placeDetails) => {
    setAddress(address);
    setPlaceDetails(placeDetails);
  };

  return (
    <GooglePlacesInput
      value={address}
      onChange={handleLocationChange}
      placeholder="Enter property address"
    />
  );
}
```

### 5. Security Best Practices
- ✅ API key is restricted to specific domains
- ✅ API key is restricted to specific Google APIs
- ✅ Environment variable is prefixed with `NEXT_PUBLIC_` for client-side access
- ✅ Address validation prevents incomplete entries

### 6. Cost Considerations
- **Places Autocomplete**: $2.83 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- Consider implementing request caching for production use
- Monitor usage in Google Cloud Console

### 7. Fallback Behavior
- If Google Maps fails to load, the component gracefully falls back to a regular text input
- Users can still enter addresses manually if needed
- Error messages guide users to enter complete addresses

## Testing
1. Start the development server: `npm run dev`
2. Navigate to the sell property quiz
3. Test address autocomplete functionality
4. Verify address validation works correctly
