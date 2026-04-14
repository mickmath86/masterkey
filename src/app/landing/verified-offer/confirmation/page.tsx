"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  PhoneIcon,
  CalendarDaysIcon,
  HomeModernIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

const PHONE_TEL = "tel:+18052629707";
const PHONE_DISPLAY = "(805) 262-9707";
const CALENDAR_SRC =
  "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";

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
    <div className="fixed inset-0 z-50 overflow-y-scroll">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-background rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Schedule a Consultation
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick a time — no obligation.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe
              src={CALENDAR_SRC}
              style={{ width: "100%", height: "750px", border: "none" }}
              scrolling="yes"
              title="Schedule Appointment"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("name") ?? "";
  const address = searchParams.get("address") ?? "";
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fire Facebook Lead event
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: "Verified Offer",
        content_category: "Seller Lead",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-lg mx-auto">
          <a
            href="/landing/verified-offer"
            className="flex items-center gap-2 text-sky-500 font-bold text-sm w-fit"
          >
            <HomeModernIcon className="w-4 h-4" />
            Verified Offer
          </a>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-sky-500" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              Request Received
            </div>
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
              {firstName ? `Thanks, ${firstName}!` : "You're all set!"}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              We've received your information
              {address ? ` for ${address}` : ""} and one of our local experts
              will be in touch with you shortly to discuss your verified offer.
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-muted/50 border border-border rounded-2xl p-5 text-left space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              What happens next
            </p>
            {[
              "We review your property details",
              "A local expert prepares your verified offer range",
              "We call you to walk through the numbers — no pressure",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-sky-600">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs text-muted-foreground">
              Want to talk now?
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={PHONE_TEL}
              className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              <PhoneIcon className="w-4 h-4" />
              Call {PHONE_DISPLAY}
            </a>
            <button
              onClick={() => setCalendarOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-background border border-border hover:border-sky-400 hover:text-sky-600 text-foreground font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
            >
              <CalendarDaysIcon className="w-4 h-4" />
              Schedule a Call
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            No obligation. We're here to help you make the best decision for
            your situation.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between text-xs text-muted-foreground/50">
          <span>MasterKey Real Estate · Thousand Oaks, CA</span>
          <span>DRE #01892427</span>
        </div>
      </footer>

      {calendarOpen && (
        <CalendarModal onClose={() => setCalendarOpen(false)} />
      )}
    </div>
  );
}

export default function VerifiedOfferConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sky-200 border-t-sky-500 animate-spin" />
        </div>
      }
    >
      <ConfirmationInner />
    </Suspense>
  );
}
