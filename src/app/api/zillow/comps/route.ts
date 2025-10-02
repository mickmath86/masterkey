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
    const zpid = searchParams.get('zpid')

    if (!zpid) {
      return NextResponse.json({ error: 'zpid parameter is required' }, { status: 400 })
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
    const cacheKey = `zillow-comps:${zpid}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached comps data for zpid:', zpid)
      return NextResponse.json(cached.data)
    }

    // Make API request
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.ZILLOW_API_HOST || 'zillow-com1.p.rapidapi.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://${apiHost}/propertyComps?zpid=${encodeURIComponent(zpid)}`,
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
    
    console.log('✅ Zillow Comps API Success for zpid:', zpid)

    
    // Process and normalize the comps data
    const processedData = await processZillowCompsData(data, zpid, apiKey, apiHost)

    
    // Cache the result
    cache.set(cacheKey, { data: processedData, timestamp: Date.now() })
    
    return NextResponse.json(processedData)

  } catch (error: any) {
    console.error('Zillow Comps API error:', error.message)
    
    // Return fallback data on error
    const { searchParams } = new URL(request.url)
    const fallbackData = getFallbackCompsData(searchParams.get('zpid') || '')
    return NextResponse.json(fallbackData)
  }
}

async function processZillowCompsData(data: any, zpid: string, apiKey: string, apiHost: string) {
  console.log('Processing comps data (simplified - no enhanced property fetching)...')
  
  let comps: any[] = []
  
  // Extract comps array from various response structures
  if (data && Array.isArray(data.comps)) {
    comps = data.comps
  } else if (Array.isArray(data)) {
    comps = data
  } else if (data && data.comps) {
    comps = Array.isArray(data.comps) ? data.comps : [data.comps]
  }

  // If no comps found, return early
  if (comps.length === 0) {
    return {
      zpid: zpid,
      comps: [],
      totalCount: 0,
      rawData: data
    }
  }

  console.log(`Found ${comps.length} comps, using original data without enhancement to reduce API stress`)

  // Simply return the original comps data without making additional API calls
  return {
    zpid: zpid,
    comps: comps,
    totalCount: comps.length,
    rawData: data
  }
}

function getFallbackCompsData(zpid: string) {
  return {
    zpid: zpid,
    comps: [
      {
        zpid: "123456789",
        address: "123 Sample St, Newbury Park, CA 91320",
        price: 1200000,
        bedrooms: 4,
        bathrooms: 2.5,
        squareFootage: 2400,
        lotSize: 8000,
        yearBuilt: 1985,
        latitude: 34.157692,
        longitude: -118.946235,
        distance: 0.2,
        daysOnMarket: 25,
        lastSaleDate: "2024-08-15",
        propertyType: "Single Family"
      },
      {
        zpid: "987654321",
        address: "456 Example Ave, Newbury Park, CA 91320",
        price: 1350000,
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 2200,
        lotSize: 7500,
        yearBuilt: 1990,
        latitude: 34.158663,
        longitude: -118.949347,
        distance: 0.3,
        daysOnMarket: 18,
        lastSaleDate: "2024-09-01",
        propertyType: "Single Family"
      }
    ],
    totalCount: 2,
    isFallback: true
  }
}
