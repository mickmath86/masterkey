"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  PrinterIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import type { ReportSummary } from "@/lib/pricing-strategy/types";

const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

// ─── Strategy color mapping ───────────────────────────────────────────────────
const STRATEGY_STYLE: Record<string, { accent: string; bg: string; border: string }> = {
  "price-for-speed": { accent: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200" },
  "price-at-market": { accent: "text-stone-700", bg: "bg-stone-50", border: "border-stone-200" },
  "price-to-test":   { accent: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  "prep-first":      { accent: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

// ─── Calendar Modal ───────────────────────────────────────────────────────────
function CalendarModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://link.msgsndr.com/js/form_embed.js";
    s.type = "text/javascript";
    document.body.appendChild(s);
    return () => {
      const el = document.querySelector(`script[src="${s.src}"]`);
      if (el) document.body.removeChild(el);
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll print:hidden">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Schedule a Pricing Consultation</h3>
              <p className="text-xs text-gray-400 mt-0.5">Discuss your strategy with a MasterKey advisor — no obligation.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe src={CALENDAR_SRC} style={{ width: "100%", height: "750px", border: "none" }} scrolling="yes" title="Schedule Consultation" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Report Content ───────────────────────────────────────────────────────────
function ReportContent({
  report,
  token,
  firstName,
}: {
  report: ReportSummary;
  token: string;
  firstName?: string;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const { strategyResult, derivedInsights, responses, generatedAt } = report;
  const style = STRATEGY_STYLE[strategyResult.strategyType] ?? STRATEGY_STYLE["price-at-market"];

  const formattedDate = new Date(generatedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <>
      <style>{`
        @media print {
          nav, footer, .print\\:hidden, button { display: none !important; }
          body { font-size: 12pt; color: #111; background: white; }
          .print-page { padding: 0; max-width: 100%; }
          .print-section { break-inside: avoid; margin-bottom: 1.5rem; }
          .print-header { border-bottom: 2px solid #111; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 print:bg-white">
        <div className="print:hidden">
          <NavbarMinimal theme="light" />
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 print:py-4 print-page">

          {/* Back + actions */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <button onClick={() => router.push("/pricing-strategy")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              Start a new assessment
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors"
            >
              <PrinterIcon className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>

          {/* Report header */}
          <div className="print-header print-section mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  MasterKey · Seller Strategy Assessment
                </p>
                <h1 className="text-3xl font-bold text-gray-950 leading-tight">
                  {firstName ? `${firstName}'s` : "Your"} Pricing Strategy Report
                </h1>
                <p className="text-sm text-gray-400 mt-1">Generated {formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Strategy result card */}
          <div className={`print-section rounded-2xl border p-6 mb-6 ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-3 mb-4">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${style.accent}`}>
                  Recommended Strategy
                </p>
                <h2 className={`text-2xl font-bold ${style.accent}`}>
                  {strategyResult.strategyLabel}
                </h2>
              </div>
              <span className={`ml-auto flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${style.border} ${style.accent}`}>
                {strategyResult.confidenceBand} fit
              </span>
            </div>
            <p className="text-base font-semibold text-gray-900 mb-3">{strategyResult.headline}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{strategyResult.rationale}</p>
          </div>

          {/* What this means */}
          <div className="print-section bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">What this means in practice</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{strategyResult.practicalMeaning}</p>
          </div>

          {/* Key risks + next steps — 2 col */}
          <div className="print-section grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Key risks to avoid</h3>
              <ul className="space-y-2">
                {strategyResult.keyRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended next steps</h3>
              <ul className="space-y-2">
                {strategyResult.nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Answer snapshot */}
          <div className="print-section bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Your assessment answers</h3>
            <div className="space-y-3">
              {responses.map((r) => (
                <div key={r.questionId} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <p className="text-xs text-gray-400 flex-1 min-w-0 leading-relaxed">{r.questionLabel}</p>
                  <p className="text-xs font-semibold text-gray-900 text-right flex-shrink-0 max-w-[40%]">{r.answerLabel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="print-section bg-stone-50 border border-stone-100 rounded-xl p-4 text-xs text-stone-500 leading-relaxed mb-8">
            <p className="font-semibold text-stone-600 mb-1">Disclaimer</p>
            {strategyResult.disclaimer}
          </div>

          {/* CTA */}
          <div className="print:hidden bg-white border border-gray-100 rounded-2xl p-6 text-center space-y-4">
            <p className="font-semibold text-gray-900">Ready to talk through your strategy?</p>
            <p className="text-sm text-gray-500">
              A MasterKey advisor can review your specific situation and give you a data-backed pricing recommendation — no cost, no obligation.
            </p>
            <button
              onClick={() => setCalendarOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
            >
              <CalendarDaysIcon className="w-4 h-4" />
              Schedule a Pricing Consultation
            </button>
            <p className="text-xs text-gray-400">
              Report link:{" "}
              <span className="font-mono text-gray-600">
                {typeof window !== "undefined" ? window.location.href : ""}
              </span>
            </p>
          </div>

          {/* Print footer */}
          <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400">
            <p>MasterKey Real Estate · Thousand Oaks, CA · DRE #01892427 · usemasterkey.com</p>
            <p className="mt-1">Report generated {formattedDate} · Token: {token}</p>
          </div>
        </div>

        <div className="print:hidden">
          <Footer />
        </div>
      </div>

      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token  = params.token ?? "";

  const [state, setState] = useState<"loading" | "found" | "notfound" | "error">("loading");
  const [report,    setReport]    = useState<ReportSummary | null>(null);
  const [firstName, setFirstName] = useState<string | undefined>();

  useEffect(() => {
    if (!token) { setState("notfound"); return; }

    fetch(`/api/assessments/pricing-strategy/report?token=${encodeURIComponent(token)}`)
      .then(async res => {
        if (res.status === 404 || res.status === 410) { setState("notfound"); return; }
        if (!res.ok) { setState("error"); return; }
        const data = await res.json();
        setReport(data.reportSummary);
        setFirstName(data.firstName ?? undefined);
        setState("found");
      })
      .catch(() => setState("error"));
  }, [token]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-gray-950 animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading your report…</p>
        </div>
      </div>
    );
  }

  if (state === "notfound" || state === "error") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <NavbarMinimal theme="light" />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Report not found</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            This report link may have expired or may not be valid. Start a new assessment to generate a fresh report.
          </p>
          <button
            onClick={() => router.push("/pricing-strategy")}
            className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
          >
            Start a new assessment
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return <ReportContent report={report!} token={token} firstName={firstName} />;
}
