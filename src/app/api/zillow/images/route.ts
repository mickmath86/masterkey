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

export async function POST(request: NextRequest) {
  try {
    const { zpid } = await request.json()

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
    const cacheKey = `zillow-images:${zpid}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached images data for zpid:', zpid)
      return NextResponse.json(cached.data)
    }

    // Make API request
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = 'zillow-com1.p.rapidapi.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'RAPIDAPI_KEY not configured' }, { status: 500 })
    }

    console.log('🔄 Zillow Images API Request for zpid:', zpid)

    const response = await fetch(
      `https://${apiHost}/images?zpid=${zpid}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
        },
      }
    )

    console.log('=== ZILLOW IMAGES API RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response body:', errorText)
      return NextResponse.json(
        { 
          error: `Zillow Images API failed: ${response.status} ${response.statusText}`,
          details: errorText,
          requestUrl: `https://${apiHost}/images?zpid=${zpid}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
  

    // Extract first image URL
    const firstImageUrl = data.images && data.images.length > 0 ? data.images[0] : null

    const result = {
      success: true,
      zpid,
      firstImageUrl,
      totalImages: data.images?.length || 0,
      allImages: data.images || [],
      rawData: data
    }

    console.log('Processed result:', JSON.stringify(result, null, 2))
    
    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })
    
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('=== ZILLOW IMAGES API ERROR ===')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch images data',
        details: error.stack
      },
      { status: 500 }
    )
  }
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
    const cacheKey = `zillow-images:${zpid}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached images data for zpid:', zpid)
      return NextResponse.json(cached.data)
    }

    // Make API request
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = 'zillow-com1.p.rapidapi.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'RAPIDAPI_KEY not configured' }, { status: 500 })
    }

    console.log('🔄 Zillow Images API Request for zpid:', zpid)

    const response = await fetch(
      `https://${apiHost}/images?zpid=${zpid}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
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
    
    console.log('✅ Zillow Images API Success for zpid:', zpid)
   
    
    // Process and normalize the images data
    const processedData = processZillowImagesData(data, zpid)
    

    
    // Cache the result
    cache.set(cacheKey, { data: processedData, timestamp: Date.now() })
    
    return NextResponse.json(processedData)

  } catch (error: any) {
    console.error('Zillow Images API error:', error.message)
    
    // Return fallback data on error
    const { searchParams } = new URL(request.url)
    const fallbackData = getFallbackImagesData(searchParams.get('zpid') || '')
    return NextResponse.json(fallbackData)
  }
}

function processZillowImagesData(data: any, zpid: string) {
  // Handle /images endpoint response structure
  if (data && Array.isArray(data.images)) {
    return {
      zpid: zpid,
      images: data.images,
      totalCount: data.images.length,
      rawData: data
    }
  }

  // Handle case where images are directly in an array
  if (Array.isArray(data)) {
    return {
      zpid: zpid,
      images: data,
      totalCount: data.length,
      rawData: data
    }
  }

  // Handle case where data has images property
  if (data && data.images) {
    const images = Array.isArray(data.images) ? data.images : [data.images]
    return {
      zpid: zpid,
      images: images,
      totalCount: images.length,
      rawData: data
    }
  }

  // Fallback for unexpected response structure
  return {
    zpid: zpid,
    images: [],
    totalCount: 0,
    rawData: data
  }
}

function getFallbackImagesData(zpid: string) {
  return {
    zpid: zpid,
    images: [
      "https://maps.googleapis.com/maps/api/streetview?location=3332+Mountain+Trail+Ave%2C+Thousand+Oaks%2C+CA+91320&size=1536x1152&key=AIzaSyARFMLB1na-BBWf7_R3-5YOQQaHqEJf6RQ&source=outdoor&&signature=vb5rxMFR-h2JZvVQFVmFyzFXFpo=",
      "https://maps.googleapis.com/maps/api/streetview?location=3332+Mountain+Trail+Ave%2C+Thousand+Oaks%2C+CA+91320&size=1536x1152&key=AIzaSyARFMLB1na-BBWf7_R3-5YOQQaHqEJf6RQ&source=outdoor&&signature=vb5rxMFR-h2JZvVQFVmFyzFXFpo="
    ],
    totalCount: 2,
    isFallback: true
  }
}
