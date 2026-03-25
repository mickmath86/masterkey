import type { Metadata } from "next";
import MarketPulseWrapper from "@/components/marketpulse/MarketPulseWrapper";

export const metadata: Metadata = {
  title: "MarketPulse | MasterKey Real Estate",
  description:
    "AI-powered market intelligence for Ventura County. Real-time pricing trends, neighborhood insights, and data-driven reports.",
};

export default function MarketPulsePage() {
  return <MarketPulseWrapper />;
}
