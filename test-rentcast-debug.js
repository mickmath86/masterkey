/**
 * Debug script to test Rentcast API directly
 */

const testRentcastAPI = async () => {
  // Get API key from environment
  const apiKey = process.env.RENTCAST_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RENTCAST_API_KEY not found in environment');
    return;
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 8) + '...');
  
  // Test different endpoint variations
  const baseUrls = [
    'https://api.rentcast.io/v1',
    'https://api.rentcast.io',
    'https://rentcast.io/api/v1'
  ];
  
  const zipCode = '91320';
  
  for (const baseUrl of baseUrls) {
    console.log(`\n🔍 Testing base URL: ${baseUrl}`);
    
    // Test different endpoint paths
    const endpoints = [
      '/markets',
      '/market-statistics',
      '/market/statistics',
      '/markets/statistics'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const url = `${baseUrl}${endpoint}`;
        const params = new URLSearchParams({
          zipCode,
          dataType: 'All',
          historyRange: '6'
        });
        
        console.log(`  📡 Testing: ${url}?${params}`);
        
        const response = await fetch(`${url}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Api-Key': apiKey,
          },
        });
        
        console.log(`  📊 Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('  ✅ SUCCESS! Data received:', JSON.stringify(data, null, 2));
          return; // Exit on first success
        } else {
          const errorText = await response.text();
          console.log(`  ❌ Error response:`, errorText.substring(0, 200));
        }
        
      } catch (error) {
        console.log(`  💥 Request failed:`, error.message);
      }
    }
  }
  
  // Test with different parameter formats
  console.log('\n🔧 Testing alternative parameter formats...');
  
  const altParams = [
    { zip: zipCode },
    { zipcode: zipCode },
    { postal_code: zipCode },
    { zip_code: zipCode }
  ];
  
  for (const params of altParams) {
    try {
      const url = 'https://api.rentcast.io/v1/markets';
      const queryParams = new URLSearchParams(params);
      
      console.log(`  📡 Testing params: ${JSON.stringify(params)}`);
      
      const response = await fetch(`${url}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': apiKey,
        },
      });
      
      console.log(`  📊 Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('  ✅ SUCCESS with alternative params!');
        console.log('  📄 Data:', JSON.stringify(data, null, 2));
        return;
      }
      
    } catch (error) {
      console.log(`  💥 Failed:`, error.message);
    }
  }
  
  console.log('\n❌ All tests failed. Check Rentcast API documentation for correct endpoint and parameters.');
};

// Run the test
testRentcastAPI().catch(console.error);
