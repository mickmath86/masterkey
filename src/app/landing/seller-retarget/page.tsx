"use client";

import { useState, useEffect } from "react";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import Image from "next/image";
import {
  PhoneIcon,
  CalendarDaysIcon,
  StarIcon,
  CheckCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  HomeModernIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

const PHONE = "8052629707";
const PHONE_DISPLAY = "(805) 262-9707";
const PHONE_TEL = "tel:+18052629707";
const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

const testimonials = [
  {
    name: "Sarah & David M.",
    role: "Thousand Oaks sellers",
    quote:
      "Mike and Mark walked us through every step. We listed on a Thursday, had 6 offers by Sunday, and closed $42,000 over asking. The process was stress-free from start to finish.",
    stars: 5,
    result: "Sold $42K over asking",
  },
  {
    name: "Jennifer R.",
    role: "Westlake Village seller",
    quote:
      "I was nervous about pricing my home in this market. MasterKey gave me real data and a clear strategy. We sold in 8 days with no contingencies.",
    stars: 5,
    result: "Sold in 8 days, no contingencies",
  },
  {
    name: "Tom & Lisa K.",
    role: "Camarillo sellers",
    quote:
      "What impressed me most was how responsive they were. Every question was answered same day. They made us feel like we were their only clients.",
    stars: 5,
    result: "Full-ask offer, Day 4",
  },
];

const reasons = [
  {
    icon: ChartBarIcon,
    title: "Local market expertise",
    body: "Deep data on every Conejo Valley submarket — pricing trends, absorption rates, and exactly what buyers are paying right now.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Proven pricing strategy",
    body: "We price to generate competition, not just interest. Our listings average 98.7% of list price with 14 days on market.",
  },
  {
    icon: HomeModernIcon,
    title: "Concierge-level service",
    body: "From staging guidance to offer negotiation, we handle every detail so you can focus on your next chapter.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Licensed, local brokers",
    body: "Mike and Mark are both Ventura County brokers with DRE licenses and decades of combined transaction experience.",
  },
];

// ─── CTA Buttons — shared across sections ────────────────────────────────────
function CTAButtons({
  onSchedule,
  size = "default",
}: {
  onSchedule: () => void;
  size?: "default" | "large";
}) {
  const base =
    size === "large"
      ? "flex items-center justify-center gap-2.5 font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-sm"
      : "flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-lg text-sm transition-colors shadow-sm";

  function handleCall() {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-17527173682/2s_nCLi7lZwbELLkzaVB",
        value: 1.0,
        currency: "USD",
      });
    }
    window.location.href = PHONE_TEL;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleCall}
        className={`${base} bg-orange-500 hover:bg-orange-400 text-white`}
      >
        <PhoneIcon className="w-4 h-4 flex-shrink-0" />
        Call {PHONE_DISPLAY}
      </button>
      <button
        onClick={onSchedule}
        className={`${base} bg-white border border-gray-200 text-gray-800 hover:border-orange-400 hover:text-orange-600`}
      >
        <CalendarDaysIcon className="w-4 h-4 flex-shrink-0" />
        Schedule a Consultation
      </button>
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
      const existing = document.querySelector(
        'script[src="https://link.msgsndr.com/js/form_embed.js"]'
      );
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
              <h3 className="text-base font-semibold text-gray-900">
                Schedule a Consultation
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Pick a time that works for you — no obligation.
              </p>
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
              id="seller-retarget-calendar"
              title="Schedule Appointment"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SellerRetargetPage() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <NavbarMinimal theme="light" />

      {/* ── 1. HERO ── */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Subtle warm glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-orange-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-300/6 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy + CTAs */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full mb-6">
                <MapPinIcon className="w-3.5 h-3.5" />
                Conejo Valley · Ventura County
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 leading-tight mb-5">
                Ready to sell?<br />
                <span className="text-orange-500">Let&apos;s talk strategy.</span>
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                You&apos;ve done the research. Now talk to a local expert who knows
                your market, your neighborhood, and exactly how to get you top
                dollar — fast.
              </p>

              <CTAButtons onSchedule={() => setCalendarOpen(true)} size="large" />

              <div className="mt-8 flex flex-wrap gap-5">
                {[
                  "No obligation",
                  "Same-day response",
                  "Ventura County experts",
                ].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 text-xs text-gray-400"
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5 text-orange-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — team card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative bg-gray-50 border border-gray-100 rounded-2xl p-8 max-w-sm w-full shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
                  Your listing team
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Mike */}
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-sm">
                      <Image
                        src="/mike-avatar.png"
                        alt="Michael Mathias"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Michael Mathias</p>
                    <p className="text-xs text-gray-400 mt-0.5">Co-Founder · Broker</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">DRE #01892427</p>
                  </div>
                  {/* Mark */}
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-sm">
                      <Image
                        src="/team/mark-avatar.jpeg"
                        alt="Mark Mathias"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Mark Mathias</p>
                    <p className="text-xs text-gray-400 mt-0.5">Co-Founder · Broker</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">DRE #01921484</p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    98.7% avg list-to-sale ratio
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    14 days avg. time on market
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    100% Ventura County focus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT / TEAM ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-medium text-orange-600 mb-5">
              Meet your brokers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
              Founded by two brothers.<br />Built for Ventura County.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                Mike and Mark Mathias are licensed Ventura County brokers with deep roots in the Conejo Valley. Their backgrounds span Madison Avenue ad-tech, SaaS product management, and years of hands-on real estate transactions — giving them a rare combination of data intelligence and negotiation expertise.
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                When you work with MasterKey, you work directly with Mike and Mark — not a team of junior agents. Every listing gets their personal attention, from initial pricing strategy to the final closing table.
              </p>

              <div className="space-y-3">
                {reasons.map((r) => (
                  <div
                    key={r.title}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <r.icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Headshots — 2-up larger cards */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  src: "/mike-avatar.png",
                  name: "Michael Mathias",
                  title: "Co-Founder / CTO / Broker",
                  dre: "DRE #01892427",
                  bio: "Former Madison Avenue ad-tech executive. Mike brings data-driven strategy and technology to every listing.",
                },
                {
                  src: "/team/mark-avatar.jpeg",
                  name: "Mark Mathias",
                  title: "Co-Founder / Principal / Broker",
                  dre: "DRE #01921484",
                  bio: "Sales leader and product manager with SaaS background. Mark drives client relationships and deal strategy.",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden shadow-sm"
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <Image
                      src={p.src}
                      alt={p.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-950 text-sm">{p.name}</p>
                    <p className="text-xs text-orange-500 font-medium mt-0.5">{p.title}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{p.dre}</p>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{p.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TESTIMONIALS ── */}
      <section className="py-20 lg:py-28 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
              What our sellers say
            </h2>
            <p className="text-gray-400 mt-3 text-sm">
              Real results from real Conejo Valley homeowners.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-orange-400" />
                  ))}
                </div>

                {/* Result badge */}
                <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-orange-600 mb-4">
                  <CheckCircleIcon className="w-3 h-3" />
                  {t.result}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="pt-4 border-t border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FINAL CTA ── */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-400/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-300/6 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full mb-6">
            <PhoneIcon className="w-3.5 h-3.5" />
            Available now · No commitment
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight mb-4">
            Your home deserves<br />
            <span className="text-orange-500">the best possible outcome.</span>
          </h2>

          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
            A quick conversation costs nothing. Find out what your home is worth
            and what it takes to sell it right — in today&apos;s market.
          </p>

          <CTAButtons onSchedule={() => setCalendarOpen(true)} size="large" />

          <p className="text-gray-300 text-xs mt-6">
            MasterKey Real Estate · 1000 Business Center Circle #112,
            Thousand Oaks, CA · DRE #01892427
          </p>
        </div>
      </section>

      <Footer />

      {/* Calendar Modal */}
      {calendarOpen && (
        <CalendarModal onClose={() => setCalendarOpen(false)} />
      )}
    </div>
  );
}
