"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A simple area chart"

// Bell curve data representing property valuation range
// Center point represents adjusted valuation, ends are ±25%
const generateBellCurveData = (centerValue: number) => {
  const points = 20; // Number of data points
  const data = [];
  
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 2 - 1; // Range from -1 to 1
    const bellValue = Math.exp(-(x * x) * 2); // Bell curve formula
    const scaledValue = centerValue * (0.75 + 0.25 * bellValue); // Scale to ±25% range
    
    data.push({
      position: i,
      valuation: Math.round(scaledValue),
      percentage: Math.round((scaledValue / centerValue - 1) * 100)
    });
  }
  
  return data;
};

// Example with $750,000 as center valuation (can be made dynamic)
const chartData = generateBellCurveData(750000);

const chartConfig = {
  valuation: {
    label: "Property Valuation",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ValuationAreaChart() {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader> */}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="position"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="line" 
                formatter={(value, name) => [
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value as number),
                  "Valuation"
                ]}
              />}
            />
            <Area
              dataKey="valuation"
              type="natural"
              fill="var(--color-valuation)"
              fillOpacity={0.4}
              stroke="var(--color-valuation)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Valuation confidence range ±25% <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Based on market analysis and property improvements
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
