interface WebhookSubmissionData {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Property Information
  propertyLocation: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  livingArea?: number;
  yearBuilt?: number;
  lotSize?: number;
  zestimate?: number;
  homeStatus?: string;
  
  // Selling Details
  sellingReason: string;
  timeline: string;
  needToSellFirst: string;
  expectedValue: string;
  outstandingObligations: string;
  occupancyStatus: string;
  
  // Metadata
  leadSource?: string;
  notes?: string;
  zpid?: string;
}

interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class WebhookService {
  private webhookUrl = 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/30bbf863-a084-4302-8069-8200c0b9ea0b';

  async submitLead(data: WebhookSubmissionData): Promise<WebhookResponse> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Map our data to the webhook format
          contact: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
          },
          property: {
            address: data.propertyLocation,
            type: data.propertyType,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            livingArea: data.livingArea,
            yearBuilt: data.yearBuilt,
            lotSize: data.lotSize,
            estimatedValue: data.zestimate,
            homeStatus: data.homeStatus,
            zpid: data.zpid,
          },
          sellingDetails: {
            reason: data.sellingReason,
            timeline: data.timeline,
            needToSellFirst: data.needToSellFirst,
            expectedValue: data.expectedValue,
            outstandingObligations: data.outstandingObligations,
            occupancyStatus: data.occupancyStatus,
          },
          metadata: {
            leadSource: data.leadSource || 'MasterKey Property Sell Form',
            notes: data.notes,
            submittedAt: new Date().toISOString(),
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook submission failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'Lead submitted successfully'
      };
    } catch (error) {
      console.error('Webhook submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const webhookService = new WebhookService();
export type { WebhookSubmissionData, WebhookResponse };
