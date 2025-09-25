import { NextRequest, NextResponse } from 'next/server'

interface FormData {
  propertyAddress: string;
  sellingIntent: string;
  sellingTimeline: string;
  sellingMotivation: string;
  propertyCondition: string;
  priceExpectation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submittedAt: string;
  formType: string;
  source: string;
}

interface ZillowPropertyResponse {
  zpid?: string;
  address?: string | { zipcode?: string };
  zipcode?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  livingArea?: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType?: string;
  zestimate?: number;
  rentZestimate?: number;
  taxAssessedValue?: number;
  lastSoldDate?: string;
  lastSoldPrice?: number;
  priceHistory?: Array<{
    date: string;
    price: number;
    event: string;
  }>;
  neighborhood?: string;
  schools?: Array<{
    name: string;
    rating: number;
    grades: string;
  }>;
  walkScore?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()
    console.log('Received form submission:', formData)

    let zillowData: ZillowPropertyResponse = {}
    let zillowImagesData: any = {}
    let residentialData: any = {}

    // Get the current server's base URL dynamically
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

    // Fetch property data from Zillow API
    try {
      const zillowResponse = await fetch(`${baseUrl}/api/zillow/property`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: formData.propertyAddress
        }),
      })

      if (zillowResponse.ok) {
        const propertyResult = await zillowResponse.json()
        zillowData = propertyResult.data || propertyResult
        console.log('Zillow Property API response:', zillowData)

        // Extract zpid from property response and fetch images
        const zpid = zillowData.zpid
        if (zpid) {
          console.log('Fetching images for zpid:', zpid)
          
          try {
            const imagesResponse = await fetch(`${baseUrl}/api/zillow/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ zpid }),
            })

            if (imagesResponse.ok) {
              zillowImagesData = await imagesResponse.json()
              console.log('Zillow Images API response:', zillowImagesData)
            } else {
              console.error('Zillow Images API failed:', imagesResponse.statusText)
              zillowImagesData = { error: `Zillow Images API failed: ${imagesResponse.statusText}` }
            }
          } catch (imagesError) {
            console.error('Error calling Zillow Images API:', imagesError)
            zillowImagesData = { error: `Zillow Images API error: ${imagesError}` }
          }
        } else {
          console.log('No zpid found in property response, skipping images fetch')
          zillowImagesData = { error: 'No zpid available for images fetch' }
        }

        // Extract zipcode from property response and fetch residential data
        // Try multiple possible zipcode locations in the response
        let zipcode: string | null = null
        
        // Check if zipcode exists directly on the response
        if ((zillowData as any).zipcode) {
          zipcode = (zillowData as any).zipcode
        }
        // Check if address is an object with zipcode
        else if (typeof zillowData.address === 'object' && zillowData.address && 'zipcode' in zillowData.address) {
          zipcode = (zillowData.address as any).zipcode
        }
        // Extract zipcode from address string using regex
        else if (typeof zillowData.address === 'string') {
          const match = zillowData.address.match(/\b\d{5}\b/)
          zipcode = match ? match[0] : null
        }
        if (zipcode) {
          console.log('Fetching residential data for zipcode:', zipcode)
          
          try {
            const residentialResponse = await fetch(`${baseUrl}/api/zillow/residential-data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ zip: zipcode }),
            })

            if (residentialResponse.ok) {
              residentialData = await residentialResponse.json()
              console.log('Zillow Residential Data API response:', residentialData)
            } else {
              console.error('Zillow Residential Data API failed:', residentialResponse.statusText)
              residentialData = { error: `Zillow Residential Data API failed: ${residentialResponse.statusText}` }
            }
          } catch (residentialError) {
            console.error('Error calling Zillow Residential Data API:', residentialError)
            residentialData = { error: `Zillow Residential Data API error: ${residentialError}` }
          }
        } else {
          console.log('No zipcode found in property response, skipping residential data fetch')
          residentialData = { error: 'No zipcode available for residential data fetch' }
        }
      } else {
        console.error('Zillow Property API failed:', zillowResponse.statusText)
        zillowData = { error: `Zillow Property API failed: ${zillowResponse.statusText}` }
      }
    } catch (zillowError) {
      console.error('Error calling Zillow Property API:', zillowError)
      zillowData = { error: `Zillow Property API error: ${zillowError}` }
    }

    // Combine form data with Zillow response
    const combinedData = {
      formData,
      propertyData: zillowData,
      imageData: zillowImagesData,
      residentialData,
      processedAt: new Date().toISOString()
    }

    // Send combined data to Zapier webhook
    try {
      const formBody = new URLSearchParams()
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        formBody.append(`form_${key}`, value)
      })

      // Add property data
      Object.entries(zillowData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formBody.append(`property_${key}`, typeof value === 'object' ? JSON.stringify(value) : String(value))
        }
      })

      // Add residential data
      Object.entries(residentialData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formBody.append(`residential_${key}`, typeof value === 'object' ? JSON.stringify(value) : String(value))
        }
      })

      // Add metadata
      formBody.append('processedAt', combinedData.processedAt)

      const webhookResponse = await fetch('https://hooks.zapier.com/hooks/catch/24734243/u1rst7c/', {
        method: 'POST',
        body: formBody,
      })

      if (webhookResponse.ok) {
        console.log('Webhook sent successfully')
      } else {
        console.error('Webhook failed:', webhookResponse.statusText)
      }
    } catch (webhookError) {
      console.error('Webhook error:', webhookError)
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted and property data fetched successfully',
      propertyData: zillowData,
      redirectUrl: `/property-profile?address=${encodeURIComponent(formData.propertyAddress)}`
    })

  } catch (error: any) {
    console.error('Error processing form submission:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process submission',
        redirectUrl: `/property-profile`
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Property submission API endpoint is working',
    timestamp: new Date().toISOString(),
  })
}
