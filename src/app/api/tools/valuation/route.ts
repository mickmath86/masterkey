import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const rapidApiHost = 'zillow-com1.p.rapidapi.com';
const rapidApiKey = process.env.RAPIDAPI_KEY!;

export async function POST(req: Request) {
  try {
    const { address, zpid } = await req.json();

    if (!address || !zpid) {
      return Response.json({ error: 'Address and zpid are required' }, { status: 400 });
    }

    // Fetch property data from Zillow API
    const propertyResponse = await fetch(
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

    if (!propertyResponse.ok) {
      throw new Error(`Property API request failed: ${propertyResponse.status}`);
    }

    const propertyData = await propertyResponse.json();

    // Fetch zestimate history data
    const historyResponse = await fetch(
      `https://${rapidApiHost}/zestimateHistory?address=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': rapidApiHost,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!historyResponse.ok) {
      throw new Error(`History API request failed: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    const zestimateHistory = historyData[0]?.zestimateHistory || [];

    // Debug logs
    console.log('Property data for valuation:', propertyData);
    console.log('Zestimate history data:', zestimateHistory);

    // Calculate some basic metrics from history
    const recentHistory = zestimateHistory.slice(-12); // Last 12 months
    const oldestValue = Number(recentHistory[0]?.v) || Number(propertyData.zestimate) || 0;
    const newestValue = Number(recentHistory[recentHistory.length - 1]?.v) || Number(propertyData.zestimate) || 0;
    const valueChange = newestValue - oldestValue;
    const percentChange = oldestValue ? ((valueChange / oldestValue) * 100).toFixed(1) : '0';

    // Generate AI valuation analysis
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a professional real estate valuation analyst. Be down to earth and speak in terms the user (a home seller) would understand. Generate an informative valuation analysis based on the provided property data and zestimate history. The analysis should be 1 paragraph long, semi-professional in tone, and focus on valuation trends, market performance, and investment insights. Keep it factual without being overly promotional.`,
      prompt: `Generate a professional valuation analysis for the following property:

Address: ${address}
Current Zestimate: $${propertyData.zestimate?.toLocaleString() || 'N/A'}
Property Type: ${propertyData.propertyType || 'N/A'}
Year Built: ${propertyData.yearBuilt || 'N/A'}
Living Area: ${propertyData.livingArea || 'N/A'} sq ft
Price per Square Foot: $${propertyData.pricePerSquareFoot || 'N/A'}
Home Status: ${propertyData.homeStatus || 'N/A'}

Valuation History Analysis:
- 12-Month Value Change: ${valueChange > 0 ? '+' : ''}$${valueChange?.toLocaleString()} (${Number(percentChange) > 0 ? '+' : ''}${percentChange}%)
- Historical Data Points: ${zestimateHistory.length} months of data available
- Oldest Recent Value: $${oldestValue?.toLocaleString()}
- Current Value: $${newestValue?.toLocaleString()}

Recent Zestimate History (last 6 months):
${recentHistory.slice(-6).map((item: any, index: number) => 
  `Month ${index + 1}: $${Number(item.v)?.toLocaleString()} (${new Date(item.t).toLocaleDateString()})`
).join('\n')}

Focus your analysis on:
1. Valuation trends and market performance over time
2. Property's value stability or volatility
3. Market positioning relative to price per square foot
4. Investment perspective and value trajectory insights

Provide actionable insights about the property's valuation performance and market position.`
    });

    // Return the streaming response directly from AI SDK
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Error generating valuation analysis:', error);
    return Response.json({ 
      error: 'Failed to generate valuation analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
