"use client";

import { Suspense, useState, useEffect } from "react";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import LandingPageV6 from "@/components/landing-pages/landing-page-v6/page";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  HomeModernIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  ScaleIcon,
} from "@heroicons/react/16/solid";

export const RENT_VS_SELL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/e5c3377b-b8fa-4ac1-ba21-bd2d63560dd7";
export const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

// ─── Types — exported so results page can import ─────────────────────────────
export interface RVSFormData {
  address: string;
  addressValid: boolean;
  homeValue: string;
  purchasePrice: string;
  purchaseYear: string;
  residencyType: "primary" | "investment" | "";   // primary = IRC 121 eligible; investment = no exclusion
  mortgageBalance: string;
  interestRate: string;
  titleOwnership: "single" | "multiple" | "";
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ─── Market defaults (Ventura County) ─────────────────────────────────────────
export const DEFAULTS = {
  monthlyRent: 3950,
  propertyTaxRate: 0.007,
  annualInsurance: 2100,
  mgmtFeeRate: 0.09,
  maintenanceRate: 0.01,
  appreciationRate: 0.045,
  vacancyRate: 0.05,
  agentCommission: 0.055,
  closingCosts: 0.01,
  stagingCosts: 3500,
  investReturnRate: 0.07,
};

// ─── Capital gains tax (Section 121 + 2025/2026 rates) ───────────────────────
// Exclusion: $250K single, $500K married/multiple on title
// Rate: 15% for most sellers (taxable income $49K–$545K single / $98K–$613K joint)
// Reference: IRS Section 121, Bankrate/NerdWallet 2025-2026 tables
/**
 * Capital gains calculation — IRC Section 121 + California FTB rules
 *
 * Federal (IRC 121):
 *   - Primary residence owned AND lived in 2+ of last 5 years:
 *     Exclusion = $250K (single) or $500K (married/joint)
 *     Rate on taxable gain = 15% long-term (most CA sellers)
 *   - Investment property or <2yr primary residence:
 *     No exclusion — full 15% federal long-term rate applies
 *
 * California (FTB):
 *   - CA does NOT recognize IRC 121 — no exclusion at the state level
 *   - CA taxes entire gain (homeValue - purchasePrice) at ordinary income rates
 *   - Effective CA rate used: 9.3% (bracket for ~$66K–$338K taxable income)
 *   - Combined federal + CA rate on taxable federal gain: ~24.3%
 *
 * Note: Basis improvements are NOT factored in (actual tax may be lower).
 * Consult a CPA for your specific situation.
 */
export function calcCapitalGains(
  homeValue: number,
  purchasePrice: number,
  titleOwnership: "single" | "multiple" | "",
  residencyType: "primary" | "investment" | "",
  purchaseYear: string
): {
  gain: number;
  federalExclusion: number;
  federalTaxableGain: number;
  federalTax: number;
  caTaxableGain: number;
  caTax: number;
  totalTax: number;
  // legacy compat
  taxableGain: number;
  capitalGainsTax: number;
  exclusion: number;
  qualifiesForIRC121: boolean;
  yearsOwned: number;
} {
  const gain = Math.max(0, homeValue - purchasePrice);
  const yearsOwned = purchaseYear
    ? new Date().getFullYear() - parseInt(purchaseYear)
    : 0;

  // IRC 121 qualification: primary residence + owned/lived in 2+ of last 5 years
  const qualifiesForIRC121 =
    residencyType === "primary" && yearsOwned >= 2;

  // Federal exclusion
  const federalExclusion = qualifiesForIRC121
    ? titleOwnership === "multiple" ? 500_000 : 250_000
    : 0;

  const federalTaxableGain = Math.max(0, gain - federalExclusion);

  // Federal long-term rate: 15% for most sellers (income $47K–$518K single / $94K–$583K joint, 2025)
  const federalRate = 0.15;
  const federalTax = federalTaxableGain * federalRate;

  // California: no IRC 121 — taxes the full gain at ordinary income rates
  // 9.3% = bracket for ~$66K–$338K CA taxable income (most Ventura County sellers)
  const caRate = 0.093;
  const caTaxableGain = gain; // CA taxes the whole gain, no exclusion
  const caTax = caTaxableGain * caRate;

  const totalTax = federalTax + caTax;

  return {
    gain,
    federalExclusion,
    federalTaxableGain,
    federalTax,
    caTaxableGain,
    caTax,
    totalTax,
    // legacy aliases for existing code
    taxableGain: federalTaxableGain,
    capitalGainsTax: totalTax,
    exclusion: federalExclusion,
    qualifiesForIRC121,
    yearsOwned,
  };
}

// ─── Full calculation engine ──────────────────────────────────────────────────
export interface CalcResults {
  salePrice: number;
  agentFee: number;
  closingAndStagingCosts: number;
  mortgagePayoff: number;
  exclusion: number;
  capitalGain: number;
  taxableGain: number;
  capitalGainsTax: number;
  federalTax: number;
  caTax: number;
  qualifiesForIRC121: boolean;
  yearsOwned: number;
  saleNetProceeds: number;
  saleAfterTax: number;
  saleInvested5yr: number;
  saleInvested10yr: number;
  monthlyRent: number;
  monthlyMortgage: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyMgmtFee: number;
  monthlyMaintenance: number;
  monthlyVacancy: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  rentTotalWealth5yr: number;
  rentTotalWealth10yr: number;
  verdict5yr: "sell" | "rent" | "close";
  verdict10yr: "sell" | "rent" | "close";
  chartData: { name: string; Sell: number; Rent: number }[];
}

export function calculate(form: RVSFormData, monthlyRentOverride?: number | null): CalcResults | null {
  const homeValue = parseFloat(form.homeValue.replace(/[,$]/g, "")) || 0;
  const purchasePrice = parseFloat(form.purchasePrice.replace(/[,$]/g, "")) || 0;
  const mortgageBalance = parseFloat(form.mortgageBalance.replace(/[,$]/g, "")) || 0;
  const interestRate = parseFloat(form.interestRate.replace(/%/g, "")) / 100 || 0.065;
  if (!homeValue || !purchasePrice) return null;

  const D = DEFAULTS;

  // ── Sell ──
  const agentFee = homeValue * D.agentCommission;
  const closingAndStagingCosts = homeValue * D.closingCosts + D.stagingCosts;
  const mortgagePayoff = mortgageBalance;
  const saleNetProceeds = homeValue - agentFee - closingAndStagingCosts - mortgagePayoff;

  const capitalGain = homeValue - purchasePrice;
  const cgResult = calcCapitalGains(
    homeValue, purchasePrice, form.titleOwnership,
    form.residencyType, form.purchaseYear
  );
  const { taxableGain, capitalGainsTax, exclusion } = cgResult;
  const saleAfterTax = Math.max(0, saleNetProceeds - capitalGainsTax);
  const saleInvested5yr = saleAfterTax * Math.pow(1 + D.investReturnRate, 5);
  const saleInvested10yr = saleAfterTax * Math.pow(1 + D.investReturnRate, 10);

  // ── Rent ──
  const monthlyRent = (monthlyRentOverride && monthlyRentOverride > 0) ? monthlyRentOverride : D.monthlyRent;
  const monthlyPropertyTax = (homeValue * D.propertyTaxRate) / 12;
  const monthlyInsurance = D.annualInsurance / 12;
  const monthlyMgmtFee = monthlyRent * D.mgmtFeeRate;
  const monthlyMaintenance = (homeValue * D.maintenanceRate) / 12;
  const monthlyVacancy = monthlyRent * D.vacancyRate;

  let monthlyMortgage = 0;
  if (mortgageBalance > 0 && interestRate > 0) {
    const r = interestRate / 12;
    const n = 300; // ~25yr remaining
    monthlyMortgage = mortgageBalance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const monthlyExpenses = monthlyMortgage + monthlyPropertyTax + monthlyInsurance +
    monthlyMgmtFee + monthlyMaintenance + monthlyVacancy;
  const monthlyCashFlow = monthlyRent - monthlyExpenses;

  // Annual equity buildup: ~35% of payment = principal, plus appreciation
  const annualPrincipalPaydown = monthlyMortgage * 12 * 0.35;

  function rentWealthAtYear(yrs: number) {
    const cumulativeCashFlow = monthlyCashFlow * 12 * yrs;
    const appreciatedValue = homeValue * Math.pow(1 + D.appreciationRate, yrs);
    const remainingMortgage = Math.max(0, mortgageBalance - annualPrincipalPaydown * yrs);
    return cumulativeCashFlow + (appreciatedValue - remainingMortgage);
  }

  const rentTotalWealth5yr = rentWealthAtYear(5);
  const rentTotalWealth10yr = rentWealthAtYear(10);

  const diff5 = saleInvested5yr - rentTotalWealth5yr;
  const diff10 = saleInvested10yr - rentTotalWealth10yr;
  const threshold = 25_000;

  return {
    salePrice: homeValue,
    agentFee,
    closingAndStagingCosts,
    mortgagePayoff,
    exclusion,
    capitalGain,
    taxableGain,
    capitalGainsTax,
    federalTax: cgResult.federalTax,
    caTax: cgResult.caTax,
    qualifiesForIRC121: cgResult.qualifiesForIRC121,
    yearsOwned: cgResult.yearsOwned,
    saleNetProceeds,
    saleAfterTax,
    saleInvested5yr,
    saleInvested10yr,
    monthlyRent,
    monthlyMortgage,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyMgmtFee,
    monthlyMaintenance,
    monthlyVacancy,
    monthlyExpenses,
    monthlyCashFlow,
    rentTotalWealth5yr,
    rentTotalWealth10yr,
    verdict5yr: Math.abs(diff5) < threshold ? "close" : diff5 > 0 ? "sell" : "rent",
    verdict10yr: Math.abs(diff10) < threshold ? "close" : diff10 > 0 ? "sell" : "rent",
    chartData: [
      { name: "5 Years", Sell: Math.round(saleInvested5yr / 1000), Rent: Math.round(rentTotalWealth5yr / 1000) },
      { name: "10 Years", Sell: Math.round(saleInvested10yr / 1000), Rent: Math.round(rentTotalWealth10yr / 1000) },
    ],
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────
export function validatePhoneFormat(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required.";
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
  if (local.length !== 10) return "Please enter a valid 10-digit phone number.";
  if (local[0] === "0" || local[0] === "1") return "Please enter a valid phone number.";
  if (/^(\d)\1{9}$/.test(local) || local === "1234567890") return "Please enter a valid phone number.";
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTIONNAIRE
// ═══════════════════════════════════════════════════════════════════════════════
function RentVsSellPageInner() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Listen for global calendar modal event
  useEffect(() => {
    const handler = () => setCalendarOpen(true);
    window.addEventListener('openCalendarModal', handler);
    return () => window.removeEventListener('openCalendarModal', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <NavbarMinimal theme="light" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-400/6 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-start lg:items-center">
            <div className="py-6 lg:py-20">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-6">
                <ScaleIcon className="w-3.5 h-3.5" />
                Free Analysis · Ventura County
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-4">
                Should you <span className="text-sky-500 italic">sell</span> your<br />
                <span className="relative text-sky-500">
                  <svg aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-6 w-full" viewBox="0 0 283 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332" stroke="url(#paint0_linear_rvs)" strokeWidth="4" />
                    <defs>
                      <linearGradient className="mt-4" id="paint0_linear_rvs" x1="282" y1="5.49999" x2="40" y2="13" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--color-sky-400)" />
                        <stop offset="1" stopColor="var(--color-sky-300)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="relative">Ventura County home</span>
                  </span><br />
                — or <span className="text-sky-500 italic">rent it out?</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Answer 6 quick questions and get an instant, personalized side-by-side comparison — including your capital gains tax exposure, monthly cash flow, and total wealth built over 5 and 10 years.
              </p>
              <div className="flex flex-col items-start gap-4">
                <Link
                  href="/rent-vs-sell/quiz"
                  className="flex items-center gap-3 bg-sky-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-md shadow-blue-200 w-full sm:w-auto justify-center"
                >
                  <ScaleIcon className="w-5 h-5" />
                  Run My Free Analysis
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <p className="text-xs text-gray-400">Free · Instant results · No obligation · Takes 2 minutes</p>
              </div>
            </div>

            {/* Right — what you'll get card */}
            <div className="relative flex justify-center lg:justify-end items-center">
              {/* Background image extending beyond the card */}
              <div className="absolute inset-0 -inset-x-12 -inset-y-12 bg-cover bg-center rounded-3xl" style={{ backgroundImage: 'url(/images/ventura.webp)' }} />
              
              <div className="relative w-full max-w-sm z-10">
                <div className="absolute -inset-1 rounded-2xl bg-blue-400/10 blur-xl" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">What you'll get</p>
                  {[
                    { icon: CurrencyDollarIcon, color: "text-blue-600 bg-blue-50", label: "Sell scenario", sub: "Net cash after tax + 5 & 10-yr investment projection" },
                    { icon: HomeModernIcon, color: "text-green-600 bg-green-50", label: "Rent scenario", sub: "Monthly cash flow + equity buildup over time" },
                    { icon: ChartBarIcon, color: "text-blue-500 bg-blue-50/60", label: "Visual comparison", sub: "Bar chart: which option wins at 5 and 10 years" },
                    { icon: ScaleIcon, color: "text-green-500 bg-green-50/60", label: "Personalized verdict", sub: "Clear recommendation + tailored follow-up path" },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-3">
                    {["Instant results", "Free", "No obligation"].map(t => (
                      <span key={t} className="flex items-center gap-1 text-xs text-gray-400">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-blue-400" />{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Non-hero sections borrowed from sellguide ── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl font-bold text-gray-950 mb-3">Built for Ventura County homeowners</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-xl mx-auto">
            Generic online calculators miss the nuance of your local market. This analysis uses real Ventura County data — rental comps, appreciation rates, and tax rules specific to Ventura County homeowners.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: ClipboardDocumentListIcon, title: "Sell scenario", desc: "Net proceeds after agent fees, closing costs, mortgage payoff, and capital gains tax — with a 10-year investment projection." },
              { icon: CurrencyDollarIcon, title: "Rent scenario", desc: "Monthly cash flow after all expenses — mortgage, tax, insurance, management, maintenance, and vacancy reserve." },
              { icon: ChartBarIcon, title: "Data-driven verdict", desc: "A clear recommendation based on your specific numbers, with a follow-up path whether you sell, rent, or want to talk it through." },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-950 text-sm mb-1">{item.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-blue-500" />No spam, ever</span>
            <span className="flex items-center gap-1.5"><ScaleIcon className="w-4 h-4 text-blue-500" />Instant results</span>
            <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4 text-green-500" />Ventura County market data</span>
          </div>
        </div>
      </section>

      <LandingPageV6 />
      <Footer />
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </div>
  );
}

// ─── Calendar Modal ───────────────────────────────────────────────────────────
function CalendarModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.type = 'text/javascript';
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <iframe src={CALENDAR_SRC} style={{ width: '100%', height: '750px', border: 'none' }} scrolling="yes" id="rvs-calendar" title="Schedule Appointment" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RentVsSellPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-400/30 border-t-blue-500 animate-spin" /></div>}>
      <RentVsSellPageInner />
    </Suspense>
  );
}
