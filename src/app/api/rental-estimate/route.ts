import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userLimit.count >= limit) {
    return false
  }

  userLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(ip, 3, 60000)) { // 3 requests per minute
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const { address, name, email, propertyType } = await request.json()

    if (!address || !name || !email || !propertyType) {
      return NextResponse.json(
        { error: 'Address, name, email, and property type are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check for RapidAPI key (server-side only)
    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // Call Zillow RentEstimate API via RapidAPI
    const url = new URL('https://zillow-com1.p.rapidapi.com/rentEstimate')
    url.searchParams.append('address', address)
    url.searchParams.append('propertyType', propertyType)
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Zillow API error:', response.status, response.statusText, errorText)
      
      // Handle specific error cases
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        )
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API authentication failed. Please check configuration.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Unable to get rental estimate at this time. Please try again later.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Extract rental estimate from rentEstimate response
    if (!data || !data.median) {
      return NextResponse.json(
        { error: 'No rental estimate found for this address. Please try a different address.' },
        { status: 404 }
      )
    }

    // Use the median as the primary estimate with percentiles as range
    const rentalEstimate = {
      address: address,
      rentEstimate: data.median,
      rentRangeLow: data.percentile_25 || Math.round(data.median * 0.8),
      rentRangeHigh: data.percentile_75 || Math.round(data.median * 1.2),
      confidence: 'estimated',
      lastUpdated: new Date().toISOString(),
      source: 'Zillow',
      comparableRentals: data.comparableRentals || 0
    }

    // Log the request for analytics (optional)
    console.log('Rental estimate request:', {
      address,
      email,
      timestamp: new Date().toISOString(),
      estimate: rentalEstimate.rentEstimate
    })

    return NextResponse.json(rentalEstimate)

  } catch (error) {
    console.error('Rental estimate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
