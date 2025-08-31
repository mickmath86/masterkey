import { NextRequest, NextResponse } from 'next/server'
import { getRentcastAPI, type MarketStatistics } from '@/lib/api/rentcast'
import { extractZipcode, isValidZipcode } from '@/lib/utils/address'

// Simple in-memory cache for market data
const cache = new Map<string, { data: MarketStatistics; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours in milliseconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const zipcode = searchParams.get('zipcode')
    const dataType = (searchParams.get('dataType') || 'All') as 'All' | 'Sale' | 'Rental'

    // Extract zipcode from address if not provided directly
    let targetZipcode = zipcode
    if (!targetZipcode && address) {
      targetZipcode = extractZipcode(address)
    }

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

  } catch (error: any) {
    console.error('Rentcast markets API error:', error.message)

    if (error.message.includes('Invalid Rentcast API key')) {
      return NextResponse.json(
        { error: 'Rentcast API configuration error. Please check your API key.' },
        { status: 500 }
      )
    }

    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (error.message.includes('No market data available')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    // Return generic error for other cases
    return NextResponse.json(
      { error: 'Failed to fetch market data from Rentcast API' },
      { status: 500 }
    )
  }
}
