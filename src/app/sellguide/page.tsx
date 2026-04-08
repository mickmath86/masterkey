"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import { GooglePlacesInput } from "@/components/ui/google-places-input";
import LandingPageV6 from "@/components/landing-pages/landing-page-v6/page";
import {
  CheckCircleIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HomeModernIcon,
  ClockIcon,
} from "@heroicons/react/16/solid";
import posthog from "posthog-js";
import { useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────
// DEV OVERRIDE — uncomment ONE line below to
// force a specific variant in localhost:
// ─────────────────────────────────────────────
// posthog.featureFlags.overrideFeatureFlags({ flags: { 'sell-guide-landing-page-campaign': 'test' } })
// posthog.featureFlags.overrideFeatureFlags({ flags: { 'sell-guide-landing-page-campaign': 'control' } })

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/wi5kuxoR9mbMghJUaVMm";

const MARKETS = [
  { label: "Thousand Oaks",    value: "thousand-oaks",    file: "/downloadables/sellguides/thousand-oaks-sellers-checklist.pdf" },
  { label: "Ventura",          value: "ventura",           file: "/downloadables/sellguides/ventura-sellers-checklist.pdf" },
  { label: "Camarillo",        value: "camarillo",         file: "/downloadables/sellguides/camarillo-sellers-checklist.pdf" },
  { label: "Westlake Village", value: "westlake-village",  file: "/downloadables/sellguides/westlake-sellers-checklist.pdf" },
  { label: "Oxnard",           value: "oxnard",            file: "/downloadables/sellguides/oxnard-sellers-checklist.pdf" },
];

const WHAT_INSIDE = [
  "Pre-listing prep checklist — what to fix, what to skip",
  "Staging strategies that consistently add $20K–$50K in perceived value",
  "How to price your home to generate multiple offers",
  "Marketing your listing: photography, MLS timing, and social strategy",
  "Navigating offers, contingencies, and counter-offers",
  "Current market stats: sale-to-list ratio, DOM, and inventory",
  "Updated monthly so you always have the most current market data",
];

const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

function validatePhoneFormat(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required.";
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
  if (local.length !== 10) return "Please enter a valid 10-digit phone number.";
  if (local[0] === "0" || local[0] === "1") return "Please enter a valid phone number.";
  if (/^(\d)\1{9}$/.test(local) || local === "1234567890") return "Please enter a valid phone number.";
  return null;
}

// ═══════════════════════════════════════════════════════
// QUESTIONNAIRE — test variant only
// ═══════════════════════════════════════════════════════
interface QData {
  market: string;
  intent: "selling" | "exploring" | "";
  address: string;
  addressValid: boolean;
  timeline: string;
  reason: string;
  reasonOther: string;
  idealPrice: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}

const TIMELINE_OPTIONS = [
  { value: "asap",    label: "ASAP" },
  { value: "3-6mo",   label: "3–6 months" },
  { value: "6-12mo",  label: "6–12 months" },
  { value: "1yr",     label: "1+ year" },
  { value: "curious", label: "Just curious" },
];

const REASON_OPTIONS = [
  { value: "upsizing",   label: "Upsizing" },
  { value: "downsizing", label: "Downsizing" },
  { value: "relocation", label: "Relocating" },
  { value: "financial",  label: "Financial" },
  { value: "divorce",    label: "Divorce / Separation" },
  { value: "estate",     label: "Estate / Inherited" },
  { value: "other",      label: "Other" },
];

function SellGuideQuestionnaire({
  onComplete,
}: {
  onComplete: (data: QData) => void;
}) {
  const [step, setStep] = useState(0); // 0 = not started (hero)
  const [data, setData] = useState<QData>({
    market: "", intent: "", address: "", addressValid: false,
    timeline: "", reason: "", reasonOther: "", idealPrice: "",
    phone: "", email: "", firstName: "", lastName: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // steps for "selling" path:  1=market 2=intent 3=address 4=timeline 5=reason 6=price 7=phone 8=name
  // steps for "exploring" path: 1=market 2=intent 7=phone 8=name
  const isSelling = data.intent === "selling";

  function totalSteps() { return isSelling ? 8 : 4; }
  function displayStep() {
    // Map real step to display step for progress bar
    if (!isSelling && step >= 3) return step - 3; // exploring: step 7→2, 8→3, 9→4
    return step;
  }

  function set<K extends keyof QData>(k: K, v: QData[K]) {
    setData(d => ({ ...d, [k]: v }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.market !== "";
      case 2: return data.intent !== "";
      case 3: return data.addressValid;
      case 4: return data.timeline !== "";
      case 5: return data.reason !== "" && (data.reason !== "other" || data.reasonOther.trim() !== "");
      case 6: return true; // price optional
      case 7: return data.phone.trim() !== "" && !phoneError && data.email.trim() !== "" && emailRegex.test(data.email);
      case 8: return data.firstName.trim() !== "";
      default: return false;
    }
  }

  function next() {
    if (step === 2 && data.intent === "exploring") {
      setStep(7); // skip to phone
    } else {
      setStep(s => s + 1);
    }
  }

  function back() {
    if (step === 7 && data.intent === "exploring") {
      setStep(2); // back to intent
    } else {
      setStep(s => s - 1);
    }
  }

  function handlePhoneChange(v: string) {
    set("phone", v);
    if (v.trim()) {
      setPhoneError(validatePhoneFormat(v) ?? "");
    } else {
      setPhoneError("");
    }
  }

  function handleEmailChange(v: string) {
    set("email", v);
    if (v.trim() && !emailRegex.test(v)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Phone carrier validation
    if (data.phone.trim()) {
      try {
        const res = await fetch("/api/validate-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: data.phone }),
        });
        const result = await res.json();
        if (!result.valid) {
          setPhoneError(result.reason ?? "Please enter a valid phone number.");
          setIsSubmitting(false);
          return;
        }
      } catch { /* fail open */ }
    }

    // Email validation
    try {
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (!result.valid) {
        setEmailError(result.reason ?? "Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
    } catch { /* fail open */ }

    setIsSubmitting(false);
    onComplete(data);
  }

  // ── Step content ────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="flex flex-col items-start gap-6 w-full max-w-md">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-md shadow-orange-200 w-full sm:w-auto justify-center"
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          Get My Report
          <ArrowRightIcon className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-400">Free · No obligation · Takes 2 minutes</p>
      </div>
    );
  }

  // Progress bar
  const progress = Math.round((step / (isSelling ? 8 : 4)) * 100);

  return (
    <div className="w-full max-w-md">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Step {displayStep()} of {totalSteps()}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

        {/* ── Step 1: Market ── */}
        {step === 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Step 1</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Which market are you interested in?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll customize the report for your specific area.</p>
            <div className="grid grid-cols-1 gap-2">
              {MARKETS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => { set("market", m.value); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors ${
                    data.market === m.value
                      ? "border-orange-400 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50/50"
                  }`}
                >
                  <MapPinIcon className={`w-4 h-4 flex-shrink-0 ${data.market === m.value ? "text-orange-500" : "text-gray-300"}`} />
                  {m.label}
                  {data.market === m.value && <CheckCircleIcon className="w-4 h-4 text-orange-500 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Intent ── */}
        {step === 2 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Step 2</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Are you considering selling your home?</h3>
            <p className="text-sm text-gray-400 mb-4">This helps us personalize your report.</p>
            <div className="space-y-3">
              {[
                { value: "selling",   label: "Yes — I'm thinking about selling", icon: HomeModernIcon, sub: "We'll include pricing strategy and next steps" },
                { value: "exploring", label: "Not right now — just exploring",    icon: ChartBarIcon,   sub: "We'll send you the market report as-is" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("intent", opt.value as "selling" | "exploring")}
                  className={`w-full flex items-start gap-3 px-4 py-4 rounded-xl border text-left transition-colors ${
                    data.intent === opt.value
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                  }`}
                >
                  <opt.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${data.intent === opt.value ? "text-orange-500" : "text-gray-300"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${data.intent === opt.value ? "text-orange-700" : "text-gray-800"}`}>{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                  </div>
                  {data.intent === opt.value && <CheckCircleIcon className="w-4 h-4 text-orange-500 ml-auto mt-1 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Address (selling only) ── */}
        {step === 3 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Step 3</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What's the property address?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll pull recent comps and local data for your specific home.</p>
            <GooglePlacesInput
              id="q-address"
              value={data.address}
              onChange={(v) => set("address", v)}
              onValidationChange={(valid) => set("addressValid", valid)}
              placeholder="Start typing your address…"
              showValidation={true}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-orange-400 focus:border-orange-400"
            />
          </div>
        )}

        {/* ── Step 4: Timeline (selling only) ── */}
        {step === 4 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Step 4</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What's your selling timeline?</h3>
            <p className="text-sm text-gray-400 mb-4">This helps us tailor your market timing advice.</p>
            <div className="flex flex-wrap gap-2">
              {TIMELINE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => set("timeline", t.value)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    data.timeline === t.value
                      ? "border-orange-400 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-orange-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Reason (selling only) ── */}
        {step === 5 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Step 5</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">What's driving your move?</h3>
            <p className="text-sm text-gray-400 mb-4">Select the option that best fits your situation.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {REASON_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => set("reason", r.value)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    data.reason === r.value
                      ? "border-orange-400 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-orange-300"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {data.reason === "other" && (
              <input
                type="text"
                value={data.reasonOther}
                onChange={(e) => set("reasonOther", e.target.value)}
                placeholder="Please describe your reason…"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none mt-2"
              />
            )}
          </div>
        )}

        {/* ── Step 6: Ideal price (selling only, optional) ── */}
        {step === 6 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Step 6</p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Do you have an ideal price in mind?</h3>
            <p className="text-sm text-gray-400 mb-1">Optional — skip if you're not sure yet.</p>

            <input
              type="text"
              value={data.idealPrice}
              onChange={(e) => set("idealPrice", e.target.value)}
              placeholder="e.g. $950,000"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none mb-4"
            />

            {/* Home valuation upsell */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-orange-700 mb-2">
                Not sure? Our free home valuation tool can help.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Real-time MLS data & comparable sales",
                  "Property-specific analysis based on size & features",
                  "Instant results — no waiting, no email required",
                  "98% accuracy vs. recent sales",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-orange-600">
                    <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-orange-400 mt-2">
                We'll link you to the valuation tool after you get your report.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 7: Phone + Email ── */}
        {step === 7 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
              {isSelling ? "Step 7" : "Step 3"}
            </p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Where should we send your report?</h3>
            <p className="text-sm text-gray-400 mb-4">
              We'll also send you updated reports as the market changes — you can unsubscribe anytime.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(805) 555-0100"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
                    phoneError
                      ? "border-red-400 focus:ring-red-400 text-gray-900"
                      : "border-gray-300 focus:ring-orange-400 focus:border-orange-400 text-gray-900"
                  }`}
                />
                {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
                <p className="mt-1.5 text-[11px] text-gray-400">
                  By providing your number you agree to receive market updates via SMS. Msg &amp; data rates may apply.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="jane@example.com"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
                    emailError
                      ? "border-red-400 focus:ring-red-400 text-gray-900"
                      : "border-gray-300 focus:ring-orange-400 focus:border-orange-400 text-gray-900"
                  }`}
                />
                {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 8: Name ── */}
        {step === 8 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
              {isSelling ? "Step 8" : "Step 4"}
            </p>
            <h3 className="text-lg font-bold text-gray-950 mb-1">Last step — what's your name?</h3>
            <p className="text-sm text-gray-400 mb-4">We'll personalize your report with your name.</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Jane"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Smith"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center gap-3 pt-1">
          {step > 1 && (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 8 ? (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="ml-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {step === 6 ? (data.idealPrice.trim() ? "Continue" : "Skip for now") : "Continue"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance() || isSubmitting}
              className="ml-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              <ClipboardDocumentListIcon className="w-4 h-4" />
              {isSubmitting ? "Getting your report…" : "Get My Report →"}
            </button>
          )}
        </div>

        {step === 8 && (
          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            No spam, ever. We will never sell your information.
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
export default function SellGuidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [variant, setVariant] = useState<"control" | "test" | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    // URL param override: ?__variant=test or ?__variant=control
    const urlOverride = searchParams.get("__variant");
    if (urlOverride === "test" || urlOverride === "control") {
      setVariant(urlOverride);
      return;
    }
    const flag = posthog.getFeatureFlag("sell-guide-landing-page-campaign");
    setVariant(flag === "test" ? "test" : "control");
  }, []);

  useEffect(() => {
    const handler = () => setCalendarOpen(true);
    window.addEventListener("openCalendarModal", handler);
    return () => window.removeEventListener("openCalendarModal", handler);
  }, []);

  // ── Control variant form state ─────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", market: "", propertyAddress: "",
  });
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isValid() {
    return (
      Boolean(form.firstName.trim()) &&
      Boolean(form.email.trim()) &&
      emailRegex.test(form.email) &&
      form.market !== "" &&
      addressValid &&
      form.phone.trim() !== "" &&
      !phoneError
    );
  }

  function handleEmailChange(v: string) {
    setForm(f => ({ ...f, email: v }));
    setEmailError(v.trim() && !emailRegex.test(v) ? "Please enter a valid email address" : "");
  }

  function handlePhoneChange(v: string) {
    setForm(f => ({ ...f, phone: v }));
    setPhoneError(validatePhoneFormat(v) ?? "");
  }

  async function handleControlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid() || isSubmitting) return;
    setIsSubmitting(true);

    if (form.phone.trim()) {
      try {
        const res = await fetch("/api/validate-phone", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: form.phone }) });
        const result = await res.json();
        if (!result.valid) { setPhoneError(result.reason ?? "Please enter a valid phone number."); setIsSubmitting(false); return; }
      } catch { /* fail open */ }
    }

    try {
      const res = await fetch("/api/validate-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email }) });
      const result = await res.json();
      if (!result.valid) { setEmailError(result.reason ?? "Please enter a valid email address."); setIsSubmitting(false); return; }
    } catch { /* fail open */ }

    const selectedMarket = MARKETS.find(m => m.value === form.market);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName, phone: form.phone,
          email: form.email, market: form.market, marketName: selectedMarket?.label ?? form.market,
          propertyAddress: form.propertyAddress, formType: "seller-guide",
          source: "sellguide-page", variant: "control",
          downloadable: `sellers-checklist-${form.market}`,
          assetUrl: selectedMarket ? `https://www.usemasterkey.com${selectedMarket.file}` : "",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch { /* fail open */ }

    setIsSubmitting(false);
    const params = new URLSearchParams({
      market: form.market,
      ...(form.firstName.trim() && { name: form.firstName.trim() }),
      ...(form.propertyAddress.trim() && { address: form.propertyAddress.trim() }),
    });
    router.push(`/sellguide/confirmation?${params.toString()}`);
  }

  // ── Test variant questionnaire completion ──────────────────────────────────
  async function handleQComplete(data: QData) {
    const selectedMarket = MARKETS.find(m => m.value === data.market);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName, lastName: data.lastName,
          phone: data.phone, email: data.email,
          market: data.market, marketName: selectedMarket?.label ?? data.market,
          propertyAddress: data.address,
          sellingIntent: data.intent,
          timeline: data.timeline,
          movingReason: data.reason === "other" ? data.reasonOther : data.reason,
          idealPrice: data.idealPrice,
          formType: "seller-guide",
          source: "sellguide-page",
          variant: "test",
          downloadable: `sellers-checklist-${data.market}`,
          assetUrl: selectedMarket ? `https://www.usemasterkey.com${selectedMarket.file}` : "",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch { /* fail open */ }

    const params = new URLSearchParams({
      market: data.market,
      ...(data.firstName.trim() && { name: data.firstName.trim() }),
      ...(data.address.trim() && { address: data.address.trim() }),
    });
    router.push(`/sellguide/confirmation?${params.toString()}`);
  }

  // ── Shared hero media ─────────────────────────────────────────────────────
  function HeroMedia() {
    return (
      <div className="flex justify-center lg:justify-end items-center">
        <div className="relative w-full">
          <div className="absolute -inset-1 rounded-xl bg-orange-400/15 blur-xl" />
          <img
            src="/images/sellguide-hero.png"
            alt="Seller's Market Report & Checklist"
            className="relative w-full rounded-xl shadow-xl border border-gray-200 object-cover lg:hidden"
            style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
          />
          <video
            autoPlay loop muted playsInline
            className="relative hidden lg:block w-96 h-[600px] rounded-xl shadow-xl border border-gray-200 object-cover"
            style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
          >
            <source src="/video/portrait-sellers-checklist-cover-lg.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }

  // ── Shared headline / badge ───────────────────────────────────────────────
  function HeroHeadline() {
    return (
      <>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full mb-6">
          <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          Free {new Date().toLocaleDateString("en-US", { month: "long" })} Edition
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-4">
          Your{" "}
          <span className="relative font-bold text-orange-400">
            <svg aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-3 w-full" viewBox="0 0 283 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332" stroke="url(#paint0_linear_sg)" strokeWidth="4" />
              <defs>
                <linearGradient id="paint0_linear_sg" x1="282" y1="5.49999" x2="40" y2="13" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--color-orange-400)" />
                  <stop offset="1" stopColor="var(--color-amber-300)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="relative">Ventura County</span>
          </span>{" "}
          <span className="italic">Sellers Market Report <span className="text-3xl italic">&amp; Checklist</span></span>
        </h1>
      </>
    );
  }

  // ── CONTROL variant ────────────────────────────────────────────────────────
  if (variant !== "test") {
    return (
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-white pb-0 border-b border-gray-100">
          <NavbarMinimal theme="light" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-400/8 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-400/6 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
            {/* Mobile: col (text → image), Desktop: 2-col grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
              <div className="py-1 lg:py-20">
                <HeroHeadline />
                <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                  Your complete guide to selling your home for top dollar — from prep and staging to closing with confidence. Choose your market below.
                </p>

                {/* Control form */}
                <form onSubmit={handleControlSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name <span className="text-red-400">*</span></label>
                      <input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Jane" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                      <input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Smith" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                    <input type="tel" value={form.phone} onChange={e => handlePhoneChange(e.target.value)} placeholder="(805) 555-0100" className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none bg-white ${phoneError ? "border-red-400 focus:ring-red-400 text-gray-900" : "border-gray-300 focus:ring-orange-400 focus:border-orange-400 text-gray-900"}`} />
                    {phoneError && <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                    <input type="email" value={form.email} onChange={e => handleEmailChange(e.target.value)} placeholder="jane@example.com" required className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none bg-white ${emailError ? "border-red-400 focus:ring-red-400 text-gray-900" : "border-gray-300 focus:ring-orange-400 focus:border-orange-400 text-gray-900"}`} />
                    {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Which market? <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={form.market} onChange={e => { setForm(f => ({ ...f, market: e.target.value, propertyAddress: "" })); setAddressValid(false); }} required className="w-full appearance-none px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none cursor-pointer">
                        <option value="" disabled>Select a market…</option>
                        {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40" />
                    </div>
                  </div>
                  {form.market && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Property Address <span className="text-red-400">*</span></label>
                      <GooglePlacesInput id="control-address" value={form.propertyAddress} onChange={v => setForm(f => ({ ...f, propertyAddress: v }))} onValidationChange={v => setAddressValid(v)} placeholder="Start typing your address…" showValidation={true} className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-orange-400 focus:border-orange-400" />
                      <p className="mt-1.5 text-[11px] text-gray-400">Enter the address of the home you're thinking of selling.</p>
                    </div>
                  )}
                  <button id="sell-submit" type="submit" disabled={!isValid() || isSubmitting} className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-sm shadow-orange-200">
                    <ClipboardDocumentListIcon className="w-4 h-4" />
                    {isSubmitting ? "Opening your checklist…" : "Get the Seller's Prep Checklist — Free"}
                  </button>
                  <p className="text-xs text-center leading-relaxed text-gray-400">No spam, ever. We will never sell your information.</p>
                </form>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">What's inside</p>
                <ul className="space-y-2.5">
                  {WHAT_INSIDE.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <HeroMedia />
            </div>
          </div>
        </section>
        <BottomSection />
        <LandingPageV6 />
        <Footer />
        {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
      </div>
    );
  }

  // ── TEST variant — questionnaire hero ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white pb-0 border-b border-gray-100">
        <NavbarMinimal theme="light" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-400/6 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          {/* Mobile: col (text → questionnaire → image), Desktop: 2-col grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-start lg:items-center">
            <div className="py-6 lg:py-20">
              <HeroHeadline />
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Your complete guide to selling your home for top dollar — personalized for your market. Takes 2 minutes.
              </p>
              <SellGuideQuestionnaire onComplete={handleQComplete} />
            </div>
            {/* Image below CTA on mobile, right column on desktop */}
            <HeroMedia />
          </div>
        </div>
      </section>
      <BottomSection />
      <LandingPageV6 />
      <Footer />
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
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
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe src={CALENDAR_SRC} style={{ width: "100%", height: "750px", border: "none" }} scrolling="yes" id="sellguide-calendar" title="Schedule Appointment" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared bottom sections ───────────────────────────────────────────────────
function BottomSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-2xl font-bold text-gray-950 mb-3">Built for Ventura County sellers</h2>
        <p className="text-gray-500 text-sm mb-10 max-w-xl mx-auto">
          Generic advice loses money. This checklist is built around what actually moves homes in your specific market.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: ClipboardDocumentListIcon, title: "Pre-Listing Checklist", desc: "A prioritized list of repairs, touch-ups, and improvements that deliver the best return before you list." },
            { icon: CurrencyDollarIcon, title: "Pricing Strategy", desc: "How to price for maximum interest, multiple offers, and a fast close at or above asking." },
            { icon: ChartBarIcon, title: "Live Market Context", desc: "2026 sale-to-list ratios, days on market, and inventory data specific to your chosen market." },
          ].map(item => (
            <div key={item.title} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-left">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-950 text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-orange-500" />No spam, ever</span>
          <span className="flex items-center gap-1.5"><ClipboardDocumentListIcon className="w-4 h-4 text-orange-500" />View instantly in your browser</span>
          <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4 text-orange-500" />Market-specific data</span>
        </div>
      </div>
    </section>
  );
}
