import { NextRequest, NextResponse } from 'next/server';

interface FormAnalyticsEvent {
  event: string;
  properties: {
    form_name: string;
    step_number: number;
    step_name: string;
    user_id?: string;
    session_id: string;
    timestamp: string;
    form_data?: any;
    user_flow?: string;
    time_on_step?: number;
    previous_step?: number;
    completion_percentage?: number;
    server_timestamp?: string;
    client_ip?: string;
    user_agent?: string;
    referer?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const event: FormAnalyticsEvent = await request.json();
    
    // Validate required fields
    if (!event.event || !event.properties) {
      return NextResponse.json(
        { error: 'Missing required event data' },
        { status: 400 }
      );
    }

    // Get client information
    const clientInfo = {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown'
    };

    // Enhance event with server-side data
    const enhancedEvent = {
      ...event,
      properties: {
        ...event.properties,
        server_timestamp: new Date().toISOString(),
        client_ip: clientInfo.ip,
        user_agent: clientInfo.userAgent,
        referer: clientInfo.referer
      }
    };

    // Log to console for development (replace with proper analytics service)
    console.log('📊 Form Analytics Event Received:', {
      event: enhancedEvent.event,
      step: enhancedEvent.properties.step_name,
      completion: enhancedEvent.properties.completion_percentage + '%',
      session: enhancedEvent.properties.session_id,
      timestamp: enhancedEvent.properties.timestamp
    });

    // TODO: Send to your analytics service
    // Examples:
    
    // 1. Send to Google Analytics 4 (server-side)
    // await sendToGA4(enhancedEvent);
    
    // 2. Send to Mixpanel
    // await sendToMixpanel(enhancedEvent);
    
    // 3. Store in database for custom analytics
    // await storeInDatabase(enhancedEvent);
    
    // 4. Send to multiple services
    await Promise.allSettled([
      // sendToGA4(enhancedEvent),
      // sendToMixpanel(enhancedEvent),
      storeEventLocally(enhancedEvent) // For now, just log locally
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}

// Example: Store event locally (replace with your preferred storage)
async function storeEventLocally(event: FormAnalyticsEvent): Promise<void> {
  // In production, you might want to:
  // 1. Store in a database (PostgreSQL, MongoDB, etc.)
  // 2. Send to a data warehouse (BigQuery, Snowflake, etc.)
  // 3. Queue for batch processing
  
  // For now, we'll just log structured data
  const logEntry = {
    timestamp: new Date().toISOString(),
    event_type: event.event,
    form_name: event.properties.form_name,
    step_number: event.properties.step_number,
    step_name: event.properties.step_name,
    session_id: event.properties.session_id,
    user_flow: event.properties.user_flow,
    completion_percentage: event.properties.completion_percentage,
    time_on_step: event.properties.time_on_step,
    client_ip: event.properties.client_ip,
    user_agent: event.properties.user_agent
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.table(logEntry);
  }

  // In production, you could write to a file or send to a logging service
  // Example: Write to a JSON log file
  // const fs = require('fs').promises;
  // await fs.appendFile('analytics.log', JSON.stringify(logEntry) + '\n');
}

// Example: Send to Google Analytics 4 (server-side)
async function sendToGA4(event: FormAnalyticsEvent): Promise<void> {
  if (!process.env.GA4_MEASUREMENT_ID || !process.env.GA4_API_SECRET) {
    console.warn('GA4 credentials not configured');
    return;
  }

  const ga4Payload = {
    client_id: event.properties.session_id,
    events: [{
      name: event.event,
      params: {
        form_name: event.properties.form_name,
        step_number: event.properties.step_number,
        step_name: event.properties.step_name,
        user_flow: event.properties.user_flow,
        completion_percentage: event.properties.completion_percentage,
        time_on_step: event.properties.time_on_step
      }
    }]
  };

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ga4Payload)
      }
    );

    if (!response.ok) {
      throw new Error(`GA4 API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send to GA4:', error);
  }
}

// Example: Send to Mixpanel
async function sendToMixpanel(event: FormAnalyticsEvent): Promise<void> {
  if (!process.env.MIXPANEL_TOKEN) {
    console.warn('Mixpanel token not configured');
    return;
  }

  const mixpanelPayload = {
    event: event.event,
    properties: {
      ...event.properties,
      token: process.env.MIXPANEL_TOKEN,
      distinct_id: event.properties.session_id,
      time: Math.floor(new Date(event.properties.timestamp).getTime() / 1000)
    }
  };

  try {
    const response = await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([mixpanelPayload])
    });

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send to Mixpanel:', error);
  }
}
