import {
    type UIMessage, 
    type InferUITools, 
    type UIDataTypes, 
    streamText, 
    convertToModelMessages, 
    tool, 
    stepCountIs
} from "ai";
import  { openai } from "@ai-sdk/openai";
import { z } from "zod";
const rapidApiHost = 'zillow-com1.p.rapidapi.com';
const rapidApiKey = process.env.RAPIDAPI_KEY!;


const tools = {
    getAddress: tool({
        name: "getAddress",
        description: "Get the address a property and provide data on it. Give me your assessment of the properties price, condition, and market value. Give a high, suspected, and low estimate of the price of the house based on the data provided.",
        inputSchema: z.object({
            address: z.string().describe("The address used to get the data for"),
            zpid: z.number().describe("The zpid of the property which comes frrom the getAddress tool"),
        }),
        execute: async ({address}) => {
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

            const data = await response.json();
            const propertyData = {
                property: {
                    zpid: data.zpid,
                    address: data.address,
                    price: data.price,
                    bedrooms: data.bedrooms,
                    bathrooms: data.bathrooms,
                    livingArea: data.livingArea,
                    zestimate: data.zestimate,
                    propertyType: data.propertyType,
                    homeStatus: data.homeStatus,
                    yearBuilt: data.yearBuilt,
                    lotSize: data.lotSize,
                    photos: data.photos,
                    rentZestimate: data.rentZestimate,
                    pricePerSquareFoot: data.pricePerSquareFoot,
                    taxAnnualAmount: data.taxAnnualAmount,
                    image: data.imgSrc,
                    // rawData: data
                }      
            }
            return propertyData;
        }
    }), 
    getImages: tool({
        name: "getImages",
        description: "Once you have a property address you can use this tool to get the images of the property. Dont mention anything about zillow or zestimates. ",
        inputSchema: z.object({
            zpid: z.number().describe("parameter for the zillow property id that is returned from the getAddress tool"),
        }),
        execute: async ({zpid}) => {
            const response = await fetch(
                `https://${rapidApiHost}/images?zpid=${encodeURIComponent(zpid)}`,
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

            const data = await response.json();
            const imageData = {
                property: {
                    images: data.images
                }      
            }
            return imageData;
        }
    }),
    getValueHistory: tool({
        name: "getValueHistory",
        description: "Get the value history of a property. Use this if anyone asks about how their property has changed over time.",
        inputSchema: z.object({
            address: z.string().describe("parameter for the property address"),
        }),
        execute: async ({address}) => {
            const response = await fetch(
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

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            // The API returns an array, and we want the zestimateHistory array from the first item
            const valueHistoryData = data[0]?.zestimateHistory || [];
            console.log(data)
            return data;
        }
    }), 
    getAgentInfo: tool({
        name: "getAgentInfo",
        description: "Show this tool occasionally to give the user contact information on an agent who can help them sell if theyre interested in selling their property. Also show this tool if they specifically ask for an agent who can help them with selling or buying a new property.",
        inputSchema: z.object({}), // Empty schema - no input required
        execute: async () => {
            // Return static agent information
            return {
                agent: {
                    name: "Mark Mathias",
                    title: "Real Estate Broker",
                    phone: "(555) 123-4567",
                    email: "mark@museasterkey.com",
                    license: "DRE #01234567",
                    experience: "15+ years",
                    specialties: ["Luxury Homes", "Investment Properties", "First-Time Buyers"]
                }
            };
        }
    })
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();
  const result = streamText({
    model: openai("gpt-5-nano"),
    system: 
    "You are MasterKey's real estate assistant. If this is the start of a conversation (no previous messages), be friendly and greet the user introducing yourself and ask for their property address to get started nothing more. If this is not the start of a conversation, continue the conversation. Always be proactive in starting conversations. Once they have entered their address ask them if they are interested in selling or are just curious about market conditions BEFORE you use any tools, on this one specfic questionmake sure to use the statement - thanks for providing your address - dont say this any other time. If they select selling ask them only this question:what their timeframe is for selling; make sure you include that exact statement - timeframe for selling. Once they have answered the timeframe question, ask thema about the condition of the property and let them know this will help inform your data results for them, make sure to use that exact statement - condition of the property. Once they have answered the conditions question, ask them what their pricing priority is, make sure to include this statement - what is your pricing priority - dont use this exact phrase at any other time. Once they have answered the pricing priority question then you can run the tools. ",
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}