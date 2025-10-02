import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const rapidApiHost = 'zillow-com1.p.rapidapi.com';
const rapidApiKey = process.env.RAPIDAPI_KEY!;

export async function POST(req: Request) {
  try {
    const { address, propertyData } = await req.json();

    if (!address) {
      return Response.json({ error: 'Address is required' }, { status: 400 });
    }

    let finalPropertyData = propertyData;

    // Only fetch from API if no property data was provided
    if (!propertyData) {
      console.log('⚠️ No property data provided, fetching from API');
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
        if (response.status === 429) {
          console.log('⚠️ Rate limit hit for presentation tool, using fallback data');
          finalPropertyData = {
            address: address,
            propertyType: 'Single Family',
            bedrooms: 4,
            bathrooms: 2.5,
            squareFootage: 2000,
            yearBuilt: 2000,
            zestimate: 850000
          };
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      } else {
        finalPropertyData = await response.json();
      }
    } else {
      console.log('✅ Using provided property data for presentation generation');
    }

    // Generate AI summary using the property data
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a professional real estate analyst. Generate a an informative property summary based on the provided property data. The summary should be 2-3 paragraphs long, professional in tone, and highlight key features without sounding salesy, market position, and investment potential. Keep it factual information derived from the data provided, doesnt need to sell the property`,
      prompt: `Generate a professional property summary for the following property:

                Address: ${address || finalPropertyData.address || 'Property Address'}
                Property Type: ${finalPropertyData.propertyType || 'N/A'}
                Bedrooms: ${finalPropertyData.bedrooms || 'N/A'}
                Bathrooms: ${finalPropertyData.bathrooms || 'N/A'}
                Living Area: ${finalPropertyData.livingArea || 'N/A'} sq ft
                Year Built: ${finalPropertyData.yearBuilt || 'N/A'}
                Lot Size: ${finalPropertyData.lotSize || 'N/A'}
                Current Zestimate: $${finalPropertyData.zestimate?.toLocaleString() || 'N/A'}
                Price per Square Foot: $${finalPropertyData.pricePerSquareFoot || 'N/A'}
                Home Status: ${finalPropertyData.homeStatus || 'N/A'}
                Annual Tax Amount: $${finalPropertyData.taxAnnualAmount?.toLocaleString() || 'N/A'}
                Rent Estimate: $${finalPropertyData.rentZestimate?.toLocaleString() || 'N/A'}

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