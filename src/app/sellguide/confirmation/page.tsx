"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
} from "@heroicons/react/16/solid";

const MARKETS: Record<string, { label: string; file: string }> = {
  "thousand-oaks": {
    label: "Thousand Oaks",
    file: "/downloadables/sellguides/thousand-oaks-sellers-checklist.pdf",
  },
  ventura: {
    label: "Ventura",
    file: "/downloadables/sellguides/ventura-sellers-checklist.pdf",
  },
  camarillo: {
    label: "Camarillo",
    file: "/downloadables/sellguides/camarillo-sellers-checklist.pdf",
  },
  "westlake-village": {
    label: "Westlake Village",
    file: "/downloadables/sellguides/westlake-sellers-checklist.pdf",
  },
  oxnard: {
    label: "Oxnard",
    file: "/downloadables/sellguides/oxnard-sellers-checklist.pdf",
  },
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const marketKey = searchParams.get("market") ?? "";
  const firstName = searchParams.get("name") ?? "";
  const market = MARKETS[marketKey];

  // Fire Facebook Lead event on page load
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: "Seller Guide Download",
        content_category: market?.label ?? marketKey,
      });
      console.log("📊 Facebook Pixel Lead event fired — sellguide confirmation");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <NavbarMinimal theme="dark" />

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-red-700/8 blur-3xl" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full text-center">

          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-400/10 border border-orange-400/20 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1.5 rounded-full mb-5">
            <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
            Your Report is Ready
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            {firstName ? `${firstName}, your` : "Your"}{" "}
            <span className="text-orange-400">
              {market ? market.label : "Seller's"}
            </span>{" "}
            market report is ready.
          </h1>

          <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Your free Sellers Market Report &amp; Checklist is ready to view.
            Click below to open it in your browser.
          </p>

          {/* Download CTA */}
          {market ? (
            <a
              href={market.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              View Your {market.label} Report
            </a>
          ) : (
            <a
              href="/sellguide"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
            >
              ← Return to the Seller&apos;s Guide
            </a>
          )}

          {/* Market info tag */}
          {market && (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/30">
              <MapPinIcon className="w-3.5 h-3.5" />
              {market.label} · 2026 Edition · Updated monthly
            </p>
          )}

          {/* Divider */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-xs text-white/30 mb-4">
              Have questions about selling in {market?.label ?? "your market"}?
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
            >
              Talk to an agent
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SellGuideConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange-400/30 border-t-orange-400 animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
