"use client"

import { TrendingUp } from "lucide-react"
import GaugeComponent from 'react-gauge-component'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ChartRadialStackedProps {
  valuationData?: {
    low: number
    recommended: number
    high: number
  }
}

export function ChartRadialStacked({ valuationData }: ChartRadialStackedProps) {
  // Use provided data or fallback to default values
  const defaultData = { low: 750000, recommended: 1000000, high: 1200000 }
  const data = valuationData || defaultData
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate percentage for gauge (recommended value as percentage of total range)
  const totalRange = data.high - data.low
  const recommendedPosition = ((data.recommended - data.low) / totalRange) * 100

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Home Value Range</CardTitle>
        <CardDescription>Property Valuation Analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 border-0 items-center pb-0">
        <div className="mx-auto w-full max-w-[400px]">
          <GaugeComponent
            type="semicircle"
            arc={{
              colorArray: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
              subArcs: [
                { limit: 33 },
                { limit: 67 },
                { limit: 100 }
              ],
              padding: 0.02,
              width: 0.3
            }}
            pointer={{
              type:"blob", 
              elastic: false,
              animationDelay: 500
            }}
            labels={{
              valueLabel: {
                formatTextValue: () => formatCurrency(data.recommended),
                style: { fontSize: '40px', fill: '#000', textShadow: 'none' }
              },
              tickLabels: {
                type: "outer",
                ticks: [
                  { value: 0 },
                  { value: 50 },
                  { value: 100 }
                ],
                defaultTickValueConfig: {
                  formatTextValue: (value: number) => {
                    if (value === 0) return formatCurrency(data.low)
                    if (value === 50) return formatCurrency(data.recommended)
                    if (value === 100) return formatCurrency(data.high)
                    return ''
                  },
                  style: { fontSize: '10px', fill: '#666' }
                }
              }
            }}
            value={recommendedPosition}
            minValue={0}
            maxValue={100}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Market analysis complete <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Low: {formatCurrency(data.low)} • High: {formatCurrency(data.high)}
        </div>
      </CardFooter>
    </Card>
  )
}
