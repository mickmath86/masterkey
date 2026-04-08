"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  CalendarDaysIcon,
  XMarkIcon,
  HomeModernIcon,
  ArrowRightIcon,
} from "@heroicons/react/16/solid";

const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

function CalendarModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existing) document.body.removeChild(existing);
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Schedule a Consultation</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pick a time that works for you — no obligation.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe src={CALENDAR_SRC} style={{ width: "100%", height: "750px", border: "none" }} scrolling="yes" title="Schedule Appointment" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const address = searchParams.get("address") ?? "";
  const market = MARKETS[marketKey];
  const [calendarOpen, setCalendarOpen] = useState(false);

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

          {/* Home valuation upsell */}
          {(market || address) && (
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HomeModernIcon className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-0.5">Want to know exactly what your home is worth?</p>
                  <p className="text-xs text-white/40 mb-3 leading-relaxed">Get a free data-driven estimate powered by live MLS data and recent comps — takes 2 minutes.</p>
                  <a
                    href={`/homevalue/questionnaire${address ? `?address=${encodeURIComponent(address)}` : ""}`}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                    <HomeModernIcon className="w-3.5 h-3.5" />
                    Get My Free Home Valuation
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-white/30 mb-4">
              Have questions about selling in {market?.label ?? "your market"}?
            </p>
            <button
              onClick={() => setCalendarOpen(true)}
              className="inline-flex items-center gap-2 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
            >
              <CalendarDaysIcon className="w-4 h-4" />
              Schedule a Consultation
            </button>
          </div>
        </div>
      </main>

      <Footer />
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
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
