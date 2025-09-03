/**
 * Rentcast API Service
 * Handles all interactions with the Rentcast API for market data and property information
 */

// Types for Rentcast API responses
export interface MarketStatistics {
  zipCode: string
  saleData?: {
    averageDaysOnMarket?: number
    averageListPrice?: number
    averagePrice?: number
    averagePricePerSquareFoot?: number
    medianListPrice?: number
    medianPrice?: number
    totalListings?: number
    totalSales?: number
    newListings?: number
    priceReduction?: {
      percent?: number
      count?: number
    }
  }
  rentalData?: {
    averageDaysOnMarket?: number
    averageRentPrice?: number
    averageRentPricePerSqft?: number
    medianRentPrice?: number
    totalListings?: number
    totalRentals?: number
  }
  lastUpdated?: string
}

export interface RentcastApiResponse {
  zipCode: string
  saleData?: Record<string, unknown>
  rentalData?: Record<string, unknown>
  status: string
  message?: string
}

export class RentcastAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.RENTCAST_API_KEY || ''
    this.baseUrl = 'https://api.rentcast.io/v1' // Use hardcoded URL to avoid env var issues

    if (!this.apiKey) {
      throw new Error('RENTCAST_API_KEY environment variable is required')
    }
  }

  /**
   * Get market statistics for a specific zip code
   */
  async getMarketStatistics(
    zipCode: string, 
    dataType: 'All' | 'Sale' | 'Rental' = 'All'
  ): Promise<MarketStatistics> {
    try {
      const url = `${this.baseUrl}/markets`
      const params = new URLSearchParams({
        zipCode,
        dataType,
        historyRange: '6' // Match sandbox parameter
      })

      console.log(`Rentcast API: Fetching market data for zip ${zipCode}`)
      
      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Rentcast API key')
        }
        if (response.status === 404) {
          throw new Error(`No market data available for zip code ${zipCode}`)
        }
        if (response.status === 429) {
          throw new Error('Rentcast API rate limit exceeded')
        }
        throw new Error(`Rentcast API error: ${response.status}`)
      }

      const data: RentcastApiResponse = await response.json()
      
      return this.processMarketData(data, zipCode)
    } catch (error) {
      console.error('Rentcast API error:', error)
      throw error
    }
  }

  /**
   * Process and normalize market data from Rentcast API
   */
  private processMarketData(data: RentcastApiResponse, zipCode: string): MarketStatistics {
    return {
      zipCode,
      saleData: data.saleData ? {
        averageDaysOnMarket: data.saleData.averageDaysOnMarket as number,
        averageListPrice: data.saleData.averageListPrice as number,
        averagePrice: data.saleData.averagePrice as number,
        averagePricePerSquareFoot: data.saleData.averagePricePerSquareFoot as number,
        medianListPrice: data.saleData.medianListPrice as number,
        medianPrice: data.saleData.medianPrice as number,
        totalListings: data.saleData.totalListings as number,
        totalSales: data.saleData.totalSales as number,
        newListings: data.saleData.newListings as number,
        priceReduction: data.saleData.priceReduction as { percent?: number; count?: number }
      } : undefined,
      rentalData: data.rentalData ? {
        averageDaysOnMarket: data.rentalData.averageDaysOnMarket as number,
        averageRentPrice: data.rentalData.averageRentPrice as number,
        averageRentPricePerSqft: data.rentalData.averageRentPricePerSqft as number,
        medianRentPrice: data.rentalData.medianRentPrice as number,
        totalListings: data.rentalData.totalListings as number,
        totalRentals: data.rentalData.totalRentals as number
      } : undefined,
      lastUpdated: new Date().toISOString()
    }
  }
}

// Singleton instance
let rentcastAPI: RentcastAPI | null = null

export function getRentcastAPI(): RentcastAPI {
  if (!rentcastAPI) {
    rentcastAPI = new RentcastAPI()
  }
  return rentcastAPI
}
