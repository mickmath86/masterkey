import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const rapidApiHost = 'zillow-com1.p.rapidapi.com';
const rapidApiKey = process.env.RAPIDAPI_KEY!;

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return Response.json({ error: 'Address is required' }, { status: 400 });
    }

    // Fetch property data from Zillow API
    const response = await fetch(
      `https://${rapidApiHost}/property?address=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': rapidApiHost,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const propertyData = await response.json();
    
    // Debug log to check property data
    console.log('Property data received:', propertyData);
    console.log('Address from property data:', propertyData.address);

    // Generate AI summary using the property data
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a professional real estate analyst. Generate a an informative property summary based on the provided property data. The summary should be 2-3 paragraphs long, professional in tone, and highlight key features without sounding salesy, market position, and investment potential. Keep it factual information derived from the data provided, doesnt need to sell the property`,
      prompt: `Generate a professional property summary for the following property:

                Address: ${address || propertyData.address || 'Property Address'}
                Property Type: ${propertyData.propertyType || 'N/A'}
                Bedrooms: ${propertyData.bedrooms || 'N/A'}
                Bathrooms: ${propertyData.bathrooms || 'N/A'}
                Living Area: ${propertyData.livingArea || 'N/A'} sq ft
                Year Built: ${propertyData.yearBuilt || 'N/A'}
                Lot Size: ${propertyData.lotSize || 'N/A'}
                Current Zestimate: $${propertyData.zestimate?.toLocaleString() || 'N/A'}
                Price per Square Foot: $${propertyData.pricePerSquareFoot || 'N/A'}
                Home Status: ${propertyData.homeStatus || 'N/A'}
                Annual Tax Amount: $${propertyData.taxAnnualAmount?.toLocaleString() || 'N/A'}
                Rent Estimate: $${propertyData.rentZestimate?.toLocaleString() || 'N/A'}

                `
    });

    // Return the streaming response directly from AI SDK
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Error generating property summary:', error);
    return Response.json({ 
      error: 'Failed to generate property summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}