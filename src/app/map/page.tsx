'use client'

import { useState, useEffect } from 'react'
import PropertyMap from '@/components/property-map'

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

// Helper function to format Repliers address
const formatRepliersAddress = (address: any): string => {
  if (!address) return 'Address not available'
  const parts = [
    address.streetNumber,
    address.streetName,
    address.city,
    address.state,
    address.zip,
  ].filter(Boolean)
  return parts.join(' ')
}

// Helper function to convert Repliers listing to Property format
const convertRepliersToProperty = (listing: any): Property | null => {
  try {
    // Get coordinates from map field
    let coordinates: [number, number] = [-118.75, 34.19] // Default to Thousand Oaks area
    
    if (listing.map && listing.map.latitude && listing.map.longitude) {
      coordinates = [listing.map.longitude, listing.map.latitude]
    }

    // Get first image or use placeholder
    const images = listing.images && listing.images.length > 0
      ? listing.images.map((img: string) => img)
      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop']

    return {
      id: listing.mlsNumber || listing.boardId || Math.random().toString(),
      address: formatRepliersAddress(listing.address),
      price: listing.listPrice || 0,
      beds: listing.details?.numBedrooms || 0,
      baths: (listing.details?.numBathrooms || 0) + (listing.details?.numBathroomsPlus || 0),
      sqft: listing.details?.sqft || 0,
      lotSize: listing.lot?.sizeTotal || undefined,
      yearBuilt: listing.details?.yearBuilt || undefined,
      propertyType: listing.details?.propertyType || 'Residential',
      status: 'for-sale',
      images: images,
      coordinates: coordinates,
      daysOnMarket: listing.details?.daysOnMarket || undefined,
      pricePerSqft: listing.details?.sqft && listing.listPrice 
        ? Math.round(listing.listPrice / listing.details.sqft)
        : undefined
    }
  } catch (error) {
    console.error('Error converting Repliers listing:', error, listing)
    return null
  }
}

export default function PropertySearchPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [currentProperties, setCurrentProperties] = useState<Property[]>([])
  const [allListings, setAllListings] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Repliers listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/repliers-test')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch listings')
        }

        // Convert Repliers listings to Property format
        const properties = (result.listings || [])
          .map(convertRepliersToProperty)
          .filter((p: Property | null): p is Property => p !== null)

        console.log('✅ Loaded', properties.length, 'Repliers listings')
        setAllListings(properties)
        setCurrentProperties(properties)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching Repliers data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  const handlePropertiesUpdate = (properties: Property[]) => {
    setCurrentProperties(properties)
  }

  return (
    <div className="relative w-full h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Repliers.io Listings Map</h1>
            <div className="flex items-center space-x-4">
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              )}
              {!loading && !error && (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{allListings.length}</span> properties
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600">
                  Error: {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full pt-16">
        {!loading && !error && allListings.length > 0 ? (
          <PropertyMap 
            properties={allListings} 
            selectedProperty={selectedProperty}
          />
        ) : loading ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Repliers.io listings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center max-w-md">
              <div className="text-red-600 text-xl font-semibold mb-2">Error Loading Listings</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-600">No listings found</p>
          </div>
        )}
      </div>
    </div>
  )
}