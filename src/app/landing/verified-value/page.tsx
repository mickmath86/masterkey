"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { GooglePlacesInput } from "@/components/ui/google-places-input";
import Content6 from "@/components/landing-pages/landing-page-v4/sections/content-6";
import CTA3 from "@/components/landing-pages/landing-page-v4/components/cta3";
import AboutUsSection from "@/components/landing-pages/landing-page-v4/sections/about-us";
import WhyThisWorksSection from "@/components/landing-pages/landing-page-v4/sections/why-this-works";
import FAQ from "@/components/landing-pages/landing-page-v4/sections/faq";
import CTA2 from "@/components/landing-pages/landing-page-v4/sections/cta2";
import V4Footer from "@/components/landing-pages/landing-page-v4/sections/footer";
import Testimonials from "@/components/landing-pages/landing-page-v4/components/testimonials";
import { Header } from "@/components/landing-pages/landing-page-v4/sections/header";
import VideoPlayer from "@/components/video-player";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import HowItWorksSection from "@/components/how-it-works-5";

function VerifiedOfferHero() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);

  function handleStart() {
    if (!addressValid) return;
    const params = new URLSearchParams({ address });
    router.push(`/landing/verified-value/quiz?${params.toString()}`);
  }

  return (
    <>
      <Header />
      <main role="main" className="bg-muted/50">
        <section
          id="home"
          className="relative mx-auto max-w-5xl px-6 py-32 text-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-16 mx-auto h-40 max-w-2xl rounded-t-full bg-gradient-to-b via-amber-50 to-purple-100 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-foreground text-balance font-bold text-4xl sm:mt-12 sm:text-6xl">
              Sell Your Home in 60 Days{" "}
              <span className="text-muted-foreground font-normal">
                — or We Work for
              </span>{" "}
              <span className="relative font-bold text-sky-500">
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-3 w-full"
                  viewBox="0 0 283 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332"
                    stroke="url(#paint0_linear_vo)"
                    strokeWidth="4"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_vo"
                      x1="282"
                      y1="5.49999"
                      x2="40"
                      y2="13"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="var(--color-sky-300)" />
                      <stop offset="1" stopColor="var(--color-blue-200)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="relative">nothing</span>
              </span>
            </h1>

            <p className="text-muted-foreground mb-8 mt-4 text-balance text-lg">
              Zero risk. Local experts. A proven system built to get homes sold
              fast — even in a slow market.
            </p>

            {/* Address bar */}
            <div className="mx-auto max-w-xl">
              <p className="text-sm font-medium text-foreground mb-3">
                Enter your property address to get started
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <GooglePlacesInput
                    id="vo-address"
                    value={address}
                    onChange={setAddress}
                    onValidationChange={setAddressValid}
                    placeholder="123 Oak Street, Thousand Oaks, CA"
                    showValidation={false}
                    className="bg-background border-border text-foreground placeholder-muted-foreground focus:ring-sky-500 focus:border-sky-500 py-3 text-base"
                  />
                </div>
                <button
                  onClick={handleStart}
                  disabled={!addressValid}
                  className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap shadow-sm"
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-muted-foreground mt-2 text-xs text-center">
                Free · No obligation · No instant online estimate — a real expert will review your home
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

function VerifiedOfferPageInner() {
  return (
    <>
      <VerifiedOfferHero />
      {/* Video lives here — outside the stateful hero so keystrokes don't remount it */}
      <section className="border-foreground/10 relative border-y">
        <div className="relative z-10 mx-auto max-w-6xl border-x px-3">
          <div className="border-x">
            <div
              aria-hidden
              className="h-3 w-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
            />
            <VideoPlayer />
          </div>
        </div>
      </section>
      <Content6 />
      <HowItWorksSection />
      <CTA3 />
      <AboutUsSection />
      <Testimonials />
      <WhyThisWorksSection />
      <FAQ />
      <CTA2 />
      <V4Footer />
    </>
  );
}

export default function VerifiedOfferPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sky-300 border-t-sky-500 animate-spin" />
        </div>
      }
    >
      <VerifiedOfferPageInner />
    </Suspense>
  );
}
