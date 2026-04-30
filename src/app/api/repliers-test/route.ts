import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.REPLIERS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'REPLIERS_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Example query: Residential listings in a specific area
    const params = new URLSearchParams({
      class: 'residential',
      status: 'A',
      type: 'sale',
      propertyType: 'Residential',
      fields: [
        'boardId',
        'mlsNumber',
        'map',
        'class',
        'status',
        'listPrice',
        'listDate',
        'soldPrice',
        'soldDate',
        'updatedOn',
        'address',
        'lastStatus',
        'details.numBathrooms',
        'details.numBathroomsPlus',
        'details.numBedrooms',
        'details.numBedroomsPlus',
        'details.propertyType',
        'details.sqft',
        'details.yearBuilt',
        'details.daysOnMarket',
        'lot.sizeTotal',
        'images',
      ].join(','),
      // Bounding box for the area (example coordinates)
      map: JSON.stringify([
        [
          [-118.64033558957004, 34.31826048356932],
          [-118.96980947643493, 34.31826048356932],
          [-118.96980947643493, 34.064588171880956],
          [-118.64033558957004, 34.064588171880956],
        ],
      ]),
    });

    const url = `https://api.repliers.io/listings?${params.toString()}`;

    console.log('🔍 Fetching Repliers.io data:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'REPLIERS-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Repliers API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Repliers API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Log the actual response structure to debug
    console.log('✅ Repliers API response:', JSON.stringify(data, null, 2));
    console.log('Response type:', typeof data);
    console.log('Is array?:', Array.isArray(data));
    
    // Handle different response structures
    let listings = [];
    if (Array.isArray(data)) {
      listings = data;
    } else if (data && Array.isArray(data.listings)) {
      listings = data.listings;
    } else if (data && Array.isArray(data.results)) {
      listings = data.results;
    } else if (data && Array.isArray(data.data)) {
      listings = data.data;
    } else {
      console.warn('⚠️ Unexpected response structure:', data);
      listings = [];
    }

    console.log('✅ Parsed listings count:', listings.length);

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings: listings,
      rawResponse: data, // Include raw response for debugging
    });
  } catch (error) {
    console.error('❌ Error fetching Repliers data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Repliers data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
