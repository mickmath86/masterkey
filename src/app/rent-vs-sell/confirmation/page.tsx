"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import { Footer } from "@/components/footer";
import {
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";
import { RENT_VS_SELL_WEBHOOK } from "../page";

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function validatePhone(v: string) {
  const d = v.replace(/\D/g, "");
  return d.length >= 10;
}

function ConfirmationInner() {
  const searchParams = useSearchParams();

  // All data passed as URL params (no PII in path, confirmation is ephemeral)
  const reportId      = searchParams.get("id") ?? "";
  const reportUrl     = reportId
    ? `https://www.usemasterkey.com/rent-vs-sell/results?id=${reportId}`
    : "";
  const origEmail     = searchParams.get("email") ?? "";
  const origPhone     = searchParams.get("phone") ?? "";
  const firstName     = searchParams.get("name")  ?? "";
  const webhookData   = searchParams.get("d")      ?? ""; // base64 encoded webhook payload

  const [showResend, setShowResend] = useState(false);
  const [newEmail, setNewEmail]     = useState("");
  const [newPhone, setNewPhone]     = useState("");
  const [emailErr, setEmailErr]     = useState("");
  const [phoneErr, setPhoneErr]     = useState("");
  const [resending, setResending]   = useState(false);
  const [resent, setResent]         = useState(false);
  const [resendError, setResendError] = useState("");

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    const emailToUse = newEmail.trim() || origEmail;
    const phoneToUse = newPhone.trim() || origPhone;

    // Validate if user typed something new
    let hasErr = false;
    if (newEmail.trim() && !validateEmail(newEmail)) {
      setEmailErr("Please enter a valid email address"); hasErr = true;
    } else { setEmailErr(""); }
    if (newPhone.trim() && !validatePhone(newPhone)) {
      setPhoneErr("Please enter a valid phone number"); hasErr = true;
    } else { setPhoneErr(""); }
    if (hasErr) return;

    setResending(true);
    setResendError("");

    try {
      // Decode the stored webhook payload and re-fire with updated contact info
      let payload: Record<string, unknown> = {};
      if (webhookData) {
        try { payload = JSON.parse(atob(webhookData)); } catch { /* use empty */ }
      }

      await fetch(RENT_VS_SELL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          email: emailToUse,
          phone: phoneToUse,
          reportUrl: reportUrl || payload.reportUrl,
          formType: "rent-vs-sell-resend",
          resentAt: new Date().toISOString(),
          originalEmail: origEmail || null,
          originalPhone: origPhone || null,
        }),
      });
      setResent(true);
      setShowResend(false);
    } catch {
      setResendError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  const maskedEmail = origEmail
    ? origEmail.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 4)) + c)
    : "";
  const maskedPhone = origPhone
    ? origPhone.replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")
    : "";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarMinimal theme="light" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-6 text-center">

          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-950 mb-2">
              {firstName ? `${firstName}, your report is on its way.` : "Your report is on its way."}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              We've sent your personalized Sell vs. Rent analysis to the contact info below. Check your inbox — it should arrive within a few minutes.
            </p>
          </div>

          {/* Contact info display */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Report sent to
            </p>
            {maskedEmail && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">{maskedEmail}</span>
              </div>
            )}
            {maskedPhone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">{maskedPhone}</span>
              </div>
            )}
          </div>

          {/* View report button */}
          {reportId && (
            <a
              href={`/rent-vs-sell/results?id=${reportId}`}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
            >
              View My Report
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          )}

          {/* Resent confirmation */}
          {resent && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
              Report resent successfully.
            </div>
          )}

          {/* Resend toggle */}
          {!resent && (
            <button
              onClick={() => setShowResend(r => !r)}
              className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mx-auto"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" />
              {showResend ? "Cancel" : "Didn't get it? Update your contact info and resend"}
            </button>
          )}

          {/* Resend form */}
          {showResend && !resent && (
            <form
              onSubmit={handleResend}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-4"
            >
              <p className="text-sm font-semibold text-gray-900">Update your contact info</p>
              <p className="text-xs text-gray-500 -mt-2">
                Leave blank to resend to the same address. Or enter a new one below.
              </p>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => { setNewEmail(e.target.value); setEmailErr(""); }}
                  placeholder={origEmail || "Enter email address"}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none bg-white ${
                    emailErr ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {emailErr && <p className="mt-1 text-xs text-red-500">{emailErr}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  New Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={e => { setNewPhone(e.target.value); setPhoneErr(""); }}
                  placeholder={origPhone || "(805) 555-0100"}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none bg-white ${
                    phoneErr ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {phoneErr && <p className="mt-1 text-xs text-red-500">{phoneErr}</p>}
              </div>

              {resendError && (
                <div className="flex items-center gap-2 text-xs text-red-600">
                  <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                  {resendError}
                </div>
              )}

              <button
                type="submit"
                disabled={resending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                {resending ? "Resending…" : "Resend My Report"}
                {!resending && <ArrowRightIcon className="w-4 h-4" />}
              </button>
            </form>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function RentVsSellConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
      </div>
    }>
      <ConfirmationInner />
    </Suspense>
  );
}
