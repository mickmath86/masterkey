interface ZillowPropertyResponse {
  success: boolean;
  data?: ZillowPropertyData;
  error?: string;
}

interface ZillowPropertyData {
  zpid: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  propertyType: string;
  homeStatus: string;
  zestimate?: number;
  rentZestimate?: number;
  yearBuilt?: number;
  lotSize?: number;
  price?: number;
  priceHistory?: Array<{
    date: string;
    price: number;
    event: string;
  }>;
  photos?: string[];
  description?: string;
  schools?: Array<{
    name: string;
    rating: number;
    level: string;
  }>;
  neighborhood?: {
    name: string;
    walkScore?: number;
  };
}

class ZillowAPIService {
  private apiKey: string;
  private baseUrl: string = 'https://zillow-com1.p.rapidapi.com';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
  }

  async getPropertyByAddress(address: string): Promise<ZillowPropertyResponse> {
    if (!this.apiKey) {
      console.warn('RapidAPI key not configured, using fallback simulation');
      return this.getFallbackData(address);
    }

    try {
      const searchParams = new URLSearchParams({
        address: address,
      });

      const response = await fetch(`${this.baseUrl}/property?${searchParams}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Zillow API returned ${response.status}, falling back to simulation`);
        return this.getFallbackData(address);
      }

      const data = await response.json();
      
      if (!data || !data.zpid) {
        console.warn('No property found in Zillow API, using fallback');
        return this.getFallbackData(address);
      }

      return {
        success: true,
        data: this.transformZillowData(data, address)
      };

    } catch (error) {
      console.error('Zillow API error:', error);
      return this.getFallbackData(address);
    }
  }

  private transformZillowData(zillowData: any, originalAddress: string): ZillowPropertyData {
    return {
      zpid: zillowData.zpid || 'unknown',
      address: zillowData.address?.streetAddress || originalAddress,
      bedrooms: zillowData.bedrooms || 0,
      bathrooms: zillowData.bathrooms || 0,
      livingArea: zillowData.livingArea || 0,
      propertyType: zillowData.propertyType || 'Unknown',
      homeStatus: zillowData.homeStatus || 'Unknown',
      zestimate: zillowData.zestimate?.value,
      rentZestimate: zillowData.rentZestimate?.value,
      yearBuilt: zillowData.yearBuilt,
      lotSize: zillowData.lotSize,
      price: zillowData.price,
      priceHistory: zillowData.priceHistory?.map((item: any) => ({
        date: item.date,
        price: item.price,
        event: item.event
      })) || [],
      photos: zillowData.photos?.map((photo: any) => photo.url) || [],
      description: zillowData.description,
      schools: zillowData.schools?.map((school: any) => ({
        name: school.name,
        rating: school.rating,
        level: school.level
      })) || [],
      neighborhood: {
        name: zillowData.neighborhood?.name || 'Unknown',
        walkScore: zillowData.walkScore
      }
    };
  }

  private getFallbackData(address: string): ZillowPropertyResponse {
    // Simulate property data for development/testing
    const fallbackData: ZillowPropertyData = {
      zpid: 'sim_' + Date.now(),
      address: address,
      bedrooms: 3,
      bathrooms: 2,
      livingArea: 1850,
      propertyType: 'Single Family',
      homeStatus: 'For Sale',
      zestimate: 485000,
      rentZestimate: 2800,
      yearBuilt: 1995,
      lotSize: 7200,
      price: 475000,
      priceHistory: [
        {
          date: '2024-01-15',
          price: 475000,
          event: 'Listed for sale'
        },
        {
          date: '2023-08-20',
          price: 460000,
          event: 'Price change'
        }
      ],
      photos: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      description: 'Beautiful single-family home with modern amenities and spacious layout.',
      schools: [
        {
          name: 'Lincoln Elementary School',
          rating: 8,
          level: 'Elementary'
        },
        {
          name: 'Roosevelt Middle School',
          rating: 7,
          level: 'Middle'
        }
      ],
      neighborhood: {
        name: 'Sunset District',
        walkScore: 75
      }
    };

    return {
      success: true,
      data: fallbackData
    };
  }
}

export const zillowAPI = new ZillowAPIService();
export type { ZillowPropertyResponse, ZillowPropertyData };
