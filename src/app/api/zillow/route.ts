import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache to prevent duplicate requests
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Rate limiting per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 10 // 10 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(key)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return false
  }

  limit.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    if (!location) {
      return NextResponse.json({ error: 'Location parameter is required' }, { status: 400 })
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before making more requests.' },
        { status: 429 }
      )
    }

    // Check cache first
    const cacheKey = `zillow:${location}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached data for:', location)
      return NextResponse.json(cached.data)
    }

    // Make API request
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.ZILLOW_API_HOST || 'zillow-com1.p.rapidapi.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://${apiHost}/property?address=${encodeURIComponent(location)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Using fallback data.' },
          { status: 429 }
        )
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('=== ZILLOW /property ENDPOINT RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Address requested:', location)
    console.log('Full response:', JSON.stringify(data, null, 2))
    console.log('Response keys:', Object.keys(data))
    console.log('Response type:', Array.isArray(data) ? 'Array' : typeof data)
    
    // Process and normalize the data
    const processedData = processZillowData(data, location)
    
    console.log('Processed data:', JSON.stringify(processedData, null, 2))
    
    // Cache the result
    cache.set(cacheKey, { data: processedData, timestamp: Date.now() })
    
    return NextResponse.json(processedData)

  } catch (error: any) {
    console.error('Zillow API error:', error.message)
    
    // Return fallback data on error
    const { searchParams } = new URL(request.url)
    const fallbackData = getFallbackData(searchParams.get('location') || '')
    return NextResponse.json(fallbackData)
  }
}

function processZillowData(data: any, location: string) {
  // Handle /property endpoint response structure
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const property = data
    
    // Extract address from the response or use provided location
    const addressObj = property.address || {}
    const formattedAddress = addressObj.streetAddress 
      ? `${addressObj.streetAddress}, ${addressObj.city}, ${addressObj.state} ${addressObj.zipcode}`
      : location

    return {
      zpid: property.zpid || 'unknown',
      address: formattedAddress,
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      livingArea: property.livingArea || 0,
      zestimate: property.zestimate || property.price || 0,
      propertyType: property.homeType || 'Unknown',
      homeStatus: property.homeStatus || 'Unknown',
      yearBuilt: property.resoFacts?.yearBuilt || null,
      lotSize: property.resoFacts?.lotSize || null,
      photos: property.photos || [],
      rentZestimate: property.rentZestimate || null,
      pricePerSquareFoot: property.resoFacts?.pricePerSquareFoot || null,
      taxAnnualAmount: property.resoFacts?.taxAnnualAmount || null,
      rawData: property
    }
  }

  // Fallback for unexpected response structure
  return {
    zpid: 'unknown',
    address: location,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    livingArea: 0,
    zestimate: 0,
    propertyType: 'Unknown',
    homeStatus: 'Unknown',
    yearBuilt: null,
    lotSize: null,
    photos: [],
    rawData: data
  }
}

function getFallbackData(location: string) {
  return {
    address: location,
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2,
    livingArea: 2100,
    zestimate: 1250000,
    propertyType: 'Single Family Home',
    homeStatus: 'For Sale',
    yearBuilt: 2010,
    lotSize: 7500,
    photos: [],
    isFallback: true
  }
}
