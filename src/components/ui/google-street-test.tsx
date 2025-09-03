"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { google: any; }
}

type Props = { address: string };

export default function StreetView({ address }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't do anything if no address
    if (!address?.trim()) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadStreetView = async () => {
      try {
        // Wait for Google Maps if not loaded
        if (!window.google?.maps) {
          await new Promise<void>((resolve) => {
            const checkGoogle = () => {
              if (window.google?.maps) {
                resolve();
              } else {
                setTimeout(checkGoogle, 100);
              }
            };
            checkGoogle();
          });
        }

        if (!isMounted || !divRef.current) return;

        // Geocode address
        const geocoder = new window.google.maps.Geocoder();
        const geocodeResult = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
          geocoder.geocode({ address }, (results: any, status: any) => {
            if (status === 'OK' && results?.[0]) {
              resolve(results[0]);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        if (!isMounted) return;

        // Create Street View
        const panorama = new window.google.maps.StreetViewPanorama(divRef.current, {
          position: geocodeResult.geometry.location,
          pov: { heading: 0, pitch: 0 },
          zoom: 1
        });

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load Street View');
          setIsLoading(false);
        }
      }
    };

    loadStreetView();

    return () => {
      isMounted = false;
    };
  }, [address]);

  // Don't render anything if no address
  if (!address?.trim()) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ width: "100%", height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #f3f3f3', borderTop: '3px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }}></div>
          <p>Loading Street View...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Street View Error: {error}</p>
        </div>
      </div>
    );
  }

  return <div ref={divRef} style={{ width: "100%", height: 400 }} />;
}