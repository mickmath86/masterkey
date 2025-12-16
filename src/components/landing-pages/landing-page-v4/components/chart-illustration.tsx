'use client'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
    views: {
        label: 'Online Views',
        color: 'var(--color-sky-500)',
    },
    showings: {
        label: 'Showings',
        color: 'var(--color-green-400)',
    },
} satisfies ChartConfig

const chartData = [
    { month: 'May', views: 224, showings: 224 },
    { month: 'June', views: 56, showings: 224 },
    { month: 'January', views: 126, showings: 252 },
    { month: 'February', views: 205, showings: 410 },
    { month: 'March', views: 200, showings: 126 },
    { month: 'April', views: 400, showings: 800 },
]

export const ChartIllustration = () => {
    return (
        <ChartContainer
            className="h-56 aspect-auto "
            config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                }}>
                <defs>
                    <linearGradient
                        id="fillviews"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-views)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-views)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient
                        id="fillshowings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-showings)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-showings)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                {/* <ChartTooltip
                    active
                    content={<ChartTooltipContent className="dark:bg-zinc-900" />}
                /> */}
                <Area
                    strokeWidth={2}
                    dataKey="showings"
                    type="natural"
                    fill="url(#fillshowings)"
                    fillOpacity={0.1}
                    stroke="var(--color-showings)"
                    stackId="a"
                />
                <Area
                    strokeWidth={2}
                    dataKey="views"
                    type="natural"
                    fill="url(#fillviews)"
                    fillOpacity={0.1}
                    stroke="var(--color-views)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}