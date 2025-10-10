"use client";

import { useEffect, useState } from 'react';
import { getUtmContext, trackWithUtm, testVercelAnalytics } from '@/hooks/useUtmTrack';

interface UtmDebugData {
  cookieExists: boolean;
  cookieRaw: string | null;
  cookieParsed: any;
  utmContext: Record<string, string>;
  urlParams: string;
  timestamp: number;
}

export function UtmDebugger() {
  const [debugData, setDebugData] = useState<UtmDebugData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const runDebug = () => {
    try {
      // Check cookie
      const cookieRaw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("masterkey_utms="))
        ?.split("=")[1] || null;
      
      let cookieParsed = null;
      if (cookieRaw) {
        try {
          cookieParsed = JSON.parse(decodeURIComponent(cookieRaw));
        } catch (e) {
          cookieParsed = { error: 'Failed to parse cookie' };
        }
      }

      // Get UTM context
      const utmContext = getUtmContext();

      // Get URL params
      const urlParams = window.location.search;

      setDebugData({
        cookieExists: !!cookieRaw,
        cookieRaw,
        cookieParsed,
        utmContext,
        urlParams,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  const testEvent = () => {
    trackWithUtm('debug_test_event', {
      test_timestamp: Date.now(),
      test_page: window.location.pathname
    });
    alert('Test event sent! Check console and Vercel Analytics.');
  };

  useEffect(() => {
    runDebug();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(runDebug, 5000);
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '400px',
      border: '2px solid #333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <strong>UTM Debug</strong>
        <div>
          <button 
            onClick={() => setIsVisible(!isVisible)}
            style={{ marginRight: '5px', padding: '2px 6px', fontSize: '10px' }}
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>
          <button 
            onClick={runDebug}
            style={{ marginRight: '5px', padding: '2px 6px', fontSize: '10px' }}
          >
            Refresh
          </button>
          <button 
            onClick={testEvent}
            style={{ marginRight: '5px', padding: '2px 6px', fontSize: '10px', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            Test Event
          </button>
          <button 
            onClick={testVercelAnalytics}
            style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            Test Vercel
          </button>
        </div>
      </div>
      
      {isVisible && debugData && (
        <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
          <div><strong>Cookie Exists:</strong> {debugData.cookieExists ? '✅' : '❌'}</div>
          <div><strong>URL Params:</strong> {debugData.urlParams || 'None'}</div>
          <div><strong>UTM Context Keys:</strong> {Object.keys(debugData.utmContext).length}</div>
          
          {debugData.utmContext && Object.keys(debugData.utmContext).length > 0 && (
            <div style={{ marginTop: '5px' }}>
              <strong>Active UTMs:</strong>
              <div style={{ backgroundColor: '#333', padding: '5px', borderRadius: '3px', marginTop: '2px' }}>
                {Object.entries(debugData.utmContext).map(([key, value]) => (
                  <div key={key}>{key}: {value}</div>
                ))}
              </div>
            </div>
          )}
          
          {debugData.cookieParsed && (
            <div style={{ marginTop: '5px' }}>
              <strong>Cookie Data:</strong>
              <div style={{ backgroundColor: '#333', padding: '5px', borderRadius: '3px', marginTop: '2px', maxHeight: '100px', overflow: 'auto' }}>
                <pre>{JSON.stringify(debugData.cookieParsed, null, 1)}</pre>
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '5px', fontSize: '9px', color: '#888' }}>
            Last updated: {new Date(debugData.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}
