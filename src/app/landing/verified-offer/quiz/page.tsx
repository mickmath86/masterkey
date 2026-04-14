"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  HomeModernIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/16/solid";

// ─── Webhook placeholder ──────────────────────────────────────────────────────
const WEBHOOK_URL = "VERIFIED_OFFER_WEBHOOK_PLACEHOLDER";

// ─── Phone validation ─────────────────────────────────────────────────────────
function validatePhoneFormat(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required.";
  const digits = phone.replace(/\D/g, "");
  const local =
    digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
  if (local.length !== 10) return "Please enter a valid 10-digit phone number.";
  if (local[0] === "0" || local[0] === "1")
    return "Please enter a valid phone number.";
  if (/^(\d)\1{9}$/.test(local) || local === "1234567890")
    return "Please enter a valid phone number.";
  return null;
}

// ─── Option data ──────────────────────────────────────────────────────────────
const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible", sub: "Ready to move quickly" },
  { value: "1-3mo", label: "1–3 months", sub: "Getting ready to list" },
  { value: "3-6mo", label: "3–6 months", sub: "Planning ahead" },
  { value: "6-12mo", label: "6–12 months", sub: "Exploring options" },
  { value: "1yr+", label: "1+ year", sub: "Just researching for now" },
];

const CONDITION_OPTIONS = [
  {
    value: "excellent",
    label: "Excellent",
    sub: "Move-in ready, updated throughout",
    icon: HomeModernIcon,
  },
  {
    value: "good",
    label: "Good",
    sub: "Well-maintained, minor updates needed",
    icon: CheckCircleIcon,
  },
  {
    value: "fair",
    label: "Fair",
    sub: "Needs some repairs or cosmetic work",
    icon: WrenchScrewdriverIcon,
  },
  {
    value: "needs-work",
    label: "Needs Work",
    sub: "Significant repairs or updates required",
    icon: WrenchScrewdriverIcon,
  },
];

const MOTIVATION_OPTIONS = [
  { value: "upsizing", label: "Upsizing", icon: ArrowTrendingUpIcon },
  { value: "downsizing", label: "Downsizing", icon: HomeModernIcon },
  { value: "relocation", label: "Relocating", icon: ArrowRightIcon },
  { value: "financial", label: "Financial reasons", icon: CurrencyDollarIcon },
  { value: "family", label: "Family change", icon: UserGroupIcon },
  { value: "lifestyle", label: "Lifestyle change", icon: HeartIcon },
  {
    value: "other",
    label: "Other",
    icon: EllipsisHorizontalCircleIcon,
  },
];

// ─── Form state ───────────────────────────────────────────────────────────────
interface QuizData {
  address: string;
  timeline: string;
  condition: string;
  motivation: string;
  motivationOther: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ INNER
// ═══════════════════════════════════════════════════════════════════════════════
function QuizInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address") ?? "";

  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>({
    address,
    timeline: "",
    condition: "",
    motivation: "",
    motivationOther: "",
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL = 5;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function set<K extends keyof QuizData>(k: K, v: QuizData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.timeline !== "";
      case 2: return data.condition !== "";
      case 3:
        return (
          data.motivation !== "" &&
          (data.motivation !== "other" || data.motivationOther.trim() !== "")
        );
      case 4:
        return data.phone.trim() !== "" && !phoneError;
      case 5:
        return (
          data.firstName.trim() !== "" &&
          data.email.trim() !== "" &&
          emailRegex.test(data.email) &&
          !emailError
        );
      default:
        return false;
    }
  }

  const progress = Math.round((step / TOTAL) * 100);

  // Auto-advance after selection on steps 1, 2, 3
  function selectAndAdvance<K extends keyof QuizData>(k: K, v: QuizData[K]) {
    set(k, v);
    if (k !== "motivation" || v !== "other") {
      setTimeout(() => setStep((s) => s + 1), 180);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Phone carrier validation
    try {
      const res = await fetch("/api/validate-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      const r = await res.json();
      if (!r.valid) {
        setPhoneError(r.reason ?? "Please enter a valid phone number.");
        setIsSubmitting(false);
        return;
      }
    } catch { /* fail open */ }

    // Email validation
    try {
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const r = await res.json();
      if (!r.valid) {
        setEmailError(r.reason ?? "Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
    } catch { /* fail open */ }

    // Fire webhook
    if (WEBHOOK_URL !== "VERIFIED_OFFER_WEBHOOK_PLACEHOLDER") {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
            propertyAddress: data.address,
            timeline: data.timeline,
            condition: data.condition,
            motivation:
              data.motivation === "other"
                ? data.motivationOther
                : data.motivation,
            formType: "verified-offer",
            source: "verified-offer-quiz",
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch { /* fail open */ }
    }

    setIsSubmitting(false);
    const params = new URLSearchParams({
      name: data.firstName,
      address: data.address,
    });
    router.push(`/landing/verified-offer/confirmation?${params.toString()}`);
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-input rounded-lg text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none bg-background";
  const inputErrCls =
    "w-full px-3 py-2.5 border border-red-400 rounded-lg text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-red-400 focus:outline-none bg-background";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <a
            href="/landing/verified-offer"
            className="flex items-center gap-2 text-sky-500 font-bold text-sm"
          >
            <HomeModernIcon className="w-4 h-4" />
            Verified Offer
          </a>
          <span className="text-xs text-muted-foreground">
            Step {step} of {TOTAL}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-sky-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Address pill */}
      {address && (
        <div className="max-w-lg mx-auto w-full px-6 pt-5">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <HomeModernIcon className="w-3.5 h-3.5 flex-shrink-0" />
            {address}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-lg space-y-6">

          {/* ══ STEP 1: TIMELINE ══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-2">
                  Step 1 of {TOTAL}
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  When are you looking to sell?
                </h2>
                <p className="text-sm text-muted-foreground">
                  This helps us match you with the right listing strategy.
                </p>
              </div>
              <div className="space-y-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => selectAndAdvance("timeline", opt.value)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                      data.timeline === opt.value
                        ? "border-sky-400 bg-sky-50"
                        : "border-border hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <ClockIcon
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        data.timeline === opt.value
                          ? "text-sky-500"
                          : "text-muted-foreground/40"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          data.timeline === opt.value
                            ? "text-sky-700"
                            : "text-foreground"
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opt.sub}
                      </p>
                    </div>
                    {data.timeline === opt.value && (
                      <CheckCircleIcon className="w-4 h-4 text-sky-500 ml-auto mt-0.5 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP 2: CONDITION ══ */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-2">
                  Step 2 of {TOTAL}
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  What condition is the property in?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Be honest — it helps us give you the most accurate picture.
                </p>
              </div>
              <div className="space-y-2">
                {CONDITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => selectAndAdvance("condition", opt.value)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                      data.condition === opt.value
                        ? "border-sky-400 bg-sky-50"
                        : "border-border hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <opt.icon
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        data.condition === opt.value
                          ? "text-sky-500"
                          : "text-muted-foreground/40"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          data.condition === opt.value
                            ? "text-sky-700"
                            : "text-foreground"
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opt.sub}
                      </p>
                    </div>
                    {data.condition === opt.value && (
                      <CheckCircleIcon className="w-4 h-4 text-sky-500 ml-auto mt-0.5 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP 3: MOTIVATION ══ */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-2">
                  Step 3 of {TOTAL}
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  What's motivating your move?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select the option that best fits your situation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {MOTIVATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      set("motivation", opt.value);
                      if (opt.value !== "other") {
                        setTimeout(() => setStep((s) => s + 1), 180);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                      data.motivation === opt.value
                        ? "border-sky-400 bg-sky-50 text-sky-700"
                        : "border-border text-foreground hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
              {data.motivation === "other" && (
                <div>
                  <input
                    type="text"
                    value={data.motivationOther}
                    onChange={(e) => set("motivationOther", e.target.value)}
                    placeholder="Tell us more…"
                    className={inputCls}
                  />
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!data.motivationOther.trim()}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Continue <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 4: PHONE ══ */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-2">
                  Step 4 of {TOTAL}
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  What's your phone number?
                </h2>
                <p className="text-sm text-muted-foreground">
                  One of our local experts will call you to walk through your
                  verified offer and next steps.
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => {
                    set("phone", e.target.value);
                    setPhoneError(
                      e.target.value.trim()
                        ? (validatePhoneFormat(e.target.value) ?? "")
                        : ""
                    );
                  }}
                  placeholder="(805) 555-0100"
                  className={phoneError ? inputErrCls : inputCls}
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-400">{phoneError}</p>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  By providing your number you agree we may contact you about
                  your property. No spam.
                </p>
              </div>
            </div>
          )}

          {/* ══ STEP 5: NAME + EMAIL ══ */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-2">
                  Step 5 of {TOTAL} — Last one!
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Almost done — tell us your name
                </h2>
                <p className="text-sm text-muted-foreground">
                  We'll personalize your offer summary and be in touch shortly.
                </p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground/70 mb-1.5">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      placeholder="Jane"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/70 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={data.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      placeholder="Smith"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => {
                      set("email", e.target.value);
                      setEmailError(
                        e.target.value.trim() &&
                          !emailRegex.test(e.target.value)
                          ? "Please enter a valid email"
                          : ""
                      );
                    }}
                    placeholder="jane@example.com"
                    className={emailError ? inputErrCls : inputCls}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-400">{emailError}</p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                No spam. Your information is never sold.
              </p>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center gap-3 pt-2">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back
              </button>
            )}

            {/* Steps 1/2/3 auto-advance — only show Continue if "other" is selected on step 3 */}
            {(step === 4 || step === 5) && (
              step < 5 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="ml-auto flex items-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Continue <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canAdvance() || isSubmitting}
                  className="ml-auto flex items-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {isSubmitting ? "Submitting…" : "Get My Verified Offer →"}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between text-xs text-muted-foreground/50">
          <span>MasterKey Real Estate · Thousand Oaks, CA</span>
          <span>DRE #01892427</span>
        </div>
      </footer>
    </div>
  );
}

export default function VerifiedOfferQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sky-200 border-t-sky-500 animate-spin" />
        </div>
      }
    >
      <QuizInner />
    </Suspense>
  );
}
