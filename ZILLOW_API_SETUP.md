# Zillow RentEstimate API Setup Guide

This guide explains how to set up the Zillow RentEstimate API integration via RapidAPI for the property management pricing calculator.

## Prerequisites

1. **RapidAPI Account**: Sign up at [RapidAPI](https://rapidapi.com/)
2. **Zillow API Subscription**: Subscribe to the [Zillow API on RapidAPI](https://rapidapi.com/apimaker/api/zillow-com1)

## Setup Steps

### 1. Get Your RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/) and sign up/log in
2. Navigate to the [Zillow API](https://rapidapi.com/apimaker/api/zillow-com1)
3. Subscribe to a plan (they usually have free tiers available)
4. Copy your RapidAPI key from the API dashboard

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your RapidAPI key to `.env.local`:
   ```
   RAPIDAPI_KEY=your_actual_rapidapi_key_here
   ```

### 3. Test the Integration

Run the test script to verify everything is working:

```bash
node test-rental-estimate-api.js
```

This will test both the direct RapidAPI connection and your local API endpoint.

## API Endpoints Used

### RentEstimate Endpoint
- **URL**: `https://zillow-com1.p.rapidapi.com/rentEstimate`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `X-RapidAPI-Key: YOUR_KEY`
  - `X-RapidAPI-Host: zillow-com1.p.rapidapi.com`
- **Body**:
  ```json
  {
    "address": "123 Main St, City, State 12345"
  }
  ```

## Local API Route

The local API route is located at `/src/app/api/rental-estimate/route.ts` and handles:

- Input validation (address, name, email)
- Email format validation
- RapidAPI key verification
- Zillow API integration
- Error handling and logging
- Response formatting

## Response Format

The API returns rental estimate data in this format:

```json
{
  "address": "123 Main St, City, State 12345",
  "rentEstimate": 2500,
  "rentRangeLow": 2200,
  "rentRangeHigh": 2800,
  "confidence": "medium",
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "source": "Zillow"
}
```

## Frontend Integration

The pricing calculator in `/src/app/property-management/page.tsx` includes:

1. **Multi-step form**:
   - Step 1: Address input
   - Step 2: Contact information (name + email with validation)
   - Step 3: Results display with gauge chart

2. **Features**:
   - Email validation using regex
   - Loading states during API calls
   - Error handling with user-friendly messages
   - Manual rent entry fallback
   - Gauge chart visualization using `react-gauge-chart`
   - Management fee calculation (7% of monthly rent)

## Troubleshooting

### Common Issues

1. **"API configuration error"**
   - Make sure `RAPIDAPI_KEY` is set in `.env.local`
   - Restart your development server after adding the key

2. **"Failed to get rental estimate from Zillow"**
   - Check your RapidAPI subscription status
   - Verify the API endpoint is correct
   - Check if you've exceeded your API quota

3. **"Invalid email format"**
   - The email validation uses regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Make sure the email follows standard format

### Testing

1. **Test RapidAPI connection directly**:
   ```bash
   node test-rental-estimate-api.js
   ```

2. **Test local development server**:
   ```bash
   npm run dev
   ```
   Then visit `http://localhost:3000/property-management` and use the pricing calculator.

3. **Check API logs**:
   - Open browser developer tools
   - Check the Network tab for API requests
   - Check the Console for any JavaScript errors

## Security Notes

- Never commit your `.env.local` file to version control
- The RapidAPI key is stored server-side only (not exposed to the frontend)
- User email addresses are validated but not stored (add database integration if needed)
- API requests are logged for analytics but don't include sensitive data

## Cost Considerations

- Check your RapidAPI plan limits
- Monitor API usage to avoid unexpected charges
- Consider implementing caching for frequently requested addresses
- Add rate limiting if needed for production use

## Next Steps

1. Set up your RapidAPI account and get your key
2. Configure the environment variables
3. Test the integration
4. Deploy to production with proper environment variable configuration
