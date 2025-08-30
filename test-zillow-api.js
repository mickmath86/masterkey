// Test script for RapidAPI Zillow integration
require('dotenv').config({ path: '.env.local' });

async function testZillowAPI() {
  const apiKey = process.env.NEXT_PUBLIC_ZILLOW_API_KEY;
  const host = process.env.ZILLOW_API_HOST || 'zillow-com1.p.rapidapi.com';
  
  console.log('Testing RapidAPI Zillow integration...');
  console.log('API Key present:', !!apiKey);
  console.log('Host:', host);
  
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_ZILLOW_API_KEY not found in environment');
    return;
  }

  // Test with different address formats
  const testAddresses = [
    '3332 Mountain Trail Ave, Newbury Park, CA 91320',
    '1600 Amphitheatre Parkway, Mountain View, CA',
    'Los Angeles, CA',
    '90210'
  ];

  for (const testAddress of testAddresses) {
    console.log(`\n🏠 Testing address: ${testAddress}`);
    
    const url = new URL('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch');
    url.searchParams.append('location', testAddress);
    // Remove status_type to get all properties
    // url.searchParams.append('status_type', 'ForSale');

    try {
    console.log('\n🔍 Testing endpoint:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
        'Content-Type': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log('\n✅ API Response received');
    console.log('Response structure:', {
      hasProps: !!data.props,
      propsLength: data.props?.length || 0,
      keys: Object.keys(data)
    });

    if (data.props && data.props.length > 0) {
      const property = data.props[0];
      console.log('\n📋 First property data:');
      console.log('Keys:', Object.keys(property));
      console.log('Sample data:', {
        zpid: property.zpid,
        address: property.address,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        homeStatus: property.homeStatus,
        livingArea: property.livingArea
      });
    } else {
      console.log('❌ No properties found in response');
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}
}

testZillowAPI();
