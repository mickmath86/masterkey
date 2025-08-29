"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
  getPayloadConfigFromPayload,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A radial chart with stacked sections"

const chartData = [{ range: "valuation", low: 750000, recommended: 1000000, high: 1200000 }]

const chartConfig = {
  low: {
    label: "Low Range",
    color: "hsl(20.5 90.2% 48.2%)", // orange-700
  },
  recommended: {
    label: "Recommended",
    color: "hsl(142.1 76.2% 36.3%)", // green-500
  },
  high: {
    label: "High Range",
    color: "hsl(200 96% 27%)", // sky-800
  },
} satisfies ChartConfig

export function ChartRadialStacked() {
  const totalValue = chartData[0].low + chartData[0].recommended + chartData[0].high
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Home Value Range</CardTitle>
        <CardDescription>Property Valuation Analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 border-0 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  w-full max-w-[500px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={110}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formatCurrency(chartData[0].recommended)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Recommended
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="low"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-low)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="recommended"
              fill="var(--color-recommended)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="high"
              fill="var(--color-high)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Market analysis complete <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Low: {formatCurrency(chartData[0].low)} • High: {formatCurrency(chartData[0].high)}
        </div>
      </CardFooter>
    </Card>
  )
}
