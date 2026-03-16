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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)",
          }}
        />
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

              <p className="text-white/70 text-sm mb-2">AI-Estimated Market Value</p>
              <p className="text-5xl sm:text-6xl font-bold text-white mb-3">
                {fmtFull(result.estimatedValue)}
              </p>
              {/* AVM Range Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-5 mb-6 max-w-sm">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-4">Estimated Value Range</p>
                <div className="flex items-center gap-3 mb-3">
                  {/* Low */}
                  <div className="text-center flex-1">
                    <p className="text-xs text-white/40 mb-1">Conservative</p>
                    <p className="text-lg font-bold text-white/70">{fmtShort(result.valueLow)}</p>
                  </div>
                  {/* Bar */}
                  <div className="flex-[2] relative">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 rounded-full" style={{ width: "100%" }} />
                    </div>
                    {/* Mid-point marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-green-400 shadow-lg" />
                  </div>
                  {/* High */}
                  <div className="text-center flex-1">
                    <p className="text-xs text-white/40 mb-1">Optimistic</p>
                    <p className="text-lg font-bold text-white/70">{fmtShort(result.valueHigh)}</p>
                  </div>
                </div>
                {/* Center label */}
                <div className="text-center">
                  <p className="text-xs text-white/40">AI best estimate: <span className="text-green-300 font-semibold">{fmtFull(result.estimatedValue)}</span></p>
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
          <h2 className="text-2xl font-bold text-gray-950 mb-2">
            Recent Comparable Sales
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Similar homes that sold recently in your area — the basis for your valuation.
          </p>
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sold Price
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Sold Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Distance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.comparables.map((comp, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {comp.address ? (
                        comp.sourceUrl ? (
                          <a
                            href={comp.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center gap-1 transition-colors"
                          >
                            {comp.address}
                            <ArrowUpRightIcon className="w-3 h-3 flex-shrink-0 opacity-60" />
                          </a>
                        ) : (
                          <p className="font-semibold text-gray-950 text-sm">{comp.address}</p>
                        )
                      ) : null}
                      <p className={`text-xs text-gray-500 ${comp.address ? "mt-0.5" : "font-medium text-gray-950"}`}>
                        {comp.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{comp.relevanceNote}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-950">
                      {fmtFull(comp.soldPrice)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 hidden sm:table-cell">
                      {comp.soldDate}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 hidden md:table-cell">
                      {comp.distanceFromSubject}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
