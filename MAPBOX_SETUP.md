# Mapbox Integration Setup

This document explains how to set up the Mapbox integration for the tract property map.

## Environment Variables Required

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Getting a Mapbox Access Token

1. **Create a Mapbox Account**
   - Go to [https://www.mapbox.com/](https://www.mapbox.com/)
   - Sign up for a free account

2. **Get Your Access Token**
   - After signing up, go to your [Account page](https://account.mapbox.com/)
   - Copy your "Default public token" or create a new one
   - The token should start with `pk.`

3. **Add Token to Environment**
   - Create or update `.env.local` in your project root
   - Add: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here`
   - Restart your development server

## Features Included

### 🗺️ **Interactive Map**
- Full-screen Mapbox map with street view
- Pan, zoom, and navigate functionality
- Real-time coordinate and zoom display

### 📍 **Property Markers**
- Red markers for properties from farmdata-sorted.json
- Hover popups with property details
- Click to view full property information in sidebar

### 🔍 **Address Search**
- Search any address and center map on location
- Blue search markers for searched addresses
- Geocoding powered by Mapbox API

### 🚚 **Carrier Route Filtering**
- Filter properties by carrier route
- Dropdown with all available routes from data
- Real-time filtering updates markers

### 📋 **FormData Integration**
- Pin addresses from questionnaire FormData
- Green markers with special styling for FormData addresses
- Automatic centering and popup with contact information
- Integration with other parts of the application

### 📊 **Property Details Sidebar**
- Click any property marker to view details
- Property information: address, bedrooms, bathrooms, sqft
- Owner information and assessed values
- Carrier route and tract information

## Usage Examples

### Basic Usage
```typescript
// Navigate to /map/tract
// Map loads with properties from farmdata-sorted.json
// Use search and filters to explore data
```

### Integration with FormData
```typescript
import MapIntegrationExample from '@/components/MapIntegrationExample';

// In your component
<MapIntegrationExample formData={yourFormData} />
```

### Using Utility Functions
```typescript
import { geocodeAddress, createFormDataMarker } from '@/lib/mapbox-utils';

// Geocode an address
const coords = await geocodeAddress("123 Main St, City, State");

// Create a FormData marker
const marker = await createFormDataMarker(map, formData);
```

## File Structure

```
src/
├── app/map/tract/page.tsx          # Main map page component
├── lib/mapbox-utils.ts             # Utility functions for Mapbox
├── components/
│   └── MapIntegrationExample.tsx   # Integration component for other pages
└── public/data/
    └── farmdata-sorted.json        # Property data source
```

## API Usage

The integration uses the following Mapbox APIs:
- **Maps API**: For displaying the interactive map
- **Geocoding API**: For address search and FormData pinpointing

## Rate Limits

Mapbox free tier includes:
- 50,000 map loads per month
- 100,000 geocoding requests per month

For production use, monitor usage in your Mapbox dashboard.

## Troubleshooting

### Map Not Loading
- Check that `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set correctly
- Verify the token starts with `pk.`
- Restart your development server after adding the token

### Geocoding Not Working
- Ensure your Mapbox token has geocoding permissions
- Check browser console for API errors
- Verify addresses are properly formatted

### Properties Not Showing
- Check that `/public/data/farmdata-sorted.json` exists
- Verify the JSON structure matches the PropertyData interface
- Check browser console for loading errors

## Security Notes

- The `NEXT_PUBLIC_` prefix makes this token visible to browsers
- Use Mapbox's URL restrictions to limit token usage to your domain
- For production, restrict the token to your specific domain(s)
- Monitor usage in Mapbox dashboard to prevent unexpected charges
