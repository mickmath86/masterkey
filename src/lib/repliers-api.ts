export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyLocation: string;
  propertyType: string;
  timeline: string;
  leadSource: string;
  notes: string;
  customFields?: Record<string, string | number | boolean>;
}

export interface RepliersApiResponse {
  success: boolean;
  error?: string;
  leadId?: string;
}

class RepliersClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.repliers.io') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async createLead(leadData: LeadData): Promise<RepliersApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        leadId: result.id,
      };
    } catch (error) {
      console.error('Error creating lead:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export function getRepliersClient(): RepliersClient {
  const apiKey = process.env.NEXT_PUBLIC_REPLIERS_API_KEY || '';
  
  if (!apiKey) {
    console.warn('REPLIERS_API_KEY not found in environment variables');
  }
  
  return new RepliersClient(apiKey);
}
