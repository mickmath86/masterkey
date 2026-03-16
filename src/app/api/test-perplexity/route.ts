/**
 * GET /api/test-perplexity
 * 
 * Simple test endpoint to verify Perplexity API connection using direct HTTP
 */

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    apiKeyPresent: !!process.env.PERPLEXITY_API_KEY,
    apiKeyLength: process.env.PERPLEXITY_API_KEY?.length || 0,
    endpoint: "https://api.perplexity.ai/chat/completions",
    model: "sonar",
  };

  // Check if API key is set
  if (!process.env.PERPLEXITY_API_KEY) {
    return Response.json(
      {
        success: false,
        error: "PERPLEXITY_API_KEY environment variable is not set",
        diagnostics,
        help: "Add PERPLEXITY_API_KEY to your .env.local file",
      },
      { status: 500 }
    );
  }

  try {
    console.log("🔍 Testing Perplexity API connection...");
    console.log("Endpoint: https://api.perplexity.ai/chat/completions");
    console.log("Model: sonar");
    console.log("API Key length:", process.env.PERPLEXITY_API_KEY.length);

    const startTime = Date.now();
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "user",
            content: "What is 2+2? Respond with just the number.",
          },
        ],
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Perplexity API returned error:", response.status, errorText);
      
      return Response.json(
        {
          success: false,
          error: "Perplexity API request failed",
          details: {
            statusCode: response.status,
            statusText: response.statusText,
            responseBody: errorText,
          },
          diagnostics,
          troubleshooting: [
            "Verify PERPLEXITY_API_KEY is correct in .env.local",
            "Check if the API key has proper permissions",
            "Ensure you have credits/quota available",
            "Visit https://console.perplexity.ai to check API status",
          ],
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response";

    console.log("✅ Perplexity API test successful!");
    console.log("Response:", text);

    return Response.json({
      success: true,
      message: "Perplexity API connection successful!",
      response: text,
      fullResponse: data,
      diagnostics: {
        ...diagnostics,
        responseTime: `${duration}ms`,
      },
    });
    
  } catch (error: any) {
    console.error("❌ Perplexity API test failed:", error);

    return Response.json(
      {
        success: false,
        error: "Perplexity API connection failed",
        details: {
          message: error.message,
          stack: error.stack,
        },
        diagnostics,
        troubleshooting: [
          "Verify PERPLEXITY_API_KEY is correct in .env.local",
          "Check if the API key has proper permissions",
          "Ensure you have credits/quota available",
          "Visit https://console.perplexity.ai to check API status",
        ],
      },
      { status: 500 }
    );
  }
}
