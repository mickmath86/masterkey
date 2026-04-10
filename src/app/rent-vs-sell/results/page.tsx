"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import {
  CurrencyDollarIcon,
  HomeModernIcon,
  ScaleIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  InformationCircleIcon,
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
import { type RVSFormData, type CalcResults, DEFAULTS, CALENDAR_SRC } from "../page";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtSigned(n: number) {
  const s = fmt(Math.abs(n));
  return n >= 0 ? `+${s}` : `−${s}`;
}

const VERDICT_CONFIG = {
  sell: {
    label: "Selling likely wins over 10 years",
    accent: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    bar: "#2563eb",
    cta: "Ready to list? Let's talk strategy.",
    ctaSub: "We'll pull a custom CMA and walk you through your net proceeds.",
    btnClass: "bg-blue-600 hover:bg-blue-500",
  },
  rent: {
    label: "Renting likely builds more wealth over 10 years",
    accent: "text-green-600",
    bg: "bg-green-50 border-green-200",
    bar: "#16a34a",
    cta: "MasterKey Property Management handles everything.",
    ctaSub: "Full-service management at 9% — passive income without the headaches.",
    btnClass: "bg-green-600 hover:bg-green-500",
  },
  close: {
    label: "It's close — the right answer depends on your goals",
    accent: "text-blue-600",
    bg: "bg-blue-50/60 border-blue-200",
    bar: "#3b82f6",
    cta: "Let's walk through the numbers together.",
    ctaSub: "A 15-minute call often makes the decision clear.",
    btnClass: "bg-blue-600 hover:bg-blue-500",
  },
};

function Row({ label, value, neg, bold, info }: { label: string; value: string; neg?: boolean; bold?: boolean; info?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs leading-relaxed ${bold ? "font-semibold text-gray-900" : "text-gray-500"} flex items-center gap-1 flex-wrap`}>
          {label}
          {info && (
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="flex-shrink-0 focus:outline-none"
              aria-label="More information"
            >
              <InformationCircleIcon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${open ? "text-blue-400" : "text-gray-300 hover:text-gray-400"}`} />
            </button>
          )}
        </span>
        <span className={`text-xs font-medium flex-shrink-0 ${bold ? "text-gray-900 font-bold" : neg ? "text-red-500" : "text-gray-700"}`}>{value}</span>
      </div>
      {info && open && (
        <div className="text-[11px] text-gray-500 leading-relaxed bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-0.5">
          {info}
        </div>
      )}
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
              <p className="text-xs text-gray-400 mt-0.5">Let's walk through your numbers — no obligation.</p>
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
// RESULTS INNER
// ═══════════════════════════════════════════════════════════════════════════════
function ResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);

  let form: RVSFormData | null = null;
  let results: CalcResults | null = null;

  try {
    const raw = searchParams.get("d");
    if (raw) {
      const parsed = JSON.parse(atob(raw));
      form = parsed.form;
      results = parsed.results;
    }
  } catch { /* invalid params */ }

  if (!form || !results) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-gray-500 text-sm">No analysis data found.</p>
        <button onClick={() => router.push("/rent-vs-sell")} className="flex items-center gap-2 text-blue-600 hover:text-blue-500 text-sm font-medium">
          <ArrowLeftIcon className="w-4 h-4" />Back to the analysis
        </button>
      </div>
    );
  }

  const v = VERDICT_CONFIG[results.verdict10yr];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarMinimal theme="light" />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10">

        {/* Back link */}
        <button onClick={() => router.push("/rent-vs-sell")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8">
          <ArrowLeftIcon className="w-4 h-4" />Run a new analysis
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-4">
            <ScaleIcon className="w-3.5 h-3.5" />
            Your Sell vs. Rent Analysis
          </div>
          <h1 className="text-3xl font-bold text-gray-950 leading-tight mb-2">
            {form.firstName ? `${form.firstName}'s` : "Your"} personalized analysis
          </h1>
          <p className="text-gray-400 text-sm">{form.address} · Based on {form.titleOwnership === "multiple" ? "joint ownership" : "single ownership"} · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>

        {/* Verdict banner */}
        <div className={`rounded-2xl border p-5 mb-6 flex items-start gap-4 ${v.bg}`}>
          <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <ScaleIcon className={`w-5 h-5 ${v.accent}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-base ${v.accent}`}>{v.label}</p>
            <p className="text-sm text-gray-600 mt-1">
              Selling + investing nets <span className="font-semibold">{fmt(results.saleInvested10yr)}</span> vs.
              renting builds <span className="font-semibold">{fmt(results.rentTotalWealth10yr)}</span> over 10 years.
              {" "}Difference: <span className="font-semibold">{fmtSigned(results.saleInvested10yr - results.rentTotalWealth10yr)}</span>.
            </p>
            <button onClick={() => setCalendarOpen(true)} className={`mt-3 inline-flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm ${v.btnClass}`}>
              <CalendarDaysIcon className="w-3.5 h-3.5" />
              {v.cta}
            </button>
            <p className="text-[11px] text-gray-400 mt-1.5">{v.ctaSub}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 mb-1">Total wealth comparison</p>
          <p className="text-xs text-gray-400 mb-4">Net proceeds invested at 7%/yr (Sell) vs. cumulative equity + cash flow (Rent)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `$${v}K`} />
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}K`, name]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Sell" fill="#2563eb" radius={[4, 4, 0, 0]} name="Sell + Invest" />
              <Bar dataKey="Rent" fill="#16a34a" radius={[4, 4, 0, 0]} name="Rent + Equity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 5yr summary strip */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">At 5 Years</p>
            <p className={`text-xs font-semibold mb-1 ${results.verdict5yr === "sell" ? "text-blue-600" : results.verdict5yr === "rent" ? "text-green-600" : "text-gray-600"}`}>
              {results.verdict5yr === "sell" ? "Sell wins" : results.verdict5yr === "rent" ? "Rent wins" : "It's close"}
            </p>
            <p className="text-xs text-gray-500">Sell: <strong>{fmt(results.saleInvested5yr)}</strong></p>
            <p className="text-xs text-gray-500">Rent: <strong>{fmt(results.rentTotalWealth5yr)}</strong></p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">At 10 Years</p>
            <p className={`text-xs font-semibold mb-1 ${results.verdict10yr === "sell" ? "text-blue-600" : results.verdict10yr === "rent" ? "text-green-600" : "text-gray-600"}`}>
              {results.verdict10yr === "sell" ? "Sell wins" : results.verdict10yr === "rent" ? "Rent wins" : "It's close"}
            </p>
            <p className="text-xs text-gray-500">Sell: <strong>{fmt(results.saleInvested10yr)}</strong></p>
            <p className="text-xs text-gray-500">Rent: <strong>{fmt(results.rentTotalWealth10yr)}</strong></p>
          </div>
        </div>

        {/* Two-column detail */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">

          {/* Sell */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">Sell Scenario</p>
            </div>
            <div className="space-y-2.5">
              <Row label="Estimated sale price" value={fmt(results.salePrice)} />
              <Row label="Agent commission (5.5%)" value={`−${fmt(results.agentFee)}`} neg info="Typical seller-paid agent commission in Ventura County, covering both listing and buyer's agent fees. This is negotiable — MasterKey's commission structure may differ." />
              <Row label="Closing costs + staging" value={`−${fmt(results.closingAndStagingCosts)}`} neg info="Closing costs include escrow fees, title insurance, transfer tax, and misc. seller costs (~1% of sale price). Staging is estimated at $3,500 — actual cost depends on home size and condition." />
              <Row label="Mortgage payoff" value={`−${fmt(results.mortgagePayoff)}`} neg />
              <div className="border-t border-blue-200 pt-2">
                <Row label="Net proceeds (before tax)" value={fmt(results.saleNetProceeds)} bold />
              </div>
              <div className="bg-white/60 rounded-lg p-2.5 space-y-1.5">
                <p className="text-[11px] text-gray-500 font-medium mb-1">Capital gains tax (IRS Section 121)</p>
                <Row label="Total gain" value={fmt(results.capitalGain)} />
                <Row
                  label={`Exclusion (${form!.titleOwnership === "multiple" ? "joint — $500K" : "single — $250K"})`}
                  value={`−${fmt(results.exclusion)}`}
                  info="Under IRS Section 121, homeowners who lived in the home as their primary residence for 2 of the last 5 years can exclude up to $250,000 (single filer) or $500,000 (married/joint) of capital gains from federal tax. State taxes may still apply."
                />
                <Row label="Taxable gain" value={fmt(results.taxableGain)} />
                <Row label="Cap gains tax (15%)" value={results.capitalGainsTax > 0 ? `−${fmt(results.capitalGainsTax)}` : "$0"} neg={results.capitalGainsTax > 0} />
              </div>
              <div className="border-t border-blue-200 pt-2">
                <Row label="Net cash in pocket (after tax)" value={fmt(results.saleAfterTax)} bold />
              </div>
              <div className="bg-white/60 rounded-lg p-2.5 space-y-1">
                <p className="text-[11px] text-gray-500 font-medium mb-1">If you invest at 7%/yr:</p>
                <Row label="After 5 years" value={fmt(results.saleInvested5yr)} />
                <Row label="After 10 years" value={fmt(results.saleInvested10yr)} bold />
              </div>
            </div>
          </div>

          {/* Rent */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                <HomeModernIcon className="w-4 h-4 text-green-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">Rent Scenario</p>
            </div>
            <div className="space-y-2.5">
              <Row label="Est. monthly rent (VC avg)" value={`${fmt(results.monthlyRent)}/mo`} info="Based on Thousand Oaks single-family rental averages. Your home's actual rent may be higher based on upgrades, lot size, and condition. Contact MasterKey for a personalized rental analysis." />
              <div className="bg-white/60 rounded-lg p-2.5 space-y-1.5">
                <p className="text-[11px] text-gray-500 font-medium mb-1">Monthly expenses</p>
                {results.monthlyMortgage > 0 && <Row label="Mortgage P&I" value={`−${fmt(results.monthlyMortgage)}/mo`} neg />}
                <Row label="Property tax (0.7%)" value={`−${fmt(results.monthlyPropertyTax)}/mo`} neg />
                <Row label="Insurance" value={`−${fmt(results.monthlyInsurance)}/mo`} neg />
                <Row label="Mgmt fee (9%)" value={`−${fmt(results.monthlyMgmtFee)}/mo`} neg info="MasterKey charges 8–10% of monthly rent for full-service property management, including tenant screening, maintenance coordination, and monthly reporting. We used 9% (midpoint) here." />
                <Row label="Maintenance (1%/yr)" value={`−${fmt(results.monthlyMaintenance)}/mo`} neg />
                <Row label="Vacancy reserve (5%)" value={`−${fmt(results.monthlyVacancy)}/mo`} neg />
              </div>
              <div className="border-t border-green-200 pt-2">
                <Row
                  label="Monthly cash flow"
                  value={`${results.monthlyCashFlow >= 0 ? "+" : "−"}${fmt(Math.abs(results.monthlyCashFlow))}/mo`}
                  bold
                  neg={results.monthlyCashFlow < 0}
                />
              </div>
              <div className="bg-white/60 rounded-lg p-2.5 space-y-1">
                <p className="text-[11px] text-gray-500 font-medium mb-1">Total wealth (equity + cash flow + 4.5%/yr appreciation):</p>
                <Row label="After 5 years" value={fmt(results.rentTotalWealth5yr)} />
                <Row label="After 10 years" value={fmt(results.rentTotalWealth10yr)} bold />
              </div>
            </div>
          </div>
        </div>

        {/* Assumptions */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-xs text-gray-400 leading-relaxed mb-6 shadow-sm">
          <p className="font-semibold text-gray-500 mb-1.5">Assumptions &amp; methodology</p>
          <p>
            <strong className="text-gray-600">Capital gains (IRS Section 121):</strong> Exclusion of{" "}
            {form!.titleOwnership === "multiple" ? "$500,000 (joint ownership)" : "$250,000 (single owner)"}
            . Taxable gain taxed at 15% long-term rate (2025/2026 bracket for most California sellers, per IRS Publication 523 and Bankrate).
            Basis = original purchase price; improvements not factored in — actual tax may be lower.
          </p>
          <p className="mt-1.5">
            <strong className="text-gray-600">Rent scenario:</strong> Monthly rent {fmt(DEFAULTS.monthlyRent)} (Ventura County SFR avg) ·
            Property tax 0.7% · Insurance {fmt(DEFAULTS.annualInsurance)}/yr · Management 9% · Maintenance 1%/yr ·
            Vacancy 5% · Appreciation 4.5%/yr (historical Ventura County average).
          </p>
          <p className="mt-1.5 text-gray-300">
            This is an estimate for informational purposes only — not financial, tax, or legal advice.
            Consult a CPA and real estate attorney for your specific situation.
          </p>
        </div>

        {/* Final CTA */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
          <p className="font-semibold text-gray-900 mb-1">Want to talk through your numbers?</p>
          <p className="text-xs text-gray-400 mb-4">Mike and Mark are Ventura County brokers who can walk you through your exact situation — sell strategy or property management.</p>
          <button onClick={() => setCalendarOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm">
            <CalendarDaysIcon className="w-4 h-4" />
            Schedule a Free Consultation
          </button>
          <p className="text-[11px] text-gray-300 mt-3">No obligation · 15 minutes · Ventura County experts</p>
        </div>

      </div>

      <Footer />
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </div>
  );
}

export default function RentVsSellResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-400/30 border-t-blue-500 animate-spin" /></div>}>
      <ResultsInner />
    </Suspense>
  );
}
