import { NextRequest, NextResponse } from 'next/server'

// In-memory cache for residential data
const residentialDataCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  userLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zip } = body

    console.log('=== ZILLOW RESIDENTIAL DATA API REQUEST ===')
    console.log('ZIP:', zip)

    if (!zip) {
      return NextResponse.json(
        { success: false, error: 'ZIP code is required' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Check cache first
    const cacheKey = `residential-${zip}`
    const cached = residentialDataCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached residential data for ZIP:', zip)
      return NextResponse.json({
        success: true,
        zip: zip,
        data: cached.data,
        cached: true,
        timestamp: new Date().toISOString()
      })
    }

    // Prepare API request
    const apiKey = process.env.RAPIDAPI_KEY
    if (!apiKey) {
      console.error('RAPIDAPI_KEY environment variable is not set')
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      )
    }

    const apiHost = process.env.ZILLOW_API_HOST || 'zillow-com1.p.rapidapi.com'
    const url = `https://${apiHost}/residentialData/monthlyInventory?zip=${zip}&limit=100`

    console.log('API Host:', apiHost)
    console.log('Full URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
    })

    console.log('=== ZILLOW RESIDENTIAL DATA API RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Zillow API error: ${response.status} ${response.statusText}`,
          details: errorText,
          zip: zip
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('=== ZILLOW RESIDENTIAL DATA RESPONSE DATA ===')
    console.log('Full response:', JSON.stringify(data, null, 2))

    if (data) {
      console.log('Response keys:', Object.keys(data))
      if (data.monthlyInventory) {
        console.log('Monthly inventory entries:', data.monthlyInventory.length)
      }
    }

    // Cache the successful response
    residentialDataCache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    })

    // Process and return the data
    const processedResult = {
      success: true,
      zip: zip,
      data: data,
      monthlyInventoryCount: data.monthlyInventory ? data.monthlyInventory.length : 0,
      cached: false,
      timestamp: new Date().toISOString(),
      rawData: data
    }

    console.log('Processed result:', JSON.stringify(processedResult, null, 2))

    return NextResponse.json(processedResult)

  } catch (error: any) {
    console.error('Error in residential data API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zip = searchParams.get('zip')

    if (!zip) {
      return NextResponse.json(
        { success: false, error: 'ZIP code parameter is required' },
        { status: 400 }
      )
    }

    // Forward to POST handler
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ zip })
    }))

  } catch (error: any) {
    console.error('Error in residential data GET endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
