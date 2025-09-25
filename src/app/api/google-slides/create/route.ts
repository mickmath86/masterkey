import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Initialize Google Slides API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/drive'
  ],
})

const slides = google.slides({ version: 'v1', auth })
const drive = google.drive({ version: 'v3', auth })

interface PropertyData {
  address: string
  city: string
  state: string
  imageUrl: string
}

export async function POST(request: NextRequest) {
  try {
    const propertyData: PropertyData = await request.json()
    
    console.log('Creating Google Slides presentation with data:', propertyData)

    // Create a new presentation
    const presentation = await slides.presentations.create({
      requestBody: {
        title: `Property Report - ${propertyData.address}`,
      },
    })

    const presentationId = presentation.data.presentationId!
    console.log('Created presentation with ID:', presentationId)

    // Get the slide ID from the created presentation
    const slideId = presentation.data.slides![0].objectId!

    // Define the requests to update the presentation
    const requests = [
      // Add title
      {
        insertText: {
          objectId: slideId,
          insertionIndex: 0,
          text: `Property Report\n${propertyData.address}\n${propertyData.city}, ${propertyData.state}`,
        },
      },
      // Add property image
      {
        createImage: {
          objectId: 'property_image',
          url: propertyData.imageUrl,
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: { magnitude: 300, unit: 'PT' },
              width: { magnitude: 400, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 50,
              translateY: 150,
              unit: 'PT',
            },
          },
        },
      },
      // Add property details text box
      {
        createShape: {
          objectId: 'property_details',
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: { magnitude: 200, unit: 'PT' },
              width: { magnitude: 300, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 480,
              translateY: 150,
              unit: 'PT',
            },
          },
        },
      },
      // Add text to the details box
      {
        insertText: {
          objectId: 'property_details',
          insertionIndex: 0,
          text: `Property Details:\n\nAddress: ${propertyData.address}\nCity: ${propertyData.city}\nState: ${propertyData.state}\n\nGenerated on: ${new Date().toLocaleDateString()}`,
        },
      },
      // Format the title
      {
        updateTextStyle: {
          objectId: slideId,
          style: {
            fontSize: { magnitude: 24, unit: 'PT' },
            bold: true,
          },
          textRange: {
            type: 'ALL',
          },
        },
      },
      // Format the details text
      {
        updateTextStyle: {
          objectId: 'property_details',
          style: {
            fontSize: { magnitude: 12, unit: 'PT' },
          },
          textRange: {
            type: 'ALL',
          },
        },
      },
    ]

    // Apply all the updates to the presentation
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests,
      },
    })

    // Make the presentation publicly viewable (optional)
    try {
      await drive.permissions.create({
        fileId: presentationId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })
      console.log('Made presentation publicly viewable')
    } catch (permissionError) {
      console.warn('Could not make presentation public:', permissionError)
    }

    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`

    return NextResponse.json({
      success: true,
      presentationId,
      presentationUrl,
      message: 'Presentation created successfully',
    })

  } catch (error: any) {
    console.error('Error creating Google Slides presentation:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create presentation',
        details: error.response?.data || error.stack,
      },
      { status: 500 }
    )
  }
}

// GET endpoint to test the API
export async function GET() {
  return NextResponse.json({
    message: 'Google Slides API endpoint is working',
    timestamp: new Date().toISOString(),
  })
}
