import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address') || '123 Main St, Los Angeles, CA'

    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    console.log('Google Maps API Test:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length,
      keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET'
    })

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Google Maps API key not configured',
        envVars: Object.keys(process.env).filter(k => k.includes('GOOGLE')),
        message: 'Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file'
      }, { status: 500 })
    }

    // Test Google Maps Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    
    console.log('Testing Google Maps API with URL:', geocodeUrl.replace(apiKey, 'API_KEY_HIDDEN'))

    const response = await fetch(geocodeUrl)
    const data = await response.json()

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      apiKeyConfigured: true,
      testAddress: address,
      geocodeResponse: data,
      message: data.status === 'OK' ? 'Google Maps API is working correctly!' : `API Error: ${data.status} - ${data.error_message || 'Unknown error'}`
    })

  } catch (error: any) {
    console.error('Google Maps API test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to test Google Maps API'
    }, { status: 500 })
  }
}
