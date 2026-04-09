"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import LandingPageV6 from "@/components/landing-pages/landing-page-v6/page";
import { GooglePlacesInput } from "@/components/ui/google-places-input";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HomeModernIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  XMarkIcon,
  ScaleIcon,
  UserIcon,
  UsersIcon,
  CalendarDaysIcon,
} from "@heroicons/react/16/solid";

// ─── Placeholder — swap in real URL when provided ───────────────────────────
export const RENT_VS_SELL_WEBHOOK = "RENT_VS_SELL_WEBHOOK_PLACEHOLDER";
export const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

// ─── Types — exported so results page can import ─────────────────────────────
export interface RVSFormData {
  address: string;
  addressValid: boolean;
  homeValue: string;
  purchasePrice: string;
  purchaseYear: string;
  mortgageBalance: string;
  interestRate: string;
  titleOwnership: "single" | "multiple" | "";
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ─── Market defaults (Thousand Oaks) ─────────────────────────────────────────
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
export function calcCapitalGains(
  homeValue: number,
  purchasePrice: number,
  titleOwnership: "single" | "multiple" | ""
): { taxableGain: number; capitalGainsTax: number; exclusion: number } {
  const gain = homeValue - purchasePrice;
  const exclusion = titleOwnership === "multiple" ? 500_000 : 250_000;
  const taxableGain = Math.max(0, gain - exclusion);
  // 15% long-term rate — appropriate for the vast majority of TO sellers
  const capitalGainsTax = taxableGain * 0.15;
  return { taxableGain, capitalGainsTax, exclusion };
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

export function calculate(form: RVSFormData): CalcResults | null {
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
  const { taxableGain, capitalGainsTax, exclusion } = calcCapitalGains(
    homeValue, purchasePrice, form.titleOwnership
  );
  const saleAfterTax = Math.max(0, saleNetProceeds - capitalGainsTax);
  const saleInvested5yr = saleAfterTax * Math.pow(1 + D.investReturnRate, 5);
  const saleInvested10yr = saleAfterTax * Math.pow(1 + D.investReturnRate, 10);

  // ── Rent ──
  const monthlyRent = D.monthlyRent;
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
function Questionnaire({ onComplete }: { onComplete: (data: RVSFormData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RVSFormData>({
    address: "", addressValid: false, homeValue: "", purchasePrice: "",
    purchaseYear: "", mortgageBalance: "", interestRate: "",
    titleOwnership: "", phone: "", email: "", firstName: "", lastName: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TOTAL = 6;

  function set<K extends keyof RVSFormData>(k: K, v: RVSFormData[K]) {
    setData(d => ({ ...d, [k]: v }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.addressValid;
      case 2: return data.homeValue.trim() !== "" && data.purchasePrice.trim() !== "" && data.purchaseYear.trim() !== "";
      case 3: return data.mortgageBalance.trim() !== "" && data.interestRate.trim() !== "";
      case 4: return data.titleOwnership !== "";
      case 5: return data.phone.trim() !== "" && !phoneError && data.email.trim() !== "" && emailRegex.test(data.email) && !emailError;
      case 6: return data.firstName.trim() !== "";
      default: return false;
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/validate-phone", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: data.phone }) });
      const r = await res.json();
      if (!r.valid) { setPhoneError(r.reason ?? "Please enter a valid phone number."); setIsSubmitting(false); return; }
    } catch { /* fail open */ }
    try {
      const res = await fetch("/api/validate-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email }) });
      const r = await res.json();
      if (!r.valid) { setEmailError(r.reason ?? "Please enter a valid email."); setIsSubmitting(false); return; }
    } catch { /* fail open */ }
    setIsSubmitting(false);
    onComplete(data);
  }

  const progress = step === 0 ? 0 : Math.round((step / TOTAL) * 100);

  if (step === 0) {
    return (
      <div className="flex flex-col items-start gap-4 w-full max-w-md">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-md shadow-blue-200 w-full sm:w-auto justify-center"
        >
          <ScaleIcon className="w-5 h-5" />
          Run My Free Analysis
          <ArrowRightIcon className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-400">Free · Instant results · No obligation</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Step {step} of {TOTAL}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

        {step === 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 1 of 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What's the property address?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll pull local comps and market data for your specific area.</p>
            <GooglePlacesInput
              id="rvs-address"
              value={data.address}
              onChange={v => set("address", v)}
              onValidationChange={valid => set("addressValid", valid)}
              placeholder="Start typing your address…"
              showValidation={true}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 2 of 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Tell us about the home's value</h3>
            <p className="text-sm text-gray-400 mb-4">These numbers drive your sell vs. rent comparison.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Estimated Current Value <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="text" inputMode="numeric" value={data.homeValue} onChange={e => set("homeValue", e.target.value)} placeholder="950,000" className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Not sure? Use our <a href="/homevalue/questionnaire" className="text-blue-500 hover:underline">free valuation tool</a>.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Original Purchase Price <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="text" inputMode="numeric" value={data.purchasePrice} onChange={e => set("purchasePrice", e.target.value)} placeholder="600,000" className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Year Purchased <span className="text-red-400">*</span></label>
                <input type="text" inputMode="numeric" value={data.purchaseYear} onChange={e => set("purchaseYear", e.target.value)} placeholder="2018" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 3 of 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What are your mortgage details?</h3>
            <p className="text-sm text-gray-400 mb-4">This determines your net proceeds and rental cash flow.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Remaining Mortgage Balance <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="text" inputMode="numeric" value={data.mortgageBalance} onChange={e => set("mortgageBalance", e.target.value)} placeholder="350,000" className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Enter 0 if you own free and clear.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Interest Rate <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type="text" inputMode="decimal" value={data.interestRate} onChange={e => set("interestRate", e.target.value)} placeholder="6.5" className="w-full pr-8 pl-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 4 of 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">How many people are on the title?</h3>
            <p className="text-sm text-gray-400 mb-4">
              This affects your capital gains tax exclusion. Single owner = $250K exclusion. Multiple owners (married/joint) = $500K exclusion under IRS Section 121.
            </p>
            <div className="space-y-3">
              {[
                { value: "single", label: "Just me", sub: "$250,000 capital gains exclusion", Icon: UserIcon },
                { value: "multiple", label: "Multiple people (married/joint)", sub: "$500,000 capital gains exclusion", Icon: UsersIcon },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { set("titleOwnership", opt.value as "single" | "multiple"); setTimeout(() => setStep(s => s + 1), 160); }}
                  className={`w-full flex items-start gap-3 px-4 py-4 rounded-xl border text-left transition-colors ${
                    data.titleOwnership === opt.value
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <opt.Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${data.titleOwnership === opt.value ? "text-blue-500" : "text-gray-300"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${data.titleOwnership === opt.value ? "text-blue-700" : "text-gray-800"}`}>{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                  </div>
                  {data.titleOwnership === opt.value && <CheckCircleIcon className="w-4 h-4 text-blue-500 ml-auto mt-1 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 5 of 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Where should we send your results?</h3>
            <p className="text-sm text-gray-400 mb-4">Your personalized sell vs. rent analysis is ready — we'll also email you a copy.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                <input type="tel" value={data.phone} onChange={e => { set("phone", e.target.value); setPhoneError(e.target.value.trim() ? (validatePhoneFormat(e.target.value) ?? "") : ""); }} placeholder="(805) 555-0100" className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none text-gray-900 ${phoneError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`} />
                {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
                <p className="mt-1 text-[11px] text-gray-400">We may reach out to walk through your results — no spam.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                <input type="email" value={data.email} onChange={e => { set("email", e.target.value); setEmailError(e.target.value.trim() && !emailRegex.test(e.target.value) ? "Please enter a valid email" : ""); }} placeholder="jane@example.com" className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none text-gray-900 ${emailError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`} />
                {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 6 of 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Last step — what's your name?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll personalize your analysis.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name <span className="text-red-400">*</span></label>
                <input type="text" value={data.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                <input type="text" value={data.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3 pt-1">
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />Back
          </button>
          {/* Step 4 auto-advances on click — hide Continue for it */}
          {step !== 4 && (step < 6 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()} className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
              Continue <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canAdvance() || isSubmitting} className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all">
              <ScaleIcon className="w-4 h-4" />
              {isSubmitting ? "Calculating…" : "Show My Results →"}
            </button>
          ))}
        </div>
        {step === 6 && <p className="text-[11px] text-gray-400 text-center">No spam. Your data is never sold.</p>}
      </div>
    </div>
  );
}

// ─── GHL Calendar Modal ───────────────────────────────────────────────────────
function CalendarModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => { const el = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]'); if (el) document.body.removeChild(el); };
  }, []);
  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Schedule a Consultation</h3>
              <p className="text-xs text-gray-400 mt-0.5">Let's walk through your numbers together — no obligation.</p>
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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function RentVsSellPageInner() {
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);

  async function handleComplete(data: RVSFormData) {
    const results = calculate(data);
    if (!results) return;

    // Fire webhook (placeholder until real URL provided)
    if (RENT_VS_SELL_WEBHOOK !== "RENT_VS_SELL_WEBHOOK_PLACEHOLDER") {
      try {
        await fetch(RENT_VS_SELL_WEBHOOK, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.firstName, lastName: data.lastName,
            phone: data.phone, email: data.email,
            propertyAddress: data.address, homeValue: data.homeValue,
            purchasePrice: data.purchasePrice, purchaseYear: data.purchaseYear,
            mortgageBalance: data.mortgageBalance, interestRate: data.interestRate,
            titleOwnership: data.titleOwnership,
            verdict5yr: results.verdict5yr, verdict10yr: results.verdict10yr,
            sellNetProceeds: Math.round(results.saleAfterTax),
            rentWealth10yr: Math.round(results.rentTotalWealth10yr),
            formType: "rent-vs-sell", source: "rent-vs-sell-page",
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch { /* fail open */ }
    }

    // Encode results + form data into URL params for results page
    const params = new URLSearchParams({
      d: btoa(JSON.stringify({ form: data, results })),
    });
    router.push(`/rent-vs-sell/results?${params.toString()}`);
  }

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
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-6">
                <ScaleIcon className="w-3.5 h-3.5" />
                Free Analysis · Conejo Valley
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-4">
                Should you sell your<br />
                <span className="text-blue-500">Thousand Oaks home</span><br />
                — or <span className="text-green-600">rent it out?</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Answer 6 quick questions and get an instant, personalized side-by-side comparison — including your capital gains tax exposure, monthly cash flow, and total wealth built over 5 and 10 years.
              </p>
              <Questionnaire onComplete={handleComplete} />
            </div>

            {/* Right — what you'll get card */}
            <div className="flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-1 rounded-2xl bg-blue-400/10 blur-xl" />
                <div className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
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
            Generic online calculators miss the nuance of your local market. This analysis uses real Conejo Valley data — rental comps, appreciation rates, and tax rules specific to Thousand Oaks homeowners.
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
            <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4 text-green-500" />Thousand Oaks market data</span>
          </div>
        </div>
      </section>

      <LandingPageV6 />
      <Footer />
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
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
