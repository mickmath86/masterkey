// Zillow API integration using RapidAPI
export interface ZillowPropertyData {
  address: string;
  zpid: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: string;
  homeStatus: string;
  zestimate: number;
  rentZestimate?: number;
  priceHistory: Array<{
    date: string;
    price: number;
    event: string;
  }>;
  comparables: Array<{
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    livingArea: number;
  }>;
}

export interface ZillowMarketData {
  medianHomeValue: number;
  priceChange30Days: number;
  priceChange1Year: number;
  daysOnMarket: number;
  inventory: number;
}

export class ZillowAPI {
  private apiKey: string;
  private host = 'zillow-com1.p.rapidapi.com';
  private baseUrl = `https://${this.host}`;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': this.host,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please wait before making more requests.`);
      }
      throw new Error(`Zillow API error: ${response.status}`);
    }

    return response.json();
  }

  async searchProperty(address: string): Promise<ZillowPropertyData | null> {
    try {
      const searchResult = await this.makeRequest('/propertyExtendedSearch', {
        location: address,
        status_type: 'ForSale',
      });

      if (!searchResult.props || searchResult.props.length === 0) {
        return null;
      }

      const property = searchResult.props[0];
      
      return {
        address: property.address || address,
        zpid: property.zpid,
        price: property.price || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        livingArea: property.livingArea || 0,
        lotSize: property.lotAreaValue || 0,
        yearBuilt: property.yearBuilt || 0,
        propertyType: property.propertyType || 'Unknown',
        homeStatus: property.listingStatus || 'For Sale',
        zestimate: property.zestimate || 0,
        rentZestimate: property.rentZestimate,
        priceHistory: property.priceHistory || [],
        comparables: property.comps || [],
      };
    } catch (error) {
      console.error('Error fetching Zillow property data:', error);
      return null;
    }
  }

  async getPropertyDetails(address: string): Promise<ZillowPropertyData | null> {
    try {
      const propertyResult = await this.makeRequest('/property', {
        address: address,
      });

      if (!propertyResult) {
        return null;
      }

      return {
        address: propertyResult.address || address,
        zpid: propertyResult.zpid,
        price: propertyResult.price || 0,
        bedrooms: propertyResult.bedrooms || 0,
        bathrooms: propertyResult.bathrooms || 0,
        livingArea: propertyResult.livingArea || 0,
        lotSize: propertyResult.lotAreaValue || 0,
        yearBuilt: propertyResult.yearBuilt || 0,
        propertyType: propertyResult.propertyType || 'Unknown',
        homeStatus: propertyResult.listingStatus || 'For Sale',
        zestimate: propertyResult.zestimate || 0,
        rentZestimate: propertyResult.rentZestimate,
        priceHistory: propertyResult.priceHistory || [],
        comparables: propertyResult.comps || [],
      };
    } catch (error) {
      console.error('Error fetching Zillow property details:', error);
      return null;
    }
  }

  async getMarketData(address: string): Promise<ZillowMarketData | null> {
    // Market data endpoint doesn't exist in RapidAPI Zillow
    // Return null to use fallback data
    console.warn('Market data endpoint not available in RapidAPI Zillow, using fallback data');
    return null;
  }
}

// Singleton instance
let zillowAPI: ZillowAPI | null = null;

export function getZillowAPI(): ZillowAPI {
  if (!zillowAPI) {
    const apiKey = process.env.NEXT_PUBLIC_ZILLOW_API_KEY || process.env.ZILLOW_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_ZILLOW_API_KEY environment variable is not set');
    }
    zillowAPI = new ZillowAPI(apiKey);
  }
  return zillowAPI;
}
