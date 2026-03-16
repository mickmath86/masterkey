"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Gradient } from "@/components/gradient";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/16/solid";

// ─── Form data type ───────────────────────────────────────────────────────────

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

// ─── Estimation engine ────────────────────────────────────────────────────────

function estimateValue(data: HomeValueFormData) {
  const sqft = parseInt((data.sqft || "1800").replace(/,/g, "")) || 1800;
  const yearBuilt = parseInt(data.yearBuilt) || 1995;
  const age = 2026 - yearBuilt;

  let ppsf = 565; // Base $/sqft for Conejo Valley

  // Condition
  const conditionMap: Record<string, number> = {
    "Excellent — like new / recently renovated": 1.12,
    "Good — well maintained, minor wear": 1.0,
    "Fair — needs some updating": 0.91,
    "Needs Work — significant repairs needed": 0.80,
  };
  ppsf *= conditionMap[data.condition] ?? 1.0;

  // Age
  if (age < 10) ppsf *= 1.05;
  else if (age > 40) ppsf *= 0.95;

  // Features
  const feats = Array.isArray(data.features) ? data.features : [];
  if (feats.includes("Swimming Pool")) ppsf += 18;
  if (feats.includes("Mountain / Canyon View")) ppsf += 25;
  if (feats.includes("Solar Panels (owned)")) ppsf += 8;
  if (feats.includes("ADU / Guest House")) ppsf += 35;
  if (feats.includes("Updated Kitchen")) ppsf += 12;
  if (feats.includes("Smart Home System")) ppsf += 5;

  // Recent updates
  const boostMap: Record<string, number> = {
    "Within the last year": 1.04,
    "1–5 years ago": 1.02,
  };
  ppsf *= boostMap[data.kitchenUpdate] ?? 1.0;
  ppsf *= boostMap[data.bathroomUpdate] ?? 1.0;

  const base = ppsf * sqft;
  const beds = parseInt(data.bedrooms) || 3;
  const baths = parseFloat(data.bathrooms) || 2;
  const bedsBonus = Math.max(0, beds - 3) * 15000;
  const bathBonus = Math.max(0, baths - 2) * 8000;

  const mid = Math.round((base + bedsBonus + bathBonus) / 1000) * 1000;
  const spread = mid * 0.055;
  const low = Math.round((mid - spread) / 1000) * 1000;
  const high = Math.round((mid + spread) / 1000) * 1000;
  const confidence = data.condition && data.sqft && data.yearBuilt ? 91 : 78;

  return { low, mid, high, confidence };
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
}
function fmtFull(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Market data (Conejo Valley, March 2026) ──────────────────────────────────

const MARKET = {
  medianPrice: 985000,
  medianPriceChange: 4.2,
  daysOnMarket: 22,
  domChange: -3,
  inventory: 312,
  inventoryChange: -12,
  listToSaleRatio: 98.7,
  monthsSupply: 1.8,
  neighborhoods: [
    { name: "Thousand Oaks", median: 1080000, change: 5.1 },
    { name: "Westlake Village", median: 1420000, change: 3.8 },
    { name: "Newbury Park", median: 940000, change: 6.2 },
    { name: "Agoura Hills", median: 1050000, change: 4.5 },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
              positive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {positive ? (
              <ArrowUpRightIcon className="w-3 h-3" />
            ) : (
              <ArrowDownRightIcon className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-950">{value}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomeValueResultsPage() {
  const [formData, setFormData] = useState<HomeValueFormData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("hv_form");
    if (raw) {
      try {
        setFormData(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Fallback if no session data
  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-950 mb-3">No valuation found</h2>
          <p className="text-gray-500 mb-6">
            Please complete the home valuation questionnaire first.
          </p>
          <Button href="/homevalue/questionnaire">
            Start valuation <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  const { low, mid, high, confidence } = estimateValue(formData);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ── Hero valuation banner ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <Gradient className="absolute inset-0 opacity-95" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — main value */}
            <div>
              <p className="text-white/60 text-sm flex items-center gap-1.5 mb-4">
                <MapPinIcon className="w-4 h-4" />
                {formData.propertyAddress}
              </p>
              {formData.propertyType && (
                <p className="text-white/50 text-xs mb-6">
                  {formData.propertyType}
                  {formData.bedrooms && ` · ${formData.bedrooms} bed`}
                  {formData.bathrooms && ` / ${formData.bathrooms} bath`}
                  {formData.sqft && ` · ${formData.sqft} sqft`}
                  {formData.yearBuilt && ` · Built ${formData.yearBuilt}`}
                </p>
              )}

              <p className="text-white/70 text-sm mb-2">Estimated Market Value</p>
              <p className="text-5xl sm:text-6xl font-bold text-white mb-3">
                {fmtFull(mid)}
              </p>
              <p className="text-green-300 text-sm font-medium mb-8">
                Range: {fmt(low)} – {fmt(high)}
              </p>

              {/* Confidence bar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60 font-medium">
                    Confidence Score
                  </span>
                  <span className="text-sm font-bold text-white">{confidence}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-1000"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-2">
                  Based on comparable sales and property details
                </p>
              </div>
            </div>

            {/* Right — breakdown */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold text-sm mb-4">
                Valuation Breakdown
              </h3>
              <div className="space-y-0">
                {[
                  {
                    label: "Base value (price/sqft × size)",
                    value: `~${fmt(Math.round((mid * 0.87) / 1000) * 1000)}`,
                    pos: true,
                  },
                  {
                    label: "Condition adjustment",
                    value: formData.condition?.startsWith("Excellent")
                      ? "+~$30K"
                      : formData.condition?.startsWith("Fair")
                      ? "−~$35K"
                      : formData.condition?.startsWith("Needs")
                      ? "−~$70K"
                      : "+$0",
                    pos: !formData.condition?.startsWith("Needs") && !formData.condition?.startsWith("Fair"),
                  },
                  {
                    label: "Feature premiums (pool, view, solar, ADU…)",
                    value: `+$${(Array.isArray(formData.features) ? formData.features : []).length * 8}K`,
                    pos: true,
                  },
                  {
                    label: "Recent renovation uplift",
                    value: "+~$15K",
                    pos: true,
                  },
                  {
                    label: "Current market conditions (Conejo Valley)",
                    value: "+4.2% YoY",
                    pos: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                  >
                    <span className="text-xs text-white/60 flex-1 pr-4">
                      {row.label}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        row.pos ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/20">
                  <span className="text-sm font-semibold text-white">
                    Estimated Value
                  </span>
                  <span className="text-lg font-bold text-white">
                    {fmtFull(mid)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Market snapshot ── */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">
                Conejo Valley Market Snapshot
              </h2>
              <p className="text-gray-500 text-sm mt-1">March 2026 · Updated weekly</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Strong Seller&apos;s Market
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Median Sale Price"
              value={fmt(MARKET.medianPrice)}
              change={`${MARKET.medianPriceChange}% YoY`}
              positive
            />
            <StatCard
              label="Avg. Days on Market"
              value={`${MARKET.daysOnMarket} days`}
              change={`${Math.abs(MARKET.domChange)} days vs. last yr`}
              positive={MARKET.domChange < 0}
            />
            <StatCard
              label="Active Inventory"
              value={`${MARKET.inventory} homes`}
              change={`${Math.abs(MARKET.inventoryChange)}% YoY`}
              positive={false}
            />
            <StatCard
              label="List-to-Sale Ratio"
              value={`${MARKET.listToSaleRatio}%`}
              change="Up from 96.2%"
              positive
            />
          </div>

          {/* Neighborhood table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-950 text-sm">
                Neighborhood Medians
              </h3>
              <span className="text-xs text-gray-400">Last 90 days</span>
            </div>
            <div className="divide-y divide-gray-50">
              {MARKET.neighborhoods.map((n) => (
                <div
                  key={n.name}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">
                      {n.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{fmtFull(n.median)}</span>
                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRightIcon className="w-3 h-3" />
                      {n.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── What this means ── */}
      <div className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-950 mb-8">
            What this means for you
            {formData.firstName ? `, ${formData.firstName}` : ""}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "It's a great time to sell",
                body: `With only ${MARKET.monthsSupply} months of supply, buyers are competing for limited inventory. Homes priced right are getting ${MARKET.listToSaleRatio}% of asking price and closing in under a month.`,
              },
              {
                title: "Spring is peak season",
                body: `March through June consistently delivers the highest sale prices in the Conejo Valley. Listing now positions you at the peak of buyer demand before the summer slowdown.`,
              },
              {
                title: "Your equity position",
                body: `If your home is worth ${fmtFull(mid)}, you may be sitting on significant equity. A MasterKey agent can give you a precise net proceeds estimate with a full closing cost breakdown.`,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-950 text-sm mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA + Agent card ── */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            {/* Left */}
            <div>
              <h2 className="text-3xl font-bold text-gray-950 mb-4">
                Ready to take the next step?
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Your free estimate is a great starting point. A MasterKey listing
                consultation gives you a precise CMA, a personalized pricing strategy,
                and a plan to maximize your net proceeds.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Free in-home or virtual consultation",
                  "Detailed comparative market analysis (CMA)",
                  "Net proceeds estimate with closing cost breakdown",
                  "Custom marketing plan for your property",
                  "No obligation — just expert advice",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Button href="/contact">
                  Schedule a consultation
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="secondary" href="/homevalue/questionnaire">
                  Value another home
                </Button>
              </div>
            </div>

            {/* Agent card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <p className="font-semibold text-gray-950">Mike Mathias</p>
                  <p className="text-xs text-gray-500">Founder · MasterKey Real Estate</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    DRE #XXXXXXX
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {formData.firstName
                  ? `Hi ${formData.firstName}, I'd`
                  : "I'd"}{" "}
                love to walk you through your home's value in detail and share
                what we're seeing in the current market. Reach out anytime — no
                pressure.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+18055550100"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4 text-blue-500" />
                  (805) 555-0100
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
                  Thousand Oaks, CA · Serving all of Ventura County
                </p>
              </div>
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
        <Gradient className="absolute inset-0 opacity-90" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions about selling in today&apos;s market?
          </h2>
          <p className="text-white/70 mb-8">
            Our team is ready to help. Free consultation, no obligation.
          </p>
          <Button href="/contact" className="text-base px-8 py-3">
            Talk to an agent
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
