"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import { GooglePlacesInput } from "@/components/ui/google-places-input";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HomeModernIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  XMarkIcon,
  ScaleIcon,
  SparklesIcon,
} from "@heroicons/react/16/solid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── PLACEHOLDER — replace with real webhook URL when provided ───────────────
const WEBHOOK_URL = "RENT_VS_BUY_WEBHOOK_PLACEHOLDER";
const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

// ─── Market defaults (Thousand Oaks) ────────────────────────────────────────
const DEFAULTS = {
  monthlyRent: 3950,       // avg SFR rent in TO
  propertyTaxRate: 0.007,  // 0.7% effective rate
  annualInsurance: 2100,   // midpoint $1,800–$2,400
  mgmtFeeRate: 0.09,       // 9% (MasterKey midpoint 8–10%)
  maintenanceRate: 0.01,   // 1% of home value
  appreciationRate: 0.045, // 4.5% historical TO
  vacancyRate: 0.05,       // 5%
  agentCommission: 0.055,  // 5.5%
  closingCosts: 0.01,      // 1% seller closing costs
  stagingCosts: 3500,      // flat estimate
  investReturnRate: 0.07,  // 7% annual if cash invested
  capitalGainExclusion: 500000, // married filing jointly
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  address: string;
  addressValid: boolean;
  homeValue: string;
  purchasePrice: string;
  purchaseYear: string;
  mortgageBalance: string;
  interestRate: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface CalcResults {
  // Sell scenario
  salePrice: number;
  saleNetProceeds: number;
  saleAfterTax: number;
  saleInvested5yr: number;
  saleInvested10yr: number;
  capitalGainsTax: number;
  agentFee: number;
  closingAndStagingCosts: number;
  mortgagePayoff: number;
  // Rent scenario
  monthlyRent: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualEquityBuildup: number;
  rentTotalWealth5yr: number;
  rentTotalWealth10yr: number;
  // Verdict
  verdict5yr: "sell" | "rent" | "close";
  verdict10yr: "sell" | "rent" | "close";
  chartData: { name: string; Sell: number; Rent: number }[];
}

// ─── Calculation engine ──────────────────────────────────────────────────────
function calculate(form: FormData): CalcResults | null {
  const homeValue = parseFloat(form.homeValue.replace(/[,$]/g, "")) || 0;
  const purchasePrice = parseFloat(form.purchasePrice.replace(/[,$]/g, "")) || 0;
  const purchaseYear = parseInt(form.purchaseYear) || 2010;
  const mortgageBalance = parseFloat(form.mortgageBalance.replace(/[,$]/g, "")) || 0;
  const interestRate = parseFloat(form.interestRate.replace(/%/g, "")) / 100 || 0.065;

  if (!homeValue || !purchasePrice) return null;

  const yearsOwned = new Date().getFullYear() - purchaseYear;
  const D = DEFAULTS;

  // ── SELL SCENARIO ──
  const agentFee = homeValue * D.agentCommission;
  const closingAndStagingCosts = homeValue * D.closingCosts + D.stagingCosts;
  const mortgagePayoff = mortgageBalance;
  const grossProceeds = homeValue - agentFee - closingAndStagingCosts - mortgagePayoff;

  // Capital gains: gain = salePrice - purchasePrice (simplified, ignores improvements)
  const capitalGain = homeValue - purchasePrice;
  const taxableGain = Math.max(0, capitalGain - D.capitalGainExclusion);
  // Long-term cap gains rate at ~15% for most sellers
  const capitalGainsTax = taxableGain * 0.15;
  const saleAfterTax = Math.max(0, grossProceeds - capitalGainsTax);

  // Invest net proceeds at 7%/yr
  const saleInvested5yr = saleAfterTax * Math.pow(1 + D.investReturnRate, 5);
  const saleInvested10yr = saleAfterTax * Math.pow(1 + D.investReturnRate, 10);

  // ── RENT SCENARIO ──
  const monthlyRent = D.monthlyRent;
  const monthlyPropertyTax = (homeValue * D.propertyTaxRate) / 12;
  const monthlyInsurance = D.annualInsurance / 12;
  const monthlyMgmtFee = monthlyRent * D.mgmtFeeRate;
  const monthlyMaintenance = (homeValue * D.maintenanceRate) / 12;
  const monthlyVacancy = monthlyRent * D.vacancyRate;

  // Monthly mortgage P&I (existing loan)
  let monthlyMortgage = 0;
  if (mortgageBalance > 0 && interestRate > 0) {
    const r = interestRate / 12;
    // Assume ~25yr remaining (rough)
    const n = 300;
    monthlyMortgage = mortgageBalance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const monthlyExpenses =
    monthlyMortgage + monthlyPropertyTax + monthlyInsurance +
    monthlyMgmtFee + monthlyMaintenance + monthlyVacancy;
  const monthlyCashFlow = monthlyRent - monthlyExpenses;

  // Annual equity buildup (principal paydown + appreciation)
  const annualPrincipalPaydown = monthlyMortgage > 0 ? monthlyMortgage * 12 * 0.35 : 0; // rough ~35% of payment is principal
  const annualEquityBuildup = annualPrincipalPaydown + homeValue * D.appreciationRate;

  // Total wealth built renting over 5yr and 10yr
  // = cumulative cash flow + equity buildup + appreciated home value - remaining mortgage
  function rentWealthAtYear(yrs: number) {
    const cumulativeCashFlow = monthlyCashFlow * 12 * yrs;
    const appreciatedValue = homeValue * Math.pow(1 + D.appreciationRate, yrs);
    const remainingMortgage = Math.max(0, mortgageBalance - annualPrincipalPaydown * yrs);
    const equity = appreciatedValue - remainingMortgage;
    return cumulativeCashFlow + equity;
  }

  const rentTotalWealth5yr = rentWealthAtYear(5);
  const rentTotalWealth10yr = rentWealthAtYear(10);

  // ── VERDICT ──
  const diff5 = saleInvested5yr - rentTotalWealth5yr;
  const diff10 = saleInvested10yr - rentTotalWealth10yr;
  const threshold = 25000;

  const verdict5yr: "sell" | "rent" | "close" =
    Math.abs(diff5) < threshold ? "close" : diff5 > 0 ? "sell" : "rent";
  const verdict10yr: "sell" | "rent" | "close" =
    Math.abs(diff10) < threshold ? "close" : diff10 > 0 ? "sell" : "rent";

  const chartData = [
    { name: "5 Years", Sell: Math.round(saleInvested5yr / 1000), Rent: Math.round(rentTotalWealth5yr / 1000) },
    { name: "10 Years", Sell: Math.round(saleInvested10yr / 1000), Rent: Math.round(rentTotalWealth10yr / 1000) },
  ];

  return {
    salePrice: homeValue,
    saleNetProceeds: grossProceeds,
    saleAfterTax,
    saleInvested5yr,
    saleInvested10yr,
    capitalGainsTax,
    agentFee,
    closingAndStagingCosts,
    mortgagePayoff,
    monthlyRent,
    monthlyExpenses,
    monthlyCashFlow,
    annualEquityBuildup,
    rentTotalWealth5yr,
    rentTotalWealth10yr,
    verdict5yr,
    verdict10yr,
    chartData,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function validatePhoneFormat(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required.";
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
  if (local.length !== 10) return "Please enter a valid 10-digit phone number.";
  if (local[0] === "0" || local[0] === "1") return "Please enter a valid phone number.";
  if (/^(\d)\1{9}$/.test(local) || local === "1234567890") return "Please enter a valid phone number.";
  return null;
}

// ─── Verdict config ───────────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  sell: {
    label: "Selling likely wins",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    cta: "Let's schedule your listing consultation",
    ctaSub: "We'll pull a custom CMA for your property and walk you through the numbers.",
  },
  rent: {
    label: "Renting likely builds more wealth",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    cta: "MasterKey Property Management handles everything",
    ctaSub: "Full-service management at 9% — less stress, more passive income.",
  },
  close: {
    label: "It's close — let's talk through it",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    cta: "Schedule a free 15-minute strategy call",
    ctaSub: "We'll walk through your specific numbers and goals together.",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTIONNAIRE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function RentVsBuyQuestionnaire({
  onComplete,
}: {
  onComplete: (data: FormData, results: CalcResults) => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    address: "", addressValid: false, homeValue: "", purchasePrice: "",
    purchaseYear: "", mortgageBalance: "", interestRate: "",
    phone: "", email: "", firstName: "", lastName: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const TOTAL_STEPS = 5;

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setData(d => ({ ...d, [k]: v }));
  }

  function handlePhoneChange(v: string) {
    set("phone", v);
    setPhoneError(v.trim() ? (validatePhoneFormat(v) ?? "") : "");
  }

  function handleEmailChange(v: string) {
    set("email", v);
    setEmailError(v.trim() && !emailRegex.test(v) ? "Please enter a valid email" : "");
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.addressValid;
      case 2: return data.homeValue.trim() !== "" && data.purchasePrice.trim() !== "" && data.purchaseYear.trim() !== "";
      case 3: return data.mortgageBalance.trim() !== "" && data.interestRate.trim() !== "";
      case 4: return data.phone.trim() !== "" && !phoneError && data.email.trim() !== "" && emailRegex.test(data.email) && !emailError;
      case 5: return data.firstName.trim() !== "";
      default: return false;
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Phone validation
    try {
      const res = await fetch("/api/validate-phone", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: data.phone }) });
      const result = await res.json();
      if (!result.valid) { setPhoneError(result.reason ?? "Please enter a valid phone number."); setIsSubmitting(false); return; }
    } catch { /* fail open */ }

    // Email validation
    try {
      const res = await fetch("/api/validate-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email }) });
      const result = await res.json();
      if (!result.valid) { setEmailError(result.reason ?? "Please enter a valid email."); setIsSubmitting(false); return; }
    } catch { /* fail open */ }

    const results = calculate(data);
    if (!results) { setIsSubmitting(false); return; }

    // Fire webhook
    if (WEBHOOK_URL !== "RENT_VS_BUY_WEBHOOK_PLACEHOLDER") {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.firstName, lastName: data.lastName,
            phone: data.phone, email: data.email,
            propertyAddress: data.address, homeValue: data.homeValue,
            purchasePrice: data.purchasePrice, purchaseYear: data.purchaseYear,
            mortgageBalance: data.mortgageBalance, interestRate: data.interestRate,
            verdict5yr: results.verdict5yr, verdict10yr: results.verdict10yr,
            sellNetProceeds: results.saleAfterTax,
            rentWealth5yr: results.rentTotalWealth5yr,
            formType: "rent-vs-buy",
            source: "rent-vs-buy-page",
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch { /* fail open */ }
    }

    setIsSubmitting(false);
    onComplete(data, results);
  }

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  // ── Step 0: hero CTA ──
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
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

        {/* ── Step 1: Address ── */}
        {step === 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 1 of 5</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What's the property address?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll use local comps and market data to build your analysis.</p>
            <GooglePlacesInput
              id="rvb-address"
              value={data.address}
              onChange={v => set("address", v)}
              onValidationChange={valid => set("addressValid", valid)}
              placeholder="Start typing your address…"
              showValidation={true}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* ── Step 2: Home value + purchase details ── */}
        {step === 2 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 2 of 5</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Tell us about the home's value</h3>
            <p className="text-sm text-gray-400 mb-4">These figures power your sell vs. rent calculation.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Estimated Current Home Value <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.homeValue}
                    onChange={e => set("homeValue", e.target.value)}
                    placeholder="950,000"
                    className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Not sure? Use your Zestimate or our <a href="/homevalue/questionnaire" className="text-blue-500 hover:underline">free valuation tool</a>.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Original Purchase Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.purchasePrice}
                    onChange={e => set("purchasePrice", e.target.value)}
                    placeholder="600,000"
                    className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Year Purchased <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.purchaseYear}
                  onChange={e => set("purchaseYear", e.target.value)}
                  placeholder="2018"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Mortgage details ── */}
        {step === 3 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 3 of 5</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What are your mortgage details?</h3>
            <p className="text-sm text-gray-400 mb-4">This determines your net proceeds and rental cash flow.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Remaining Mortgage Balance <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.mortgageBalance}
                    onChange={e => set("mortgageBalance", e.target.value)}
                    placeholder="350,000"
                    className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Enter 0 if you own the home free and clear.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Current Interest Rate <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={data.interestRate}
                    onChange={e => set("interestRate", e.target.value)}
                    placeholder="6.5"
                    className="w-full pr-8 pl-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Contact (gated before results) ── */}
        {step === 4 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 4 of 5</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Where should we send your results?</h3>
            <p className="text-sm text-gray-400 mb-4">Your personalized sell vs. rent analysis is ready — we'll also email you a copy.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="(805) 555-0100"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none text-gray-900 ${phoneError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
                />
                {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
                <p className="mt-1 text-[11px] text-gray-400">We may reach out to walk through your results — no spam.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => handleEmailChange(e.target.value)}
                  placeholder="jane@example.com"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none text-gray-900 ${emailError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
                />
                {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Name + Submit ── */}
        {step === 5 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 5 of 5</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Last step — what's your name?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll personalize your report.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={e => set("firstName", e.target.value)}
                  placeholder="Jane"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={e => set("lastName", e.target.value)}
                  placeholder="Smith"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center gap-3 pt-1">
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
              className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Continue <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance() || isSubmitting}
              className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              <ScaleIcon className="w-4 h-4" />
              {isSubmitting ? "Calculating…" : "Show My Results →"}
            </button>
          )}
        </div>
        {step === 5 && <p className="text-[11px] text-gray-400 text-center">No spam. Your data is never sold.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESULTS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function Results({ data, results, onSchedule }: { data: FormData; results: CalcResults; onSchedule: () => void }) {
  const v = VERDICT_CONFIG[results.verdict10yr];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Verdict banner */}
      <div className={`rounded-2xl border p-5 mb-6 flex items-start gap-4 ${v.bg}`}>
        <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ScaleIcon className={`w-5 h-5 ${v.color}`} />
        </div>
        <div className="flex-1">
          <p className={`font-bold text-base ${v.color}`}>{v.label}</p>
          <p className="text-sm text-gray-600 mt-0.5">
            Over 10 years: selling + investing nets{" "}
            <span className="font-semibold">{fmt(results.saleInvested10yr)}</span> vs.
            renting builds <span className="font-semibold">{fmt(results.rentTotalWealth10yr)}</span>.
          </p>
          <button
            onClick={onSchedule}
            className="mt-3 inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <CalendarDaysIcon className="w-3.5 h-3.5 text-blue-500" />
            {v.cta}
          </button>
          <p className="text-[11px] text-gray-400 mt-1.5">{v.ctaSub}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900 mb-4">Total wealth comparison ($K)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={results.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}K`} />
            <Tooltip formatter={(value: number) => [`$${value}K`, ""]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Sell" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Rent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column detail */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Sell */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-orange-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Sell Scenario</p>
          </div>
          <div className="space-y-2 text-sm">
            <Row label="Estimated sale price" value={fmt(results.salePrice)} />
            <Row label={`Agent commission (5.5%)`} value={`−${fmt(results.agentFee)}`} neg />
            <Row label="Closing costs + staging" value={`−${fmt(results.closingAndStagingCosts)}`} neg />
            <Row label="Mortgage payoff" value={`−${fmt(results.mortgagePayoff)}`} neg />
            {results.capitalGainsTax > 0 && <Row label="Capital gains tax (est.)" value={`−${fmt(results.capitalGainsTax)}`} neg />}
            <div className="border-t border-orange-200 pt-2 mt-2">
              <Row label="Net cash in pocket" value={fmt(results.saleAfterTax)} bold />
            </div>
            <div className="bg-white/60 rounded-lg p-2.5 mt-2 space-y-1">
              <p className="text-[11px] text-gray-500 font-medium mb-1">If you invest at 7%/yr:</p>
              <Row label="After 5 years" value={fmt(results.saleInvested5yr)} />
              <Row label="After 10 years" value={fmt(results.saleInvested10yr)} bold />
            </div>
          </div>
        </div>

        {/* Rent */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <HomeModernIcon className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Rent Scenario</p>
          </div>
          <div className="space-y-2 text-sm">
            <Row label="Est. monthly rent (TO avg)" value={fmt(results.monthlyRent) + "/mo"} />
            <Row label="Monthly expenses (all-in)" value={`−${fmt(results.monthlyExpenses)}/mo`} neg />
            <div className="border-t border-blue-200 pt-2 mt-2">
              <Row label="Monthly cash flow" value={`${results.monthlyCashFlow >= 0 ? "+" : ""}${fmt(results.monthlyCashFlow)}/mo`} bold />
            </div>
            <div className="bg-white/60 rounded-lg p-2.5 mt-2 space-y-1">
              <p className="text-[11px] text-gray-500 font-medium mb-1">Total wealth (equity + cash flow):</p>
              <Row label="After 5 years" value={fmt(results.rentTotalWealth5yr)} />
              <Row label="After 10 years" value={fmt(results.rentTotalWealth10yr)} bold />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Includes principal paydown + 4.5%/yr appreciation</p>
          </div>
        </div>
      </div>

      {/* Assumptions disclosure */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
        <p className="font-medium text-gray-500 mb-1">Assumptions used in this analysis</p>
        Monthly rent: {fmt(DEFAULTS.monthlyRent)} (Thousand Oaks SFR avg) · Property tax: 0.7% · Insurance: {fmt(DEFAULTS.annualInsurance)}/yr ·
        Management fee: 9% · Maintenance: 1%/yr · Vacancy: 5% · Appreciation: 4.5%/yr ·
        Investment return: 7%/yr · Capital gains exclusion: $500K (married).
        This is an estimate, not financial or tax advice. Consult a CPA for your specific situation.
      </div>
    </div>
  );
}

function Row({ label, value, neg, bold }: { label: string; value: string; neg?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={`text-xs ${bold ? "font-semibold text-gray-900" : "text-gray-500"}`}>{label}</span>
      <span className={`text-xs font-medium flex-shrink-0 ${bold ? "text-gray-900 font-bold" : neg ? "text-red-500" : "text-gray-700"}`}>{value}</span>
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
    return () => {
      const el = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (el) document.body.removeChild(el);
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
function RentVsBuyPageInner() {
  const [results, setResults] = useState<CalcResults | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  function handleComplete(data: FormData, calc: CalcResults) {
    setFormData(data);
    setResults(calc);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white pb-0 border-b border-gray-100">
        <NavbarMinimal theme="light" />

        {/* Background glows — blue/slate theme */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-slate-400/6 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-start lg:items-center">

            {/* Left: headline + questionnaire or results */}
            <div className="py-6 lg:py-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-6">
                <ScaleIcon className="w-3.5 h-3.5" />
                Free Analysis · Thousand Oaks
              </div>

              {!results ? (
                <>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-4">
                    Should you sell your<br />
                    <span className="text-blue-500">Thousand Oaks home</span><br />
                    — or rent it out?
                  </h1>
                  <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                    Answer 5 quick questions and get an instant, personalized side-by-side comparison of what you'd net by selling vs. what you'd build by renting.
                  </p>
                  <RentVsBuyQuestionnaire onComplete={handleComplete} />
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-950 leading-tight mb-2">
                    {formData?.firstName ? `${formData.firstName}, here` : "Here"}'s your analysis
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Based on {formData?.address ?? "your property"} — personalized to your numbers.
                  </p>
                  <Results data={formData!} results={results} onSchedule={() => setCalendarOpen(true)} />

                  <button
                    onClick={() => { setResults(null); setFormData(null); }}
                    className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                  >
                    ← Start over with different numbers
                  </button>
                </>
              )}
            </div>

            {/* Right: illustration / explainer (hidden once results show) */}
            {!results && (
              <div className="flex justify-center lg:justify-end items-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -inset-1 rounded-2xl bg-blue-400/15 blur-xl" />
                  <div className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">What you'll get</p>
                    {[
                      { icon: CurrencyDollarIcon, color: "text-orange-500 bg-orange-50", label: "Sell scenario", sub: "Net cash today + 5 & 10-yr investment projection" },
                      { icon: HomeModernIcon, color: "text-blue-500 bg-blue-50", label: "Rent scenario", sub: "Monthly cash flow + equity buildup over time" },
                      { icon: ChartBarIcon, color: "text-purple-500 bg-purple-50", label: "Visual comparison", sub: "Bar chart showing which option wins at 5 and 10 years" },
                      { icon: SparklesIcon, color: "text-green-500 bg-green-50", label: "Personalized verdict", sub: "Clear recommendation with a follow-up path" },
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
            )}
          </div>
        </div>
      </section>

      <Footer />
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </div>
  );
}

export default function RentVsBuyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-400/30 border-t-blue-500 animate-spin" />
      </div>
    }>
      <RentVsBuyPageInner />
    </Suspense>
  );
}
