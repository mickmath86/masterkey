# UTM Attribution Testing Plan

## **Testing Steps**

### **Step 1: Initial Setup**
1. Open browser in incognito/private mode
2. Clear all cookies and storage
3. Open browser console to monitor logs

### **Step 2: Test Initial UTM Capture**
1. Visit: `http://localhost:3000/landing/listing-presentation?utm_source=test&utm_medium=email&utm_campaign=debug_test`
2. **Expected Results:**
   - Middleware logs: `✅ Found UTM: utm_source = test`
   - Cookie set: `🍪 Setting UTM cookie with data`
   - UtmBootstrap logs: `🆕 Found NEW UTMs in URL`
   - Vercel event: `utm_attribution` sent once
   - Debug panel shows: Cookie exists ✅, UTM Context has 3+ keys

### **Step 3: Test Page Navigation (Critical Test)**
1. Navigate to: `/questionnaire/listing-presentation` (no UTM params in URL)
2. **Expected Results:**
   - UtmBootstrap logs: `📊 Using existing UTMs from cookie`
   - Page view event: `trackWithUtm('page_view')` with UTM context
   - Debug panel shows: Same UTM context persists
   - Console shows: `🎯 Generated UTM context: {utm_source: "test", ...}`

### **Step 4: Test Button Clicks**
1. Click any button that fires `trackWithUtm()` events
2. **Expected Results:**
   - Console logs: `📊 Tracked "[event_name]": {utm_source: "test", ...}`
   - UTM context included in event data
   - No warning: `⚠️ No UTM context found for event`

### **Step 5: Verify in Vercel Analytics**
1. Go to Vercel Analytics dashboard
2. Filter by `utm_source = test`
3. **Expected Results:**
   - Initial `utm_attribution` event visible
   - All subsequent `page_view` events visible
   - All button click events visible under the same UTM filter

## **Debug Tools Available**

### **1. UTM Debug Panel (Bottom Right)**
- Shows real-time UTM status
- "Test Event" button to verify tracking
- Auto-refreshes every 5 seconds

### **2. Console Logs**
- `🍪` Cookie operations
- `🎯` UTM context generation  
- `📊` Event tracking
- `⚠️` Warnings for missing UTMs

### **3. Manual Cookie Check**
```javascript
// Run in browser console
document.cookie.split(';').find(c => c.includes('masterkey_utms'))
```

## **Common Issues & Solutions**

### **Issue: No UTM Context on Subsequent Pages**
**Symptoms:** Debug panel shows "UTM Context Keys: 0"
**Solutions:**
1. Check if cookie exists: `document.cookie.includes('masterkey_utms')`
2. Verify cookie parsing in console logs
3. Check middleware logs for cookie setting

### **Issue: Events Not Attributed in Vercel**
**Symptoms:** Events appear in Vercel but not under UTM filter
**Solutions:**
1. Verify UTM parameters are in event payload (console logs)
2. Check Vercel Analytics filter syntax
3. Wait 5-10 minutes for Vercel Analytics processing

### **Issue: Cookie Not Persisting**
**Symptoms:** Cookie disappears between pages
**Solutions:**
1. Check browser privacy settings
2. Verify HTTPS in production (secure flag)
3. Check SameSite policy conflicts

## **Fallback Mechanisms Added**

1. **Enhanced Cookie Parsing:** More robust cookie reading
2. **URL Fallback:** If cookie missing, reads UTMs from current URL
3. **Comprehensive Logging:** Detailed debug information
4. **Error Handling:** Graceful fallbacks if parsing fails

## **Quick Verification Commands**

```javascript
// Check UTM context (run in console)
import { getUtmContext } from '@/hooks/useUtmTrack';
console.log(getUtmContext());

// Manual event test
import { trackWithUtm } from '@/hooks/useUtmTrack';
trackWithUtm('manual_test', { test: true });
```

## **Expected Vercel Analytics Data Structure**

Each event should include:
```json
{
  "event_name": "page_view",
  "utm_source": "test",
  "utm_medium": "email", 
  "utm_campaign": "debug_test",
  "attribution_type": "first_touch",
  "first_seen": "1697123456789",
  "last_updated": "1697123456789",
  // ... other event data
}
```
