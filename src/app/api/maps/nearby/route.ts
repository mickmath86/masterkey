import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query, location, radius } = await request.json()

    if (!query || !location?.latitude || !location?.longitude) {
      return NextResponse.json(
        { error: 'Missing required parameters: query, location' },
        { status: 400 }
      )
    }

    // Use MCP Google Maps integration
    const response = await fetch('http://localhost:3001/api/mcp/maps/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        location,
        radius: radius || 2000
      })
    })

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Nearby places API error:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch nearby places', places: [] },
      { status: 500 }
    )
  }
}
