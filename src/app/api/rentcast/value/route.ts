import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for AVM data
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours in milliseconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  try {
    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `rentcast:avm:${address}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached Rentcast AVM data for:', address)
      return NextResponse.json(cached.data)
    }

    // Fetch from Rentcast AVM API
    console.log(`Fetching Rentcast AVM data for address: ${address}`)
    
    const apiKey = process.env.RENTCAST_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Rentcast API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.rentcast.io/v1/avm/value?address=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Rentcast API key' },
          { status: 500 }
        )
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      throw new Error(`Rentcast API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('=== RENTCAST AVM API RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Address requested:', address)
    console.log('Full response:', JSON.stringify(data, null, 2))
    
    // Cache the result
    cache.set(cacheKey, { data, timestamp: Date.now() })

    return NextResponse.json(data)

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    // Enhanced logging for production debugging
    console.error('Rentcast AVM API error details:', {
      message: errorMessage,
      stack: errorStack,
      address,
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.RENTCAST_API_KEY,
      apiKeyLength: process.env.RENTCAST_API_KEY?.length || 0
    })

    if (errorMessage.includes('RENTCAST_API_KEY')) {
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

    // Return detailed error for debugging in production
    return NextResponse.json(
      { 
        error: 'Failed to fetch AVM data from Rentcast API',
        details: errorMessage,
        address
      },
      { status: 500 }
    )
  }
}
