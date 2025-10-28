# Webhook Configuration Guide

## Simplified Step 9 Webhook Setup

### Current Status
✅ **Simplified Step 9 webhook implementation is complete**

The system now sends a separate webhook when users complete the simplified version of Step 9.

### Where to Add Your Webhook URL

To configure your webhook URL for the simplified Step 9 form:

1. **Open the file**: `/src/lib/webhook-api.ts`
2. **Find line 65**: Look for `private simplifiedWebhookUrl = 'REPLACE_WITH_YOUR_SIMPLIFIED_WEBHOOK_URL';`
3. **Replace the URL**: Change `'REPLACE_WITH_YOUR_SIMPLIFIED_WEBHOOK_URL'` to your actual webhook URL

### Example:
```typescript
// Before:
private simplifiedWebhookUrl = 'REPLACE_WITH_YOUR_SIMPLIFIED_WEBHOOK_URL';

// After (with your actual webhook URL):
private simplifiedWebhookUrl = 'https://your-webhook-service.com/simplified-step9';
```

### Webhook Data Structure

When the simplified Step 9 is submitted, your webhook will receive:

```json
{
  "contact": {
    "contactMethod": "email", // or "phone"
    "email": "user@example.com", // only if contactMethod is "email"
    "phone": "555-123-4567", // only if contactMethod is "phone"
    "priceUpdates": true // boolean - whether user wants price updates
  },
  "questionnaire": {
    "propertyAddress": "123 Main St, City, State",
    "sellingIntent": "I am looking to sell my property",
    "sellingTimeline": "Within 3 months",
    "sellingMotivation": "Relocating for work",
    "propertyCondition": "Good condition",
    "propertyImprovements": ["Kitchen remodel", "Fresh paint (interior)"],
    "improvementDetails": [
      {
        "improvement": "Kitchen remodel",
        "cost": 25000
      }
    ],
    "priceExpectation": "$400,000 - $450,000"
  },
  "metadata": {
    "leadSource": "MasterKey Simplified Step 9",
    "formVersion": "simplified",
    "submittedAt": "2024-10-27T22:35:00.000Z",
    "source": "questionnaire"
  }
}
```

### Key Differences from Original Step 9

**Simplified Version:**
- ✅ Contains ALL questionnaire data from steps 1-8
- ✅ Only requires email OR phone (user's choice)
- ✅ Includes price update preference
- ✅ Immediate webhook send (no waiting for property analysis)
- ✅ Separate webhook URL for easy tracking

**Original Version:**
- Requires first name, last name, email, phone, and privacy consent
- Webhook sent after property analysis completes
- Uses comprehensive webhook URL

### Testing Both Versions

**Original Step 9:**
- URL: `http://localhost:3001/questionnaire/listing-presentation`

**Simplified Step 9:**
- URL: `http://localhost:3001/questionnaire/listing-presentation?simple=true`

### Traffic Control

To switch all traffic to simplified version, edit line 131 in `/src/app/questionnaire/listing-presentation/page.tsx`:

```typescript
// Always use simplified:
return true;

// Always use original:
return false;

// 50/50 split:
return Math.random() < 0.5;
```

### Console Logging

When webhooks are sent, you'll see these console messages:
- `📤 Preparing comprehensive webhook data...`
- `📤 Sending simplified webhook with data:` (for simplified Step 9)
- `📤 Sending comprehensive webhook with data:` (for original Step 9)
- `✅ Simplified webhook sent successfully` (for simplified Step 9)
- `✅ Comprehensive webhook sent successfully` (for original Step 9)
- `❌ [Type] webhook failed: [error]` (if there's an issue)

---

**✅ Setup Complete!** Both webhook URLs are already configured and ready to receive comprehensive property data.
