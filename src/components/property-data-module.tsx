"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
  DownloadCloudIcon,
  ListCheckIcon,
  HouseIcon,
  ShowerHead,
  Scan,
  LandPlot,
  ArrowUpIcon,
  SparkleIcon,
  ChartAreaIcon,
  Sparkles,
  CircleQuestionMark
 
} from "lucide-react"
import { extractZipcode } from "@/lib/utils/address"
import type { MarketStatistics } from "@/lib/api/rentcast"
import { MOCK_PROPERTY_DATA, MOCK_MARKET_DATA, USE_MOCK_DATA, MOCK_SUBJECT_PROPERTY_DATA, MOCK_AVM_DATA, MOCK_COMPS_DATA, MOCK_PROPERTY_IMAGE, MOCK_VALUE_DATA } from "@/lib/mock-data"
import GaugeComponent from 'react-gauge-component';
import { Separator } from "@/components/ui/separator"
import { ChartLineInteractive } from "./ui/chart-line-interactive"
import { ChartAreaInteractive } from "./ui/chart-area-interactive"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { ChartRadar } from "./ui/chart-radar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { MapboxMap } from "./ui/mapbox-map"
import { PropertyDetailsSheet } from "./property-details-sheet"
import type image from "next/image"

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
  
  // need to kill this
  const [propertyData, setPropertyData] = useState<any>(null) 

  const [useMockData, setUseMockData] = useState<boolean>(true)
  const [subjectPropertyData, setSubjectPropertyData] = useState<any>(null)
  const [marketData, setMarketData] = useState<any>(null)
  const [avmData, setAvmData] = useState<any>(null)
  const [valueData, setValueData] = useState<any>(null)
  const [propertyImages, setPropertyImages] = useState<any>(null)
  const [comps, setComps] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1" | "3" | "5">("1")
  const [isTaxHistoryExpanded, setIsTaxHistoryExpanded] = useState(false)
  const [isPropertySheetOpen, setIsPropertySheetOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  // Handler for when a map marker is clicked
  const handleMarkerClick = (propertyData: any) => {
    setSelectedProperty(propertyData)
    setIsPropertySheetOpen(true)
  }
  
  useEffect(() => {
    console.log('PropertyDataModule - Address received:', address)
    console.log('PropertyDataModule - Address type:', typeof address)
    console.log('PropertyDataModule - useMockData:', useMockData)
    
    if (!address) {
      console.log('PropertyDataModule - No address provided, returning early')
      return
    }

    // Use mock data in development to avoid API calls
    if (useMockData) {
      console.log('Using mock data for development')
      
      setMarketData(MOCK_MARKET_DATA)
      
      setSubjectPropertyData(MOCK_SUBJECT_PROPERTY_DATA)
      setComps(MOCK_COMPS_DATA)
      setPropertyData(MOCK_PROPERTY_DATA)
      // Hardcoded AVM data to prevent page breaks
      setAvmData(MOCK_AVM_DATA)
      setValueData(MOCK_VALUE_DATA)
      // todo: get property images from API
      setPropertyImages(MOCK_PROPERTY_IMAGE)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Convert URL-friendly address format to API-friendly format
        const apiAddress = address.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        console.log('PropertyDataModule - Original address:', address)
        console.log('PropertyDataModule - Converted address for API:', apiAddress)
        
        //Fetch Subject Property Data
        const zillowUrl = `/api/zillow?location=${encodeURIComponent(apiAddress)}`
        console.log('PropertyDataModule - Zillow API URL:', zillowUrl)
        const subjectPropertyResponse = await fetch(zillowUrl)
        console.log('PropertyDataModule - Zillow response status:', subjectPropertyResponse.status)
        let subjectPropertyResult = null
        if (subjectPropertyResponse.ok) {
          subjectPropertyResult = await subjectPropertyResponse.json()
          setSubjectPropertyData(subjectPropertyResult)

          //Fetch Property Images using zpid from subject property data
          if (subjectPropertyResult?.zpid) {
            const propertyImagesResponse = await fetch(`/api/zillow/images?zpid=${encodeURIComponent(subjectPropertyResult.zpid)}`)
            if (propertyImagesResponse.ok) {
              const propertyImagesResult = await propertyImagesResponse.json()
              setPropertyImages(propertyImagesResult)
            }
          }
        }
        // Fetch AVM data
        const rentcastUrl = `/api/rentcast/value?address=${encodeURIComponent(apiAddress)}`
        console.log('PropertyDataModule - Rentcast API URL:', rentcastUrl)
        const avmResponse = await fetch(rentcastUrl)
        console.log('PropertyDataModule - Rentcast response status:', avmResponse.status)
        if (avmResponse.ok) {
          const avmResult = await avmResponse.json()
          setAvmData(avmResult)
          
        }

        //Fetch Comps using zpid from subject property data
        if (subjectPropertyResult?.zpid) {
          const compsResponse = await fetch(`/api/zillow/comps?zpid=${encodeURIComponent(subjectPropertyResult.zpid)}`)
          if (compsResponse.ok) {
            const compsResult = await compsResponse.json()
            setComps(compsResult)
          }
        }

        // Fetch market data
        const marketZipcode = zipcode || extractZipcode(address || '')
        if (marketZipcode) {
          const marketResponse = await fetch(`/api/rentcast/markets?zipcode=${encodeURIComponent(marketZipcode)}`)
          if (marketResponse.ok) {
            const marketResult = await marketResponse.json()
            setMarketData(marketResult)
          }
        }

        //Fetch ValueData using zpid from subject property data
        if (subjectPropertyResult?.zpid) {
          const valueDataResponse = await fetch(`/api/zillow/values?zpid=${encodeURIComponent(subjectPropertyResult.zpid)}`)
          if (valueDataResponse.ok) {
            const valueDataResult = await valueDataResponse.json()
            setValueData(valueDataResult)
          }
        }

        // Set property data with hardcoded values to prevent breaks
        setPropertyData({
          ...MOCK_PROPERTY_DATA,
          zestimate: avmData?.price || 850000,
          address: address
        })

      } catch (err) {
        setError('Network error while fetching data')
        console.error('Data fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [address, zipcode])

  

  const getMarketSpeedIndicator = (days: number) => {
    if (days < 30) return { 
      label: "Fast Market", 
      color: "bg-green-100 text-green-800", 
      icon: TrendingUp,
      description: `Properties sell quickly with high demand with an average of ${marketData?.saleData?.averageDaysOnMarket || 'N/A'} days on market. As a seller, you can expect competitive offers, potentially above asking price, and a faster closing timeline. This is an excellent time to list your property.`
    }
    if (days > 60) return { 
      label: "Slow Market", 
      color: "bg-red-100 text-red-800", 
      icon: TrendingDown,
      description: `Properties take longer to sell with lower demand with an average of ${marketData?.saleData?.averageDaysOnMarket || 'N/A'} days on market. As a seller, you may need to price competitively, consider staging improvements, and be prepared for longer marketing periods and potential price negotiations.`
    }
    return { 
      label: "Balanced Market", 
      color: "bg-blue-100 text-blue-800", 
      icon: Calendar,
      description: `Supply and demand are relatively equal with an average of ${marketData?.saleData?.averageDaysOnMarket || 'N/A'} days on market. As a seller, you can expect reasonable market activity with standard negotiation processes. Proper pricing and presentation are key to attracting qualified buyers.`
    }
  }

  const marketStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800"
    return "bg-red-100 text-red-800"
  }

  const borderStatusColor = (status: string) => {
    if (status === "Active") return "border-l-green-500"
    return "border-l-red-500"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
  }

  const nextImage = () => {
    if (propertyImages && propertyImages.images && propertyImages.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.images.length)
    }
  }

  const prevImage = () => {
    if (propertyImages && propertyImages.images && propertyImages.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyImages.images.length) % propertyImages.images.length)
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
  
  const pricePerSquareFoot = subjectPropertyData?.zestimate && subjectPropertyData?.livingAreaValue 
    ? Math.round((subjectPropertyData?.zestimate / subjectPropertyData?.livingAreaValue) * 100) / 100 
    : 0
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
      <div className="bg-sky-50 border-b border-sky-200 dark:bg-sky-900/20 dark:border-sky-800 sticky top-0 z-50">
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
          {/* Card Sidebar */}
          <div className="md:flex flex-col gap-8 hidden">

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
                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                      <Video className="h-4 w-4 mr-2" />
                      Schedule Zoom Call
                    </button>
                    <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule In Person
                    </button>
                    <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Chat with Mike Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
             {/* Resource Card Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="sticky top-20">
                <div className="bg-white rounded-lg shadow-sm border border-sky-200 dark:bg-gray-800 dark:border-sky-700">
                  <div className="text-center p-6">
                   
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resources</h3>
                
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                      <DownloadCloudIcon className="h-4 w-4 mr-2" />
                      Download Official CMA
                    </button>
                    <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                      <ListCheckIcon   className="h-4 w-4 mr-2" />
                     Download Sellers Checklist
                    </button>
                   
                  </div>
                </div>
              </div>
            </div> 
          </div>



          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Home Value Section */}
            <div id="home-value" className="bg-white rounded-lg shadow-sm border-2  dark:bg-gray-800 dark:border-sky-700">
              <div className="p-6">
                <div className="text-center mb-6">

                  {/* value */}
                  <div>
                    <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h2 className="text-lg font-semibold">{subjectPropertyData?.address?.streetAddress} | {subjectPropertyData?.address?.city} | {subjectPropertyData?.address?.state} | {subjectPropertyData?.address?.zipcode}</h2>  
                      <p className="text-lg block font-semibold bg-sky-100 px-4 py-2 rounded-full text-sky-600 dark:text-gray-400">Estimated Home Value</p>
                     
                    </div>
                  
                    <div className=" py-4 flex flex-col gap-y-4 text-xl">
                     
                        <p className="text-6xl font-bold text-sky-600 dark:text-sky-400">
                          {subjectPropertyData?.zestimate ? formatCurrency(subjectPropertyData?.zestimate) : formatCurrency(850000)}
                        </p>            
                    </div>

                    <div className="flex flex-row items-center gap-2 justify-center">
                      {/* one */}
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-semibold ">
                        
                          ${pricePerSquareFoot}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          per sq.ft.
                        </div>
                      </div>
                      <Separator orientation="vertical" />
                      {/* two */}
                      <div>
                        <div>
                          {/* TODO: Replace with dynamic confidence or range data from avmData */}
                          {avmData?.confidence || 'Low'}
                        </div>
                        <div>
                          confidence
                        </div>
                      </div>
                  
                    </div>
                  </div>

                  {/* images */}
                  {propertyImages?.images && propertyImages.images.length > 0 && (
                   <div className="relative mt-2">
                    <h3 className=" absolute top-2 left-2 bg-white px-2 py-1 rounded text-sky-600 dark:text-gray-400 text-sm font-semibold mb-2">
                      {propertyImages.images.length === 1 ? 'Property Image' : 'Property Images'}
                    </h3>
                    <img
                      src={propertyImages.images[currentImageIndex]}
                      alt={`Property photo ${currentImageIndex + 1}`}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    {propertyImages.images.length > 1 && (
                      <>
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
                          {propertyImages.images.map((_: any, index: number) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? "bg-sky-500" : "bg-white/60"
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  )}
                
                  
                </div>
                
                {/* value measure */}
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between text-gray-600">
                    <div>
                      Low Estimate
                    </div>
                    <div>
                      High Estimate
                      </div>
                  </div>
                  {/* value bar */}
                   {/* TODO: need to update this so its pulling accurate info that jives with Zillow data */}
                  <div className="bg-gradient-to-r from-sky-500 to-sky-800 h-2 rounded-sm">   </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="font-semibold text-lg">{formatCurrency(avmData?.priceRangeLow || 0)}</span>
                      <div>
                        {avmData?.priceRangeLow && avmData?.subjectProperty?.squareFootage 
                          ? formatCurrency(avmData?.priceRangeLow / avmData?.subjectProperty?.squareFootage) 
                          : '$0'}/sf
                      </div>
                     
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="font-semibold text-lg">{formatCurrency(avmData?.priceRangeHigh || 0)}</span>
                        <div>
                        {avmData?.priceRangeHigh && avmData?.subjectProperty?.squareFootage 
                          ? formatCurrency(avmData?.priceRangeHigh / avmData?.subjectProperty?.squareFootage) 
                          : '$0'}/sf
                        </div>
                    </div>
                  </div>
                  
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-transparent mt-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      <Bed className="w-6 h-6 mr-1" /> {subjectPropertyData?.bedrooms || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      <ShowerHead className="w-6 h-6 mr-1" />   {subjectPropertyData?.bathrooms || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                     <HouseIcon className="w-6 h-6 mr-1" /> {subjectPropertyData?.livingAreaValue ? subjectPropertyData.livingAreaValue.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Square Footage </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center  text-2xl font-semibold text-sky-600 dark:text-sky-400">
                      <LandPlot className="w-6 h-6 mr-1" /> {subjectPropertyData?.yearBuilt || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Year Built</div>
                  </div>
                </div>
                <Separator orientation="horizontal" className="my-4" />
                {/* sub section */}
                <div className="gap-y-4 flex flex-col">
                  
                  <ChartAreaInteractive address={avmData?.subjectProperty?.formattedAddress || address} valueData={valueData}/> 
                </div>
            
                
              </div>
            </div>

            {/* market stats component */}
            <div id="market-statistics" className="bg-white rounded-lg shadow-sm border  dark:bg-gray-800 dark:border-blue-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Market Statistics</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Detailed market trends and pricing analysis for your area
                  {marketData?.zipCode && ` (${marketData.zipCode})`}
                </p>

               
                <div className="flex flex-col gap-2 ">
          
                  <div className="flex flex-col items-start">
                 
                  {marketSpeed && (
                    
                    <div className="flex flex-col items-start gap-y-2 border border-blue-200 p-2 rounded-sm">
                      <div className="flex flex-row items-center gap-4">
                        <h2 className="font-semibold flex flex-row items-center gap-2">AI Market Assessment</h2>
                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium ${marketSpeed.color}`}>
                          <marketSpeed.icon className="h-4 w-4 mr-1" />
                          {marketSpeed.label}
                        </span>
                      </div>
                       
                      <div className="flex flex-row bg-sky-50 p-2 gap-2 rounded-sm">
                        <Sparkles className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                       <p className="text-sm text-gray-600 dark:text-gray-400  text-left">{marketSpeed.description}</p>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* cols */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">

                  {/* box */}
                  <ChartRadar marketData={marketData} />  

                  {/* box  */}  
                  <Card className="flex flex-col justify-between cursor-pointer hover:bg-blue-50">
                    <CardHeader>
                    <CardTitle className="text-slate-800">Average Price</CardTitle>
                    <CardDescription className="text-slate-600">
                    Average price of a <span className="font-semibold"> {avmData?.subjectProperty.propertyType}</span> in <span className="font-semibold"> {avmData?.subjectProperty.zipCode}</span>
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-y-4 justify-between">
                      {(() => {
                        // Get the subject property type from avmData
                        const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                        
                        // Find property type specific data from marketData
                        const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        console.log('subjectPropertyType:', subjectPropertyType);
                        console.log('propertyTypeData:', propertyTypeData);
                        console.log('dataByPropertyType:', marketData?.saleData?.dataByPropertyType);
                        
                        // Use property type specific data if available, otherwise fall back to general market data
                        const avgPrice = propertyTypeData?.averagePrice || marketData?.saleData?.averagePrice;
                        const minPrice = propertyTypeData?.minPrice || marketData?.saleData?.minPrice;
                        const maxPrice = propertyTypeData?.maxPrice || marketData?.saleData?.maxPrice;
                        
                        return (
                          <>
                            <h2 className="font-semibold text-5xl ">{formatCurrency(avgPrice)} <span className="text-gray-600 text-xs dark:text-gray-400">for {avmData?.subjectProperty?.propertyType || 'properties'}s</span></h2>
                            <Separator orientation="horizontal" className="my-4" />
                            <p className="text-xs"><span className="font-semibold">{avmData?.subjectProperty?.addressLine1 || 'Property'}</span> by comparison</p>
                            <Progress value={subjectPropertyData?.price / maxPrice * 100} className="w-full"/> 
                            <div className="flex w-full flex-row text-xs justify-between items-center gap-2">
                              <p>{formatCurrency(minPrice)} <span className="text-gray-600 text-xs dark:text-gray-400">(Low)</span></p>
                              <p>{formatCurrency(maxPrice)} <span className="text-gray-600 text-xs dark:text-gray-400">(High)</span></p>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                      {marketData?.saleData?.history && Object.keys(marketData.saleData.history).length > 0 && (() => {
                        // Get the subject property type from avmData
                        const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                        
                        // Find property type specific data from marketData
                        const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        // Get current property type specific average price
                        const currentPrice = propertyTypeData?.averagePrice || marketData?.saleData?.averagePrice;
                        
                        // Get historical data
                        const historyKeys = Object.keys(marketData.saleData.history).sort().reverse()
                        const firstHistoryEntry = marketData.saleData.history[historyKeys[1]]
                        
                        // Find historical property type data if it exists
                        const historicalPropertyTypeData = firstHistoryEntry?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        // Use historical property type price if available, otherwise fall back to general historical price
                        const previousPrice = historicalPropertyTypeData?.averagePrice || firstHistoryEntry?.averagePrice;
                        
                        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
                        const isPositive = change > 0;
                        
                        return (
                          <>  
                            <div className="flex items-center gap-2 leading-none font-medium">
                              {isPositive ? (
                                <span className="flex flex-row items-center gap-2 align-middle">
                                  Trending up by <span className="font-semibold bg-green-100 p-1 rounded-sm">+{change.toFixed(1)}%</span> this month <TrendingUp className="h-4 w-4 " />
                                </span>
                              ) : (
                                <span className="flex flex-row items-center gap-2 align-middle ">
                                  Trending down by <span className="font-semibold bg-red-100 p-1 rounded-sm">-{Math.abs(change).toFixed(1)}%</span> this month <TrendingDown className="h-4 w-4" />
                                </span>
                              )} 
                            </div>
                          </>
                        )
                      })()}
                    </CardFooter>
                  </Card>

                  {/* box 3  */}
                  <Card className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Average Days on Market</CardTitle>
                      <CardDescription className="text-slate-600">
                        Real estate market conditions assessment
                      </CardDescription>
                    </CardHeader>
                
                    <CardContent className="flex items-center justify-center">
                      {(() => {
                        // Get the subject property type from avmData
                        const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                        
                        // Find property type specific data from marketData
                        const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        // Use property type specific days on market if available, otherwise fall back to general market data
                        const avgDaysOnMarket = propertyTypeData?.averageDaysOnMarket || marketData?.saleData?.averageDaysOnMarket;
                        
                        return (
                          <span className="font-semibold text-6xl ">{Math.round(avgDaysOnMarket)}</span>
                        );
                      })()}
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                
                      {marketData?.saleData?.history && Object.keys(marketData.saleData.history).length > 0 && (() => {
                      // Get the subject property type from avmData
                      const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                      
                      // Find property type specific data from marketData
                      const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                        (data: any) => data.propertyType === subjectPropertyType
                      );
                      
                      // Use property type specific days on market if available, otherwise fall back to general market data
                      const currentDays = propertyTypeData?.averageDaysOnMarket || marketData.saleData.averageDaysOnMarket
                      const historyKeys = Object.keys(marketData.saleData.history).sort().reverse()
                      const firstHistoryEntry = marketData.saleData.history[historyKeys[1]]
                      const previousDays = firstHistoryEntry.averageDaysOnMarket
                      const change = ((currentDays - previousDays) / previousDays) * 100
                      const isPositive = change > 0
                      
                      return (
                      <>  
                 
                        <div className="flex items-center gap-2 leading-none font-medium">
                       {isPositive ? (
                        <span className="flex flex-row items-center gap-2 align-middle">Trending up by <span className="font-semibold bg-green-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingUp className="h-4 w-4 " /></span>
                       ):(
                        <span className="flex flex-row items-center gap-2 align-middle">Trending down by <span className="font-semibold bg-red-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingDown className="h-4 w-4" /></span>
                       )} 
                      </div>
                      {/* <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        January - June 2024
                      </div> */}

                        </>
                        )
                      })()}
                    </CardFooter>
                 
                 </Card>   


                {/* box 3 */}
                 <Card className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Total Listings</CardTitle>
                      <CardDescription className="text-slate-600">
                        Real estate market conditions assessment
                      </CardDescription>
                    </CardHeader>
                
                    <CardContent className="flex items-center justify-center">
                        <span className="font-semibold text-6xl ">{marketData?.saleData.totalListings}</span>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                
                      {marketData?.saleData?.history && Object.keys(marketData.saleData.history).length > 0 && (() => {
                      const currentTotalListings = marketData.saleData.totalListings
                      const historyKeys = Object.keys(marketData.saleData.history).sort().reverse()
                      const firstHistoryEntry = marketData.saleData.history[historyKeys[1]]
                      const previousTotalListings = firstHistoryEntry.totalListings
                      const change = ((currentTotalListings - previousTotalListings) / previousTotalListings) * 100
                      const isPositive = change > 0
                      
                      return (
                      <>  
                 
                        <div className="flex items-center gap-2 leading-none font-medium">
                       {isPositive ? (
                        <span className="flex flex-row items-center gap-2 align-middle">Trending up by <span className="font-semibold bg-green-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingUp className="h-4 w-4 " /></span>
                       ):(
                        <span className="flex flex-row items-center gap-2 align-middle">Trending down by <span className="font-semibold bg-red-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingDown className="h-4 w-4" /></span>
                       )} 
                      </div>
                      {/* <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        January - June 2024
                      </div> */}

                        </>
                        )
                      })()}
                    </CardFooter>
                 
                 </Card>   
                </div>

                {/* end cols */}

           
                </div>
                {/* <ChartLineInteractive /> */}
      

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


            {/* comparables */}
             <div id="comps" className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Sales Comparables</h3>
                        <p className="text-sm text-gray-600">Buy and Sell histories of comparable properties</p>
                    </div>

                    {/* mapbox */}
                    
                   
                   
                  </div>
                 
                  <div className="relative">
                  <MapboxMap 
                      center={[avmData?.subjectProperty?.longitude || -98.3518, avmData?.subjectProperty?.latitude || 29.4241]}
                      zoom={14}
                      markers={[
                        // Subject property marker
                        {
                          coordinates: [avmData?.subjectProperty?.longitude || -98.3518, avmData?.subjectProperty?.latitude || 29.4241],
                          title: "Subject Property",
                          description: avmData?.subjectProperty?.formattedAddress,
                          color: "#EF4444", // Red for subject property
                          image: propertyImages?.images?.[0] || undefined,
                          data: avmData?.subjectProperty
                        },
                        // Comparable properties markers
                        ...(comps?.comps?.map((comp: any, index: number) => ({
                          coordinates: [comp.longitude, comp.latitude],
                          title: `${comp.formattedChip.location[0].fullValue}, ${comp.formattedChip.location[1].fullValue}`,
                          description: `${comp.address?.streetAddress} - ${formatCurrency(comp.price)}`,
                          color: "#3B82F6", // Blue for comparables
                          image: comp.miniCardPhotos?.[0]?.url,
                          data: comp
                        })) || [])
                      ]}
                      className="w-full h-80 mb-4"
                      onMarkerClick={handleMarkerClick}
                    />
                  {comps?.comps?.map((comp: any, index: number) => (
                    <div key={index} className={`flex flex-row justify-between items-center gap-4 mb-2  p-2 rounded-sm border border-gray-200 border-l-2 ${borderStatusColor(comp.homeStatus)}`}>
                      <div>
                      <p className="text-sm text-gray-600">{comp.formattedChip.location[0].fullValue}, {comp.formattedChip.location[1].fullValue}</p>
                        <p className="text-2xl font-semibold">{formatCurrency(comp.price)}</p>
                      </div>
                      <div className="text-gray-500 flex flex-col justify-start text-left">
                        <div className="flex items-center gap-4 justify-items-start">
                          <p className="flex items-center gap-4"><span className="w-4 "><Bed /></span>{comp.bedrooms}</p>
                          <p className="flex items-center gap-4"><span className="w-4 "><ShowerHead /></span>{comp.bathrooms}</p>
                          <p className="flex flex-row items-center gap-4"><span className="w-4  "><Scan /></span>{comp.livingArea}</p>
                        </div>
                       
                      </div>
                      
                     <div className="flex flex-row gap-2 items-center">
                     <p className={`text-sm font-medium ${marketStatusColor(comp.homeStatus)} py-1 px-2 rounded-sm`}>
                      {comp.homeStatus === "RECENTLY_SOLD" ? "Sold" : comp.homeStatus}
                     </p>
                      <Image 
                        className="rounded-sm" 
                        src={comp.miniCardPhotos?.[0]?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0yNSAzNUg3NVY2NUgyNVYzNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPHA+CjxwYXRoIGQ9Ik00NSA1NUw1NSA0NUw2NSA1NUw3MCA2MEgyNUw0NSA1NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIj5OTyBJTUFHRTwvdGV4dD4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM2QjcyODAiPkFWQUlMQUJMRTwvdGV4dD4KPC9zdmc+"} 
                        alt={comp.address?.streetAddress || "Property"} 
                        width={100} 
                        height={100}
                        unoptimized={true}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('data:image/svg+xml')) {
                            target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0yNSAzNUg3NVY2NUgyNVYzNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPHA+CjxwYXRoIGQ9Ik00NSA1NUw1NSA0NUw2NSA1NUw3MCA2MEgyNUw0NSA1NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIj5OTyBJTUFHRTwvdGV4dD4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM2QjcyODAiPkFWQUlMQUJMRTwvdGV4dD4KPC9zdmc+";
                          }
                        }}
                      />  
                     
                     </div>
                   
                     
                    </div>
                    ))}
                  </div>
           
                </div>
              </div>
          



           

         
          </div>
        </div>
      </div>

      {/* Property Details Sheet */}
      <PropertyDetailsSheet
        isOpen={isPropertySheetOpen}
        onOpenChange={setIsPropertySheetOpen}
        property={selectedProperty}
      />
    </div>
  )
}
