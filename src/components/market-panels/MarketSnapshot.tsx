'use client'

import { cn } from '@/lib/utils'
import { Home, Clock, BarChart3, Percent, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface MarketSnapshotProps {
  isDark: boolean
  data: any
}

export function MarketSnapshot({ isDark, data }: MarketSnapshotProps) {
  const marketCondition = data?.priceChange > 3 ? 'Seller\'s Market' : data?.priceChange < -3 ? 'Buyer\'s Market' : 'Balanced Market'
  const conditionColor = data?.priceChange > 3 ? 'text-red-500' : data?.priceChange < -3 ? 'text-green-500' : 'text-yellow-500'

  const sparklineData = data?.priceHistory?.slice(-12) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
          Market Snapshot
        </h2>
        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          Today's key metrics for Ventura County housing
        </p>
      </div>

      {/* Market Condition Badge */}
      <div className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold',
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      )}>
        <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          Market Status:
        </span>
        <span className={cn('text-lg', conditionColor)}>
          {marketCondition}
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Median Price */}
        <div className={cn(
          'rounded-lg p-6',
          isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home className={cn('h-5 w-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
              <span className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Median Price
              </span>
            </div>
            {data?.priceChange > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
            ${data?.medianPrice?.toLocaleString() || '—'}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              data?.priceChange > 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {data?.priceChange > 0 ? '+' : ''}{data?.priceChange?.toFixed(1)}% YoY
            </span>
          </div>
          {/* Mini Sparkline */}
          {sparklineData.length > 0 && (
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isDark ? '#3B82F6' : '#1B4FCA'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Days on Market */}
        <div className={cn(
          'rounded-lg p-6',
          isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('h-5 w-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
            <span className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
              Days on Market
            </span>
          </div>
          <div className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
            {data?.daysOnMarket || '—'}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              data?.domChange < 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {data?.domChange > 0 ? '+' : ''}{data?.domChange?.toFixed(1)}% vs last year
            </span>
          </div>
        </div>

        {/* Active Listings */}
        <div className={cn(
          'rounded-lg p-6',
          isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className={cn('h-5 w-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
            <span className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
              Active Listings
            </span>
          </div>
          <div className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
            {data?.activeListings?.toLocaleString() || '—'}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              data?.inventoryChange > 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {data?.inventoryChange > 0 ? '+' : ''}{data?.inventoryChange?.toFixed(1)}% vs last year
            </span>
          </div>
        </div>

        {/* Mortgage Rate */}
        <div className={cn(
          'rounded-lg p-6',
          isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Percent className={cn('h-5 w-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
            <span className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
              30-Year Fixed Rate
            </span>
          </div>
          <div className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
            {data?.mortgageRate?.toFixed(2)}%
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              data?.rateChange < 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {data?.rateChange > 0 ? '+' : ''}{data?.rateChange?.toFixed(2)}% vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className={cn(
        'rounded-lg p-6',
        isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
      )}>
        <h3 className={cn('font-bold mb-3', isDark ? 'text-blue-400' : 'text-blue-900')}>
          Quick Insights
        </h3>
        <ul className={cn('space-y-2 text-sm', isDark ? 'text-gray-300' : 'text-gray-700')}>
          <li>• Median home prices are {data?.priceChange > 0 ? 'up' : 'down'} {Math.abs(data?.priceChange || 0).toFixed(1)}% year-over-year</li>
          <li>• Homes are selling {data?.domChange < 0 ? 'faster' : 'slower'} than last year</li>
          <li>• Inventory levels are {data?.inventoryChange > 0 ? 'increasing' : 'decreasing'}, indicating a {data?.inventoryChange > 0 ? 'buyer-friendly' : 'seller-friendly'} market</li>
          <li>• Current mortgage rates are {data?.rateChange < 0 ? 'favorable' : 'elevated'} compared to recent months</li>
        </ul>
      </div>
    </div>
  )
}
