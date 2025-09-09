# API Endpoint Testing Guide

## Step 1: Verify Environment Variable

First, check if the environment variable is properly loaded:

```bash
# Check if ZILLOW_API_KEY is set
node -e "require('dotenv').config({ path: '.env.local' }); console.log('ZILLOW_API_KEY:', process.env.ZILLOW_API_KEY ? 'SET' : 'NOT SET');"
```

## Step 2: Test Local API Endpoint

Make sure your dev server is running (`npm run dev`), then test the local API:

```bash
# Test with curl (replace localhost:3001 with your actual port)
curl -X POST http://localhost:3001/api/rental-estimate \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St, Los Angeles, CA",
    "name": "Test User",
    "email": "test@example.com"
  }'
```

## Step 3: Test Zillow API Directly

Test the Zillow API directly to see if it's working:

```bash
# Replace YOUR_API_KEY with your actual key
curl -X GET "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=123%20Main%20St%2C%20Los%20Angeles%2C%20CA" \
  -H "X-RapidAPI-Key: 5b5d239adamsh06d88e3057331eep1b7b79jsnbf056653234a" \
  -H "X-RapidAPI-Host: zillow-com1.p.rapidapi.com"
```

## Step 4: Check Server Logs

Watch your Next.js server logs for any error messages when making requests.

## Expected Responses

### Successful Local API Response:
```json
{
  "address": "123 Main St, Los Angeles, CA",
  "rentEstimate": 2500,
  "rentRangeLow": 2000,
  "rentRangeHigh": 3000,
  "confidence": "estimated",
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "source": "Zillow"
}
```

### Common Error Responses:
- `{"error":"API configuration error"}` - Environment variable not set
- `{"error":"Address, name, and email are required"}` - Missing required fields
- `{"error":"Too many requests..."}` - Rate limiting
- `{"error":"No properties found..."}` - Invalid address

## Troubleshooting

1. **Environment Variable Issues:**
   - Make sure `.env.local` contains: `ZILLOW_API_KEY=5b5d239adamsh06d88e3057331eep1b7b79jsnbf056653234a`
   - Restart your dev server after changing environment variables

2. **API Key Issues:**
   - Verify your RapidAPI subscription is active
   - Check if you've exceeded your API quota

3. **Network Issues:**
   - Test with a simple address like "Los Angeles, CA"
   - Try different addresses to see if it's address-specific
