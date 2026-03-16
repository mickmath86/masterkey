"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/button";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  HomeIcon,
} from "@heroicons/react/16/solid";

const stats = [
  { value: "2 min", label: "Average completion time" },
  { value: "Free", label: "No cost, no obligation" },
  { value: "98%", label: "Accuracy vs. recent sales" },
  { value: "24/7", label: "Available anytime" },
];

const features = [
  {
    icon: ChartBarIcon,
    title: "Real-Time Market Data",
    desc: "Your estimate is built on live MLS data, recent comparable sales, and Conejo Valley market trends — updated daily.",
  },
  {
    icon: HomeIcon,
    title: "Property-Specific Analysis",
    desc: "We factor in your home's size, condition, upgrades, and unique features for a precise, personalized valuation.",
  },
  {
    icon: ClockIcon,
    title: "Instant Results",
    desc: "No waiting. No email. Your full valuation report — with market context — is ready the moment you finish.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private & Secure",
    desc: "Your information is never sold. We use it only to generate your report and follow up if you'd like an expert review.",
  },
];

const trustBadges = [
  "No credit card required",
  "No obligation to list",
  "Expert review available",
  "Licensed CA brokerage",
];

export default function HomeValuePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {/* ── Hero ── */}
      <div className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Back to home */}
        <div className="absolute top-6 left-6 z-20">
          <Button variant="secondary" href="/" className="bg-white/90 backdrop-blur-sm text-sm">
            ← Back to Home
          </Button>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12 py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">
              <span className="w-6 h-px bg-white/50" />
              Free Home Valuation
            </span>

            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
              What is your home worth today?
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              Get an accurate, data-driven estimate powered by live MLS data,
              recent comparable sales, and local Conejo Valley expertise. Takes
              2 minutes. No obligation.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5"
                >
                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/homevalue/questionnaire" className="text-base px-8 py-3">
                Get my home value
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
              <Link
                href="/contact"
                className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4"
              >
                Talk to an agent instead
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-gray-950">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950">
              How MasterKey estimates your home
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Our valuation combines three data sources with your specific home
              details for the most accurate free estimate available.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-950 text-sm mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA strip ── */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to find out what your home is worth?
          </h2>
          <p className="text-white/70 mb-8">
            Takes 2 minutes. No obligation. Get your personalized report instantly.
          </p>
          <Button href="/homevalue/questionnaire" className="text-base px-8 py-3">
            Start my valuation
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
