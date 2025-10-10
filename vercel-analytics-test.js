// Simple test to verify Vercel Analytics is working
// Run this in browser console

console.log('🧪 Testing Vercel Analytics Connection...');

// Check if Vercel Analytics is loaded
if (typeof window !== 'undefined') {
  console.log('🔍 Window object available');
  
  // Check for Vercel Analytics script
  const vercelScripts = Array.from(document.scripts).filter(script => 
    script.src.includes('vercel') || script.src.includes('analytics')
  );
  
  console.log('📜 Vercel-related scripts found:', vercelScripts.length);
  vercelScripts.forEach(script => console.log('  -', script.src));
  
  // Check for analytics functions
  console.log('🔧 Analytics functions available:');
  console.log('  - window.va:', typeof window.va);
  console.log('  - window.gtag:', typeof window.gtag);
  
  // Try to import and use track function directly
  try {
    // This should work if Vercel Analytics is properly loaded
    import('@vercel/analytics/react').then(({ track }) => {
      console.log('✅ Successfully imported Vercel Analytics track function');
      
      // Send a simple test event
      track('vercel_test_direct', {
        test_type: 'direct_import',
        timestamp: Date.now(),
        user_agent: navigator.userAgent.substring(0, 50)
      });
      
      console.log('📤 Sent direct test event to Vercel Analytics');
      
      // Send test with UTM data if available
      const utmCookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("masterkey_utms="))
        ?.split("=")[1];
      
      if (utmCookie) {
        try {
          const utms = JSON.parse(decodeURIComponent(utmCookie));
          track('vercel_test_with_utms', {
            test_type: 'with_utms',
            timestamp: Date.now(),
            ...utms
          });
          console.log('📤 Sent UTM test event:', utms);
        } catch (e) {
          console.error('❌ Failed to parse UTM cookie:', e);
        }
      } else {
        console.log('❌ No UTM cookie found for test');
      }
      
    }).catch(error => {
      console.error('❌ Failed to import Vercel Analytics:', error);
    });
    
  } catch (error) {
    console.error('❌ Error testing Vercel Analytics:', error);
  }
} else {
  console.error('❌ Window object not available');
}

console.log('🧪 Test complete. Check Vercel Analytics dashboard in 5-10 minutes for events:');
console.log('  - vercel_test_direct');
console.log('  - vercel_test_with_utms (if UTMs available)');
