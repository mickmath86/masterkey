import { NextRequest, NextResponse } from 'next/server'
import { getRentcastAPI, type MarketStatistics } from '@/lib/api/rentcast'
import { extractZipcode, isValidZipcode } from '@/lib/utils/address'

// Simple in-memory cache for market data
const cache = new Map<string, { data: MarketStatistics; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours in milliseconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const zipcode = searchParams.get('zipcode')
  const dataType = (searchParams.get('dataType') || 'All') as 'All' | 'Sale' | 'Rental'

  // Extract zipcode from address if not provided directly
  let targetZipcode = zipcode
  if (!targetZipcode && address) {
    targetZipcode = extractZipcode(address)
  }

  try {

    if (!targetZipcode) {
      return NextResponse.json(
        { error: 'Address or zipcode is required' },
        { status: 400 }
      )
    }

    if (!isValidZipcode(targetZipcode)) {
      return NextResponse.json(
        { error: 'Invalid zipcode format. Must be 5 digits.' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `rentcast:${targetZipcode}:${dataType}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached Rentcast market data for:', targetZipcode)
      return NextResponse.json(cached.data)
    }

    // Fetch from Rentcast API
    console.log(`Fetching Rentcast market data for zipcode: ${targetZipcode}`)
    const rentcastAPI = getRentcastAPI()
    const marketData = await rentcastAPI.getMarketStatistics(targetZipcode, dataType)

    // Cache the result
    cache.set(cacheKey, { data: marketData, timestamp: Date.now() })

    return NextResponse.json(marketData)

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    // Enhanced logging for production debugging
    console.error('Rentcast markets API error details:', {
      message: errorMessage,
      stack: errorStack,
      zipcode: targetZipcode,
      address,
      dataType,
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.RENTCAST_API_KEY,
      apiKeyLength: process.env.RENTCAST_API_KEY?.length || 0
    })

    if (errorMessage.includes('RENTCAST_API_KEY environment variable is required')) {
      return NextResponse.json(
        { error: 'Rentcast API key not configured in production environment' },
        { status: 500 }
      )
    }

    if (errorMessage.includes('Invalid Rentcast API key')) {
      return NextResponse.json(
        { error: 'Rentcast API configuration error. Please check your API key.' },
        { status: 500 }
      )
    }

    if (errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (errorMessage.includes('No market data available')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      )
    }

    // Return detailed error for debugging in production
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data from Rentcast API',
        details: errorMessage,
        zipcode: targetZipcode
      },
      { status: 500 }
    )
  }
}
