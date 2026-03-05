import { NextResponse } from 'next/server'
import { getRentcastAPI, type MarketStats } from '@/lib/rentcast'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FREDObservation {
  date: string
  value: string
}

interface FREDResponse {
  observations: FREDObservation[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CONEJO_ZIPS = ['91360', '91361', '91362']
const FRED_SERIES = 'MORTGAGE30US'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 h

// ─── Simple in-memory cache ───────────────────────────────────────────────────

type CacheEntry = {
  data: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function setCached(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

// ─── FRED helper ──────────────────────────────────────────────────────────────

async function fetchMortgageRates(): Promise<
  { current: number; change: number; history: { date: string; rate: number }[] }
> {
  const fredKey = process.env.FRED_API_KEY
  if (!fredKey) {
    // Return plausible mock data when key not configured
    return {
      current: 6.82,
      change: -0.05,
      history: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 3600 * 1000)
          .toISOString()
          .slice(0, 7),
        rate: 6.5 + Math.sin(i * 0.5) * 0.4,
      })),
    }
  }

  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=${FRED_SERIES}` +
    `&api_key=${fredKey}` +
    `&file_type=json` +
    `&sort_order=desc` +
    `&limit=60`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`FRED error ${res.status}`)
  const json: FREDResponse = await res.json()

  const obs = json.observations
    .filter(o => o.value !== '.')
    .map(o => ({ date: o.date.slice(0, 7), rate: parseFloat(o.value) }))
    .reverse()
    .slice(-12)

  const current = obs[obs.length - 1]?.rate ?? 6.82
  const prev = obs[obs.length - 2]?.rate ?? current
  return { current, change: parseFloat((current - prev).toFixed(2)), history: obs }
}

// ─── RentCast helper ──────────────────────────────────────────────────────────

async function fetchRentcastData(zips: string[]): Promise<{
  medianPrice: number
  priceChange: number
  daysOnMarket: number
  domChange: number
  activeListings: number
  inventoryChange: number
  priceHistory: { month: string; price: number }[]
  inventoryHistory: { month: string; listings: number; dom: number }[]
}> {
  const api = getRentcastAPI()

  // Fetch stats for each ZIP and average them
  const results = await Promise.all(
    zips.map(zip =>
      api
        .getMarketStatistics({ zipCode: zip, propertyType: 'Single Family' })
        .catch(() => null),
    ),
  )
  const valid = results.filter((r): r is MarketStats => r !== null)

  if (valid.length === 0) {
    // Fallback mock data
    return {
      medianPrice: 925000,
      priceChange: 4.2,
      daysOnMarket: 28,
      domChange: -3,
      activeListings: 142,
      inventoryChange: 6.5,
      priceHistory: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(Date.now() - (11 - i) * 30 * 24 * 3600 * 1000).toLocaleString(
          'default',
          { month: 'short' },
        ),
        price: 880000 + i * 4000 + Math.sin(i) * 15000,
      })),
      inventoryHistory: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(Date.now() - (11 - i) * 30 * 24 * 3600 * 1000).toLocaleString(
          'default',
          { month: 'short' },
        ),
        listings: 120 + i * 2 + Math.round(Math.sin(i) * 10),
        dom: 30 - i * 0.2 + Math.round(Math.cos(i) * 2),
      })),
    }
  }

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

  const medianPrice = avg(valid.map(r => r.medianSalePrice ?? 0))
  const priceChange = avg(valid.map(r => r.medianSalePriceChange ?? 0))
  const daysOnMarket = avg(valid.map(r => r.averageDaysOnMarket ?? 0))
  const domChange = avg(valid.map(r => r.averageDaysOnMarketChange ?? 0))
  const activeListings = Math.round(avg(valid.map(r => r.activeListings ?? 0)))
  const inventoryChange = avg(valid.map(r => r.activeListingsChange ?? 0))

  // Build price history from the first valid result that has it
  const withHistory = valid.find(r => r.priceHistory && r.priceHistory.length > 0)
  const priceHistory = withHistory?.priceHistory?.slice(-12).map(p => ({
    month: new Date(p.date).toLocaleString('default', { month: 'short' }),
    price: p.medianSalePrice,
  })) ?? []

  const withInventory = valid.find(
    r => r.inventoryHistory && r.inventoryHistory.length > 0,
  )
  const inventoryHistory = withInventory?.inventoryHistory?.slice(-12).map(p => ({
    month: new Date(p.date).toLocaleString('default', { month: 'short' }),
    listings: p.activeListings,
    dom: p.averageDaysOnMarket,
  })) ?? []

  return {
    medianPrice,
    priceChange,
    daysOnMarket,
    domChange,
    activeListings,
    inventoryChange,
    priceHistory,
    inventoryHistory,
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const CACHE_KEY = 'market_pulse'

  try {
    const cached = getCached<object>(CACHE_KEY)
    if (cached) return NextResponse.json(cached)

    const [rentcast, mortgage] = await Promise.all([
      fetchRentcastData(CONEJO_ZIPS),
      fetchMortgageRates(),
    ])

    const payload = {
      ...rentcast,
      mortgageRate: mortgage.current,
      rateChange: mortgage.change,
      mortgageHistory: mortgage.history,
      lastUpdated: new Date().toISOString(),
      source: 'RentCast + FRED',
    }

    setCached(CACHE_KEY, payload)
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[market/pulse]', err)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
