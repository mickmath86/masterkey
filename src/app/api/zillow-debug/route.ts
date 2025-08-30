import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || '123 Main St, Los Angeles, CA 90210'

    const apiKey = process.env.NEXT_PUBLIC_ZILLOW_API_KEY
    const apiHost = process.env.ZILLOW_API_HOST || 'zillow-com1.p.rapidapi.com'

    console.log('=== ZILLOW API DEBUG ===')
    console.log('Location:', location)
    console.log('API Host:', apiHost)
    console.log('API Key configured:', !!apiKey)
    console.log('API Key length:', apiKey?.length)

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key not configured',
        debug: {
          envVars: Object.keys(process.env).filter(k => k.includes('ZILLOW')),
          apiHost,
          location
        }
      }, { status: 500 })
    }

    // Test the exact endpoint we're using
    const url = `https://${apiHost}/propertyExtendedSearch?location=${encodeURIComponent(location)}&status_type=ForSale`
    console.log('Request URL:', url)

    const headers = {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost,
      'Content-Type': 'application/json',
    }
    console.log('Request Headers:', { ...headers, 'X-RapidAPI-Key': 'HIDDEN' })

    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))

    const rawData = await response.text()
    console.log('Raw Response:', rawData.substring(0, 500) + '...')

    let data
    try {
      data = JSON.parse(rawData)
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      return NextResponse.json({
        error: 'Invalid JSON response from API',
        rawResponse: rawData.substring(0, 1000),
        status: response.status
      })
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      url,
      headers: { ...headers, 'X-RapidAPI-Key': 'HIDDEN' },
      rawResponse: data,
      responseSize: rawData.length,
      debug: {
        hasProps: !!data.props,
        propsLength: data.props?.length || 0,
        dataKeys: Object.keys(data),
        firstProp: data.props?.[0] || null
      }
    })

  } catch (error: any) {
    console.error('Zillow API debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
