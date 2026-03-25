import type { Metadata } from "next";
import MarketPulseDashboard from "@/components/marketpulse/MarketPulseDashboard";

export const metadata: Metadata = {
  title: "Dashboard | MarketPulse",
  description: "Real-time market data and analytics for Ventura County real estate.",
};

export default function DashboardPage() {
  return <MarketPulseDashboard />;
}
