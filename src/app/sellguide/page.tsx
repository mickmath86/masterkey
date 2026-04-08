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
} from "@heroicons/react/16/solid";
import posthog from "posthog-js";

// ─────────────────────────────────────────────
// DEV OVERRIDE — uncomment ONE line below to
// force a specific variant in localhost:
// ─────────────────────────────────────────────
posthog.featureFlags.overrideFeatureFlags({ flags: { 'sell-guide-landing-page-campaign': 'test' } })
// posthog.featureFlags.overrideFeatureFlags({ flags: { 'sell-guide-landing-page-campaign': 'control' } })

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/wi5kuxoR9mbMghJUaVMm";

const MARKETS = [
  { label: "Thousand Oaks",  value: "thousand-oaks",   file: "/downloadables/sellguides/thousand-oaks-sellers-checklist.pdf" },
  { label: "Ventura",        value: "ventura",          file: "/downloadables/sellguides/ventura-sellers-checklist.pdf" },
  { label: "Camarillo",      value: "camarillo",        file: "/downloadables/sellguides/camarillo-sellers-checklist.pdf" },
  { label: "Westlake Village", value: "westlake-village", file: "/downloadables/sellguides/westlake-sellers-checklist.pdf" },
  { label: "Oxnard",         value: "oxnard",           file: "/downloadables/sellguides/oxnard-sellers-checklist.pdf" },
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

// Layer 1: client-side phone format check
function validatePhoneFormat(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required.";
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
  if (local.length !== 10) return "Please enter a valid 10-digit phone number.";
  if (local[0] === "0" || local[0] === "1") return "Please enter a valid phone number.";
  if (/^(\d)\1{9}$/.test(local) || local === "1234567890") return "Please enter a valid phone number.";
  return null;
}

const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

export default function SellGuidePage() {
  const router = useRouter();

  // Read PostHog experiment flag after mount (PostHog is client-only)
  const [variant, setVariant] = useState<"control" | "test" | null>(null);

  // GHL calendar modal
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Listen for custom event fired by child components (LandingPageV6 CTAs)
  useEffect(() => {
    const handler = () => setCalendarOpen(true);
    window.addEventListener("openCalendarModal", handler);
    return () => window.removeEventListener("openCalendarModal", handler);
  }, []);

  useEffect(() => {
    const flag = posthog.getFeatureFlag("sell-guide-landing-page-campaign");
    setVariant(flag === "test" ? "test" : "control");
  }, []);

  // Phone is optional in the 'test' variant
  const phoneRequired = variant !== "test";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    market: "",
    propertyAddress: "",
  });
  const [emailError, setEmailError]   = useState("");
  const [phoneError, setPhoneError]   = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isValid() {
    const phoneOk = phoneRequired
      ? form.phone.trim() !== "" && !phoneError
      : !phoneError; // still show format error if something was typed
    return (
      Boolean(form.firstName.trim()) &&
      Boolean(form.email.trim()) &&
      emailRegex.test(form.email) &&
      form.market !== "" &&
      addressValid &&
      phoneOk
    );
  }

  function handleEmailChange(v: string) {
    setForm((f) => ({ ...f, email: v }));
    if (v.trim() && !emailRegex.test(v)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }

  function handlePhoneChange(v: string) {
    setForm((f) => ({ ...f, phone: v }));
    // Only run format validation if phone is required OR something was typed
    if (phoneRequired || v.trim()) {
      const err = validatePhoneFormat(v);
      setPhoneError(err ?? "");
    } else {
      setPhoneError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid() || isSubmitting) return;

    setIsSubmitting(true);

    // Layer 2: carrier lookup (only when phone was provided)
    if (form.phone.trim()) {
      try {
        const res = await fetch("/api/validate-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: form.phone }),
        });
        const result = await res.json();
        if (!result.valid) {
          setPhoneError(result.reason ?? "Please enter a valid phone number.");
          setIsSubmitting(false);
          return;
        }
      } catch {
        // API unreachable — fail open, continue
      }
    }

    // Layer 3: email reputation check
    try {
      const emailRes = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const emailResult = await emailRes.json();
      if (!emailResult.valid) {
        setEmailError(emailResult.reason ?? "Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
    } catch {
      // API unreachable — fail open, continue
    }

    const selectedMarket = MARKETS.find((m) => m.value === form.market);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          market: form.market,
          marketName: selectedMarket?.label ?? form.market,
          propertyAddress: form.propertyAddress,
          formType: "seller-guide",
          source: "sellguide-page",
          variant: variant ?? "control",
          downloadable: `sellers-checklist-${form.market}`,
          assetUrl: selectedMarket
            ? `https://www.usemasterkey.com${selectedMarket.file}`
            : "",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch {
      // webhook failed — still redirect, lead data already validated
    }

    setIsSubmitting(false);
    const params = new URLSearchParams({
      market: form.market,
      ...(form.firstName.trim() && { name: form.firstName.trim() }),
    });
    router.push(`/sellguide/confirmation?${params.toString()}`);
  }

  // ─── Shared form JSX (used by both variants) ───────────────────────────────
  // Accepts theme-specific class strings so one form block serves both variants
  function renderForm({
    cardCls,
    labelCls,
    inputCls,
    inputErrCls,
    selectCls,
    btnCls,
    hintCls,
    placeholderTheme,
  }: {
    cardCls: string;
    labelCls: string;
    inputCls: string;
    inputErrCls: string;
    selectCls: string;
    btnCls: string;
    hintCls: string;
    placeholderTheme: string;
  }) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`${cardCls} rounded-2xl p-6 mb-8 space-y-4`}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              placeholder="Jane"
              required
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none ${inputCls}`}
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              placeholder="Smith"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none ${inputCls}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
            Phone{phoneRequired
              ? <> <span className="text-red-400">*</span></>
              : <span className={`font-normal ${hintCls}`}> (optional)</span>}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(805) 555-0100"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
              phoneError ? inputErrCls : inputCls
            }`}
          />
          {phoneError && (
            <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>
          )}
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="jane@example.com"
            required
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none ${
              emailError ? inputErrCls : inputCls
            }`}
          />
          {emailError && (
            <p className="text-red-400 text-xs mt-1">{emailError}</p>
          )}
        </div>

        {/* Market dropdown */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
            Which market are you interested in? <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={form.market}
              onChange={(e) => {
                setForm((f) => ({ ...f, market: e.target.value, propertyAddress: "" }));
                setAddressValid(false);
              }}
              required
              className={`w-full appearance-none px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none cursor-pointer ${selectCls}`}
            >
              <option value="" disabled>Select a market…</option>
              {MARKETS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40" />
          </div>
        </div>

        {/* Property address (revealed after market selected) */}
        {form.market && (
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
              Property Address <span className="text-red-400">*</span>
            </label>
            <GooglePlacesInput
              id="property-address"
              value={form.propertyAddress}
              onChange={(val) => setForm((f) => ({ ...f, propertyAddress: val }))}
              onValidationChange={(valid) => setAddressValid(valid)}
              placeholder="Start typing your property address…"
              showValidation={true}
              className={`${placeholderTheme} focus:ring-orange-400 focus:border-orange-400`}
            />
            <p className={`mt-1.5 text-[11px] ${hintCls}`}>
              Enter the address of the home you&apos;re thinking of selling.
            </p>
          </div>
        )}

        <button
          id="sell-submit"
          type="submit"
          disabled={!isValid() || isSubmitting}
          className={`w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-lg transition-colors text-sm ${btnCls}`}
        >
          <ClipboardDocumentListIcon className="w-4 h-4" />
          {isSubmitting ? "Opening your checklist…" : "Get the Seller\u2019s Prep Checklist — Free"}
        </button>

        <p className={`text-xs text-center leading-relaxed ${hintCls}`}>
          No spam, ever. We will never sell your information.
        </p>
      </form>
    );
  }

  // ─── CONTROL variant (dark — original) ────────────────────────────────────
  if (variant !== "test") {
    return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white pb-0 border-b border-gray-100">
        <NavbarMinimal theme="light" />
        {/* Subtle warm glows on light bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-400/6 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col-reverse lg:flex-row lg:grid lg:grid-cols-2 gap-12 items-center">
            <div className="py-1 lg:py-20">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full mb-6">
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                Free {new Date().toLocaleDateString('en-US', { month: 'long' })} Edition
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-4">
                Your <br />
                <span className="relative font-bold text-orange-400">
                                    <svg
                                        aria-hidden
                                        className="pointer-events-none absolute inset-x-0 -bottom-3 w-full"
                                        viewBox="0 0 283 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332"
                                            stroke="url(#paint0_linear_pl)"
                                            strokeWidth="4"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_pl"
                                                x1="282"
                                                y1="5.49999"
                                                x2="40"
                                                y2="13"
                                                gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--color-orange-400)" />
                                                <stop
                                                    offset="1"
                                                    stopColor="var(--color-amber-300)"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="relative">Ventura County</span>
                                </span>{' '}
                <span className="italic">Sellers Market Report <span className="text-3xl italic">&amp; Checklist</span></span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Your complete guide to selling your home for top dollar — from
                prep and staging to closing with confidence. Choose your market below.
              </p>

              {renderForm({
                cardCls: "bg-gray-50 border border-gray-200",
                labelCls: "text-gray-600",
                inputCls: "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-400",
                inputErrCls: "bg-white border-red-400 text-gray-900 placeholder-gray-400 focus:ring-red-400 focus:border-red-400",
                selectCls: "bg-white border-gray-300 text-gray-900",
                btnCls: "bg-orange-500 hover:bg-orange-400 text-white shadow-sm shadow-orange-200",
                hintCls: "text-gray-400",
                placeholderTheme: "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
              })}

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                What&apos;s inside
              </p>
              <ul className="space-y-2.5">
                {WHAT_INSIDE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end items-center  lg:pb-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-orange-400/15 blur-xl" />
                {/* Mobile image */}
                <img
                  src="/images/sellguide-hero.png"
                  alt="The Seller's Prep Checklist cover"
                  className="relative w-full rounded-xl shadow-xl border border-gray-200 object-cover lg:hidden"
                  style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
                />
                {/* Large screen video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative hidden lg:block w-96 h-[600px] rounded-xl shadow-xl border border-gray-200 object-cover"
                  style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
                >
                  <source src="/video/portrait-sellers-checklist-cover-lg.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
              </div>
            </div>
          </div>
        </div>
      </section>
      <BottomSection />
      <LandingPageV6 />
      <Footer />
    </div>
  );
  }

  // ─── TEST variant (light mode, phone optional) ─────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white pb-0 border-b border-gray-100">
        <NavbarMinimal theme="light" />
        {/* Subtle warm glows on light bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-400/6 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col-reverse lg:flex-row lg:grid lg:grid-cols-2 gap-12 items-center">
            <div className="py-1 lg:py-20">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full mb-6">
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                Free {new Date().toLocaleDateString('en-US', { month: 'long' })} Edition
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-4">
                Your <br />
                <span className="relative font-bold text-orange-400">
                                    <svg
                                        aria-hidden
                                        className="pointer-events-none absolute inset-x-0 -bottom-3 w-full"
                                        viewBox="0 0 283 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332"
                                            stroke="url(#paint0_linear_pl)"
                                            strokeWidth="4"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_pl"
                                                x1="282"
                                                y1="5.49999"
                                                x2="40"
                                                y2="13"
                                                gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--color-orange-400)" />
                                                <stop
                                                    offset="1"
                                                    stopColor="var(--color-amber-300)"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="relative">Ventura County</span>
                                </span>{' '}
                <span className="italic">Sellers Market Report <span className="text-3xl italic">&amp; Checklist</span></span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Your complete guide to selling your home for top dollar — from
                prep and staging to closing with confidence. Choose your market below.
              </p>

              {renderForm({
                cardCls: "bg-gray-50 border border-gray-200",
                labelCls: "text-gray-600",
                inputCls: "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-400",
                inputErrCls: "bg-white border-red-400 text-gray-900 placeholder-gray-400 focus:ring-red-400 focus:border-red-400",
                selectCls: "bg-white border-gray-300 text-gray-900",
                btnCls: "bg-orange-500 hover:bg-orange-400 text-white shadow-sm shadow-orange-200",
                hintCls: "text-gray-400",
                placeholderTheme: "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
              })}

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                What&apos;s inside
              </p>
              <ul className="space-y-2.5">
                {WHAT_INSIDE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end items-center lg:pb-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-orange-400/15 blur-xl" />
                {/* Mobile image */}
                <img
                  src="/images/sellguide-hero.png"
                  alt="The Seller's Prep Checklist cover"
                  className="relative w-full rounded-xl shadow-xl border border-gray-200 object-cover lg:hidden"
                  style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
                />
                {/* Large screen video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative hidden lg:block w-96 h-[600px] rounded-xl shadow-xl border border-gray-200 object-cover"
                  style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
                >
                  <source src="/video/portrait-sellers-checklist-cover-lg.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
              </div>
            </div>
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
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Schedule a Consultation</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pick a time that works for you — no obligation.</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe
              src={CALENDAR_SRC}
              style={{ width: "100%", height: "750px", border: "none" }}
              scrolling="yes"
              id="sellguide-calendar"
              title="Schedule Appointment"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared bottom sections (same for both variants) ──────────────────────────
function BottomSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-2xl font-bold text-gray-950 mb-3">
          Built for Ventura County sellers
        </h2>
        <p className="text-gray-500 text-sm mb-10 max-w-xl mx-auto">
          Generic advice loses money. This checklist is built around what actually
          moves homes in your specific market — Thousand Oaks, Ventura, Camarillo,
          Westlake Village, or Oxnard.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: ClipboardDocumentListIcon,
              title: "Pre-Listing Checklist",
              desc: "A prioritized list of repairs, touch-ups, and improvements that deliver the best return before you list.",
            },
            {
              icon: CurrencyDollarIcon,
              title: "Pricing Strategy",
              desc: "How to price for maximum interest, multiple offers, and a fast close at or above asking.",
            },
            {
              icon: ChartBarIcon,
              title: "Live Market Context",
              desc: "2026 sale-to-list ratios, days on market, and inventory data specific to your chosen market.",
            },
          ].map((item) => (
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
          <span className="flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-orange-500" />
            No spam, ever
          </span>
          <span className="flex items-center gap-1.5">
            <ClipboardDocumentListIcon className="w-4 h-4 text-orange-500" />
            View instantly in your browser
          </span>
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4 text-orange-500" />
            Market-specific data
          </span>
        </div>
      </div>
    </section>
  );
}
