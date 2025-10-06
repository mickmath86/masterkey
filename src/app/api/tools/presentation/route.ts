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
    const { address, propertyData, questionnaireData } = await request.json();
    console.log('📋 Request data:', {
      address,
      hasPropertyData: !!propertyData,
      propertyDataKeys: propertyData ? Object.keys(propertyData) : [],
      hasQuestionnaireData: !!questionnaireData,
      propertyCondition: questionnaireData?.propertyCondition
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
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          throw new Error(`API request failed: ${data.error}`);
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      } else {
        finalPropertyData = await response.json();
      }
    } else {
      console.log('✅ Using provided property data for presentation generation');
    }

    // Check if property type is supported (only single family homes and condos)
    const supportedHomeTypes = ['SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE'];
    if (finalPropertyData?.homeType && !supportedHomeTypes.includes(finalPropertyData.homeType)) {
      console.log(`❌ Unsupported property type: ${finalPropertyData.homeType}`);
      return Response.json({
        error: 'Property type not supported',
        message: 'We currently only support single family homes, condos, and townhouses. This property appears to be a different type of residence.',
        propertyType: finalPropertyData.homeType
      }, { status: 400 });
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
      prompt: `Property Address: ${address}

Property Details:
${JSON.stringify(finalPropertyData, null, 2)}

${questionnaireData?.propertyCondition ? `Property Condition (from owner): ${questionnaireData.propertyCondition}` : ''}

Generate a comprehensive property summary focusing on key selling points and market position. Be factual and informative without being overly promotional. Use "valuation" instead of "Zestimate" in all descriptions.${questionnaireData?.propertyCondition ? ` Take into account the property condition provided by the owner: "${questionnaireData.propertyCondition}". Include this condition assessment in the keyFeatures with category "condition" and reference it appropriately in the overview and investment highlights.` : ''}`,
      schema: z.object({
        overview: z.string().describe("Brief 2-3 sentence overview of the property"),
        keyFeatures: z.array(z.object({
          category: z.enum(["size", "age", "location", "value", "condition", "amenities", "bedrooms", "bathrooms", "market_value", "tax", "rental", "financial"]).describe(`Feature category. Dont use word zestimate, use word - valuation.  ${questionnaireData?.propertyCondition ? `Take into account the property condition provided by the owner: "${questionnaireData.propertyCondition}"` : ''}`),
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
      })
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