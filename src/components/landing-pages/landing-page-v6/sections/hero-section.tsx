'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from "./header"
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/16/solid'

const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

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
              id="landing-v5-calendar"
              title="Schedule Appointment"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <>
            <Header />

            <main
                role="main"
                className="bg-muted/50">
                <section
                    id="home"
                    className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -bottom-16 mx-auto h-40 max-w-2xl rounded-t-full bg-gradient-to-b via-amber-50 to-purple-100 blur-3xl"
                    />
                    <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left — Text Content */}
                        <div>
                            <h1 className="text-foreground text-balance font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                                Ventura County's{' '}
                                <span className="relative font-bold text-sky-500">
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
                                                <stop stopColor="var(--color-sky-300)" />
                                                <stop
                                                    offset="1"
                                                    stopColor="var(--color-blue-200)"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="relative">Most Trusted</span>
                                </span>{' '}
                                Home Selling Brokers
                            </h1>
                            <p className="text-muted-foreground mt-6 text-balance text-lg lg:text-xl">
                                Zero risk. Local experts. A proven system built to get homes sold fast — even in a slow market.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-6 text-base">
                                    <Link href="tel:805-262-9707">Call Now</Link>
                                </Button>
                                <Button
                                    onClick={() => setCalendarOpen(true)}
                                    size="lg"
                                    className="px-6 text-base"
                                    variant="outline"
                                >
                                    Schedule Appointment
                                </Button>
                            </div>
                        </div>

                        {/* Right — Placeholder Image */}
                        <div className="relative">
                            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-blue-100 shadow-xl">
                                <Image
                                    src="/images/house-for-sale.jpg"
                                    alt="Home for sale"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Calendar Modal */}
            {calendarOpen && (
                <CalendarModal onClose={() => setCalendarOpen(false)} />
            )}
        </>
    )
}