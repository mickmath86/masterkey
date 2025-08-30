import { useState, useEffect } from 'react'
import { getZillowAPI, type ZillowPropertyData, type ZillowMarketData } from '@/lib/api/zillow'
import { getGoogleMapsAPI, type PlaceDetails } from '@/lib/api/google-maps'

export interface PropertyData {
  address: string
  estimatedValue: number
  bedrooms: number
  bathrooms: number
  sqft: number
  lotSize: number
  yearBuilt: number
  propertyType: string
  lastSold: {
    date: string
    price: number
  }
  marketData: {
    medianHomeValue: number
    priceChange30Days: number
    priceChange1Year: number
    daysOnMarket: number
  }
  valuationGauge: {
    low: number
    recommended: number
    high: number
    current: number
  }
  images: string[]
  priceHistory: {
    [key: string]: Array<{
      month: string
      price: number
    }>
  }
  priceForecasting: Array<{
    month: string
    price: number
    type?: string
  }>
  placeDetails?: PlaceDetails
}

export interface UsePropertyDataResult {
  propertyData: PropertyData | null
  isLoading: boolean
  error: string | null
  refetch: (address: string) => Promise<void>
}

// Mock data fallback
const mockPropertyData: PropertyData = {
  address: "1234 Maple Street, San Francisco, CA 94102",
  estimatedValue: 1250000,
  bedrooms: 3,
  bathrooms: 2.5,
  sqft: 2100,
  lotSize: 0.15,
  yearBuilt: 1985,
  propertyType: "Single Family Home",
  lastSold: {
    date: "2019-03-15",
    price: 980000,
  },
  marketData: {
    medianHomeValue: 1180000,
    priceChange30Days: 2.3,
    priceChange1Year: 8.7,
    daysOnMarket: 28,
  },
  valuationGauge: {
    low: 1100000,
    recommended: 1250000,
    high: 1400000,
    current: 1250000,
  },
  images: [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  ],
  priceHistory: {
    "1": [
      { month: "Jan 2024", price: 1150000 },
      { month: "Mar 2024", price: 1180000 },
      { month: "Jun 2024", price: 1200000 },
      { month: "Sep 2024", price: 1220000 },
      { month: "Dec 2024", price: 1250000 },
    ],
    "3": [
      { month: "Q1 2022", price: 950000 },
      { month: "Q3 2022", price: 1020000 },
      { month: "Q1 2023", price: 1100000 },
      { month: "Q3 2023", price: 1180000 },
      { month: "Q1 2024", price: 1220000 },
      { month: "Q3 2024", price: 1250000 },
    ],
    "5": [
      { month: "2020", price: 850000 },
      { month: "2021", price: 920000 },
      { month: "2022", price: 1020000 },
      { month: "2023", price: 1180000 },
      { month: "2024", price: 1250000 },
    ],
  },
  priceForecasting: [
    { month: "Jan 2025", price: 1250000, type: "current" },
    { month: "Feb 2025", price: 1265000, type: "projected" },
    { month: "Mar 2025", price: 1280000, type: "projected" },
    { month: "Apr 2025", price: 1290000, type: "projected" },
  ],
}

export function usePropertyData(initialAddress?: string): UsePropertyDataResult {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPropertyData = async (address: string) => {
    if (!address.trim()) {
      setError('Address is required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Check if APIs are configured
      const hasZillowAPI = !!process.env.NEXT_PUBLIC_ZILLOW_API_KEY
      const hasGoogleAPI = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      let zillowData: ZillowPropertyData | null = null
      let marketData: ZillowMarketData | null = null
      let placeDetails: PlaceDetails | null = null

      try {
        setIsLoading(true)
        setError(null)

        // Check if we have Zillow API access
        if (!hasZillowAPI) {
          console.warn('Zillow API not available, using mock data')
          setPropertyData(mockPropertyData)
          return
        }

        const zillowAPI = getZillowAPI()
        
        // Fetch property data and market data with rate limit handling
        let propertyResult = null
        let marketResult = null
        
        try {
          [propertyResult, marketResult] = await Promise.all([
            zillowAPI.searchProperty(address),
            zillowAPI.getMarketData(address)
          ])
          zillowData = propertyResult
          marketData = marketResult
        } catch (apiError: any) {
          if (apiError.message.includes('Rate limit exceeded')) {
            console.warn('Rate limit exceeded, using mock data')
            setPropertyData(mockPropertyData)
            return
          }
          throw apiError
        }
      } catch (err) {
        console.warn('Zillow API failed, using mock data:', err)
      }

      // Fetch from Google Places API if available
      if (hasGoogleAPI) {
        try {
          const googleAPI = getGoogleMapsAPI()
          placeDetails = await googleAPI.validateAddress(address)
        } catch (err) {
          console.warn('Google Places API failed:', err)
        }
      }

      // Format address properly if it's an object
      const formatAddress = (addr: any): string => {
        if (typeof addr === 'string') return addr
        if (typeof addr === 'object' && addr) {
          return addr.streetAddress || `${addr.city}, ${addr.state} ${addr.zipcode}` || JSON.stringify(addr)
        }
        return address
      }

      // Merge real data with mock data fallback
      const mergedData: PropertyData = {
        ...mockPropertyData,
        address: placeDetails?.formattedAddress || formatAddress(zillowData?.address) || address,
        estimatedValue: zillowData?.zestimate || zillowData?.price || mockPropertyData.estimatedValue,
        bedrooms: zillowData?.bedrooms || mockPropertyData.bedrooms,
        bathrooms: zillowData?.bathrooms || mockPropertyData.bathrooms,
        sqft: zillowData?.livingArea || mockPropertyData.sqft,
        lotSize: zillowData?.lotSize || mockPropertyData.lotSize,
        yearBuilt: zillowData?.yearBuilt || mockPropertyData.yearBuilt,
        propertyType: zillowData?.propertyType || mockPropertyData.propertyType,
        lastSold: {
          date: mockPropertyData.lastSold.date, // API doesn't provide this consistently
          price: zillowData?.price || mockPropertyData.lastSold.price,
        },
        marketData: {
          medianHomeValue: marketData?.medianHomeValue || mockPropertyData.marketData.medianHomeValue,
          priceChange30Days: marketData?.priceChange30Days || mockPropertyData.marketData.priceChange30Days,
          priceChange1Year: marketData?.priceChange1Year || mockPropertyData.marketData.priceChange1Year,
          daysOnMarket: marketData?.daysOnMarket || mockPropertyData.marketData.daysOnMarket,
        },
        valuationGauge: {
          low: zillowData?.zestimate ? Math.round(zillowData.zestimate * 0.88) : (zillowData?.price ? Math.round(zillowData.price * 0.88) : mockPropertyData.valuationGauge.low),
          recommended: zillowData?.zestimate || zillowData?.price || mockPropertyData.valuationGauge.recommended,
          high: zillowData?.zestimate ? Math.round(zillowData.zestimate * 1.12) : (zillowData?.price ? Math.round(zillowData.price * 1.12) : mockPropertyData.valuationGauge.high),
          current: zillowData?.zestimate || zillowData?.price || mockPropertyData.valuationGauge.current,
        },
        placeDetails: placeDetails || undefined,
      }

      setPropertyData(mergedData)
    } catch (err) {
      console.error('Error fetching property data:', err)
      setError('Failed to fetch property data. Using sample data.')
      setPropertyData(mockPropertyData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialAddress) {
      fetchPropertyData(initialAddress)
    } else {
      // Load mock data by default
      setPropertyData(mockPropertyData)
    }
  }, [initialAddress])

  return {
    propertyData,
    isLoading,
    error,
    refetch: fetchPropertyData,
  }
}
