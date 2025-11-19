"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceArea, ReferenceLine, Text } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipLanding,
  ChartTooltipLandingContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

// Market condition colors - change these to update both legend and zones
const MARKET_COLORS = {
  seller: "rgba(22, 163, 74, 0.2)", // green-600 with opacity
  neutral: "rgba(249, 115, 22, 0.2)", // orange-500 with opacity
  buyer: "rgba(14, 165, 233, 0.2)"  // sky-500 with opacity
}

const chartData = [
  { date: "2024-02-01", venturaCounty: 285, losAngelesCounty: 220 },
  { date: "2024-03-01", venturaCounty: 320, losAngelesCounty: 180 },
  { date: "2024-04-01", venturaCounty: 195, losAngelesCounty: 240 },
  { date: "2024-05-01", venturaCounty: 410, losAngelesCounty: 350 },
  { date: "2024-06-01", venturaCounty: 380, losAngelesCounty: 290 },
  { date: "2024-07-01", venturaCounty: 450, losAngelesCounty: 420 },
  { date: "2024-08-01", venturaCounty: 290, losAngelesCounty: 310 },
  { date: "2024-09-01", venturaCounty: 520, losAngelesCounty: 480 },
  { date: "2024-10-01", venturaCounty: 340, losAngelesCounty: 360 },
]

const chartConfig = {
  views: {
    label: "Market Data",
  },
  dom: {
    label: "Days on Market",
  },
  venturaCounty: {
    label: "Ventura County",
    color: "var(--chart-1)",
  },
  losAngelesCounty: {
    label: "Los Angeles County",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("venturaCounty")

  const total = React.useMemo(
    () => ({
      venturaCounty: chartData.reduce((acc, curr) => acc + curr.venturaCounty, 0),
      losAngelesCounty: chartData.reduce((acc, curr) => acc + curr.losAngelesCounty, 0),
    }),
    []
  )

  // Calculate zones based on the active chart data range
  const zones = React.useMemo(() => {
    const values = chartData.map(item => item[activeChart as keyof typeof item]).filter(val => typeof val === 'number') as number[]
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue
    
    return {
      // Buyer advantage (lower 40% - blue)
      buyerZone: {
        y1: minValue,
        y2: minValue + (range * 0.4)
      },
      // Neutral zone (middle 20% - gray)
      neutralZone: {
        y1: minValue + (range * 0.4),
        y2: minValue + (range * 0.6)
      },
      // Seller advantage (upper 40% - green)
      sellerZone: {
        y1: minValue + (range * 0.6),
        y2: maxValue
      }
    }
  }, [activeChart])

  // Define split point for historical vs forecast
  const splitIndex = 6 // After July (index 5), so August, September, October are forecast (dotted)
  const inflectionDate = chartData[splitIndex - 1].date // July date for vertical line
  
  // Split data for overlapping segments to create continuous line
  const historicalData = chartData.slice(0, splitIndex) // Feb-July (6 months)
  const forecastData = chartData.slice(splitIndex - 1) // July-October (4 months, starting from July)

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Days on Market by County</CardTitle>
          <CardDescription>
            Comparing market conditions between <span className="font-semibold">Ventura</span> and <span className="font-semibold">Los Angeles</span> counties
           
          </CardDescription>
        </div>
       
        <div className="flex">
          {["venturaCounty", "losAngelesCounty"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 data-[active=true]:font-bold flex text-lg sm:text-3xl flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                {/* <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span> */}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* Background zones */}
            <ReferenceArea
              y1={zones.buyerZone.y1}
              y2={zones.buyerZone.y2}
              fill={MARKET_COLORS.buyer}
              fillOpacity={0.3}
            />
            <ReferenceArea
              y1={zones.neutralZone.y1}
              y2={zones.neutralZone.y2}
              fill={MARKET_COLORS.neutral}
              fillOpacity={0.2}
            />
            <ReferenceArea
              y1={zones.sellerZone.y1}
              y2={zones.sellerZone.y2}
              fill={MARKET_COLORS.seller}
              fillOpacity={0.3}
            />

            
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              hide
              domain={[
                (dataMin: number) => dataMin,
                (dataMax: number) => dataMax
              ]}
            />
            <ChartTooltipLanding
              content={
                <ChartTooltipLandingContent
                  className="w-[200px]"
                  labelFormatter={(value: any) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    return value ? [
                      <div key="tooltip-content" className="flex justify-between items-center gap-2">
                        <div className="bg-sky-500 w-3 h-3 rounded-full"></div>
                        <div className="text-sm">Days on Market:</div>
                        <span className="font-bold">{value} days</span>
                      </div>
                    ] : null
                  }}
                />
              }
            />
            {/* Vertical line at inflection point */}
            <ReferenceLine
              x={inflectionDate}
              stroke="white"
              strokeWidth={2}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
            
            {/* Continuous solid line for full dataset */}
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={true}
            />
            
            {/* Dotted overlay for forecast portion only */}
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke="#0ea5e9"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              data={forecastData}
            />
          </LineChart>
        </ChartContainer>
        
        {/* Overlay Labels - Simple fixed positioning to match zone layout */}
        <div className="absolute inset-0 pointer-events-none flex flex-col">
          {/* Seller's Advantage - Top 40% */}
          <div className="flex-[2] flex justify-center items-center">
            <span className="text-sm font-semibold text-green-600 opacity-70">
              Seller's Advantage
            </span>
          </div>
          
          {/* Neutral Market - Middle 20% */}
          <div className="flex-1 flex justify-center items-center">
            <span className="text-sm font-semibold text-orange-500 opacity-70">
              Neutral Market
            </span>
          </div>
          
          {/* Buyer's Advantage - Bottom 40% */}
          <div className="flex-[2] flex justify-center items-center">
            <span className="text-sm font-semibold text-blue-500 opacity-70">
              Buyer's Advantage
            </span>
          </div>
        </div>
      </div>
      </CardContent>
    </Card>
  )
}
