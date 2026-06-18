/**
 * /api/market-updates
 *
 * Fetches live Repliers data for a given city + month and returns a
 * structured MarketUpdateData object used by the slide deck page.
 *
 * Query params:
 *   city  — e.g. "Thousand Oaks"
 *   date  — e.g. "2026-05" (YYYY-MM)
 */

import { NextRequest, NextResponse } from 'next/server'

const REPLIERS_KEY = process.env.REPLIERS_API_KEY || ''
const REPLIERS_BASE = 'https://api.repliers.io/listings'

interface RepliersStats {
  soldPrice?: { avg: number; med: number }
  listPrice?: { avg: number; med: number }
  aboveBelowList?: { below: number; above: number }
  sqft?: { avgPriceLow: number; avgPriceHigh: number }
  daysOnMarket?: { med: number; avg: number }
  closed?: { count: number; mth?: Record<string, { count: number }> }
  available?: { mth?: Record<string, number> }
  new?: { count: number; mth?: Record<string, { count: number }> }
}

interface RepliersListing {
  listPrice: number
  soldPrice: number
  address: {
    streetNumber: string
    streetName: string
    streetSuffix: string | null
    unitNumber: string | null
    city: string
    state: string
    zip: string
    neighborhood: string | null
  }
  details: {
    numBedrooms: number
    numBathrooms: number
    sqft: string
  }
  daysOnMarket: number | null
  images: string[]
}

interface RepliersResponse {
  count: number
  statistics?: RepliersStats
  listings?: RepliersListing[]
}

async function fetchRepliers(params: Record<string, string | string[]>): Promise<RepliersResponse> {
  const url = new URL(REPLIERS_BASE)
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      v.forEach((val) => url.searchParams.append(k, val))
    } else {
      url.searchParams.set(k, v)
    }
  }
  url.searchParams.set('resultsPerPage', '100')

  const res = await fetch(url.toString(), {
    headers: { 'REPLIERS-API-KEY': REPLIERS_KEY },
    next: { revalidate: 3600 }, // cache 1hr
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Repliers error ${res.status}: ${err}`)
  }
  return res.json()
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const city = searchParams.get('city') || 'Thousand Oaks'
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 7)

  // Parse month boundaries
  const [year, month] = date.split('-').map(Number)
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const monthEnd = `${year}-${String(month).padStart(2, '0')}-${lastDay}`

  // Previous month
  const prevDate = new Date(year, month - 2, 1)
  const prevYear = prevDate.getFullYear()
  const prevMonth = prevDate.getMonth() + 1
  const prevStart = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`
  const prevLastDay = new Date(prevYear, prevMonth, 0).getDate()
  const prevEnd = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${prevLastDay}`

  // Same month last year
  const yoyStart = `${year - 1}-${String(month).padStart(2, '0')}-01`
  const yoyEnd = `${year - 1}-${String(month).padStart(2, '0')}-${lastDay}`

  // 12-month window start
  const twelveMonthsAgo = new Date(year, month - 13, 1)
  const tmaYear = twelveMonthsAgo.getFullYear()
  const tmaMonth = twelveMonthsAgo.getMonth() + 1
  const tmaStart = `${tmaYear}-${String(tmaMonth).padStart(2, '0')}-01`

  const baseParams = {
    city: [city],
    state: ['CA'],
    type: ['sale'],
    class: ['residential'],
    listings: 'false',
  }

  try {
    const [currentSold, prevSold, yoySold, activeListings, recentListings] = await Promise.all([
      // Current month sold stats
      fetchRepliers({
        ...baseParams,
        status: ['U'],
        lastStatus: ['Sld'],
        minSoldDate: monthStart,
        maxSoldDate: monthEnd,
        statistics:
          'cnt-closed,med-soldPrice,avg-soldPrice,avg-daysOnMarket,med-daysOnMarket,pct-aboveBelowList,avg-priceSqft',
      }),

      // Previous month sold stats (MoM)
      fetchRepliers({
        ...baseParams,
        status: ['U'],
        lastStatus: ['Sld'],
        minSoldDate: prevStart,
        maxSoldDate: prevEnd,
        statistics:
          'cnt-closed,med-soldPrice,avg-soldPrice,avg-daysOnMarket,med-daysOnMarket,pct-aboveBelowList,avg-priceSqft',
      }),

      // Same month last year (YoY)
      fetchRepliers({
        ...baseParams,
        status: ['U'],
        lastStatus: ['Sld'],
        minSoldDate: yoyStart,
        maxSoldDate: yoyEnd,
        statistics:
          'cnt-closed,med-soldPrice,avg-soldPrice,avg-daysOnMarket,med-daysOnMarket,pct-aboveBelowList,avg-priceSqft',
      }),

      // Active inventory
      fetchRepliers({
        ...baseParams,
        status: ['A'],
        statistics: 'cnt-available,med-listPrice,avg-listPrice,cnt-new',
      }),

      // Recent sold listings (for showcase cards) — separate call with listings=true
      fetchRepliers({
        city: [city],
        state: ['CA'],
        type: ['sale'],
        class: ['residential'],
        status: ['U'],
        lastStatus: ['Sld'],
        minSoldDate: monthStart,
        maxSoldDate: monthEnd,
        sortBy: 'soldDateDesc',
        fields: 'address,listPrice,soldPrice,daysOnMarket,details.numBedrooms,details.numBathrooms,details.sqft,images[1]',
        resultsPerPage: '6',
      }),
    ])

    // Build 12-month trend from the 12mo window data - we'll use mth breakdown from currentSold closed.mth
    // Re-fetch 12-month window for trend chart
    const trendData = await fetchRepliers({
      ...baseParams,
      status: ['U'],
      lastStatus: ['Sld'],
      minSoldDate: tmaStart,
      maxSoldDate: monthEnd,
      statistics: 'cnt-closed,med-soldPrice,avg-soldPrice',
    })

    // Monthly closed breakdown from trendData
    const trendByMonth = trendData.statistics?.closed?.mth || {}

    const cs = currentSold.statistics || {}
    const ps = prevSold.statistics || {}
    const ys = yoySold.statistics || {}
    const al = activeListings.statistics || {}

    // Months of supply = active listings / closed last month
    const activeCount = activeListings.count
    const closedCount = cs.closed?.count || 0
    const monthsOfSupply =
      closedCount > 0 ? Math.round((activeCount / closedCount) * 10) / 10 : null

    const data = {
      city,
      date,
      reportMonth: new Date(year, month - 1, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),

      // Active inventory
      activeListings: activeCount,
      medListPrice: al.listPrice?.med || null,
      avgListPrice: al.listPrice?.avg || null,
      newListings: al.new?.count || null,
      monthsOfSupply,

      // Current month sold
      closedSales: cs.closed?.count || null,
      medSoldPrice: cs.soldPrice?.med || null,
      avgSoldPrice: cs.soldPrice?.avg || null,
      medDaysOnMarket: cs.daysOnMarket?.med || null,
      avgDaysOnMarket: cs.daysOnMarket?.avg || null,
      aboveList: cs.aboveBelowList?.above || null,
      belowList: cs.aboveBelowList?.below || null,
      avgPricePerSqft: cs.sqft?.avgPriceLow || null,

      // MoM comparisons
      mom: {
        closedSales: ps.closed?.count || null,
        medSoldPrice: ps.soldPrice?.med || null,
        avgDaysOnMarket: ps.daysOnMarket?.avg || null,
        medDaysOnMarket: ps.daysOnMarket?.med || null,
        avgPricePerSqft: ps.sqft?.avgPriceLow || null,
        aboveList: ps.aboveBelowList?.above || null,
      },

      // YoY comparisons
      yoy: {
        closedSales: ys.closed?.count || null,
        medSoldPrice: ys.soldPrice?.med || null,
        avgDaysOnMarket: ys.daysOnMarket?.avg || null,
        medDaysOnMarket: ys.daysOnMarket?.med || null,
        avgPricePerSqft: ys.sqft?.avgPriceLow || null,
        aboveList: ys.aboveBelowList?.above || null,
      },

      // 12-month trend
      trend: Object.entries(trendByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([mth, val]) => ({
          month: mth,
          label: new Date(mth + '-15').toLocaleString('en-US', { month: 'short', year: '2-digit' }),
          closedSales: (val as { count: number }).count,
        })),

      // Recent sold listings
      recentSales: (recentListings.listings || []).slice(0, 6).map((l) => ({
        address: [
          l.address.streetNumber,
          l.address.streetName,
          l.address.streetSuffix,
          l.address.unitNumber ? `#${l.address.unitNumber}` : null,
        ]
          .filter(Boolean)
          .join(' '),
        neighborhood: l.address.neighborhood || null,
        listPrice: l.listPrice,
        soldPrice: l.soldPrice,
        beds: l.details.numBedrooms,
        baths: l.details.numBathrooms,
        sqft: l.details.sqft ? parseInt(l.details.sqft) : null,
        daysOnMarket: l.daysOnMarket,
        image: l.images?.[0]
          ? `https://cdn.repliers.io/${l.images[0]}`
          : null,
        overUnder:
          l.soldPrice && l.listPrice
            ? Math.round(((l.soldPrice - l.listPrice) / l.listPrice) * 100)
            : null,
      })),

      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[market-updates]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
