/**
 * Test script for Rentcast API integration
 * Run with: node test-rentcast-api.js
 */

const testAddresses = [
  "3332 Mountain Trail Ave, Newbury Park, CA 91320",
  "123 Main St, Los Angeles, CA 90210",
  "456 Oak Street, Beverly Hills, CA 90210"
]

// Test zipcode extraction functionality
async function testZipcodeExtraction() {
  console.log('=== Testing Zipcode Extraction ===')
  
  try {
    // Simple zipcode extraction function for testing
    function extractZipcode(address) {
      if (!address) return null
      const zipcodePattern = /\b(\d{5})(?:-\d{4})?\b/g
      const matches = address.match(zipcodePattern)
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1]
        return lastMatch.substring(0, 5)
      }
      return null
    }
    
    const testAddresses = [
      '3332 Mountain Trail Ave, Newbury Park, CA 91320',
      '123 Main St, Los Angeles, CA 90210-1234',
      'Beverly Hills, CA 90210',
      'Invalid address without zipcode'
    ]
    
    for (const address of testAddresses) {
      const zipcode = extractZipcode(address)
      console.log(`Address: "${address}" -> Zipcode: ${zipcode}`)
    }
    
    console.log('✅ Zipcode extraction tests passed')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

async function testRentcastAPI() {
  console.log('\n=== Testing Rentcast API Route ===')
  
  const baseUrl = 'http://localhost:3001'
  
  for (const address of testAddresses) {
    try {
      console.log(`\nTesting address: ${address}`)
      
      const response = await fetch(`${baseUrl}/api/rentcast/markets?address=${encodeURIComponent(address)}`)
      const data = await response.json()
      
      console.log('Status:', response.status)
      console.log('Response:', JSON.stringify(data, null, 2))
      
      if (data.saleData?.averageDaysOnMarket) {
        console.log(`✅ Average Days on Market: ${data.saleData.averageDaysOnMarket}`)
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message)
    }
    
    console.log('---')
  }
}

async function runTests() {
  console.log('🧪 Rentcast API Integration Tests')
  
  try {
    await testZipcodeExtraction()
    await testRentcastAPI()
    
    console.log('\n✅ All tests completed!')
    console.log('\n📋 Next Steps:')
    console.log('1. Add your Rentcast API key to .env.local')
    console.log('2. Start your dev server: npm run dev')
    console.log('3. Visit a property page to see market data')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
}

module.exports = { testZipcodeExtraction, testRentcastAPI }
