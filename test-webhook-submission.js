#!/usr/bin/env node

/**
 * Test script to submit mock data to Zapier webhook
 * Usage: node test-webhook-submission.js
 */

// Mock form data (what would come from the questionnaire)
const mockFormData = {
  propertyAddress: "123 Main Street, Beverly Hills, CA 90210, USA",
  sellingIntent: "I am looking to sell my home",
  sellingTimeline: "Within 3 months",
  sellingMotivation: "Relocating for work",
  propertyCondition: "Move-in ready",
  pricingPriority: "Getting the highest price possible",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  submittedAt: new Date().toISOString(),
  formType: "listing-presentation",
  source: "website-questionnaire"
};

// Mock Zillow property data (what would come from /api/zillow/property)
const mockPropertyData = {
  zpid: "123456789",
  address: "123 Main Street, Beverly Hills, CA 90210, USA",
  price: 2500000,
  bedrooms: 4,
  bathrooms: 3.5,
  livingArea: 3200,
  lotSize: 8500,
  yearBuilt: 1995,
  propertyType: "Single Family",
  zestimate: 2450000,
  rentZestimate: 8500,
  taxAssessedValue: 2200000,
  lastSoldDate: "2018-05-15",
  lastSoldPrice: 1950000,
  neighborhood: "Beverly Hills",
  walkScore: 85,
  priceHistory: [
    {
      date: "2018-05-15",
      price: 1950000,
      event: "Sold"
    },
    {
      date: "2018-04-01",
      price: 2100000,
      event: "Listed"
    }
  ],
  schools: [
    {
      name: "Beverly Hills High School",
      rating: 9,
      grades: "9-12"
    },
    {
      name: "Beverly Hills Elementary",
      rating: 10,
      grades: "K-5"
    }
  ]
};

// Mock Zillow images data (what would come from /api/zillow/images)
const mockImageData = {
  success: true,
  zpid: 123456789,
  firstImageUrl: "https://photos.zillowstatic.com/fp/example1.jpg",
  totalImages: 25,
  allImages: [
    "https://photos.zillowstatic.com/fp/example1.jpg",
    "https://photos.zillowstatic.com/fp/example2.jpg",
    "https://photos.zillowstatic.com/fp/example3.jpg",
    "https://photos.zillowstatic.com/fp/example4.jpg",
    "https://photos.zillowstatic.com/fp/example5.jpg"
  ],
  rawData: {
    images: [
      "https://photos.zillowstatic.com/fp/example1.jpg",
      "https://photos.zillowstatic.com/fp/example2.jpg",
      "https://photos.zillowstatic.com/fp/example3.jpg",
      "https://photos.zillowstatic.com/fp/example4.jpg",
      "https://photos.zillowstatic.com/fp/example5.jpg"
    ]
  }
};

// Mock Zillow residential data (what would come from /api/zillow/residential-data)
const mockResidentialData = {
  success: true,
  zip: "90210",
  monthlyInventoryCount: 24,
  cached: false,
  timestamp: new Date().toISOString(),
  data: {
    monthlyInventory: [
      {
        date: "2024-01-01",
        totalInventory: 145,
        newListings: 23,
        priceReductions: 8,
        averageDaysOnMarket: 42,
        medianListPrice: 2450000
      },
      {
        date: "2024-02-01", 
        totalInventory: 138,
        newListings: 19,
        priceReductions: 12,
        averageDaysOnMarket: 38,
        medianListPrice: 2525000
      },
      {
        date: "2024-03-01",
        totalInventory: 152,
        newListings: 31,
        priceReductions: 6,
        averageDaysOnMarket: 35,
        medianListPrice: 2675000
      }
    ],
    summary: {
      averageInventory: 145,
      inventoryTrend: "stable",
      priceDirection: "increasing",
      marketActivity: "moderate"
    }
  },
  rawData: {
    monthlyInventory: [
      {
        date: "2024-01-01",
        totalInventory: 145,
        newListings: 23,
        priceReductions: 8,
        averageDaysOnMarket: 42,
        medianListPrice: 2450000
      },
      {
        date: "2024-02-01", 
        totalInventory: 138,
        newListings: 19,
        priceReductions: 12,
        averageDaysOnMarket: 38,
        medianListPrice: 2525000
      },
      {
        date: "2024-03-01",
        totalInventory: 152,
        newListings: 31,
        priceReductions: 6,
        averageDaysOnMarket: 35,
        medianListPrice: 2675000
      }
    ]
  }
};

async function testWebhookSubmission() {
  console.log('🚀 Testing Zapier webhook submission with mock data...');
  console.log('===============================================\n');

  try {
    // Create form body just like the actual API does
    const formBody = new URLSearchParams();
    
    // Add form data with form_ prefix
    console.log('📝 Adding form data...');
    Object.entries(mockFormData).forEach(([key, value]) => {
      formBody.append(`form_${key}`, value);
      console.log(`   form_${key}: ${value}`);
    });

    // Add property data with property_ prefix
    console.log('\n🏠 Adding property data...');
    Object.entries(mockPropertyData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        formBody.append(`property_${key}`, formattedValue);
        console.log(`   property_${key}: ${typeof value === 'object' ? '[Object/Array]' : value}`);
      }
    });

    // Add image data with image_ prefix
    console.log('\n📸 Adding image data...');
    Object.entries(mockImageData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        formBody.append(`image_${key}`, formattedValue);
        console.log(`   image_${key}: ${typeof value === 'object' ? '[Object/Array]' : value}`);
      }
    });

    // Add residential data with residential_ prefix
    console.log('\n🏠 Adding residential data...');
    Object.entries(mockResidentialData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        formBody.append(`residential_${key}`, formattedValue);
        console.log(`   residential_${key}: ${typeof value === 'object' ? '[Object/Array]' : value}`);
      }
    });

    // Add metadata
    formBody.append('processedAt', new Date().toISOString());
    console.log(`\n⏰ Added processedAt: ${new Date().toISOString()}`);

    // Send to Zapier webhook
    console.log('\n🔗 Sending to Zapier webhook...');
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/24734243/u1rst7c/';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formBody,
    });

    console.log(`\n✅ Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('🎉 Webhook submission successful!');
      
      // Try to get response text (Zapier usually returns simple confirmation)
      try {
        const responseText = await response.text();
        if (responseText) {
          console.log(`📄 Response body: ${responseText}`);
        }
      } catch (e) {
        console.log('📄 No response body or unable to read response');
      }
    } else {
      console.log('❌ Webhook submission failed');
      const errorText = await response.text();
      console.log(`Error details: ${errorText}`);
    }

  } catch (error) {
    console.error('💥 Error during webhook submission:', error.message);
    console.error('Stack trace:', error.stack);
  }

  console.log('\n🏁 Test completed!');
}

// Run the test
testWebhookSubmission();
