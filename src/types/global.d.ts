declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>;
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export {};
