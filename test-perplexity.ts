/**
 * Simple test script to verify Perplexity API connection
 * Run with: npx tsx test-perplexity.ts
 */

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const perplexity = createOpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY ?? "",
  baseURL: "https://api.perplexity.ai",
});

async function testPerplexityConnection() {
  console.log("🔍 Testing Perplexity API connection...\n");

  // Check if API key is set
  if (!process.env.PERPLEXITY_API_KEY) {
    console.error("❌ PERPLEXITY_API_KEY environment variable is not set!");
    console.log("Please set it in your .env.local file or export it:");
    console.log("export PERPLEXITY_API_KEY='your-api-key-here'\n");
    process.exit(1);
  }

  console.log("✅ API Key found (length:", process.env.PERPLEXITY_API_KEY.length, "characters)\n");

  try {
    console.log("📡 Sending test request to Perplexity API...");
    console.log("Model: sonar");
    console.log("Endpoint: https://api.perplexity.ai\n");

    const { text } = await generateText({
      model: perplexity("sonar"),
      messages: [
        {
          role: "user",
          content: "What is 2+2? Respond with just the number.",
        },
      ],
    });

    console.log("✅ SUCCESS! API connection working!");
    console.log("Response:", text);
    console.log("\n🎉 Perplexity API is configured correctly!\n");
    
  } catch (error: any) {
    console.error("❌ API Connection Failed!\n");
    console.error("Error details:");
    console.error("- Message:", error.message);
    console.error("- Status Code:", error.statusCode);
    console.error("- URL:", error.url);
    console.error("- Response Body:", error.responseBody);
    console.error("\nFull error object:", JSON.stringify(error, null, 2));
    
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Verify your PERPLEXITY_API_KEY is correct");
    console.log("2. Check if the API key has proper permissions");
    console.log("3. Ensure you have credits/quota available");
    console.log("4. Visit https://console.perplexity.ai to check your API status\n");
    
    process.exit(1);
  }
}

testPerplexityConnection();
