'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/components/button'
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  MapIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import { GooglePlacesInput } from '@/components/ui/google-places-input'

interface SearchFilters {
  searchType: 'for-sale' | 'for-rent' | 'sold'
  location: string
  priceMin: string
  priceMax: string
  beds: string
  baths: string
  homeType: string[]
  sqftMin: string
  sqftMax: string
  lotSizeMin: string
  lotSizeMax: string
  yearBuiltMin: string
  yearBuiltMax: string
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

interface PropertySearchLayoutProps {
  children: ReactNode
  properties: Property[]
  onPropertySelect?: (property: Property) => void
  onPropertiesUpdate?: (properties: Property[]) => void
}

const homeTypes = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Apartment',
  'Mobile/Manufactured',
  'Land/Lot'
]

export default function PropertySearchLayout({ 
  children, 
  properties, 
  onPropertySelect,
  onPropertiesUpdate 
}: PropertySearchLayoutProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'for-sale',
    location: '',
    priceMin: '',
    priceMax: '',
    beds: '',
    baths: '',
    homeType: [],
    sqftMin: '',
    sqftMax: '',
    lotSizeMin: '',
    lotSizeMax: '',
    yearBuiltMin: '',
    yearBuiltMax: ''
  })

  // Fetch properties from API
  const fetchProperties = async () => {
    if (!filters.location) {
      setFilteredProperties([])
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        location: filters.location,
        status_type: filters.searchType
      })

      // Add optional filters
      if (filters.priceMin) {
        if (filters.searchType === 'for-rent') {
          params.append('rentMinPrice', filters.priceMin)
        } else {
          params.append('minPrice', filters.priceMin)
        }
      }
      if (filters.priceMax) {
        if (filters.searchType === 'for-rent') {
          params.append('rentMaxPrice', filters.priceMax)
        } else {
          params.append('maxPrice', filters.priceMax)
        }
      }
      if (filters.beds) {
        const bedsNum = parseInt(filters.beds)
        params.append('bedsMin', bedsNum.toString())
      }
      if (filters.baths) {
        const bathsNum = parseFloat(filters.baths)
        params.append('bathsMin', bathsNum.toString())
      }
      if (filters.homeType.length === 1) {
        params.append('home_type', filters.homeType[0])
      }
      if (filters.sqftMin) params.append('sqftMin', filters.sqftMin)
      if (filters.sqftMax) params.append('sqftMax', filters.sqftMax)
      if (filters.yearBuiltMin) params.append('buildYearMin', filters.yearBuiltMin)
      if (filters.yearBuiltMax) params.append('buildYearMax', filters.yearBuiltMax)
      if (filters.lotSizeMin) params.append('lotSizeMin', filters.lotSizeMin)
      if (filters.lotSizeMax) params.append('lotSizeMax', filters.lotSizeMax)

      const response = await fetch(`/api/properties/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }

      const data = await response.json()
      const newProperties = data.properties || []
      setFilteredProperties(newProperties)
      onPropertiesUpdate?.(newProperties)
    } catch (err) {
      setError('Failed to load properties. Please try again.')
      console.error('Property search error:', err)
      setFilteredProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger search when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProperties()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [filters])

  const formatPrice = (price: number | undefined | null, status: string) => {
    if (!price || price === 0) {
      return 'Price not available'
    }
    if (status === 'for-rent') {
      return `$${price.toLocaleString()}/mo`
    }
    return `$${price.toLocaleString()}`
  }

  const handlePropertyClick = (property: Property) => {
    onPropertySelect?.(property)
  }

  const handleSearch = () => {
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Property Search</h1>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              {/* Filters button only on mobile/tablet */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              {/* Map/List toggle only on mobile/tablet */}
              <div className="lg:hidden flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <GooglePlacesInput
                value={filters.location}
                onChange={(address) => setFilters(prev => ({ ...prev, location: address }))}
                placeholder="Enter city"
                types={['(cities)']}
                className="w-full"
                showValidation={false}
              />
            </div>
            <Button 
              className="px-6" 
              onClick={handleSearch}
              disabled={isLoading || !filters.location}
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Filters Bar (lg and above) */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            {/* Listing Type - Desktop only */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={filters.searchType}
                onChange={(e) => setFilters(prev => ({ ...prev, searchType: e.target.value as 'for-sale' | 'for-rent' | 'sold' }))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Price:</label>
              <div className="flex space-x-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Beds */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Beds:</label>
              <select
                value={filters.beds}
                onChange={(e) => setFilters(prev => ({ ...prev, beds: e.target.value }))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Baths */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Baths:</label>
              <select
                value={filters.baths}
                onChange={(e) => setFilters(prev => ({ ...prev, baths: e.target.value }))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Home Type Dropdown */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Property:</label>
              <select
                value={filters.homeType.length === 1 ? filters.homeType[0] : ''}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFilters(prev => ({ ...prev, homeType: [] }))
                  } else {
                    setFilters(prev => ({ ...prev, homeType: [e.target.value] }))
                  }
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">Any Property</option>
                {homeTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Square Footage */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sqft:</label>
              <div className="flex space-x-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.sqftMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, sqftMin: e.target.value }))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.sqftMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, sqftMax: e.target.value }))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                searchType: filters.searchType,
                location: filters.location,
                priceMin: '',
                priceMax: '',
                beds: '',
                baths: '',
                homeType: [],
                sqftMin: '',
                sqftMax: '',
                lotSizeMin: '',
                lotSizeMax: '',
                yearBuiltMin: '',
                yearBuiltMax: ''
              })}
              className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              Clear filters
            </button>

            {/* Results Count */}
            <div className="ml-auto">
              <span className="text-sm text-gray-600">
                {filteredProperties.length} properties
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Filters Panel (below lg) */}
      {showFilters && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Listing Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Listing Type</label>
                <select
                  value={filters.searchType}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchType: e.target.value as 'for-sale' | 'for-rent' | 'sold' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Beds */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Beds</label>
                <select
                  value={filters.beds}
                  onChange={(e) => setFilters(prev => ({ ...prev, beds: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Baths */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Baths</label>
                <select
                  value={filters.baths}
                  onChange={(e) => setFilters(prev => ({ ...prev, baths: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="1.5">1.5+</option>
                  <option value="2">2+</option>
                  <option value="2.5">2.5+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Home Type Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Home Type</label>
                <select
                  value={filters.homeType.length === 1 ? filters.homeType[0] : ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setFilters(prev => ({ ...prev, homeType: [] }))
                    } else {
                      setFilters(prev => ({ ...prev, homeType: [e.target.value] }))
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any Type</option>
                  {homeTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Square Footage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Square Feet
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.sqftMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, sqftMin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.sqftMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, sqftMax: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {filteredProperties.length} properties found
              </span>
              <button
                onClick={() => setFilters({
                  searchType: filters.searchType,
                  location: filters.location,
                  priceMin: '',
                  priceMax: '',
                  beds: '',
                  baths: '',
                  homeType: [],
                  sqftMin: '',
                  sqftMax: '',
                  lotSizeMin: '',
                  lotSizeMax: '',
                  yearBuiltMin: '',
                  yearBuiltMax: ''
                })}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Property List (Always visible on lg+, conditional on smaller screens) */}
        <div className={`bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 max-h-full ${
          // Always show on large screens, conditionally show on smaller screens
          'lg:w-96 lg:block' + 
          (viewMode === 'list' ? ' w-full md:w-1/2 block' : ' hidden')
        }`}>
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isLoading ? 'Searching...' : `${filteredProperties.length} Properties Found`}
              </h2>
              {error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading properties...</span>
                </div>
              ) : filteredProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="flex">
                    {/* Property Image */}
                    <div className="w-24 h-20 flex-shrink-0">
                      <img
                        src={property.images[0]}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(property.price, property.status)}
                        </div>
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {property.status === 'for-sale' ? 'For Sale' : property.status === 'for-rent' ? 'For Rent' : 'Sold'}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-1">
                        {property.beds} bed • {property.baths} bath • {property.sqft.toLocaleString()} sqft
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {property.address}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        {property.daysOnMarket && (
                          <span>{property.daysOnMarket} days on market</span>
                        )}
                        {property.pricePerSqft && (
                          <span>${property.pricePerSqft}/sqft</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {!isLoading && filteredProperties.length === 0 && filters.location && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2">No properties found</div>
                  <div className="text-sm text-gray-400">Try adjusting your search criteria</div>
                </div>
              )}
              
              {!isLoading && !filters.location && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2">Enter a city to search for properties</div>
                  <div className="text-sm text-gray-400">Use the search bar above to get started</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content - Map (Remaining width after sidebar) */}
        <div className={`relative flex-1 ${viewMode === 'list' ? 'lg:block md:block hidden' : 'block'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
