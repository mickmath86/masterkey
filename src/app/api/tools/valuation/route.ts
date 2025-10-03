import { generateText, streamText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const rapidApiHost = 'zillow-com1.p.rapidapi.com';
const rapidApiKey = process.env.RAPIDAPI_KEY!;

console.log('🔥 VALUATION ROUTE FILE LOADED - Module execution');

export async function POST(request: Request) {
  console.log('🚀 VALUATION API ROUTE STARTED - Basic execution check');
  console.log('📊 Valuation API - Starting request processing:', {
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
    const { address, zpid, propertyData: passedPropertyData, valueData } = await request.json();
    console.log('📋 Request data:', {
      address: address || 'NOT PROVIDED',
      zpid: zpid || 'NOT PROVIDED',
      hasPropertyData: !!passedPropertyData,
      hasValueData: !!valueData,
      valueDataLength: Array.isArray(valueData) ? valueData.length : 'NOT ARRAY'
    });

    if (!address || !zpid) {
      return Response.json({ error: 'Address and zpid are required' }, { status: 400 });
    }

    let finalPropertyData = passedPropertyData;

    // Only fetch property data if not provided
    if (!passedPropertyData) {
      console.log('⚠️ No property data provided for valuation, fetching from API');
      const propertyResponse = await fetch(
        `https://${rapidApiHost}/property?address=${encodeURIComponent(address)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }
      );

      if (!propertyResponse.ok) {
        throw new Error(`Property API request failed: ${propertyResponse.status}`);
      }
    } else {
      console.log('✅ Using provided property data for valuation analysis');
    }

    let zestimateHistory = [];

    // Use provided valueData if available, otherwise fetch it
    if (valueData && Array.isArray(valueData)) {
      console.log('✅ Using provided value data for valuation analysis');
      zestimateHistory = valueData;
    } else {
      console.log('⚠️ No value data provided, fetching from API');
      // Fetch value history data (same as chart uses)
      const valuesResponse = await fetch(
        `https://${rapidApiHost}/zestimateHistory?zpid=${zpid}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }
      );

      if (!valuesResponse.ok) {
        if (valuesResponse.status === 429) {
          console.log('⚠️ Rate limit hit for valuation tool, using fallback analysis');
        } else if (valuesResponse.status === 404) {
          console.log('⚠️ Value history not found for zpid, using fallback analysis');
        } else {
          console.log(`⚠️ Values API error ${valuesResponse.status}, using fallback analysis`);
        }
        
        // Generate valuation analysis without detailed history data for any API error
        console.log('📊 Generating valuation analysis without historical data');
        
        // Use empty array for zestimateHistory to continue with analysis
        zestimateHistory = [];
      } else {
        const valuesData = await valuesResponse.json();
        // Use the same data structure as the chart component
        zestimateHistory = Array.isArray(valuesData) ? valuesData : [];
      }
    }

    console.log('📊 Values Data for Valuation:', {
      source: valueData ? 'provided' : 'fetched',
      dataLength: zestimateHistory.length,
      firstItem: zestimateHistory[0],
      lastItem: zestimateHistory[zestimateHistory.length - 1]
    });

    console.log('✅ Generating valuation analysis with property data and history');

    // Calculate 12-month performance using the same method as the chart
    // Find the value from exactly 12 months ago and compare to most recent
    const now = new Date();
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
    
    // Sort history by timestamp to ensure proper ordering
    const sortedHistory = zestimateHistory.sort((a: any, b: any) => a.t - b.t);
    
    // Find the closest value to 12 months ago
    const twelveMonthsAgoTimestamp = Math.floor(twelveMonthsAgo.getTime() / 1000);
    let baselineValue = null;
    let baselineIndex = -1;
    
    // Find the data point closest to 12 months ago
    for (let i = 0; i < sortedHistory.length; i++) {
      if (sortedHistory[i].t >= twelveMonthsAgoTimestamp) {
        baselineIndex = i;
        baselineValue = Number(sortedHistory[i].v);
        break;
      }
    }
    
    // If no exact match, use the closest earlier data point
    if (baselineIndex === -1 && sortedHistory.length > 0) {
      baselineIndex = 0;
      baselineValue = Number(sortedHistory[0].v);
    }
    
    // Get the most recent value
    const newestValue = sortedHistory.length > 0 ? Number(sortedHistory[sortedHistory.length - 1].v) : Number(finalPropertyData?.zestimate) || 0;
    const oldestValue = baselineValue || newestValue;
    
    const valueChange = newestValue - oldestValue;
    const percentChange = oldestValue ? ((valueChange / oldestValue) * 100) : 0;
    
    // Handle case where we have no historical data
    const hasHistoricalData = sortedHistory.length > 0;
    
    console.log('📊 12-Month Calculation:', {
      oldestValue: oldestValue,
      newestValue: newestValue,
      valueChange: valueChange,
      percentChange: percentChange.toFixed(1) + '%',
      dataPoints: sortedHistory.length,
      baselineDate: baselineIndex >= 0 ? new Date(sortedHistory[baselineIndex].t * 1000).toLocaleDateString() : 'N/A',
      newestDate: sortedHistory.length > 0 ? new Date(sortedHistory[sortedHistory.length - 1].t * 1000).toLocaleDateString() : 'N/A'
    });

    console.log('🤖 Preparing valuation AI generation with data:', {
      hasPropertyData: !!finalPropertyData,
      hasHistoricalData,
      dataPointsCount: sortedHistory.length,
      currentValue: newestValue,
      yearOverYearChange: percentChange.toFixed(1) + '%'
    });

    // Generate structured AI valuation analysis
    console.log('🤖 Starting valuation AI generation...');
    const result = await generateObject({
      model: openai("gpt-4o-mini"), // Using gpt-4o-mini for better structured output
      system: `You are a professional real estate valuation analyst. Generate a structured valuation analysis that's informative yet accessible to home sellers. Instead of saying Zestimate anywhere make sure to call our valuation. `,
      schema: z.object({
        summary: z.string().describe("Brief 2-3 sentence overview of the property's valuation"),
        marketTrend: z.object({
          direction: z.enum(["increasing", "decreasing", "stable"]).describe("Overall trend direction"),
          strength: z.enum(["strong", "moderate", "weak"]).describe("Strength of the trend"),
          description: z.string().describe("1-2 sentence explanation of the trend")
        }),
        keyMetrics: z.object({
          valueChange12Month: z.object({
            amount: z.number().describe("Dollar amount change over 12 months"),
            percentage: z.number().describe("Percentage change over 12 months"),
            isPositive: z.boolean().describe("Whether the change is positive")
          }),
          pricePerSqFt: z.object({
            current: z.number().optional().describe("Current price per square foot"),
            marketPosition: z.enum(["above", "at", "below"]).describe("Position relative to market average")
          }),
          volatility: z.enum(["low", "moderate", "high"]).describe("Price volatility assessment")
        }),
        insights: z.array(z.object({
          type: z.enum(["positive", "neutral", "negative"]).describe("Type of insight"),
          title: z.string().describe("Short insight title"),
          description: z.string().describe("Detailed explanation")
        })).describe("Key insights about the property"),
        recommendation: z.object({
          action: z.enum(["hold", "sell_soon", "sell_now", "wait"]).describe("Recommended action. Make sure there is established critera for this so that we dont recommend two different suggestions if they run through the process again. "),
          reasoning: z.string().describe("Explanation for the recommendation. Make sure to take into consideration the seller's motivations and pending their desire to sell.  "),
          timeframe: z.string().describe("Suggested timeframe for action")
        })
      }),
      prompt: `Analyze this property's valuation data and provide structured insights:

        Property Details:
        - Address: ${address}
        - Current Zestimate: $${finalPropertyData?.zestimate?.toLocaleString() || 'N/A'}
        - Property Type: ${finalPropertyData?.propertyType || 'N/A'}
        - Living Area: ${finalPropertyData?.livingArea || 'N/A'} sq ft
        - Year Built: ${finalPropertyData?.yearBuilt || 'N/A'}
        - Price per Sq Ft: $${finalPropertyData?.pricePerSquareFoot || 'N/A'}

        ${hasHistoricalData ? `Market Performance:
        - 12-Month Change: ${valueChange > 0 ? '+' : ''}$${valueChange?.toLocaleString()} (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%)
        - Data Points Available: ${zestimateHistory.length} months
        - Current Value: $${newestValue?.toLocaleString()}
        - Recent History: ${sortedHistory.slice(-6).map((item: any) => 
          `$${Number(item.v)?.toLocaleString()}`
        ).join(', ')}` : `Market Performance:
        - Historical data not available
        - Analysis based on current property characteristics and market conditions
        - Current Value: $${newestValue?.toLocaleString()}`}

        ${hasHistoricalData ? 
          'Provide actionable, data-driven insights for a home seller based on historical trends.' : 
          'Provide actionable insights for a home seller based on property characteristics and general market conditions.'}`
    });

    console.log('✅ Valuation AI generation successful! Result structure:', {
      hasSummary: !!result.object.summary,
      hasMarketTrend: !!result.object.marketTrend,
      hasKeyMetrics: !!result.object.keyMetrics,
      hasRecommendation: !!result.object.recommendation
    });

    return Response.json(result.object);

  } catch (error) {
    console.error('❌ Valuation API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV
    });
    
    return Response.json({ 
      error: 'Failed to generate valuation analysis',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
