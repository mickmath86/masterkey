"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import {
  CheckCircleIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon,
} from "@heroicons/react/16/solid";

const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/63dbb140-9990-4cb4-8954-e6d59f3813ce";

const WHAT_INSIDE = [
  "Pre-listing prep checklist — what to fix, what to skip",
  "Staging strategies that consistently add $20K–$50K in perceived value",
  "How to price your home to generate multiple offers",
  "Marketing your listing: photography, MLS timing, and social strategy",
  "Navigating offers, contingencies, and counter-offers",
  "Current Thousand Oaks market stats: sale-to-list ratio, DOM, and inventory",
];

export default function SellGuidePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isValid() {
    return (
      form.firstName.trim() &&
      form.email.trim() &&
      emailRegex.test(form.email)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          formType: "seller-guide",
          source: "sellguide-page",
          downloadable: "masterkey-sellers-checklist",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch {
      // still redirect
    } finally {
      setIsSubmitting(false);
      const link = document.createElement("a");
      link.href = "/downloadables/masterkey-sellers-checklist.pdf";
      link.download = "Masterkey-Sellers-Prep-Checklist.pdf";
      link.click();
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero (NavbarMinimal lives inside the dark section) ── */}
      <section className="relative overflow-hidden bg-gray-950 pb-0">
        <NavbarMinimal theme="dark" />
        {/* Warm red/orange tint glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-600/12 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-red-700/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          {/* items-center so cover is vertically centered on desktop */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy + form + checklist */}
            <div className="py-12 lg:py-20">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1.5 rounded-full mb-6">
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                Free Download — 2026 Edition
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                The Thousand Oaks<br />
                <span className="text-orange-400">Seller&apos;s Prep Checklist</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
                Your complete guide to selling your home in the Conejo Valley for
                top dollar — from prep and staging to closing with confidence.
              </p>

              {/* ── Inline form (desktop: above checklist) ── */}
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      placeholder="Jane"
                      required
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      placeholder="Smith"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">
                    Phone <span className="text-white/30 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="(805) 555-0100"
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className={`w-full px-3 py-2.5 bg-white/10 border rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-orange-400 focus:outline-none ${
                      emailError ? "border-red-400" : "border-white/20 focus:border-orange-400"
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid() || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  {isSubmitting ? "Preparing your download…" : "Download the Seller's Prep Checklist — Free"}
                </button>

                <p className="text-xs text-white/30 text-center leading-relaxed">
                  No spam, ever. We will never sell your information.
                </p>
              </form>

              {/* What's inside */}
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                What&apos;s inside
              </p>
              <ul className="space-y-2.5">
                {WHAT_INSIDE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircleIcon className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — PDF cover preview
                pb-12 adds bottom padding on mobile so it doesn't clip */}
            <div className="flex justify-center lg:justify-end items-center pb-12 lg:pb-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-orange-500/20 blur-xl" />
                <img
                  src="/sellers-checklist-cover.jpg"
                  alt="The Thousand Oaks Seller's Prep Checklist cover"
                  className="relative w-64 sm:w-72 lg:w-80 rounded-xl shadow-2xl border border-white/10"
                  style={{ transform: "perspective(800px) rotateY(-4deg) rotateX(2deg)" }}
                />
                <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  FREE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why this guide ── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl font-bold text-gray-950 mb-3">
            Built for Conejo Valley sellers
          </h2>
          <p className="text-gray-500 text-sm mb-10 max-w-xl mx-auto">
            Generic advice loses money. This checklist is built around what actually
            moves homes in Thousand Oaks, Westlake Village, and Newbury Park.
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
                desc: "2026 sale-to-list ratios, days on market, and inventory data specific to the Conejo Valley.",
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

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-orange-500" />
              No spam, ever
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowDownTrayIcon className="w-4 h-4 text-orange-500" />
              Instant PDF download
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-orange-500" />
              Conejo Valley–specific data
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
