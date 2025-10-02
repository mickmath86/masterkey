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
    const cacheKey = `zillow-values:${zpid}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached value history data for zpid:', zpid)
      return NextResponse.json(cached.data)
    }

    // Make API request
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = 'zillow-com1.p.rapidapi.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'RAPIDAPI_KEY not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://${apiHost}/zestimateHistory?zpid=${encodeURIComponent(zpid)}`,
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
    
    console.log('✅ Zillow Values API Success for zpid:', zpid)
    console.log('🔍 Raw API response structure:', {
      isArray: Array.isArray(data),
      keys: Object.keys(data || {}),
      firstItem: Array.isArray(data) ? data[0] : data,
      hasZestimateHistory: data?.[0]?.zestimateHistory ? 'Yes' : 'No'
    })

    
    // Process and normalize the value history data
    const processedData = processZillowValueHistoryData(data, zpid)
    console.log('🔧 Processed data:', {
      isArray: Array.isArray(processedData),
      length: processedData?.length || 0,
      firstProcessedItem: processedData?.[0]
    })
    

    
    // Cache the result
    cache.set(cacheKey, { data: processedData, timestamp: Date.now() })
    
    return NextResponse.json(processedData)

  } catch (error: any) {
    console.error('Zillow Value History API error:', error.message)
    
    // Return fallback data on error
    const { searchParams } = new URL(request.url)
    const fallbackData = getFallbackValueHistoryData(searchParams.get('zpid') || '')
    return NextResponse.json(fallbackData)
  }
}

function processZillowValueHistoryData(data: any, zpid: string) {
  console.log('🔧 Processing value history data:', { dataType: typeof data, isArray: Array.isArray(data) })
  
  // Handle case where data is an array and first item has zestimateHistory
  if (Array.isArray(data) && data.length > 0 && data[0]?.zestimateHistory) {
    console.log('📊 Found zestimateHistory in first array item')
    return data[0].zestimateHistory.map((item: any) => ({
      t: item.t || item.time || item.timestamp || item.date,
      v: item.v || item.value || item.zestimate || item.price
    })).filter((item: any) => item.t && item.v) // Filter out invalid items
  }

  // Handle /zestimateHistory endpoint response structure
  if (data && Array.isArray(data.zestimateHistory)) {
    console.log('📊 Found direct zestimateHistory array')
    return data.zestimateHistory.map((item: any) => ({
      t: item.t || item.time || item.timestamp || item.date,
      v: item.v || item.value || item.zestimate || item.price
    })).filter((item: any) => item.t && item.v)
  }

  // Handle case where history is directly in an array
  if (Array.isArray(data)) {
    console.log('📊 Processing direct array data')
    return data.map((item: any) => ({
      t: item.t || item.time || item.timestamp || item.date,
      v: item.v || item.value || item.zestimate || item.price
    })).filter((item: any) => item.t && item.v) // Filter out invalid items
  }

  // Handle case where data has history property
  if (data && data.history) {
    console.log('📊 Found history property')
    const history = Array.isArray(data.history) ? data.history : [data.history]
    return history.map((item: any) => ({
      t: item.t || item.time || item.timestamp || item.date,
      v: item.v || item.value || item.zestimate || item.price
    })).filter((item: any) => item.t && item.v)
  }

  // Handle case where data has valueHistory property
  if (data && data.valueHistory) {
    console.log('📊 Found valueHistory property')
    const history = Array.isArray(data.valueHistory) ? data.valueHistory : [data.valueHistory]
    return history.map((item: any) => ({
      t: item.time || item.timestamp || item.date,
      v: item.value || item.zestimate || item.price
    }))
  }

  // Fallback for unexpected response structure - return empty array
  return []
}

function getFallbackValueHistoryData(zpid: string) {
  // Return mock value data in the expected format for the chart
  const currentTime = Math.floor(Date.now() / 1000)
  const oneYearAgo = currentTime - (365 * 24 * 60 * 60)
  
  return [
    { t: oneYearAgo, v: 1200000 },
    { t: oneYearAgo + (30 * 24 * 60 * 60), v: 1210000 },
    { t: oneYearAgo + (60 * 24 * 60 * 60), v: 1205000 },
    { t: oneYearAgo + (90 * 24 * 60 * 60), v: 1220000 },
    { t: oneYearAgo + (120 * 24 * 60 * 60), v: 1235000 },
    { t: oneYearAgo + (150 * 24 * 60 * 60), v: 1240000 },
    { t: oneYearAgo + (180 * 24 * 60 * 60), v: 1255000 },
    { t: oneYearAgo + (210 * 24 * 60 * 60), v: 1260000 },
    { t: oneYearAgo + (240 * 24 * 60 * 60), v: 1275000 },
    { t: oneYearAgo + (270 * 24 * 60 * 60), v: 1280000 },
    { t: oneYearAgo + (300 * 24 * 60 * 60), v: 1290000 },
    { t: currentTime, v: 1300000 }
  ]
}
