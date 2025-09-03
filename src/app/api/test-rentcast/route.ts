import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.RENTCAST_API_KEY
  const baseUrl = process.env.RENTCAST_API_BASE_URL || 'https://api.rentcast.io/v1'
  
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'RENTCAST_API_KEY not found',
      env: Object.keys(process.env).filter(key => key.includes('RENT'))
    })
  }
  
  // Test the actual API call
  try {
    const url = `${baseUrl}/markets`
    const params = new URLSearchParams({
      zipCode: '91320',
      dataType: 'All',
      historyRange: '6'
    })
    
    console.log(`Testing: ${url}?${params}`)
    console.log(`API Key (first 8 chars): ${apiKey.substring(0, 8)}...`)
    
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
      },
    })
    
    const responseText = await response.text()
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''),
      url: `${url}?${params}`,
      apiKeyPresent: !!apiKey,
      apiKeyLength: apiKey.length
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!apiKey
    })
  }
}
