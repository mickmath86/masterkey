"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export const description = "An interactive area chart"

// Define types for the value data
interface ValueDataItem {
  t: number // timestamp
  v: number // value
}

interface TransformedDataItem {
  date: string
  value: number
}

const unixFormat = (timestamp: number): string => {
  const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
  return date.toISOString().split('T')[0] // Returns YYYY-MM-DD format
}



const chartConfig = {
  value: {
    label: "Property Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({address, valueData}: {address: string, valueData: ValueDataItem[] | null}) {
  const [timeRange, setTimeRange] = React.useState("all")
// Transform valueData to chart format
const transformedValueData = valueData?.map(item => ({
  date: unixFormat(item.t),
  value: item.v
})) || []

  const filteredData = transformedValueData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 0
    
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "1y") {
      daysToSubtract = 365
    } else {
      return true // Show all data
    }
    
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // Calculate percentage change between first and last data points
  const percentageChange = React.useMemo(() => {
    if (filteredData.length < 2) return null
    
    const firstValue = filteredData[0].value
    const lastValue = filteredData[filteredData.length - 1].value
    const change = ((lastValue - firstValue) / firstValue) * 100
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      rawChange: change
    }
  }, [filteredData])

  // Generate AI market assessment based on performance
  const marketAssessment = React.useMemo(() => {
    if (!percentageChange) return "Insufficient data for market analysis."
    
    const { rawChange } = percentageChange
    const timeRangeText = timeRange === "all" ? "historically" : 
                         timeRange === "1y" ? "over the past year" :
                         timeRange === "90d" ? "over the past 3 months" :
                         "over the past 30 days"
    
    if (rawChange >= 20) {
      return `Exceptional growth ${timeRangeText}. This property has significantly outperformed typical market expectations, indicating strong demand and potential for continued appreciation.`
    } else if (rawChange >= 10) {
      return `Strong performance ${timeRangeText}. The property shows healthy appreciation above average market trends, suggesting a robust local market.`
    } else if (rawChange >= 5) {
      return `Steady growth ${timeRangeText}. The property demonstrates consistent appreciation in line with healthy market conditions.`
    } else if (rawChange >= 0) {
      return `Stable market ${timeRangeText}. The property has maintained its value with modest growth, reflecting market equilibrium.`
    } else if (rawChange >= -5) {
      return `Minor correction ${timeRangeText}. The property experienced a slight decline, which may represent a market adjustment or buying opportunity.`
    } else if (rawChange >= -10) {
      return `Market softening ${timeRangeText}. The property shows notable decline, suggesting challenging market conditions or local factors affecting values.`
    } else {
      return `Significant decline ${timeRangeText}. The property has experienced substantial value loss, indicating distressed market conditions requiring careful analysis.`
    }
  }, [percentageChange, timeRange])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Property Value History for {address}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Historical property values over time
            {percentageChange && (
              <span className={`flex items-center gap-1 text-sm font-medium ${
                percentageChange.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {percentageChange.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {percentageChange.isPositive ? '+' : '-'}{percentageChange.value}%
              </span>
            )}
          </CardDescription>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 bg-sky-50 p-2 rounded-sm max-w-md">
            <Sparkles className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>{marketAssessment}</span>
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All Time
            </SelectItem>
            <SelectItem value="1y" className="rounded-lg">
              Last Year
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                })
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  formatter={(value, name) => {
                    return [`$${Number(value).toLocaleString()}`];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
