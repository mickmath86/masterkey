"use client"

import * as React from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A real estate market analysis radar chart"

interface MarketRadarProps {
  marketData?: any
}

// Function to calculate market indicators from marketData
const calculateMarketIndicators = (marketData: any) => {
  if (!marketData?.saleData) {
    return [
      { axis: "Inventory", value: 50 },
      { axis: "Demand", value: 50 },
      { axis: "Price Pressure", value: 50 },
      { axis: "Market Speed", value: 50 },
    ]
  }

  const { saleData } = marketData
  
  // 1. Inventory Level (based on total listings vs new listings ratio)
  const inventoryRatio = saleData.totalListings / (saleData.newListings || 1)
  const inventoryScore = Math.min(100, Math.max(0, 100 - (inventoryRatio - 3) * 20)) // Lower inventory = higher score
  
  // 2. Demand (based on new listings vs average - higher new listings = higher demand)
  const demandScore = Math.min(100, Math.max(0, (saleData.newListings / 30) * 100)) // Normalize to 30 as baseline
  
  // 3. Price Pressure (based on price range spread and average vs median)
  const priceSpread = (saleData.maxPrice - saleData.minPrice) / saleData.averagePrice
  const priceVariance = Math.abs(saleData.averagePrice - saleData.medianPrice) / saleData.averagePrice
  const pricePressureScore = Math.min(100, Math.max(0, (priceVariance + priceSpread * 0.1) * 100))
  
  // 4. Market Speed (inverse of days on market - faster = higher score)
  const speedScore = Math.min(100, Math.max(0, 100 - (saleData.averageDaysOnMarket / 100) * 100))
  
  return [
    { axis: "Inventory", value: Math.round(inventoryScore) },
    { axis: "Demand", value: Math.round(demandScore) },
    { axis: "Price Pressure", value: Math.round(pricePressureScore) },
    { axis: "Market Speed", value: Math.round(speedScore) },
  ]
}

// Function to determine market type based on indicators
const getMarketType = (data: any[]) => {
  const inventory = data.find(d => d.axis === "Inventory")?.value || 0
  const demand = data.find(d => d.axis === "Demand")?.value || 0
  const pricePressure = data.find(d => d.axis === "Price Pressure")?.value || 0
  const marketSpeed = data.find(d => d.axis === "Market Speed")?.value || 0
  
  const avgScore = (inventory + demand + pricePressure + marketSpeed) / 4
  
  if (avgScore > 70) return { label: "SELLER'S", description: "Strong Seller's Market", color: "text-red-500" }
  if (avgScore > 55) return { label: "BALANCED+", description: "Seller-Favored Market", color: "text-orange-500" }
  if (avgScore > 45) return { label: "BALANCED", description: "Balanced Market", color: "text-yellow-500" }
  if (avgScore > 30) return { label: "BALANCED-", description: "Buyer-Favored Market", color: "text-blue-500" }
  return { label: "BUYER'S", description: "Strong Buyer's Market", color: "text-green-500" }
}

// Function to determine dominant quadrant for X overlay
const getDominantQuadrant = (data: any[]) => {
  const inventory = data.find(d => d.axis === "Inventory")?.value || 0
  const demand = data.find(d => d.axis === "Demand")?.value || 0
  const pricePressure = data.find(d => d.axis === "Price Pressure")?.value || 0
  const marketSpeed = data.find(d => d.axis === "Market Speed")?.value || 0
  
  // The radar chart axes are positioned as:
  // - Inventory: top (12 o'clock)
  // - Demand: right (3 o'clock) 
  // - Price Pressure: bottom (6 o'clock)
  // - Market Speed: left (9 o'clock)
  
  // Calculate which direction the data is skewing based on actual radar positions
  const topScore = inventory // High inventory points toward SELLER'S (top-left)
  const rightScore = demand // High demand points toward HOT (top-right)
  const bottomScore = pricePressure // High price pressure points toward SLOW (bottom-right)
  const leftScore = marketSpeed // High market speed points toward BUYER'S (bottom-left)
  
  // Determine quadrant based on which combination of adjacent axes is highest
  const sellerQuadrant = (topScore + leftScore) / 2 // Top-left: High inventory + High speed
  const hotQuadrant = (topScore + rightScore) / 2 // Top-right: High inventory + High demand  
  const slowQuadrant = (bottomScore + rightScore) / 2 // Bottom-right: High price pressure + High demand
  const buyerQuadrant = (bottomScore + leftScore) / 2 // Bottom-left: High price pressure + High speed
  
  const quadrants = [
    { name: "seller", score: sellerQuadrant, position: "top-left" },
    { name: "hot", score: hotQuadrant, position: "top-right" },
    { name: "slow", score: slowQuadrant, position: "bottom-right" },
    { name: "buyer", score: buyerQuadrant, position: "bottom-left" }
  ]
  
  return quadrants.reduce((max, current) => current.score > max.score ? current : max)
}

const chartConfig = {
  value: {
    label: "Market Indicator",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartRadar({ marketData }: MarketRadarProps) {
  const chartData = calculateMarketIndicators(marketData)
  const marketType = getMarketType(chartData)
  const dominantQuadrant = getDominantQuadrant(chartData)
  
  return (
    <Card className="">
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-slate-800">Market Analysis</CardTitle>
        <CardDescription className="text-slate-600">
          Real estate market conditions assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0  relative">
        {/* X-shaped overlay with dynamic highlighting */}
        <div className="absolute inset-0 px-6 pointer-events-none z-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* X lines from center to corners - stopping before labels */}
            <line 
              x1="50" y1="50" x2="15" y2="15" 
              stroke={dominantQuadrant.position === "top-left" ? "#3B82F6" : "#E2E8F0"} 
              strokeWidth={dominantQuadrant.position === "top-left" ? "2" : "0.5"}
              strokeDasharray={dominantQuadrant.position === "top-left" ? "0" : "2,2"}
              opacity={dominantQuadrant.position === "top-left" ? "1" : "0.3"}
              vectorEffect="non-scaling-stroke"
            />
            <line 
              x1="50" y1="50" x2="85" y2="15" 
              stroke={dominantQuadrant.position === "top-right" ? "#3B82F6" : "#E2E8F0"} 
              strokeWidth={dominantQuadrant.position === "top-right" ? "2" : "0.5"}
              strokeDasharray={dominantQuadrant.position === "top-right" ? "0" : "2,2"}
              opacity={dominantQuadrant.position === "top-right" ? "1" : "0.3"}
              vectorEffect="non-scaling-stroke"
            />
            <line 
              x1="50" y1="50" x2="15" y2="75" 
              stroke={dominantQuadrant.position === "bottom-left" ? "#3B82F6" : "#E2E8F0"} 
              strokeWidth={dominantQuadrant.position === "bottom-left" ? "2" : "0.5"}
              strokeDasharray={dominantQuadrant.position === "bottom-left" ? "0" : "2,2"}
              opacity={dominantQuadrant.position === "bottom-left" ? "1" : "0.3"}
              vectorEffect="non-scaling-stroke"
            />
            <line 
              x1="50" y1="50" x2="85" y2="75" 
              stroke={dominantQuadrant.position === "bottom-right" ? "#3B82F6" : "#E2E8F0"} 
              strokeWidth={dominantQuadrant.position === "bottom-right" ? "2" : "0.5"}
              strokeDasharray={dominantQuadrant.position === "bottom-right" ? "0" : "2,2"}
              opacity={dominantQuadrant.position === "bottom-right" ? "1" : "0.3"}
              vectorEffect="non-scaling-stroke"
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="1.5" fill="#3B82F6" opacity="0.8" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Corner Labels */}
        <div className="absolute inset-0 px-6 pointer-events-none z-10">
          <div className={`absolute top-2 left-6 text-xs font-medium border px-2 py-1 rounded transition-all duration-300 ${
            dominantQuadrant.position === "top-left" 
              ? "text-blue-600 border-blue-300 bg-blue-50 shadow-md" 
              : "text-slate-600 border-slate-200"
          }`}>SELLER'S</div>
          <div className={`absolute top-2 right-6 text-xs font-medium border px-2 py-1 rounded transition-all duration-300 ${
            dominantQuadrant.position === "top-right" 
              ? "text-blue-600 border-blue-300 bg-blue-50 shadow-md" 
              : "text-slate-600 border-slate-200"
          }`}>HOT</div>
          <div className={`absolute bottom-8 left-6 text-xs font-medium border px-2 py-1 rounded transition-all duration-300 ${
            dominantQuadrant.position === "bottom-left" 
              ? "text-blue-600 border-blue-300 bg-blue-50 shadow-md" 
              : "text-slate-600 border-slate-200"
          }`}>BUYER'S</div>
          <div className={`absolute bottom-8 right-6 text-xs font-medium border px-2 py-1 rounded transition-all duration-300 ${
            dominantQuadrant.position === "bottom-right" 
              ? "text-blue-600 border-blue-300 bg-blue-50 shadow-md" 
              : "text-slate-600 border-slate-200"
          }`}>SLOW</div>
        </div>
        
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadarChart data={chartData} margin={{ top: 25, right: 30, bottom: 25, left: 30 }} >
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent className="bg-white border-slate-200" />} 
            />
            <PolarAngleAxis 
              dataKey="axis" 
              tick={{ fontSize: 10, fill: '#059669', fontWeight: 600 }}
              className="text-emerald-600"
            />
            <PolarGrid 
              stroke="#CBD5E1" 
              strokeWidth={1}
            />
            <Radar
              dataKey="value"
              stroke="url(#marketGradient)"
              fill="url(#marketGradient)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </RadarChart>
        </ChartContainer>
        
      
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">

      
          <div className="flex items-center gap-2 leading-none font-medium">
                  {marketType.label} MARKET
          </div>
        
      </CardFooter> 
    </Card>
  )
}
