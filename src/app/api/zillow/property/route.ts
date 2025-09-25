import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address, zpid } = await request.json()

    if (!address && !zpid) {
      return NextResponse.json({ error: 'Either address or zpid is required' }, { status: 400 })
    }

    // Make API request to Zillow via RapidAPI
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = 'zillow-com1.p.rapidapi.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'RAPIDAPI_KEY not configured' }, { status: 500 })
    }

    // Build query parameters
    const queryParams = new URLSearchParams()
    if (zpid) queryParams.append('zpid', zpid)
    if (address) queryParams.append('address', address)

    console.log('=== ZILLOW PROPERTY API REQUEST ===')
    console.log('API Host:', apiHost)
    console.log('Query params:', queryParams.toString())
    console.log('Full URL:', `https://${apiHost}/property?${queryParams.toString()}`)

    const response = await fetch(
      `https://${apiHost}/property?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
        },
      }
    )

    console.log('=== ZILLOW API RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response body:', errorText)
      return NextResponse.json(
        { 
          error: `Zillow API failed: ${response.status} ${response.statusText}`,
          details: errorText,
          requestUrl: `https://${apiHost}/property?${queryParams.toString()}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    console.log('=== ZILLOW PROPERTY RESPONSE DATA ===')
    console.log('Full response:', JSON.stringify(data, null, 2))
    console.log('Response keys:', Object.keys(data))
    console.log('Response type:', Array.isArray(data) ? 'Array' : typeof data)

    return NextResponse.json({
      success: true,
      data,
      requestParams: { address, zpid },
      apiResponse: {
        status: response.status,
        statusText: response.statusText
      }
    })

  } catch (error: any) {
    console.error('=== ZILLOW PROPERTY API ERROR ===')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch property data',
        details: error.stack
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const zpid = searchParams.get('zpid')

  // Forward to POST method
  return POST(new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, zpid })
  }))
}
