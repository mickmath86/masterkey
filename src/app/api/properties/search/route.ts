import { NextRequest, NextResponse } from 'next/server'

interface ZillowProperty {
  dateSold: string | null
  propertyType: string
  lotAreaValue: number
  address: string
  imgSrc: string
  price: number
  bedrooms: number
  longitude: number
  latitude: number
  listingStatus: string
  zpid: string
  listingSubType: {
    is_FSBA?: boolean
  }
  contingentListingType: string | null
  daysOnZillow: number
  bathrooms: number
  livingArea: number
  country: string
  currency: string
  lotAreaUnit: string
  hasImage: boolean
}

interface ZillowResponse {
  props: ZillowProperty[]
  resultsPerPage: number
  totalPages: number
  totalResultCount: number
  currentPage: number
}

interface Property {
  id: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: number
  yearBuilt?: number
  propertyType: string
  status: 'for-sale' | 'for-rent' | 'sold'
  images: string[]
  coordinates: [number, number]
  daysOnMarket?: number
  pricePerSqft?: number
}

// Map Zillow property types to our UI options
const mapPropertyType = (zillowType: string): string => {
  const typeMap: { [key: string]: string } = {
    'SINGLE_FAMILY': 'Single Family',
    'CONDO': 'Condo',
    'TOWNHOUSE': 'Townhouse',
    'MULTI_FAMILY': 'Multi-Family',
    'APARTMENT': 'Apartment',
    'MANUFACTURED': 'Mobile/Manufactured',
    'LOT': 'Land/Lot'
  }
  return typeMap[zillowType] || 'Single Family'
}

// Map our UI status to Zillow status
const mapStatusType = (uiStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'for-sale': 'ForSale',
    'for-rent': 'ForRent',
    'sold': 'RecentlySold'
  }
  return statusMap[uiStatus] || 'ForSale'
}

// Map our UI home types to Zillow home types
const mapHomeType = (uiHomeType: string): string => {
  const homeTypeMap: { [key: string]: string } = {
    'Single Family': 'Houses',
    'Condo': 'Condos',
    'Townhouse': 'Townhomes',
    'Multi-Family': 'Multi-family',
    'Apartment': 'Apartments',
    'Mobile/Manufactured': 'Manufactured',
    'Land/Lot': 'LotsLand'
  }
  return homeTypeMap[uiHomeType] || 'Houses'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const location = searchParams.get('location') || 'San Francisco, CA'
    const statusType = searchParams.get('status_type') || 'for-sale'
    const homeType = searchParams.get('home_type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rentMinPrice = searchParams.get('rentMinPrice')
    const rentMaxPrice = searchParams.get('rentMaxPrice')
    const bathsMin = searchParams.get('bathsMin')
    const bathsMax = searchParams.get('bathsMax')
    const bedsMin = searchParams.get('bedsMin')
    const bedsMax = searchParams.get('bedsMax')
    const sqftMin = searchParams.get('sqftMin')
    const sqftMax = searchParams.get('sqftMax')
    const buildYearMin = searchParams.get('buildYearMin')
    const buildYearMax = searchParams.get('buildYearMax')
    const daysOn = searchParams.get('daysOn')
    const lotSizeMin = searchParams.get('lotSizeMin')
    const lotSizeMax = searchParams.get('lotSizeMax')

    // Build API parameters
    const apiParams = new URLSearchParams({
      location,
      status_type: mapStatusType(statusType)
    })

    // Add optional parameters
    if (homeType) {
      apiParams.append('home_type', mapHomeType(homeType))
    }

    // Price parameters (different for rent vs sale/sold)
    if (statusType === 'for-rent') {
      if (rentMinPrice) apiParams.append('rentMinPrice', rentMinPrice)
      if (rentMaxPrice) apiParams.append('rentMaxPrice', rentMaxPrice)
    } else {
      if (minPrice) apiParams.append('minPrice', minPrice)
      if (maxPrice) apiParams.append('maxPrice', maxPrice)
    }

    if (bathsMin) apiParams.append('bathsMin', bathsMin)
    if (bathsMax) apiParams.append('bathsMax', bathsMax)
    if (bedsMin) apiParams.append('bedsMin', bedsMin)
    if (bedsMax) apiParams.append('bedsMax', bedsMax)
    if (sqftMin) apiParams.append('sqftMin', sqftMin)
    if (sqftMax) apiParams.append('sqftMax', sqftMax)
    if (buildYearMin) apiParams.append('buildYearMin', buildYearMin)
    if (buildYearMax) apiParams.append('buildYearMax', buildYearMax)
    if (daysOn) apiParams.append('daysOn', daysOn)
    if (lotSizeMin) apiParams.append('lotSizeMin', lotSizeMin)
    if (lotSizeMax) apiParams.append('lotSizeMax', lotSizeMax)

    // Make API request to Zillow
    const response = await fetch(
      `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?${apiParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`)
    }

    const data: ZillowResponse = await response.json()

    // Check if response has the expected structure
    if (!data || !Array.isArray(data.props)) {
      console.warn('Unexpected Zillow API response structure:', data)
      return NextResponse.json({
        properties: [],
        totalResults: 0,
        totalPages: 0,
        currentPage: 1,
        resultsPerPage: 0
      })
    }

    // Transform Zillow data to our Property interface
    const properties: Property[] = data.props.map((prop) => ({
      id: prop.zpid || 'unknown',
      address: prop.address || 'Address not available',
      price: prop.price || 0,
      beds: prop.bedrooms || 0,
      baths: prop.bathrooms || 0,
      sqft: prop.livingArea || 0,
      lotSize: prop.lotAreaValue || undefined,
      propertyType: mapPropertyType(prop.propertyType || 'SINGLE_FAMILY'),
      status: statusType as 'for-sale' | 'for-rent' | 'sold',
      images: (prop.hasImage && prop.imgSrc) ? [prop.imgSrc] : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'],
      coordinates: [prop.longitude || -122.4194, prop.latitude || 37.7749] as [number, number],
      daysOnMarket: (prop.daysOnZillow && prop.daysOnZillow > 0) ? prop.daysOnZillow : undefined,
      pricePerSqft: (prop.livingArea && prop.livingArea > 0 && prop.price) ? Math.round(prop.price / prop.livingArea) : undefined
    }))

    return NextResponse.json({
      properties,
      totalResults: data.totalResultCount,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      resultsPerPage: data.resultsPerPage
    })

  } catch (error) {
    console.error('Property search API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
