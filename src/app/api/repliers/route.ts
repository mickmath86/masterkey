import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.REPLIERS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'REPLIERS_API_KEY environment variable is not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.repliers.io/listings?status=A', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'REPLIERS-API-KEY': apiKey,
      },
      body: JSON.stringify({
        address: address,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Repliers API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Repliers API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching from Repliers API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Repliers API' },
      { status: 500 }
    )
  }
}
