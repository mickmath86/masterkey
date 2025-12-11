'use client'
import { Area, AreaChart, XAxis } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
    vtaDOM: {
        label: 'VTA DOM',
        color: 'var(--color-emerald-500)',
    },
    laDOM: {
        label: 'LA DOM',
        color: 'var(--color-indigo-400)',
    },
} satisfies ChartConfig

const chartData = [
    { month: 'Jan', vtaDOM: 50, laDOM: 48 },
    { month: 'Feb', vtaDOM: 38, laDOM: 35 },
    { month: 'Mar', vtaDOM: 41, laDOM: 39 },
    { month: 'Apr', vtaDOM: 36, laDOM: 33 },
    { month: 'May', vtaDOM: 42, laDOM: 38 },
    { month: 'Jun', vtaDOM: 45, laDOM: 41 },
]

export const ChartIllustration = () => {
    return (
        <ChartContainer
            className="aspect-auto h-72 w-60 max-w-60"
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
                        id="fillVtaDOM"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-vtaDOM)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-vtaDOM)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient
                        id="fillLaDOM"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-laDOM)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-laDOM)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <ChartTooltip
                    active
                    content={<ChartTooltipContent className="dark:bg-muted" />}
                />
                <XAxis
                    dataKey="month"
                    stroke="var(--color-muted)"
                />
                <Area
                    strokeWidth={1}
                    dataKey="laDOM"
                    type="natural"
                    fill="url(#fillLaDOM)"
                    fillOpacity={0.1}
                    stroke="var(--color-laDOM)"
                    stackId="a"
                />
                <Area
                    strokeWidth={1}
                    dataKey="vtaDOM"
                    type="natural"
                    fill="url(#fillVtaDOM)"
                    fillOpacity={0.1}
                    stroke="var(--color-vtaDOM)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}