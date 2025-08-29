"use client"

import { useState } from "react"
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
  Star,
} from "lucide-react"
import { ChartRadialStacked } from "./ui/chart-radial-stacked"
import { ChartArea } from "./ui/area-chart"

// Mock property data
const propertyData = {
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
      { year: "2022", price: 1050000 },
      { year: "2023", price: 1120000 },
      { year: "2024", price: 1250000 },
    ],
    "5": [
      { year: "2020", price: 950000 },
      { year: "2021", price: 1000000 },
      { year: "2022", price: 1050000 },
      { year: "2023", price: 1120000 },
      { year: "2024", price: 1250000 },
    ],
  },
  priceForecasting: [
    { month: "Sep 2024", price: 1220000, type: "historical" },
    { month: "Oct 2024", price: 1235000, type: "historical" },
    { month: "Nov 2024", price: 1245000, type: "historical" },
    { month: "Dec 2024", price: 1250000, type: "current" },
    { month: "Jan 2025", price: 1265000, type: "projected" },
    { month: "Feb 2025", price: 1275000, type: "projected" },
    { month: "Mar 2025", price: 1290000, type: "projected" },
  ],
}

const createRadialData = () => {
  const { low, recommended, high } = propertyData.valuationGauge
  const total = high - low
  const lowPercentage = ((recommended - low) / total) * 100
  const highPercentage = ((high - recommended) / total) * 100

  return [
    { name: "Low Range", value: lowPercentage, fill: "#ef4444" },
    { name: "Recommended", value: 20, fill: "#22c55e" },
    { name: "High Range", value: highPercentage, fill: "#f59e0b" },
  ]
}

const agentData = {
  name: "Mike Mathias",
  avatar: "/real-estate-agent-headshot.png",
  title: "Senior Real Estate Agent",
  rating: 4.9,
  reviews: 127,
  yearsExperience: 8,
}

export default function PropertyDataModule() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1" | "3" | "5">("1")

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length)
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

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 mx-auto p-6">
      <div className="flex max-w-7xl mx-auto border-1 shadow-sm bg-background border-gray-200 p-6 rounded-sm gap-8">

       

        {/* Main Content */}
        <div id="valuation-content" className="flex-1 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{propertyData.address}</span>
            </div>
            <h1 className="text-4xl font-bold text-balance">Property Valuation Report</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Comprehensive market analysis and property insights for your home
            </p>
          </div>
       

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
                onClick={() => scrollToSection("market-statistics")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Market Statistics
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
              <ChartRadialStacked />
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
                    +{propertyData.marketData.priceChange1Year}%
                  </div>
                  <div className="text-sm text-muted-foreground">1-Year Change</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-sky-600">
                    +{propertyData.marketData.priceChange30Days}%
                  </div>
                  <div className="text-sm text-muted-foreground">30-Day Change</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold">{propertyData.marketData.daysOnMarket}</div>
                  <div className="text-sm text-muted-foreground">Avg Days on Market</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold">
                    {formatCurrency(propertyData.marketData.medianHomeValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Area Median</div>
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
                  src={propertyData.images[currentImageIndex] || "/placeholder.svg"}
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
                  {propertyData.images.map((_, index) => (
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
                    <div className="font-semibold">{propertyData.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{propertyData.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{formatNumber(propertyData.sqft)}</div>
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
                    {formatCurrency(propertyData.lastSold.price)} ({new Date(propertyData.lastSold.date).getFullYear()})
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
          </Card>
          {/* enter prop details */}
         
          

          

          {/* Property Photos Section */}
       

          {/* Property Details Section */}
        

          {/* Market Statistics Section */}
          <Card id="market-statistics" className="border-blue-200 scroll-mt-24">
            <CardHeader>
              <CardTitle>Market Statistics</CardTitle>
              <CardDescription>Detailed market trends and pricing analysis for your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* <div>
                <h3 className="text-xl font-semibold mb-4">Market Summary</h3>
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    The San Francisco real estate market continues to show strong performance with steady appreciation.
                    Single-family homes in your area have experienced consistent growth, driven by limited inventory and
                    sustained demand. Current market conditions favor sellers, with properties typically receiving
                    multiple offers and selling above asking price.
                  </p>
                </div>
              </div> */}

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
                          +{propertyData.marketData.priceChange1Year}% YoY
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
                        data={propertyData.priceHistory[selectedTimeframe]}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey={selectedTimeframe === "1" ? "month" : "year"} tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
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
                  <LineChart data={propertyData.priceForecasting} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
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
                      strokeDasharray={(data: any) => (data.type === "projected" ? "5 5" : "0")}
                      dot={({ payload, cx, cy }: any) => {
                        if (!payload) return null
                        const fillColor =
                          payload.type === "current" ? "#ef4444" : payload.type === "projected" ? "#8b5cf6" : "#6b7280"
                        const strokeColor =
                          payload.type === "current" ? "#ef4444" : payload.type === "projected" ? "#8b5cf6" : "#6b7280"
                        const strokeWidth = payload.type === "current" ? 3 : 2
                        const radius = payload.type === "current" ? 5 : 3

                        return (
                          <circle
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
                <h5 className="font-semibold text-purple-900 mb-2">Forecast Summary</h5>
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
