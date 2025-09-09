// Test script for Zillow RentEstimate API via RapidAPI
require('dotenv').config({ path: '.env.local' });

async function testRentalEstimateAPI() {
  const rapidApiKey = process.env.ZILLOW_API_KEY;
  
  console.log('Testing Zillow RentEstimate API via RapidAPI...');
  console.log('RapidAPI Key present:', !!rapidApiKey);
  
  if (!rapidApiKey) {
    console.error('❌ ZILLOW_API_KEY not found in environment variables');
    console.log('Please add ZILLOW_API_KEY=your_key_here to your .env.local file');
    return;
  }

  // Test addresses
  const testAddresses = [
    '3332 Mountain Trail Ave, Newbury Park, CA 91320',
    '1600 Amphitheatre Parkway, Mountain View, CA',
    '123 Main St, Los Angeles, CA 90210'
  ];

  for (const testAddress of testAddresses) {
    console.log(`\n🏠 Testing rental estimate for: ${testAddress}`);
    
    try {
      const response = await fetch('https://zillow-com1.p.rapidapi.com/rentEstimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        },
        body: JSON.stringify({
          address: testAddress
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        continue;
      }

      const data = await response.json();
      console.log('✅ API Response received');
      console.log('Response structure:', Object.keys(data));
      console.log('Full response:', JSON.stringify(data, null, 2));

      // Extract rental estimate data
      const rentalEstimate = {
        address: testAddress,
        rentEstimate: data.rentEstimate || data.rent_estimate || data.estimate,
        rentRangeLow: data.rentRangeLow || data.rent_range_low || data.low_estimate,
        rentRangeHigh: data.rentRangeHigh || data.rent_range_high || data.high_estimate,
        confidence: data.confidence || 'medium',
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        source: 'Zillow'
      };

      console.log('📊 Processed rental estimate:', rentalEstimate);

    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
  }
}

// Test the local API endpoint
async function testLocalAPI() {
  console.log('\n🔧 Testing local API endpoint...');
  
  const testData = {
    address: '3332 Mountain Trail Ave, Newbury Park, CA 91320',
    name: 'Test User',
    email: 'test@example.com'
  };

  try {
    const response = await fetch('http://localhost:3000/api/rental-estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Local API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Local API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Local API Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Local API request failed:', error.message);
    console.log('Make sure the Next.js development server is running (npm run dev)');
  }
}

async function runTests() {
  await testRentalEstimateAPI();
  await testLocalAPI();
}

runTests();
