// Test script for the property submission API endpoint
const testPropertySubmission = async () => {
  const testData = {
    propertyAddress: '123 Main Street, San Francisco, CA 94102',
    sellingIntent: 'I am looking to sell my property',
    sellingTimeline: 'Within 3 months',
    sellingMotivation: 'Upgrading to a larger home',
    propertyCondition: 'Good - Minor updates needed',
    priceExpectation: 'Maximum market value',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    submittedAt: new Date().toISOString(),
    formType: 'real-estate-sell',
    source: 'questionnaire'
  };

  try {
    console.log('Testing property submission API...');
    console.log('Test data:', testData);

    const response = await fetch('http://localhost:3000/api/property-submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('\n--- API Response ---');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.propertyData) {
      console.log('\n--- Property Data from Zillow ---');
      console.log(JSON.stringify(result.propertyData, null, 2));
    }

    if (result.error) {
      console.log('Error:', result.error);
    }

    console.log('Redirect URL:', result.redirectUrl);

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Test the GET endpoint first
const testGetEndpoint = async () => {
  try {
    console.log('Testing GET endpoint...');
    const response = await fetch('http://localhost:3000/api/property-submission');
    const result = await response.json();
    console.log('GET response:', result);
  } catch (error) {
    console.error('GET test failed:', error);
  }
};

// Run tests
const runTests = async () => {
  await testGetEndpoint();
  console.log('\n' + '='.repeat(50) + '\n');
  await testPropertySubmission();
};

runTests();
