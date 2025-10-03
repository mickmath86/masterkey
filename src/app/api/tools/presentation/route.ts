import { streamText, generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const rapidApiHost = 'zillow-com1.p.rapidapi.com';
const rapidApiKey = process.env.RAPIDAPI_KEY!;

console.log('🔥 PRESENTATION ROUTE FILE LOADED - Module execution');

// Create OpenAI client with trimmed API key to avoid newline issues
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim()
});

export async function POST(request: Request) {
  console.log('🚀 PRESENTATION API ROUTE STARTED - Basic execution check');
  console.log('🎯 Presentation API - Starting request processing:', {
    timestamp: new Date().toISOString(),
    url: request.url
  });
  // Check if required environment variables are configured
  console.log('🔑 Environment check:', {
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasRapidAPI: !!rapidApiKey,
    nodeEnv: process.env.NODE_ENV
  });
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable is not set');
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }
    
    if (!rapidApiKey) {
      console.error('❌ RAPIDAPI_KEY environment variable is not set');
      return Response.json({ error: 'RapidAPI key not configured' }, { status: 500 });
    }

    console.log('📥 Parsing request body...');
    const { address, propertyData } = await request.json();
    console.log('📋 Request data:', {
      address: address || 'NOT PROVIDED',
      hasPropertyData: !!propertyData,
      propertyDataKeys: propertyData ? Object.keys(propertyData) : 'NONE'
    });

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

    console.log('🤖 Preparing AI generation with data:', {
      hasPropertyData: !!finalPropertyData,
      propertyDataSample: finalPropertyData ? {
        address: finalPropertyData.address,
        price: finalPropertyData.price || finalPropertyData.zestimate,
        bedrooms: finalPropertyData.bedrooms,
        bathrooms: finalPropertyData.bathrooms
      } : 'NONE'
    });

    // Generate structured AI property summary
    console.log('🤖 Starting AI generation...');
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      system: `You are a professional real estate analyst. Generate a structured property summary that's informative and factual without being overly promotional.
      
      For keyFeatures categories, use only these options: size, age, location, value, condition, amenities, bedrooms, bathrooms, market_value, tax, rental, financial
      
      Map property details to appropriate categories:
      - Living area, square footage → "size"
      - Bedrooms → "bedrooms" 
      - Bathrooms → "bathrooms"
      - Current price, Zestimate → "market_value"
      - Property taxes → "tax"
      - Rental estimates → "rental"
      - Year built, property age → "age"
      - Address, neighborhood → "location"
      - Property condition, status → "condition"
      - Features, upgrades → "amenities"
      
      For investmentHighlights types, use only: appreciation, rental_income, tax_benefits, location, condition, value, financial`,
      schema: z.object({
        overview: z.string().describe("Brief 2-3 sentence overview of the property"),
        keyFeatures: z.array(z.object({
          category: z.enum(["size", "age", "location", "value", "condition", "amenities", "bedrooms", "bathrooms", "market_value", "tax", "rental", "financial"]).describe("Feature category"),
          title: z.string().describe("Feature title"),
          description: z.string().describe("Feature description")
        })).describe("Key property features organized by category"),
        marketPosition: z.object({
          pricePoint: z.enum(["below_market", "market_rate", "above_market"]).describe("Price positioning"),
          competitiveness: z.enum(["high", "moderate", "low"]).describe("Market competitiveness"),
          description: z.string().describe("Market position explanation")
        }),
        investmentHighlights: z.array(z.object({
          type: z.enum(["appreciation", "rental_income", "tax_benefits", "location", "condition", "value", "financial"]).describe("Investment aspect"),
          title: z.string().describe("Highlight title"),
          value: z.string().describe("Specific value or benefit")
        })).describe("Investment potential highlights"),
        propertyStats: z.object({
          pricePerSqFt: z.number().optional().describe("Price per square foot"),
          taxRate: z.number().optional().describe("Annual tax rate as percentage"),
          rentYield: z.number().optional().describe("Potential rental yield percentage"),
          ageCategory: z.enum(["new", "modern", "established", "vintage"]).describe("Property age category")
        })
      }),
      prompt: `Analyze this property data and provide structured insights:

Property Details:
- Address: ${address || finalPropertyData.address || 'Property Address'}
- Property Type: ${finalPropertyData.propertyType || 'N/A'}
- Bedrooms: ${finalPropertyData.bedrooms || 'N/A'}
- Bathrooms: ${finalPropertyData.bathrooms || 'N/A'}
- Living Area: ${finalPropertyData.livingArea || 'N/A'} sq ft
- Year Built: ${finalPropertyData.yearBuilt || 'N/A'}
- Lot Size: ${finalPropertyData.lotSize || 'N/A'}
- Current Zestimate: $${finalPropertyData.zestimate?.toLocaleString() || 'N/A'}
- Price per Sq Ft: $${finalPropertyData.pricePerSquareFoot || 'N/A'}
- Home Status: ${finalPropertyData.homeStatus || 'N/A'}
- Annual Tax: $${finalPropertyData.taxAnnualAmount?.toLocaleString() || 'N/A'}
- Rent Estimate: $${finalPropertyData.rentZestimate?.toLocaleString() || 'N/A'}

Focus on factual analysis, market positioning, and investment potential based on the data provided.`
    });

    console.log('✅ AI generation successful! Result structure:', {
      hasOverview: !!result.object.overview,
      keyFeaturesCount: result.object.keyFeatures?.length || 0,
      hasMarketPosition: !!result.object.marketPosition,
      investmentHighlightsCount: result.object.investmentHighlights?.length || 0,
      hasPropertyStats: !!result.object.propertyStats
    });

    return Response.json(result.object);

  } catch (error) {
    console.error('❌ Presentation API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV
    });
    
    return Response.json({ 
      error: 'Failed to generate property summary',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}