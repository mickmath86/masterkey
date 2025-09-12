"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Bed,
  Bath,
  Square,
  TrendingUp,
  TrendingDown,
  Download,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Video,
  UserCheck,
  Star,
} from "lucide-react"
import { extractZipcode } from "@/lib/utils/address"
import type { MarketStatistics } from "@/lib/api/rentcast"
import { MOCK_PROPERTY_DATA, MOCK_MARKET_DATA, USE_MOCK_DATA } from "@/lib/mock-data"
import GaugeComponent from 'react-gauge-component';

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // or 2 if you want cents
});

const agentData = {
  name: "Mike Mathias",
  avatar: "/mike-avatar.png",
  title: "Senior Real Estate Agent",
  rating: 4.9,
  reviews: 127,
  yearsExperience: 8,
}

interface PropertyDataModuleProps {
  address?: string;
  zipcode?: string;
}

export function PropertyDataModule({ address, zipcode }: PropertyDataModuleProps) {
  const router = useRouter()
  const [propertyData, setPropertyData] = useState<any>(null)
  const [marketData, setMarketData] = useState<MarketStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1" | "3" | "5">("1")
  const [isTaxHistoryExpanded, setIsTaxHistoryExpanded] = useState(false)
  
  useEffect(() => {
    if (!address) return

    // Use mock data in development to avoid API calls
    if (USE_MOCK_DATA) {
      console.log('Using mock data for development')
      setMarketData(MOCK_MARKET_DATA as MarketStatistics)
      setIsLoading(false)
      return
    }

    const fetchMarketData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const marketZipcode = zipcode || extractZipcode(address || '')
        if (!marketZipcode) {
          setError('Unable to determine zipcode for market data')
          return
        }

        const response = await fetch(`/api/rentcast/markets?zipcode=${encodeURIComponent(marketZipcode)}`)
        
        if (response.ok) {
          const data = await response.json()
          setMarketData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch market data')
        }
      } catch (err) {
        setError('Network error while fetching market data')
        console.error('Market data fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [address, zipcode])

  useEffect(() => {
    if (!address) return

    // Use mock data in development to avoid API calls
    if (USE_MOCK_DATA) {
      console.log('Using mock property data for development')
      setPropertyData(MOCK_PROPERTY_DATA)
      setIsLoading(false)
      return
    }

    let didCancel = false

    const fetchPropertyData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/zillow?location=${encodeURIComponent(address)}`)
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const propertyResult = await response.json()

        if (!didCancel) {
          setPropertyData(propertyResult)
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.warn('API failed, using fallback data:', errorMessage)
        if (!didCancel) {
          setError(errorMessage)
          setPropertyData({
            address: address,
            price: 1250000,
            bedrooms: 3,
            bathrooms: 2,
            livingArea: 2100,
            zestimate: 1250000,
            propertyType: 'Single Family Home',
            homeStatus: 'For Sale',
            isFallback: true
          })
        }
      } finally {
        if (!didCancel) {
          setIsLoading(false)
        }
      }
    }

    fetchPropertyData()

    return () => {
      didCancel = true
    }
  }, [address])

  const getMarketSpeedIndicator = (days: number) => {
    if (days < 30) return { 
      label: "Fast Market", 
      color: "bg-green-100 text-green-800", 
      icon: TrendingUp,
      description: "Properties sell quickly with high demand. As a seller, you can expect competitive offers, potentially above asking price, and a faster closing timeline. This is an excellent time to list your property."
    }
    if (days > 60) return { 
      label: "Slow Market", 
      color: "bg-red-100 text-red-800", 
      icon: TrendingDown,
      description: "Properties take longer to sell with lower demand. As a seller, you may need to price competitively, consider staging improvements, and be prepared for longer marketing periods and potential price negotiations."
    }
    return { 
      label: "Balanced Market", 
      color: "bg-blue-100 text-blue-800", 
      icon: Calendar,
      description: "Supply and demand are relatively equal. As a seller, you can expect reasonable market activity with standard negotiation processes. Proper pricing and presentation are key to attracting qualified buyers."
    }
  }

  const nextImage = () => {
    if (propertyData && propertyData.photos && propertyData.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyData.photos.length)
    }
  }

  const prevImage = () => {
    if (propertyData && propertyData.photos && propertyData.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyData.photos.length) % propertyData.photos.length)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-md dark:bg-gray-700 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 mb-8 w-2/3"></div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-sky-500 bg-sky-100 dark:bg-sky-900 dark:text-sky-300">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading property data...
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading property data
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">No property data available</p>
          </div>
        </div>
      </div>
    )
  }

  // Format address for display
  const displayAddress = typeof propertyData.address === 'object' 
    ? `${propertyData.address.streetAddress || ''}, ${propertyData.address.city || ''}, ${propertyData.address.state || ''} ${propertyData.address.zipcode || ''}`.trim()
    : propertyData.address || address

  const avgDaysOnMarket = marketData?.saleData?.averageDaysOnMarket
  const marketSpeed = avgDaysOnMarket ? getMarketSpeedIndicator(avgDaysOnMarket) : null
  
  // Calculate maxPrice as 1.25x the property price from Zillow API
  const propertyPrice = propertyData?.zestimate || propertyData?.price || 0
  const maxPrice = propertyPrice > 0 ? propertyPrice * 1.25 : 1800000

  // Console log to verify maxPrice calculation
  console.log('MaxPrice Calculation Debug:', {
    propertyPrice: propertyPrice,
    zestimate: propertyData?.zestimate,
    price: propertyData?.price,
    calculatedMaxPrice: propertyPrice > 0 ? propertyPrice * 1.25 : 'Using fallback: 1800000',
    finalMaxPrice: maxPrice,
    isUsingFallback: propertyPrice <= 0
  })
  
  // Set minimum value to 0 as requested
  const minPrice = 0
  
  // Calculate gauge limits as percentages of maxPrice (must be in ascending order)
  const limit50Percent = maxPrice * 0.50 // 50% of maxPrice
  const limit75Percent = maxPrice * 0.75 // 75% of maxPrice  
  const limit80Percent = maxPrice * 0.80 // 80% of maxPrice

  // Console log the calculated values for debugging
  console.log('Gauge Values:', {
    minPrice,
    limit50Percent,
    limit75Percent,
    limit80Percent,
    maxPrice
  })
 
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back to search
            </button>
            <div className="flex items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{displayAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-sky-50 border-b border-sky-200 dark:bg-sky-900/20 dark:border-sky-800 sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <button
              onClick={() => scrollToSection("home-value")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home Value
            </button>
            <button
              onClick={() => scrollToSection("property-photos")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Photos & Map
            </button>
            <button
              onClick={() => scrollToSection("property-details")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Property Details
            </button>
            <button
              onClick={() => scrollToSection("market-statistics")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Market Data
            </button>
            {propertyData?.taxHistory && propertyData.taxHistory.length > 0 && (
              <button
                onClick={() => scrollToSection("tax-history")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Tax History
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Agent Card Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="bg-white rounded-lg shadow-sm border border-sky-200 dark:bg-gray-800 dark:border-sky-700">
                <div className="text-center p-6">
                  <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-3">
                    <img
                      src={agentData.avatar || "/placeholder.svg"}
                      alt={agentData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agentData.name}</h3>
                  <p className="text-sky-700 dark:text-sky-300">{agentData.title}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-sky-600 dark:text-sky-400 mt-2">
                    <span>⭐ {agentData.rating}</span>
                    <span>•</span>
                    <span>{agentData.reviews} reviews</span>
                    <span>•</span>
                    <span>{agentData.yearsExperience} years</span>
                  </div>
                </div>
                <div className="px-6 pb-6 space-y-3">
                  <button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-md font-medium flex items-center justify-center">
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Zoom Call
                  </button>
                  <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 rounded-md font-medium flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule In Person
                  </button>
                  <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 rounded-md font-medium flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Chat with Mike Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Home Value Section */}
            <div id="home-value" className="bg-white rounded-lg shadow-sm border-2 border-sky-200 dark:bg-gray-800 dark:border-sky-700">
              <div className="p-6">
                <div className="text-center mb-6">
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">Estimated Home Value</p>
                  <div className="z-20">

                    <GaugeComponent 
                        type="semicircle"
                        style={{
                            
                        }}
                        arc={{
                          subArcs: [
                            {
                              limit: limit50Percent,
                              color: "#f97316"
                            }, 
                            {
                              limit: limit75Percent,
                              color: "#10b981"
                            },
                            {
                              limit: limit80Percent,
                              color: "#0ea5e9"
                            },
             
                          ]
                        }}

                        pointer={{type: "blob"}}
                        minValue={minPrice}
                        maxValue={maxPrice}
                        value={propertyData.zestimate || propertyData.price || 0}
                        labels={{
                          valueLabel: {
                            // Center number (inside the gauge)
                            formatTextValue: (v: number) => usd.format(v),
                            matchColorWithArc: true,
                          },
                          tickLabels: {
                            // Axis tick numbers
                            defaultTickValueConfig: {
                              formatTextValue: (v: number) => usd.format(v),
                            },
                          },
                        }}
                  
                        // value={80}
                    />
                  </div>
                  {/* <h2 className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                    {formatCurrency(propertyData.zestimate || propertyData.price)}
                  </h2> */}
                  
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-transparent">
                  <div className="space-y-1">
                    <div className="text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      {marketData?.saleData?.averageDaysOnMarket || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Days on Market</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      {marketData?.saleData?.averagePrice ? formatCurrency(marketData.saleData.averagePrice) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Sales Price</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      {marketData?.saleData?.newListings || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">New Listings <span className="text-xs text-gray-500">(last 6 months)</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      {marketData?.saleData?.averagePricePerSquareFoot ? `$${marketData.saleData.averagePricePerSquareFoot}` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Price per Sq Ft</div>
                  </div>
                </div>

                {marketSpeed && (
                  <div className="mt-6 flex items-center flex-col gap-2 justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${marketSpeed.color}`}>
                      <marketSpeed.icon className="h-4 w-4 mr-1" />
                      {marketSpeed.label}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md text-center">{marketSpeed.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Property Photos - Only render if photos exist */}
            {propertyData.photos && propertyData.photos.length > 0 && (
              <div id="property-photos" className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Photos</h3>
                  <div className="relative">
                    <img
                      src={propertyData.photos[currentImageIndex]}
                      alt={`Property photo ${currentImageIndex + 1}`}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-md"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {propertyData.photos.map((_: any, index: number) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-sky-500" : "bg-white/60"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div id="property-details" className="bg-white rounded-lg shadow-sm border border-emerald-200 dark:bg-gray-800 dark:border-emerald-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Bed className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{propertyData.bedrooms || 'N/A'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{propertyData.bathrooms || 'N/A'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Square className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{propertyData.livingArea ? formatNumber(propertyData.livingArea) : 'N/A'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{propertyData.yearBuilt || 'N/A'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Year Built</div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700 mb-6" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Property Type</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {propertyData.propertyType || 'Single Family Home'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Lot Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">{propertyData.lotSize || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Sold</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {propertyData.lastSold ? 
                        `${formatCurrency(propertyData.lastSold.price)} (${new Date(propertyData.lastSold.date).getFullYear()})` : 
                        'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Statistics */}
            <div id="market-statistics" className="bg-white rounded-lg shadow-sm border border-blue-200 dark:bg-gray-800 dark:border-blue-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Market Statistics</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Detailed market trends and pricing analysis for your area
                  {marketData?.zipCode && ` (${marketData.zipCode})`}
                </p>

                {marketData && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Market Insights</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {marketData.saleData?.averageDaysOnMarket && (
                        <p>
                          Properties in this area typically sell within{' '}
                          <strong>{marketData.saleData.averageDaysOnMarket} days</strong>
                          {marketData.saleData.averageDaysOnMarket < 30 ? ' - a fast-moving market!' : 
                           marketData.saleData.averageDaysOnMarket > 60 ? ' - buyers have more time to decide.' : 
                           ' - a balanced market.'}
                        </p>
                      )}
                      {marketData.rentalData?.averageRentPrice && (
                        <p>
                          Average rental price in the area: <strong>{formatCurrency(marketData.rentalData.averageRentPrice)}/month</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {error && !marketData && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700">
                    <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Market Data Unavailable</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {error.includes('No market data available') 
                        ? `Market statistics are not available for this zip code in our database.`
                        : 'Unable to load current market data. Please try again later.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tax History */}
            {propertyData.taxHistory && propertyData.taxHistory.length > 0 && (
              <div id="tax-history" className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6">
                  <button
                    onClick={() => setIsTaxHistoryExpanded(!isTaxHistoryExpanded)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Tax History
                    </h3>
                    <svg 
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isTaxHistoryExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isTaxHistoryExpanded && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tax Year</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tax Amount</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Assessed Value</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Land Value</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Building Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propertyData.taxHistory.map((tax: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{tax.taxYear || tax.year}</td>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                {tax.taxPaid || tax.taxAmount ? usd.format(tax.taxPaid || tax.taxAmount) : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                {tax.value || tax.assessedValue ? usd.format(tax.value || tax.assessedValue) : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                {tax.landValue ? usd.format(tax.landValue) : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                {tax.buildingValue || tax.improvementValue ? usd.format(tax.buildingValue || tax.improvementValue) : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {propertyData.taxHistory.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <p>No tax history available for this property.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-md font-medium">
                <Download className="h-4 w-4" />
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
