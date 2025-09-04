"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react"
import { extractZipcode } from "@/lib/utils/address"
import type { MarketStatistics } from "@/lib/api/rentcast"

interface MarketInsightsProps {
  address: string
  className?: string
}

export function MarketInsights({ address, className }: MarketInsightsProps) {
  const [marketData, setMarketData] = useState<MarketStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    const fetchMarketData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/rentcast/markets?address=${encodeURIComponent(address)}`)
        
        if (response.ok) {
          const data = await response.json()
          setMarketData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch market data')
        }
      } catch (err) {
        setError('Network error while fetching market data')
        console.error('Market data fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [address])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getMarketSpeedIndicator = (days: number) => {
    if (days < 30) return { label: "Fast Market", color: "bg-green-100 text-green-800", icon: TrendingUp }
    if (days > 60) return { label: "Slow Market", color: "bg-red-100 text-red-800", icon: TrendingDown }
    return { label: "Balanced Market", color: "bg-blue-100 text-blue-800", icon: Calendar }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Market Insights
          </CardTitle>
          <CardDescription>Loading market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Market Insights
          </CardTitle>
          <CardDescription>Unable to load market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground p-4 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!marketData) {
    return null
  }

  const zipcode = extractZipcode(address)
  const avgDaysOnMarket = marketData.saleData?.averageDaysOnMarket
  const marketSpeed = avgDaysOnMarket ? getMarketSpeedIndicator(avgDaysOnMarket) : null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Market Insights
          {zipcode && <Badge variant="outline">{zipcode}</Badge>}
        </CardTitle>
        <CardDescription>
          Current market conditions in your area
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Metric - Average Days on Market */}
        {avgDaysOnMarket && (
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {avgDaysOnMarket}
            </div>
            <div className="text-lg font-medium text-blue-800 mb-2">
              Average Days on Market
            </div>
            {marketSpeed && (
              <Badge className={marketSpeed.color}>
                <marketSpeed.icon className="h-3 w-3 mr-1" />
                {marketSpeed.label}
              </Badge>
            )}
          </div>
        )}

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData.saleData?.averagePrice && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <DollarSign className="h-5 w-5 mx-auto text-green-600 mb-2" />
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(marketData.saleData.averagePrice)}
              </div>
              <div className="text-sm text-green-700">Average Sale Price</div>
            </div>
          )}

          {marketData.saleData?.totalSales && (
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <TrendingUp className="h-5 w-5 mx-auto text-purple-600 mb-2" />
              <div className="text-xl font-bold text-purple-600">
                {marketData.saleData.totalSales}
              </div>
              <div className="text-sm text-purple-700">Recent Sales</div>
            </div>
          )}
        </div>

        {/* Market Insights Text */}
        {avgDaysOnMarket && (
          <div className="bg-slate-50 p-4 rounded-lg border">
            <h4 className="font-semibold mb-2 text-slate-800">Market Analysis</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Properties in this area typically sell within{' '}
              <strong>{avgDaysOnMarket} days</strong>
              {avgDaysOnMarket < 30 && ' - indicating a very active market with high buyer demand.'}
              {avgDaysOnMarket >= 30 && avgDaysOnMarket <= 60 && ' - showing a balanced market with steady activity.'}
              {avgDaysOnMarket > 60 && ' - suggesting buyers have more time to make decisions.'}
              {marketData.saleData?.priceReduction && (
                <span>
                  {' '}Additionally, {marketData.saleData.priceReduction.percent}% of recent listings had price reductions.
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
