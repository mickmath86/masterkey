"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import { QUESTIONS } from "@/lib/pricing-strategy/questions";
import type { AssessmentResponse } from "@/lib/pricing-strategy/types";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import { Suspense } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ─── STEP CONSTANTS ────────────────────────────────────────────────────────
// 0 = landing, 1–N = questions, N+1 = email gate, N+2 = submitting/done
const Q_START = 1;
const Q_END   = QUESTIONS.length;
const GATE    = QUESTIONS.length + 1;

// ─── LANDING SECTION ─────────────────────────────────────────────────────────
function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarMinimal theme="light" />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full">
            MasterKey · Conejo Valley
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
            What pricing strategy is right for your home?
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Your home's ideal list price isn't just a number — it's a strategy. 
            This short assessment helps you think through timing, condition, and your priorities 
            so you can approach the market with clarity and confidence.
          </p>

          {/* Benefits */}
          <ul className="space-y-3 text-left max-w-md mx-auto">
            {[
              "Understand which pricing approach fits your situation",
              "See the key risks to avoid based on your answers",
              "Get a tailored strategy summary you can save and revisit",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base shadow-sm"
          >
            Start the Assessment
            <ArrowRightIcon className="w-4 h-4" />
          </button>

          <p className="text-xs text-gray-400">
            8 questions · Under 2 minutes · No sales pitch
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── QUESTION STEP ────────────────────────────────────────────────────────────
function QuestionStep({
  step,
  responses,
  onAnswer,
  onBack,
}: {
  step: number;
  responses: Record<string, AssessmentResponse>;
  onAnswer: (resp: AssessmentResponse) => void;
  onBack: () => void;
}) {
  const qIndex  = step - Q_START;
  const question = QUESTIONS[qIndex];
  if (!question) return null;

  const current = responses[question.id];
  const progress = Math.round((step / (Q_END + 1)) * 100);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarMinimal theme="light" />

      {/* Progress */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gray-950 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12">
        <div className="w-full max-w-xl space-y-8">
          {/* Step counter */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Question {qIndex + 1} of {Q_END}
          </p>

          {/* Question */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950 leading-snug">
            {question.label}
            {question.optional && (
              <span className="ml-2 text-base font-normal text-gray-400">(optional)</span>
            )}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onAnswer({
                    questionId:    question.id,
                    questionLabel: question.label,
                    answerValue:   opt.value,
                    answerLabel:   opt.label,
                  });
                }}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl border text-left transition-all group ${
                  current?.answerValue === opt.value
                    ? "border-gray-950 bg-gray-950 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="text-base font-medium leading-snug">{opt.label}</span>
                <ChevronRightIcon
                  className={`w-4 h-4 flex-shrink-0 ${
                    current?.answerValue === opt.value ? "text-white" : "text-gray-300 group-hover:text-gray-500"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL GATE ───────────────────────────────────────────────────────────────
function EmailGate({
  responses,
  onSubmit,
  submitting,
}: {
  responses: Record<string, AssessmentResponse>;
  onSubmit: (lead: {
    firstName: string; email: string; phone?: string;
    propertyAddress?: string; cityOrZip?: string;
  }) => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState({
    firstName: "", email: "", phone: "", propertyAddress: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cityOrZip = responses["city-zip"]?.answerLabel ?? "";

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!validateEmail(form.email)) e.email = "Please enter a valid email address";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({
      firstName:       form.firstName.trim(),
      email:           form.email.trim(),
      phone:           form.phone.trim() || undefined,
      propertyAddress: form.propertyAddress.trim() || undefined,
      cityOrZip:       cityOrZip || undefined,
    });
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-950 focus:border-gray-950 focus:outline-none bg-white";
  const errCls   = "w-full px-4 py-3 border border-red-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none bg-white";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarMinimal theme="light" />
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Preview value */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Your strategy is ready
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Based on your answers, we've identified a tailored pricing approach for your situation.
            </p>
            <p className="text-sm text-gray-500">
              Enter your name and email below to see your full strategy summary and get a shareable link you can revisit anytime.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane"
                className={errors.firstName ? errCls : inputCls}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@example.com"
                className={errors.email ? errCls : inputCls}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="(805) 555-0100"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Property Address <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.propertyAddress}
                onChange={e => setForm(f => ({ ...f, propertyAddress: e.target.value }))}
                placeholder="123 Oak Street, Thousand Oaks"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-xl transition-colors text-base"
            >
              {submitting ? "Saving your results…" : "View My Pricing Strategy"}
              {!submitting && <ArrowRightIcon className="w-4 h-4" />}
            </button>
            <p className="text-xs text-gray-400 text-center">
              We'll email your strategy report. No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function PricingStrategyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep]       = useState(0);
  const [responses, setResponses] = useState<Record<string, AssessmentResponse>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Capture UTM params
  const utmRef = useRef({
    utmSource:   searchParams.get("utm_source")   ?? undefined,
    utmMedium:   searchParams.get("utm_medium")   ?? undefined,
    utmCampaign: searchParams.get("utm_campaign") ?? undefined,
    utmTerm:     searchParams.get("utm_term")     ?? undefined,
    utmContent:  searchParams.get("utm_content")  ?? undefined,
  });

  // Scroll to top on step change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  function handleAnswer(resp: AssessmentResponse) {
    setResponses(prev => ({ ...prev, [resp.questionId]: resp }));
    // Auto-advance to next step after brief delay for visual feedback
    setTimeout(() => setStep(s => s + 1), 220);
  }

  async function handleSubmit(lead: {
    firstName: string; email: string; phone?: string;
    propertyAddress?: string; cityOrZip?: string;
  }) {
    setSubmitting(true);
    setError(null);

    const payload = {
      lead,
      responses: Object.values(responses),
      sourcePath: "/pricing-strategy",
      ...utmRef.current,
    };

    try {
      const res = await fetch("/api/assessments/pricing-strategy/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.reportToken) {
        throw new Error(data.error ?? "Submission failed");
      }
      router.push(`/pricing-strategy/report/${data.reportToken}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  if (step === 0) return <Landing onStart={() => setStep(1)} />;

  if (step >= Q_START && step <= Q_END) {
    return (
      <QuestionStep
        step={step}
        responses={responses}
        onAnswer={handleAnswer}
        onBack={() => setStep(s => Math.max(0, s - 1))}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}
      <EmailGate
        responses={responses}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </>
  );
}

export default function PricingStrategyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-950 animate-spin" />
      </div>
    }>
      <PricingStrategyInner />
    </Suspense>
  );
}
