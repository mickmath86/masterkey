"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { getZillowAPI } from '@/lib/api/zillow'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, Legend } from "recharts"
import {
  Home,
  Bed,
  Bath,
  Square,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Video,
  UserCheck,
  ArrowRight,
  TrendingDown,
  Star,
} from "lucide-react"
import { ChartRadialStacked } from "./ui/chart-radial-stacked"
import { ChartArea } from "./ui/area-chart"
import { GoogleMap } from "./ui/google-map"
import { extractZipcode } from "@/lib/utils/address"
import type { MarketStatistics } from "@/lib/api/rentcast"
import { MarketInsights } from "./ui/market-insights"

const agentData = {
  name: "Mike Mathias",
  avatar: "/mike-avatar.png",
  title: "Senior Real Estate Agent",
  rating: 4.9,
  reviews: 127,
  yearsExperience: 8,
}

interface MarketInsightsProps {
  address: string
  className?: string
}

interface PropertyDataModuleProps {
  address?: string;
  zipcode?: string;
}

export function PropertyDataModule({ address, zipcode }: PropertyDataModuleProps) {
  const [propertyData, setPropertyData] = useState<any>(null)
  const [marketData, setMarketData] = useState<MarketStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!address) return

    const fetchMarketData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Use zipcode parameter if provided, otherwise extract from address
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

  
    const getMarketSpeedIndicator = (days: number) => {
      if (days < 30) return { label: "Fast Market", color: "bg-green-100 text-green-800", icon: TrendingUp }
      if (days > 60) return { label: "Slow Market", color: "bg-red-100 text-red-800", icon: TrendingDown }
      return { label: "Balanced Market", color: "bg-blue-100 text-blue-800", icon: Calendar }
    }



  useEffect(() => {
    if (!address) return

    let didCancel = false // Prevent state updates if component unmounts

    const fetchPropertyData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Call our server-side API route instead of direct RapidAPI
        const response = await fetch(`/api/zillow?location=${encodeURIComponent(address)}`)
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const propertyResult = await response.json()

        if (!didCancel) {
          setPropertyData(propertyResult)
          
          // Fetch market data using Rentcast API
          await fetchMarketData(address)
        }
      } catch (err: any) {
        console.warn('API failed, using fallback data:', err.message)
        if (!didCancel) {
          setError(err.message)
          // Fallback data will be provided by the server route
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

    const fetchMarketData = async (address: string) => {
      try {
        const response = await fetch(`/api/rentcast/markets?address=${encodeURIComponent(address)}`)
        
        if (response.ok) {
          const marketResult = await response.json()
          if (!didCancel) {
            setMarketData(marketResult)
          }
        } else {
          console.warn('Market data fetch failed:', response.status)
        }
      } catch (err) {
        console.warn('Market data fetch error:', err)
      }
    }

    fetchPropertyData()

    return () => {
      didCancel = true // Cleanup function to prevent state updates
    }
  }, [address])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1" | "3" | "5">("1")

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
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading property data</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!propertyData) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No property data available</p>
      </div>
    )
  }

  // Calculate valuation data for chart
  const valuationData = {
    low: Math.round((propertyData.zestimate || propertyData.price) * 0.88),
    recommended: propertyData.zestimate || propertyData.price,
    high: Math.round((propertyData.zestimate || propertyData.price) * 1.12),
  }

  // Format address for display
  const displayAddress = typeof propertyData.address === 'object' 
    ? `${propertyData.address.streetAddress || ''}, ${propertyData.address.city || ''}, ${propertyData.address.state || ''} ${propertyData.address.zipcode || ''}`.trim()
    : propertyData.address || address

  const extractedZipcode = extractZipcode(address || '')
  const avgDaysOnMarket = marketData?.saleData?.averageDaysOnMarket
  const marketSpeed = avgDaysOnMarket ? getMarketSpeedIndicator(avgDaysOnMarket) : null 

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 mx-auto p-6">
      <div className="flex max-w-7xl mx-auto border-1 shadow-sm bg-background border-gray-200 p-6 rounded-sm gap-8">

        {/* Main Content */}
        <div id="valuation-content" className="flex-1 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{displayAddress}</span>
            </div>
            <h1 className="text-4xl font-bold text-balance">Property Valuation Report</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Comprehensive market analysis and property insights for your home
            </p>
          </div>

          {/* Market Insights Component */}
          {/* {address && <MarketInsights address={address} className="border-blue-200" />} */}
       

          {/* Navigation Section */}
          <nav className="border-b border-sky-200 pb-4 sticky top-0 z-10 bg-background pt-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("home-value")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Home Value
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("property-photos")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Photos & Map
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("property-details")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Property Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("property-location")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Location & Map
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("market-statistics")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Market Data
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("price-forecasting")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Price Forecasting
              </Button>
            </div>
          </nav>
          

          {/* Estimated Home Value Section */}
          <div className="flex flex-col md:flex-row gap-8">


             {/* agent card */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-20">
                <Card className="border-sky-200">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-3">
                      <img
                        src={agentData.avatar || "/placeholder.svg"}
                        alt={agentData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl">{agentData.name}</CardTitle>
                    <CardDescription className="text-sky-700">{agentData.title}</CardDescription>
                    <div className="flex items-center justify-center gap-2 text-sm text-sky-600">
                      <span>⭐ {agentData.rating}</span>
                      <span>•</span>
                      <span>{agentData.reviews} reviews</span>
                      <span>•</span>
                      <span>{agentData.yearsExperience} years</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white" size="lg">
                      <Video className="h-4 w-4 mr-2" />
                      Schedule Zoom Call
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule In Person
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent"
                      size="lg"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Chat with Mike Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
        {/* end agent card */}
        


        <div className="flex flex-col gap-y-8">
        <Card id="home-value" className="border-2 border-sky-200 scroll-mt-24">
              <ChartRadialStacked valuationData={valuationData} />
            {/* <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-sky-600">
                {formatCurrency(propertyData.estimatedValue)}
              </CardTitle>
              <CardDescription className="text-lg">Estimated Home Value</CardDescription>
            </CardHeader> */}
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-sky-600">
                    {marketData?.saleData?.averageDaysOnMarket || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Days on Market</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-sky-600">
                    {marketData?.saleData?.averagePrice ? formatCurrency(marketData.saleData.averagePrice) : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Sales Price</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-sky-600">
                    {marketData?.saleData?.newListings || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">New Listings <span className="text-xs text-gray-500">(last 6 months)</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-sky-600">
                    {marketData?.saleData?.averagePricePerSquareFoot ? `$${marketData.saleData.averagePricePerSquareFoot}` : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Price per Sq Ft</div>
                </div>
              </div>

              <Separator />
            </CardContent>
          </Card>

        <Card id="property-photos" className="border-slate-200 scroll-mt-24">
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <img
                  src={propertyData.photos?.[currentImageIndex] || "/placeholder.svg"}
                  alt={`Property photo ${currentImageIndex + 1}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {(propertyData.photos || []).map((_: any, index: number) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-sky-500" : "bg-background/60"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Property Location Section */}
             
            </CardContent>
            <div id="property-details" className="border-emerald-200 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{propertyData.bedrooms || propertyData.beds || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{propertyData.bathrooms || propertyData.baths || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{propertyData.livingArea ? formatNumber(propertyData.livingArea) : 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{propertyData.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground">Year Built</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <Badge variant="secondary">{propertyData.propertyType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot Size</span>
                  <span className="font-medium">{propertyData.lotSize} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sold</span>
                  <span className="font-medium">
                    {propertyData.lastSold ? 
                      `${formatCurrency(propertyData.lastSold.price)} (${new Date(propertyData.lastSold.date).getFullYear()})` : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
          </Card>

         
          

          

        

          {/* Property Location Map */}
          {/* <GoogleMap 
            address={propertyData.address}
            className="border-green-200 scroll-mt-24"
            id="property-location"
          /> */}

          {/* Market Statistics Section */}
          <Card id="market-statistics" className="border-blue-200 scroll-mt-24">
            <CardHeader>
              <CardTitle>Market Statistics</CardTitle>
              <CardDescription>
                Detailed market trends and pricing analysis for your area
                {marketData?.zipCode && ` (${marketData.zipCode})`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Market Summary with Rentcast Data */}
           

              {/* Market Insights */}
              {marketData && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Market Insights</h4>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    {marketData.saleData?.averageDaysOnMarket && (
                      <p>
                        Properties in this area typically sell within{' '}
                        <strong>{marketData.saleData.averageDaysOnMarket} days</strong>
                        {marketData.saleData.averageDaysOnMarket < 30 ? ' - a fast-moving market!' : 
                         marketData.saleData.averageDaysOnMarket > 60 ? ' - buyers have more time to decide.' : 
                         ' - a balanced market.'}
                      </p>
                    )}
                    {marketData.saleData?.priceReduction && (
                      <p>
                        <strong>{marketData.saleData.priceReduction.percent}%</strong> of listings 
                        had price reductions ({marketData.saleData.priceReduction.count} properties).
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

              {/* Show error message when no market data is available */}
              {error && !marketData && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-800">Market Data Unavailable</h4>
                  <p className="text-sm text-yellow-700">
                    {error.includes('No market data available') 
                      ? `Market statistics are not available for this zip code in our database.`
                      : 'Unable to load current market data. Please try again later.'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
              <ChartArea />

                {/* Market Price Trends */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium">Market Price Trends</h5>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-sky-600" />
                        <span className="text-sm font-medium text-sky-600">
                          +{propertyData.marketData?.priceChange1Year || 0}% YoY
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {(["1", "3", "5"] as const).map((timeframe) => (
                        <Button
                          key={timeframe}
                          variant={selectedTimeframe === timeframe ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeframe(timeframe)}
                          className={selectedTimeframe === timeframe ? "bg-sky-500 hover:bg-sky-600" : ""}
                        >
                          {timeframe}Y
                        </Button>
                      ))}
                    </div>
                  </div>

                  <ChartContainer
                    config={{
                      price: {
                        label: "Price",
                        color: "#0ea5e9",
                      },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={propertyData.priceHistory?.[selectedTimeframe] || []}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey={selectedTimeframe === "1" ? "month" : "year"} tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length && payload[0]) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Period</span>
                                      <span className="font-bold text-muted-foreground">{label}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
                                      <span className="font-bold">{formatCurrency(payload[0].value as number)}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Forecasting Section */}
          <Card id="price-forecasting" className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                Price Forecasting
              </CardTitle>
              <CardDescription>Projected price trends if you wait 3 months before selling</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    color: "#8b5cf6",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={propertyData.priceForecasting || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length && payload[0]) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                                  <span className="font-bold text-muted-foreground">{label}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {data.type === "projected" ? "Projected Price" : "Price"}
                                  </span>
                                  <span className="font-bold">{formatCurrency(payload[0].value as number)}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={(props: any) => {
                        const { payload, cx, cy, index } = props
                        if (!payload) return <></>
                        const fillColor =
                          payload.type === "current" ? "#ef4444" : payload.type === "projected" ? "#8b5cf6" : "#6b7280"
                        const strokeColor =
                          payload.type === "current" ? "#ef4444" : payload.type === "projected" ? "#8b5cf6" : "#6b7280"
                        const strokeWidth = payload.type === "current" ? 3 : 2
                        const radius = payload.type === "current" ? 5 : 3

                        return (
                          <circle
                            key={`dot-${index}`}
                            cx={cx}
                            cy={cy}
                            r={radius}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                          />
                        )
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-2">Forecast Summary</h4>
                <p className="text-purple-800 text-sm">
                  Based on current market trends, waiting 3 months could potentially increase your home value by
                  approximately <strong>$40,000 (3.2%)</strong>. However, market conditions can change, and this
                  projection is based on historical data and current trends.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600">
              <Download className="h-4 w-4" />
              Download Full Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
