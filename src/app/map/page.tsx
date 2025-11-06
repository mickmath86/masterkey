'use client'

import { useState } from 'react'
import PropertySearchLayout from '@/components/property-search-layout'
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

// Mock property data - replace with real API
const mockProperties: Property[] = [
  {
    id: '1',
    address: '123 Main St, San Francisco, CA 94102',
    price: 1200000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    lotSize: 5000,
    yearBuilt: 1995,
    propertyType: 'Single Family',
    status: 'for-sale',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'],
    coordinates: [-122.4194, 37.7749],
    daysOnMarket: 15,
    pricePerSqft: 667
  },
  {
    id: '2',
    address: '456 Oak Ave, San Francisco, CA 94103',
    price: 850000,
    beds: 2,
    baths: 1,
    sqft: 1200,
    propertyType: 'Condo',
    status: 'for-sale',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'],
    coordinates: [-122.4094, 37.7849],
    daysOnMarket: 8,
    pricePerSqft: 708
  },
  {
    id: '3',
    address: '789 Pine St, San Francisco, CA 94104',
    price: 4500,
    beds: 1,
    baths: 1,
    sqft: 800,
    propertyType: 'Apartment',
    status: 'for-rent',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'],
    coordinates: [-122.3994, 37.7949]
  }
]

export default function PropertySearchPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [currentProperties, setCurrentProperties] = useState<Property[]>([])

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  const handlePropertiesUpdate = (properties: Property[]) => {
    setCurrentProperties(properties)
  }

  return (
    <PropertySearchLayout 
      properties={mockProperties}
      onPropertySelect={handlePropertySelect}
      onPropertiesUpdate={handlePropertiesUpdate}
    >
      <PropertyMap 
        properties={currentProperties} 
        selectedProperty={selectedProperty}
      />
    </PropertySearchLayout>
  )
}