"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import type { ValuationResult } from "@/app/api/homevalue/analyze/route";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/16/solid";

// ─── Form data type (mirrors questionnaire) ───────────────────────────────────

interface HomeValueFormData {
  propertyAddress: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  condition: string;
  garage: string;
  features: string[];
  kitchenUpdate: string;
  bathroomUpdate: string;
  roofUpdate: string;
  hvacUpdate: string;
  timeline: string;
  reason: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtFull(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
}

const marketConditionLabel: Record<string, { label: string; color: string; bg: string }> = {
  strong_sellers: { label: "Strong Seller's Market", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  sellers: { label: "Seller's Market", color: "text-green-600", bg: "bg-green-50 border-green-100" },
  balanced: { label: "Balanced Market", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  buyers: { label: "Buyer's Market", color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  strong_buyers: { label: "Strong Buyer's Market", color: "text-red-600", bg: "bg-red-50 border-red-100" },
};

const ratingColor: Record<string, string> = {
  excellent: "text-green-600 bg-green-50",
  good: "text-blue-600 bg-blue-50",
  average: "text-yellow-600 bg-yellow-50",
  below_average: "text-red-500 bg-red-50",
};

const ratingLabel: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  below_average: "Below Avg",
};

// ─── Hero background — Street View with graceful fallback ──────────────────────

const FALLBACK_BG =
  "url(https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)";

function HeroBackground({ streetViewUrl }: { streetViewUrl: string }) {
  if (!streetViewUrl) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: FALLBACK_BG }}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={streetViewUrl}
      alt=""
      aria-hidden
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = "none";
        const fb = document.createElement("div");
        fb.className = "absolute inset-0 bg-cover bg-center";
        fb.style.backgroundImage = FALLBACK_BG;
        el.parentElement?.insertBefore(fb, el);
      }}
    />
  );
}

// ─── Animated checklist loading screen ───────────────────────────────────────

const LOADING_STEPS = [
  "Analyzing your property details",
  "Searching recent comparable sales",
  "Researching local market conditions",
  "Calculating your home's estimated value",
  "Preparing your personalized report",
];

function LoadingState({ address }: { address?: string }) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Stagger through steps: complete one every ~2.5s, keeping last one "in progress"
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOADING_STEPS.forEach((_, i) => {
      if (i < LOADING_STEPS.length - 1) {
        // Complete all but the last step
        timers.push(
          setTimeout(() => {
            setCompletedSteps((prev) => [...prev, i]);
            setActiveStep(i + 1);
          }, (i + 1) * 2600)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      {/* Address pill */}
      {address && (
        <div className="flex items-center gap-2 text-white/50 text-sm mb-10">
          <MapPinIcon className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span>{address}</span>
        </div>
      )}

      {/* Headline */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Generating Your Home Valuation
        </h2>
        <p className="text-white/50 text-sm">
          Our AI is researching live market data — this takes about 15 seconds.
        </p>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-md space-y-4">
        {LOADING_STEPS.map((step, i) => {
          const isDone = completedSteps.includes(i);
          const isActive = activeStep === i && !isDone;
          const isPending = !isDone && !isActive;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 transition-all duration-500 ${
                isPending ? "opacity-30" : "opacity-100"
              }`}
              style={{
                transform: isPending ? "translateX(8px)" : "translateX(0)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                {isDone ? (
                  <CheckCircleIcon className="w-7 h-7 text-green-400" />
                ) : isActive ? (
                  <span className="relative flex w-5 h-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50" />
                    <span className="relative inline-flex rounded-full w-5 h-5 bg-blue-500" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-white/20" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDone
                    ? "text-green-400 line-through decoration-green-400/50"
                    : isActive
                    ? "text-white"
                    : "text-white/30"
                }`}
              >
                {step}
              </span>

              {/* "In progress..." badge */}
              {isActive && (
                <span className="ml-auto text-xs text-blue-400 font-medium animate-pulse">
                  In progress…
                </span>
              )}
              {isDone && (
                <span className="ml-auto text-xs text-green-400/60 font-medium">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle bottom note */}
      <p className="mt-12 text-white/20 text-xs text-center max-w-xs">
        Powered by Perplexity AI with live web search. Data is fetched in real time.
      </p>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-950 mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          We couldn&apos;t generate your valuation. This is usually a temporary issue.
          Try again or contact us directly.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={onRetry}>Try again</Button>
          <Button variant="secondary" href="/contact">
            Contact us
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main results page ────────────────────────────────────────────────────────

export default function HomeValueResultsPage() {
  const [formData, setFormData] = useState<HomeValueFormData | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [visible, setVisible] = useState(false);

  async function fetchValuation(data: HomeValueFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/homevalue/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setResult(json.data as ValuationResult);
      setStatus("done");
      setTimeout(() => setVisible(true), 80);
    } catch (err) {
      console.error("Valuation fetch error:", err);
      setStatus("error");
    }
  }

  useEffect(() => {
    const raw = sessionStorage.getItem("hv_form");
    if (!raw) {
      setStatus("error");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as HomeValueFormData;
      setFormData(parsed);
      fetchValuation(parsed);
    } catch {
      setStatus("error");
    }
  }, []);

  // ── States ───────────────────────────────────────────────────────────────────

  if (status === "loading") return <LoadingState address={formData?.propertyAddress} />;
  if (status === "error" || !result || !formData) {
    return <ErrorState onRetry={() => formData && fetchValuation(formData)} />;
  }

  const mktStyle = marketConditionLabel[result.market.marketCondition] ?? marketConditionLabel.balanced;

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ── Hero — estimated value ── */}
      <div className="relative overflow-hidden">
        {/* Street View of subject property, fallback to generic house photo */}
        <HeroBackground streetViewUrl={result.subjectStreetViewUrl} />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left — main value */}
            <div>
              {formData.propertyAddress && (
                <p className="text-white/60 text-sm flex items-center gap-1.5 mb-2">
                  <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                  {formData.propertyAddress}
                </p>
              )}
              {(formData.propertyType || formData.bedrooms) && (
                <p className="text-white/40 text-xs mb-6">
                  {[
                    formData.propertyType,
                    formData.bedrooms && `${formData.bedrooms} bed`,
                    formData.bathrooms && `${formData.bathrooms} bath`,
                    formData.sqft && `${formData.sqft} sqft`,
                    formData.yearBuilt && `Built ${formData.yearBuilt}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {/* Source badge */}
              <div className="flex items-center gap-2 mb-3">
                {result.valueSource === "rentcast" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                    Verified by Rentcast AVM
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    AI-Estimated Market Value
                  </span>
                )}
              </div>
              <p className="text-5xl sm:text-6xl font-bold text-white mb-2">
                {fmtFull(result.estimatedValue)}
              </p>

              {/* AVM Range Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-5 mb-6 max-w-sm">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-4">Estimated Value Range</p>
                {/* Low / High figures */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Conservative</p>
                    <p className="text-2xl font-bold text-white/80">{fmtShort(result.valueLow)}</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-xs text-white/30 mb-1">Best estimate</p>
                    <p className="text-sm font-bold text-green-300">{fmtFull(result.estimatedValue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">Optimistic</p>
                    <p className="text-2xl font-bold text-white/80">{fmtShort(result.valueHigh)}</p>
                  </div>
                </div>
                {/* Gradient bar with midpoint dot */}
                <div className="relative h-2.5 bg-white/15 rounded-full overflow-visible">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-green-400 to-emerald-400 rounded-full" />
                  {/* Midpoint marker — positioned at center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-green-400 shadow-md z-10" />
                </div>
              </div>

              {/* Market condition badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border mb-8 ${mktStyle.bg} ${mktStyle.color}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {mktStyle.label}
              </span>

              {/* Confidence */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60 font-medium">AI Confidence</span>
                  <span className="text-sm font-bold text-white">
                    {result.confidenceScore}%
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidenceScore}%` }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-2">{result.confidenceRationale}</p>
              </div>
            </div>

            {/* Right — executive summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-2">
                  AI Analysis
                </p>
                <p className="text-white/90 text-sm leading-relaxed">
                  {result.executiveSummary}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-3">
                  Recommended List Price
                </p>
                <p className="text-3xl font-bold text-white">
                  {fmtFull(result.sellerStrategy.recommendedListPrice)}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Est. net proceeds: {result.sellerStrategy.estimatedNetProceeds}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-2">
                  Best Time to List
                </p>
                <p className="text-sm text-white/80">{result.sellerStrategy.bestTimeToList}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Value drivers ── */}
      <div className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-950 mb-2">
            What&apos;s driving your home&apos;s value
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Key factors the AI identified based on your property details and local market data.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.valueDrivers.map((driver, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 ${
                  driver.impact === "positive"
                    ? "border-green-100 bg-green-50"
                    : driver.impact === "negative"
                    ? "border-red-100 bg-red-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-950 text-sm flex-1 pr-2">
                    {driver.factor}
                  </p>
                  <span
                    className={`text-xs font-bold flex-shrink-0 ${
                      driver.impact === "positive"
                        ? "text-green-600"
                        : driver.impact === "negative"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {driver.estimatedImpact}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {driver.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Market snapshot ── */}
      <div className="bg-gray-50 py-14 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">
                {result.market.area} Market Snapshot
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Current conditions · AI-researched data
              </p>
            </div>
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-full ${mktStyle.bg} ${mktStyle.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {mktStyle.label}
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: "Median Sale Price",
                value: fmtShort(result.market.medianHomePrice),
                change: `${result.market.medianPriceChangeYoY > 0 ? "+" : ""}${result.market.medianPriceChangeYoY.toFixed(1)}% YoY`,
                positive: result.market.medianPriceChangeYoY >= 0,
              },
              {
                label: "Avg. Days on Market",
                value: `${result.market.avgDaysOnMarket} days`,
                change: undefined,
                positive: true,
              },
              {
                label: "List-to-Sale Ratio",
                value: `${result.market.listToSaleRatio.toFixed(1)}%`,
                change: result.market.listToSaleRatio >= 98 ? "Competitive" : undefined,
                positive: result.market.listToSaleRatio >= 97,
              },
              {
                label: "Months of Supply",
                value: `${result.market.monthsOfSupply.toFixed(1)} mos`,
                change: result.market.monthsOfSupply <= 2 ? "Low inventory" : undefined,
                positive: result.market.monthsOfSupply <= 3,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {card.label}
                  </p>
                  {card.change && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                        card.positive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {card.positive ? (
                        <ArrowUpRightIcon className="w-3 h-3" />
                      ) : (
                        <ArrowDownRightIcon className="w-3 h-3" />
                      )}
                      {card.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-950">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Market summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Market Commentary
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {result.market.marketSummary}
            </p>
          </div>
        </div>
      </div>

      {/* ── Comparable sales ── */}
      <div className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-950">Recent Comparable Sales</h2>
            {result.valueSource === "rentcast" && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full mt-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                Verified Rentcast data
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-8">
            {result.valueSource === "rentcast"
              ? "Real comparable sales from Rentcast — verified sold listings used to calculate your AVM."
              : "Similar homes that sold recently in your area — the basis for your valuation."}
          </p>

          {result.comparables.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-400 text-sm">No comparable sales data available for this address.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sold Price</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Distance</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.comparables.map((comp, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Street View thumbnail */}
                          {comp.streetViewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={comp.streetViewUrl}
                              alt={comp.formattedAddress}
                              className="w-16 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
                          )}
                          <div>
                        <a
                          href={`https://www.zillow.com/homes/${encodeURIComponent(comp.formattedAddress)}_rb/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1 font-semibold text-gray-950 text-sm hover:text-blue-600 transition-colors"
                        >
                          {comp.formattedAddress}
                          <ArrowUpRightIcon className="w-3 h-3 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                        </a>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[
                            comp.bedrooms && `${comp.bedrooms} bd`,
                            comp.bathrooms && `${comp.bathrooms} ba`,
                            comp.squareFootage && `${comp.squareFootage.toLocaleString()} sqft`,
                          ].filter(Boolean).join(" · ")}
                          {comp.daysOld > 0 && (
                            <span className="ml-2 text-gray-300">· sold ~{comp.daysOld}d ago</span>
                          )}
                        </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-950">{fmtFull(comp.price)}</p>
                        {comp.squareFootage > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            ${Math.round(comp.price / comp.squareFootage).toLocaleString()}/sqft
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 text-sm hidden sm:table-cell">
                        {comp.distance} mi
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell">
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                          comp.correlation >= 80 ? "bg-green-50 text-green-700" :
                          comp.correlation >= 60 ? "bg-blue-50 text-blue-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>
                          {comp.correlation}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Neighborhood insights ── */}
      <div className="bg-gray-50 py-14 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-950 mb-8">
            Neighborhood Insights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.neighborhoodInsights.map((insight, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-950 text-sm">
                    {insight.category}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ratingColor[insight.rating]}`}
                  >
                    {ratingLabel[insight.rating]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Seller strategy ── */}
      <div className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-950 mb-8">
            Your Selling Strategy
            {formData.firstName ? `, ${formData.firstName}` : ""}
          </h2>
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
            {/* Pricing rationale + tips */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Pricing Strategy
                </p>
                <p className="text-3xl font-bold text-gray-950 mb-3">
                  {fmtFull(result.sellerStrategy.recommendedListPrice)}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {result.sellerStrategy.pricingRationale}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Tips to Maximize Your Sale Price
                </p>
                <ul className="space-y-3">
                  {result.sellerStrategy.topSellingTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Agent card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/mike-avatar.png"
                  alt="Mike Mathias"
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-gray-950">Mike Mathias</p>
                  <p className="text-xs text-gray-500">
                    Founder · MasterKey Real Estate
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    DRE #01892427
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {formData.firstName ? `Hi ${formData.firstName}, I'd` : "I'd"} love
                to walk you through this in detail — the AI gives you a strong starting
                point, and I can add the local knowledge to sharpen it. Let&apos;s talk.
              </p>
              <div className="space-y-3 mb-6">
                <a
                  href="tel:+18052629707"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4 text-blue-500" />
                  805.262.9707
                </a>
                <a
                  href="mailto:mike@usemasterkey.com"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <EnvelopeIcon className="w-4 h-4 text-blue-500" />
                  mike@usemasterkey.com
                </a>
                <p className="flex items-center gap-3 text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Thousand Oaks, CA · Ventura County
                </p>
              </div>
              <Button href="/contact" className="w-full justify-center">
                Schedule a consultation
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions about selling in today&apos;s market?
          </h2>
          <p className="text-white/70 mb-8">
            Free consultation. No obligation. Expert guidance.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/contact">
              Talk to an agent
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="secondary" href="/homevalue/questionnaire">
              Value another home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
