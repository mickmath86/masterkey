// Test script for the Zillow property API endpoint
const testZillowProperty = async () => {
  const testCases = [
    {
      name: 'Test with address',
      data: { address: '3332 Mountain Trail Ave Newbury Park CA 91320' }
    },
    {
      name: 'Test with zpid',
      data: { zpid: '16470107' }
    },
    {
      name: 'Test with both address and zpid',
      data: { 
        address: '3332 Mountain Trail Ave Newbury Park CA 91320',
        zpid: '16470107'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${testCase.name}`);
    console.log(`Data:`, testCase.data);
    console.log('='.repeat(60));

    try {
      const response = await fetch('http://localhost:3000/api/zillow/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      });

      console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ SUCCESS');
        console.log('API Response Status:', result.apiResponse.status);
        console.log('Request Params:', result.requestParams);
        
        if (result.data) {
          console.log('\n--- Property Data ---');
          if (typeof result.data === 'object') {
            console.log('Property Keys:', Object.keys(result.data));
            // Show some key fields if they exist
            const keyFields = ['zpid', 'address', 'price', 'bedrooms', 'bathrooms', 'livingArea'];
            keyFields.forEach(field => {
              if (result.data[field] !== undefined) {
                console.log(`${field}:`, result.data[field]);
              }
            });
          } else {
            console.log('Data:', result.data);
          }
        }
      } else {
        console.log('❌ FAILED');
        console.log('Error:', result.error);
        if (result.details) {
          console.log('Details:', result.details);
        }
        if (result.requestUrl) {
          console.log('Request URL:', result.requestUrl);
        }
      }

    } catch (error) {
      console.log('❌ REQUEST FAILED');
      console.error('Error:', error.message);
    }
  }
};

// Test GET endpoint as well
const testGetEndpoint = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('Testing GET endpoint with query parameters');
  console.log('='.repeat(60));

  try {
    const response = await fetch('http://localhost:3000/api/zillow/property?address=1600%20Amphitheatre%20Parkway,%20Mountain%20View,%20CA');
    const result = await response.json();
    
    console.log(`Response Status: ${response.status}`);
    console.log('Success:', result.success);
    
    if (result.error) {
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('GET test failed:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting Zillow Property API Tests...\n');
  
  // Test POST endpoints
  await testZillowProperty();
  
  // Test GET endpoint
  await testGetEndpoint();
  
  console.log('\n✨ All tests completed!');
};

runAllTests();
