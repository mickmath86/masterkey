# Google Slides Integration Setup

This guide will help you set up the Google Slides API integration for creating dynamic presentations.

## Prerequisites

1. A Google Cloud Platform (GCP) project
2. Google Slides API and Google Drive API enabled
3. A service account with appropriate permissions

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable:
   - **Google Slides API**
   - **Google Drive API**

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `slides-generator`
   - Description: `Service account for creating Google Slides presentations`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. Find your newly created service account in the credentials list
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Select "JSON" format and click "Create"
6. Download the JSON file - **keep this secure!**

## Step 5: Set Up Environment Variables

Add the following to your `.env.local` file:

```env
# Google Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----"
```

**Important Notes:**
- Replace `your-service-account@your-project.iam.gserviceaccount.com` with your actual service account email
- Copy the entire private key from the downloaded JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Keep the quotes around the private key
- The `\n` characters in the private key should be literal `\n` (not actual line breaks)

## Step 6: Install Dependencies

Run the following command to install the Google APIs client library:

```bash
npm install googleapis
```

## Step 7: Test the Integration

1. Navigate to `/slides-test` in your application
2. Fill out the form with:
   - Property Address: `123 Main Street`
   - City: `San Francisco`
   - State: `CA`
   - Image URL: A valid image URL (e.g., from Unsplash)
3. Click "Create Google Slides Presentation"

## Troubleshooting

### Common Issues:

1. **Authentication Error**: Check that your service account email and private key are correct
2. **API Not Enabled**: Ensure both Google Slides API and Google Drive API are enabled
3. **Permission Denied**: The service account needs access to create files in Google Drive
4. **Invalid Image URL**: Make sure the image URL is publicly accessible

### Checking Logs:

Check the browser console and server logs for detailed error messages.

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account JSON file secure
- Consider using Google Cloud Secret Manager for production deployments
- The created presentations will be owned by the service account

## API Limits

- Google Slides API has usage quotas
- For production use, consider implementing rate limiting
- Monitor your API usage in the Google Cloud Console

## Features

The integration creates presentations with:
- Dynamic title with property address
- Property image from the provided URL
- Property details text box
- Professional formatting
- Public sharing (optional)

## Next Steps

- Customize the presentation template
- Add more dynamic content
- Implement error handling for invalid image URLs
- Add authentication for user-specific presentations
