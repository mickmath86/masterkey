"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { GooglePlacesInput } from "@/components/ui/google-places-input";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ScaleIcon,
  CheckCircleIcon,
  HomeModernIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
  SparklesIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/16/solid";
import {
  RENT_VS_SELL_WEBHOOK,
  calculate,
  validatePhoneFormat,
  type RVSFormData,
} from "../page";

// ─── Rentcast data shape ──────────────────────────────────────────────────────
interface PropertyFacts {
  found: true;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
}

interface AVMData {
  price?: number | null;
  priceRangeLow?: number | null;
  priceRangeHigh?: number | null;
  rent?: number | null;
  rentRangeLow?: number | null;
  rentRangeHigh?: number | null;
  latitude?: number;
  longitude?: number;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ─── Step config ──────────────────────────────────────────────────────────────
// Steps: 1=address, 2=confirm (only if Rentcast found), 3=purchase, 4=mortgage, 5=title, 6=contact, 7=name
// If Rentcast not found: skip step 2, steps become 1,3,4,5,6,7 → displayed as 1-6

// ─── GHL Calendar Modal (for any embedded CTA) ────────────────────────────────
function CalendarModal({ onClose }: { onClose: () => void }) {
  const CALENDAR_SRC = "https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY";
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://link.msgsndr.com/js/form_embed.js";
    s.type = "text/javascript";
    document.body.appendChild(s);
    return () => { const el = document.querySelector(`script[src="${s.src}"]`); if (el) document.body.removeChild(el); };
  }, []);
  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Schedule a Consultation</h3>
              <p className="text-xs text-gray-400 mt-0.5">No obligation — we'll walk through your numbers together.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <iframe src={CALENDAR_SRC} style={{ width: "100%", height: "750px", border: "none" }} scrolling="yes" title="Schedule Appointment" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ PAGE INNER
// ═══════════════════════════════════════════════════════════════════════════════
// Residency question component — avoids IIFE/ternary parse issues in TSX
function ResidencyQuestion({
  purchaseYear, residencyType, titleOwnership, onChange,
}: {
  purchaseYear: string;
  residencyType: string;
  titleOwnership: string;
  onChange: (v: "primary" | "investment") => void;
}) {
  const yearsOwned = new Date().getFullYear() - parseInt(purchaseYear);
  const qualifies = yearsOwned >= 2;
  const exclusionAmt = titleOwnership === "multiple" ? "$500,000" : "$250,000";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        Is this your primary residence? <span className="text-red-400">*</span>
      </label>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onChange("primary")}
          className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
            residencyType === "primary"
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
          }`}
        >
          <div className="flex-1">
            <p className={`text-sm font-semibold ${residencyType === "primary" ? "text-blue-700" : "text-gray-800"}`}>
              Yes — this is my primary residence
            </p>
            {qualifies ? (
              <p className="text-xs text-green-600 mt-0.5 font-medium">
                ✓ Owned {yearsOwned} yr{yearsOwned !== 1 ? "s" : ""} — qualifies for IRC §121 federal exclusion
              </p>
            ) : (
              <p className="text-xs text-amber-600 mt-0.5">
                ⚠ Owned {yearsOwned} yr{yearsOwned !== 1 ? "s" : ""} — IRC §121 requires 2+ years of primary residence
              </p>
            )}
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange("investment")}
          className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
            residencyType === "investment"
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
          }`}
        >
          <div className="flex-1">
            <p className={`text-sm font-semibold ${residencyType === "investment" ? "text-blue-700" : "text-gray-800"}`}>
              No — this is a rental or investment property
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              No federal exclusion applies — full capital gains tax on the entire profit
            </p>
          </div>
        </button>
        <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
          Under IRC §121, homeowners who used the home as their primary residence for 2+ of the last 5 years may exclude up to {exclusionAmt} of gain from federal tax. California does not recognize this exclusion.
        </p>
      </div>
    </div>
  );
}

function QuizInner() {
  const router = useRouter();

  // ── Form data ──
  const [data, setData] = useState<RVSFormData>({
    address: "", addressValid: false, homeValue: "", purchasePrice: "",
    purchaseYear: "", residencyType: "", mortgageBalance: "", interestRate: "",
    titleOwnership: "", phone: "", email: "", firstName: "", lastName: "",
  });

  // ── Rentcast state ──
  const [rentcastLoading, setRentcastLoading] = useState(false);
  const [rentcastError, setRentcastError] = useState(false);
  const [propertyFacts, setPropertyFacts] = useState<PropertyFacts | null>(null);
  const [avm, setAvm] = useState<AVMData | null>(null);
  const [rentcastDone, setRentcastDone] = useState(false);

  // Editable confirm fields (seeded from Rentcast, user can override)
  const [editedFacts, setEditedFacts] = useState<{ bedrooms: string; bathrooms: string; sqft: string } | null>(null);
  const [confirmedValue, setConfirmedValue] = useState("");
  const [confirmedRent, setConfirmedRent] = useState("");
  const [showRefinement, setShowRefinement] = useState(false);
  const [refinedValue, setRefinedValue] = useState<number | null>(null);
  const [refinementData, setRefinementData] = useState({
    condition: "", garage: "", kitchenUpdate: "", bathroomUpdate: "",
    roofUpdate: "", hvacUpdate: "",
    features: [] as string[],
  });
  const [refinementLoading, setRefinementLoading] = useState(false);

  // ── Step state ──
  // 1=address, 2=confirm(optional), 3=purchase, 4=mortgage, 5=title(auto), 6=contact, 7=name
  const [step, setStep] = useState(1);
  const hasConfirmStep = rentcastDone && (propertyFacts !== null || avm !== null);
  const TOTAL_STEPS = hasConfirmStep ? 7 : 6;

  // Display step (visual number shown to user)
  function displayStep() {
    if (!hasConfirmStep && step >= 3) return step - 1;
    return step;
  }

  // ── Validation state ──
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function set<K extends keyof RVSFormData>(k: K, v: RVSFormData[K]) {
    setData(d => ({ ...d, [k]: v }));
  }

  // ── Fetch Rentcast data after address confirmed ────────────────────────────
  async function fetchRentcastData(address: string) {
    setRentcastLoading(true);
    setRentcastError(false);
    setPropertyFacts(null);
    setAvm(null);
    setRentcastDone(false);

    try {
      // Step 1: fetch property facts first so we can enrich the AVM call
      let facts: PropertyFacts | null = null;
      try {
        const factsRes = await fetch(`/api/homevalue/property-lookup?address=${encodeURIComponent(address)}`);
        if (factsRes.ok) {
          const j = await factsRes.json();
          if (j.found === true) facts = j as PropertyFacts;
        }
      } catch { /* ignore */ }

      // Step 2: AVM value + rent — both enriched with property attributes, run in parallel
      const enrichedParams = new URLSearchParams({ address });
      if (facts?.propertyType) enrichedParams.set("propertyType", facts.propertyType);
      if (facts?.bedrooms)     enrichedParams.set("bedrooms",     facts.bedrooms);
      if (facts?.bathrooms)    enrichedParams.set("bathrooms",    facts.bathrooms);
      if (facts?.sqft)         enrichedParams.set("squareFootage", facts.sqft);

      let avmData: AVMData | null = null;
      try {
        const [valueRes, rentRes] = await Promise.allSettled([
          fetch(`/api/rentcast/value?${enrichedParams.toString()}`),
          fetch(`/api/rentcast/rent?${enrichedParams.toString()}`),
        ]);

        let price: number | null = null;
        let priceRangeLow: number | null = null;
        let priceRangeHigh: number | null = null;
        let rent: number | null = null;
        let rentRangeLow: number | null = null;
        let rentRangeHigh: number | null = null;

        if (valueRes.status === "fulfilled" && valueRes.value.ok) {
          const j = await valueRes.value.json();
          price          = j.price ?? null;
          priceRangeLow  = j.priceRangeLow ?? null;
          priceRangeHigh = j.priceRangeHigh ?? null;
        }

        if (rentRes.status === "fulfilled" && rentRes.value.ok) {
          const j = await rentRes.value.json();
          rent          = j.rent ?? null;
          rentRangeLow  = j.rentRangeLow ?? null;
          rentRangeHigh = j.rentRangeHigh ?? null;
        }

        if (price || rent) {
          avmData = { price, priceRangeLow, priceRangeHigh, rent, rentRangeLow, rentRangeHigh };
        }
      } catch { /* ignore */ }

      setPropertyFacts(facts);
      if (facts) setEditedFacts({ bedrooms: facts.bedrooms || "", bathrooms: facts.bathrooms || "", sqft: facts.sqft || "" });
      setAvm(avmData);

      // Pre-fill editable confirm fields from Rentcast
      if (avmData?.price) {
        const v = Math.round(avmData.price / 1000) * 1000;
        setConfirmedValue(v.toLocaleString());
        set("homeValue", v.toLocaleString());
      }
      if (avmData?.rent) {
        const r = Math.round(avmData.rent / 50) * 50;
        setConfirmedRent(r.toLocaleString());
      }

    } catch {
      setRentcastError(true);
    } finally {
      setRentcastLoading(false);
      setRentcastDone(true);
    }
  }

  // ── Advance from step 1 ───────────────────────────────────────────────────
  function advanceFromAddress() {
    if (!data.addressValid) return;
    // Kick off Rentcast fetch, then move to step 2 (loading shown there)
    fetchRentcastData(data.address);
    setStep(2);
  }

  // When Rentcast finishes and there's no useful data, skip confirm step
  useEffect(() => {
    if (step === 2 && rentcastDone && !hasConfirmStep) {
      setStep(3);
    }
  }, [rentcastDone, hasConfirmStep, step]);

  // Part B: reset viewport zoom on every step change (prevents iOS zoom-in persisting)
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    // Temporarily enforce scale=1 to reset zoom, then restore
    viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
    const timeout = setTimeout(() => {
      viewport.setAttribute("content", "width=device-width, initial-scale=1");
    }, 300);
    return () => clearTimeout(timeout);
  }, [step]);

  // ── Refined value calculation ──────────────────────────────────────────────
  function computeRefinedValue() {
    const base = parseFloat(confirmedValue.replace(/[,$]/g, "")) || (avm?.price ?? 0);
    if (!base) return;
    setRefinementLoading(true);
    let adj = base;
    // Condition adjustment
    if (refinementData.condition.includes("Excellent")) adj *= 1.05;
    else if (refinementData.condition.includes("Good")) adj *= 1.02;
    else if (refinementData.condition.includes("Fair")) adj *= 0.97;
    else if (refinementData.condition.includes("Needs Work")) adj *= 0.92;
    // Garage
    if (refinementData.garage.includes("2-Car")) adj += 15000;
    else if (refinementData.garage.includes("3-Car")) adj += 25000;
    else if (refinementData.garage.includes("1-Car")) adj += 8000;
    // Kitchen update
    if (refinementData.kitchenUpdate.includes("Within the last year")) adj += 20000;
    else if (refinementData.kitchenUpdate.includes("1–5 years")) adj += 12000;
    else if (refinementData.kitchenUpdate.includes("5–10")) adj += 5000;
    // Bathroom update
    if (refinementData.bathroomUpdate.includes("Within the last year")) adj += 10000;
    else if (refinementData.bathroomUpdate.includes("1–5 years")) adj += 6000;
    // Roof
    if (refinementData.roofUpdate.includes("Within the last year")) adj += 12000;
    else if (refinementData.roofUpdate.includes("1–5 years")) adj += 7000;
    // HVAC
    if (refinementData.hvacUpdate.includes("Within the last year")) adj += 8000;
    else if (refinementData.hvacUpdate.includes("1–5 years")) adj += 4000;
    // Round to nearest $1000
    const rounded = Math.round(adj / 1000) * 1000;
    setTimeout(() => {
      setRefinedValue(rounded);
      setRefinementLoading(false);
    }, 800); // brief delay for UX
  }

  function applyRefinedValue() {
    if (refinedValue) {
      setConfirmedValue(refinedValue.toLocaleString());
      set("homeValue", refinedValue.toLocaleString());
      setShowRefinement(false);
    }
  }

  // ── Re-fetch AVM + rent with edited facts ────────────────────────────────
  async function refetchWithEditedFacts() {
    if (!data.address) return;
    setRentcastLoading(true);
    setRentcastDone(false);
    const ef = editedFacts ?? { bedrooms: "", bathrooms: "", sqft: "" };
    const params = new URLSearchParams({ address: data.address });
    if (propertyFacts?.propertyType) params.set("propertyType", propertyFacts.propertyType);
    if (ef.bedrooms)  params.set("bedrooms",      ef.bedrooms);
    if (ef.bathrooms) params.set("bathrooms",     ef.bathrooms);
    if (ef.sqft)      params.set("squareFootage", ef.sqft);

    try {
      const [valueRes, rentRes] = await Promise.allSettled([
        fetch(`/api/rentcast/value?${params.toString()}`),
        fetch(`/api/rentcast/rent?${params.toString()}`),
      ]);
      let price: number | null = null, priceRangeLow: number | null = null, priceRangeHigh: number | null = null;
      let rent: number | null = null, rentRangeLow: number | null = null, rentRangeHigh: number | null = null;

      if (valueRes.status === "fulfilled" && valueRes.value.ok) {
        const j = await valueRes.value.json();
        price = j.price ?? null; priceRangeLow = j.priceRangeLow ?? null; priceRangeHigh = j.priceRangeHigh ?? null;
      }
      if (rentRes.status === "fulfilled" && rentRes.value.ok) {
        const j = await rentRes.value.json();
        rent = j.rent ?? null; rentRangeLow = j.rentRangeLow ?? null; rentRangeHigh = j.rentRangeHigh ?? null;
      }
      if (price || rent) setAvm({ price, priceRangeLow, priceRangeHigh, rent, rentRangeLow, rentRangeHigh });
      if (price) { const v = Math.round(price / 1000) * 1000; setConfirmedValue(v.toLocaleString()); set("homeValue", v.toLocaleString()); }
      if (rent)  { setConfirmedRent(Math.round(rent / 50) * 50 + ""); }
    } catch { /* ignore */ } finally {
      setRentcastLoading(false);
      setRentcastDone(true);
    }
  }

  // ── Confirm step apply ────────────────────────────────────────────────────
  function applyConfirm() {
    if (confirmedValue.trim()) set("homeValue", confirmedValue.trim());
    setStep(3);
  }

  // ── canAdvance ────────────────────────────────────────────────────────────
  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.addressValid;
      case 2: return rentcastDone; // loading spinner handles the wait
      case 3: return data.purchasePrice.trim() !== "" && data.purchaseYear.trim() !== "" && data.residencyType !== "";
      case 4: return data.mortgageBalance.trim() !== "" && data.interestRate.trim() !== "";
      case 5: return data.titleOwnership !== ""; // auto-advances
      case 6: return data.phone.trim() !== "" && !phoneError && data.email.trim() !== "" && emailRegex.test(data.email) && !emailError;
      case 7: return data.firstName.trim() !== "";
      default: return false;
    }
  }

  const [validating, setValidating] = useState(false);

  async function nextStep() {
    // Step 6 = contact info — validate phone + email via Abstract before advancing
    if (step === 6) {
      setValidating(true);
      let blocked = false;

      try {
        const res = await fetch("/api/validate-phone", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: data.phone }),
        });
        const r = await res.json();
        if (!r.valid) {
          setPhoneError(r.reason ?? "Please enter a valid phone number.");
          blocked = true;
        }
      } catch { /* fail open — format check already passed */ }

      if (!blocked) {
        try {
          const res = await fetch("/api/validate-email", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
          });
          const r = await res.json();
          if (!r.valid) {
            setEmailError(r.reason ?? "Please enter a valid email address.");
            blocked = true;
          }
        } catch { /* fail open */ }
      }

      setValidating(false);
      if (blocked) return; // stay on step 6
      setStep(s => s + 1);
      return;
    }
    setStep(s => s + 1);
  }
  function prevStep() {
    if (step === 3 && !hasConfirmStep) setStep(1);
    else setStep(s => s - 1);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Merge confirmed rent into data defaults if user set it
    const finalData: RVSFormData = {
      ...data,
      homeValue: confirmedValue.trim() || data.homeValue,
    };

    // Calculate results — if inputs are incomplete, still fire webhook with what we have
    const rentNum = confirmedRent.trim()
      ? parseFloat(confirmedRent.replace(/[,$]/g, ""))
      : (avm?.rent ?? null);
    const results = calculate(finalData, rentNum && !isNaN(rentNum) ? rentNum : null);

    // 1. Save report to Supabase first — so reportUrl is available for the webhook
    let reportId: string | null = null;
    let reportUrl: string | null = null;
    try {
      const saveRes = await fetch("/api/rent-vs-sell/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: finalData,
          results,
          monthlyRent: rentNum && !isNaN(rentNum) ? rentNum : null,
        }),
      });
      if (saveRes.ok) {
        const saved = await saveRes.json();
        reportId = saved.id ?? null;
        reportUrl = saved.url ?? null;
      }
    } catch { /* fail open */ }

    // 2. Fire webhook with full payload including reportUrl
    try {
      await fetch(RENT_VS_SELL_WEBHOOK, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: finalData.firstName, lastName: finalData.lastName,
          phone: finalData.phone, email: finalData.email,
          propertyAddress: finalData.address,
          homeValue: finalData.homeValue,
          purchasePrice: finalData.purchasePrice,
          purchaseYear: finalData.purchaseYear,
          mortgageBalance: finalData.mortgageBalance,
          interestRate: finalData.interestRate,
          titleOwnership: finalData.titleOwnership,
            residencyType: finalData.residencyType,
          rentcastEstimatedValue: avm?.price ?? null,
          rentcastEstimatedRent: avm?.rent ?? null,
          rentcastConfirmedRent: confirmedRent || null,
          verdict5yr: results?.verdict5yr ?? null, verdict10yr: results?.verdict10yr ?? null,
          sellNetProceeds: results ? Math.round(results.saleAfterTax) : null,
          rentWealth10yr: results ? Math.round(results.rentTotalWealth10yr) : null,
          reportUrl: reportUrl ?? null,
          formType: "rent-vs-sell", source: "rent-vs-sell-quiz",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Rent vs sell webhook submission failed", error);
      /* fail open */
    }

    setIsSubmitting(false);

    // Redirect to confirmation page (not results directly)
    // Encode minimal webhook payload so resend can re-fire it
    const webhookPayload = btoa(JSON.stringify({
      firstName: finalData.firstName, lastName: finalData.lastName,
      phone: finalData.phone, email: finalData.email,
      propertyAddress: finalData.address,
      homeValue: finalData.homeValue,
      purchasePrice: finalData.purchasePrice,
      purchaseYear: finalData.purchaseYear,
      mortgageBalance: finalData.mortgageBalance,
      interestRate: finalData.interestRate,
      titleOwnership: finalData.titleOwnership,
      verdict5yr: results?.verdict5yr ?? null,
      verdict10yr: results?.verdict10yr ?? null,
      sellNetProceeds: results ? Math.round(results.saleAfterTax) : null,
      rentWealth10yr: results ? Math.round(results.rentTotalWealth10yr) : null,
    }));

    const confirmParams = new URLSearchParams({
      ...(reportId ? { id: reportId } : {}),
      email: finalData.email,
      phone: finalData.phone,
      name: finalData.firstName,
      d: webhookPayload,
    });
    router.push(`/rent-vs-sell/confirmation?${confirmParams.toString()}`);
  }

  const progress = Math.round((displayStep() / TOTAL_STEPS) * 100);

  // ── Shared input classes ──────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white";
  const inputErrCls = "w-full px-3 py-2.5 border border-red-400 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none bg-white";
  // Format number with commas as user types, strip non-numeric on change
  function formatDollar(raw: string): string {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return parseInt(digits, 10).toLocaleString("en-US");
  }

  const dollarInput = (val: string, onChange: (v: string) => void, placeholder: string) => (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
      <input
        type="text"
        inputMode="numeric"
        value={val}
        onChange={e => onChange(formatDollar(e.target.value))}
        placeholder={placeholder}
        className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
      />
    </div>
  );

  // Year options from current year back to 1900
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <a href="/rent-vs-sell" className="flex items-center gap-2 text-blue-600 font-bold text-sm">
            <ScaleIcon className="w-4 h-4" />
            Sell vs. Rent Analysis
          </a>
          <span className="text-xs text-gray-400">Step {displayStep()} of {TOTAL_STEPS}</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="h-1 bg-gray-100">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-10">
        <div className="w-full max-w-lg space-y-6">

          {/* ══ STEP 1: ADDRESS ══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 1 of {TOTAL_STEPS}</p>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">What's the property address?</h2>
                <p className="text-sm text-gray-400">We'll pull live rental and value data from Rentcast for your specific home.</p>
              </div>
              <GooglePlacesInput
                id="rvs-address"
                value={data.address}
                onChange={v => set("address", v)}
                onValidationChange={valid => set("addressValid", valid)}
                placeholder="Start typing your address…"
                showValidation={true}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={advanceFromAddress}
                disabled={!data.addressValid}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Continue <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ══ STEP 2: RENTCAST LOADING / CONFIRM ══ */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Loading state */}
              {rentcastLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Looking up your property…</p>
                    <p className="text-xs text-gray-400 mt-1">Fetching data from Rentcast</p>
                  </div>
                </div>
              )}

              {/* Confirm state — Rentcast returned data */}
              {!rentcastLoading && rentcastDone && hasConfirmStep && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step 2 of {TOTAL_STEPS}</p>
                    <h2 className="text-2xl font-bold text-gray-950 mb-1">Confirm your property details</h2>
                    <p className="text-sm text-gray-400">We pulled this data from Rentcast. Review and edit anything that looks off before we run your analysis.</p>
                  </div>

                  {/* Rentcast data card */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
                    {/* Address */}
                    <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <HomeModernIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-400 font-medium">Property</p>
                        <p className="text-sm font-semibold text-gray-900">{data.address}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                        <SparklesIcon className="w-3.5 h-3.5" />
                        Rentcast data
                      </div>
                    </div>

                    {/* Property facts */}
                    {propertyFacts && (
                      <div className="space-y-3">
                        {/* Read-only facts */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Year built", value: propertyFacts.yearBuilt || "—" },
                            { label: "Type", value: propertyFacts.propertyType || "—" },
                          ].map(f => (
                            <div key={f.label} className="bg-white rounded-lg px-3 py-2">
                              <p className="text-[10px] text-gray-400">{f.label}</p>
                              <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                            </div>
                          ))}
                          {avm?.priceRangeLow && avm?.priceRangeHigh && (
                            <div className="bg-white rounded-lg px-3 py-2 col-span-2">
                              <p className="text-[10px] text-gray-400">Rentcast value range</p>
                              <p className="text-sm font-semibold text-gray-900">{fmt(avm.priceRangeLow)} – {fmt(avm.priceRangeHigh)}</p>
                            </div>
                          )}
                        </div>
                        {/* Editable facts */}
                        <div>
                          <p className="text-[10px] text-gray-400 mb-2">Edit to improve estimate accuracy</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">Beds</label>
                              <input type="text" inputMode="numeric" value={editedFacts?.bedrooms ?? propertyFacts.bedrooms}
                                onChange={e => setEditedFacts(f => ({ bedrooms: e.target.value, bathrooms: f?.bathrooms ?? "", sqft: f?.sqft ?? "" }))}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-1 focus:ring-blue-400 focus:outline-none bg-white" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">Baths</label>
                              <input type="text" inputMode="decimal" value={editedFacts?.bathrooms ?? propertyFacts.bathrooms}
                                onChange={e => setEditedFacts(f => ({ bedrooms: f?.bedrooms ?? "", bathrooms: e.target.value, sqft: f?.sqft ?? "" }))}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-1 focus:ring-blue-400 focus:outline-none bg-white" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-1">Sq ft</label>
                              <input type="text" inputMode="numeric" value={editedFacts?.sqft ?? propertyFacts.sqft}
                                onChange={e => setEditedFacts(f => ({ bedrooms: f?.bedrooms ?? "", bathrooms: f?.bathrooms ?? "", sqft: e.target.value }))}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-base text-gray-900 focus:ring-1 focus:ring-blue-400 focus:outline-none bg-white" />
                            </div>
                          </div>
                          <button
                            onClick={refetchWithEditedFacts}
                            disabled={rentcastLoading}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 bg-white px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                          >
                            {rentcastLoading ? "Updating…" : "↻ Recalculate estimate with these values"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Editable: Estimated home value + range + refinement */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        Estimated Home Value
                      </label>

                      {/* Value range bar */}
                      {avm?.priceRangeLow && avm?.priceRangeHigh && (
                        <div className="bg-white rounded-lg px-3 py-2.5 border border-blue-100">
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                            <span>Low estimate</span>
                            <span className="font-semibold text-blue-600 text-xs">Rentcast range</span>
                            <span>High estimate</span>
                          </div>
                          <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                            <span>{fmt(avm.priceRangeLow)}</span>
                            <span className="text-blue-600 text-base">{avm?.price ? fmt(avm.price) : "—"}</span>
                            <span>{fmt(avm.priceRangeHigh)}</span>
                          </div>
                          {/* Range bar */}
                          <div className="relative h-1.5 bg-blue-100 rounded-full mt-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 rounded-full" />
                            {avm?.price && (
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow"
                                style={{ left: `calc(${Math.min(100,Math.max(0,((avm.price - avm.priceRangeLow) / (avm.priceRangeHigh - avm.priceRangeLow)) * 100))}% - 6px)` }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={confirmedValue}
                          onChange={e => { setConfirmedValue(e.target.value); set("homeValue", e.target.value); }}
                          placeholder={avm?.price ? Math.round(avm.price).toLocaleString() : "Enter value"}
                          className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                        />
                      </div>

                      {/* Tooltip + refinement trigger */}
                      <div className="p-3 bg-white/70 rounded-lg border border-blue-100 text-[11px] text-gray-500 leading-relaxed">
                        This is an estimate provided by Rentcast based on public records and comparable sales. For a more accurate valuation that takes into consideration updates to your home, click{" "}
                        <button
                          onClick={() => setShowRefinement(r => !r)}
                          className="text-blue-500 hover:underline font-medium"
                        >
                          here
                        </button>
                        .
                      </div>

                      {/* Refinement accordion */}
                      {showRefinement && (
                        <div className="border border-blue-200 rounded-xl bg-blue-50/50 p-4 space-y-4">
                          <p className="text-xs font-semibold text-blue-700 mb-1">Tell us more about your home to refine the estimate</p>

                          {/* Condition */}
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-2">Overall condition</p>
                            <div className="grid grid-cols-2 gap-2">
                              {["Excellent — like new / recently renovated","Good — well maintained, minor wear","Fair — needs some updating","Needs Work — significant repairs needed"].map(opt => (
                                <button key={opt} onClick={() => setRefinementData(d => ({...d, condition: opt}))}
                                  className={`text-left px-3 py-2 rounded-lg border text-[11px] transition-colors ${refinementData.condition === opt ? "border-blue-400 bg-blue-100 text-blue-800 font-medium" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                                  {opt.split(" — ")[0]}
                                  <span className="block text-[10px] text-gray-400 font-normal">{opt.split(" — ")[1]}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Garage */}
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-2">Garage</p>
                            <div className="flex flex-wrap gap-2">
                              {["None","1-Car Garage","2-Car Garage","3-Car Garage","Carport"].map(opt => (
                                <button key={opt} onClick={() => setRefinementData(d => ({...d, garage: opt}))}
                                  className={`px-3 py-1.5 rounded-full border text-[11px] transition-colors ${refinementData.garage === opt ? "border-blue-400 bg-blue-100 text-blue-800 font-medium" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Updates — 2-col grid */}
                          {[
                            { key: "kitchenUpdate" as const, label: "Kitchen last updated" },
                            { key: "bathroomUpdate" as const, label: "Bathrooms last updated" },
                            { key: "roofUpdate" as const, label: "Roof last updated" },
                            { key: "hvacUpdate" as const, label: "HVAC last updated" },
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <p className="text-xs font-medium text-gray-600 mb-2">{label}</p>
                              <div className="flex flex-wrap gap-2">
                                {["Within the last year","1–5 years ago","5–10 years ago","10+ years ago / original","Not applicable"].map(opt => (
                                  <button key={opt} onClick={() => setRefinementData(d => ({...d, [key]: opt}))}
                                    className={`px-3 py-1.5 rounded-full border text-[11px] transition-colors ${refinementData[key] === opt ? "border-blue-400 bg-blue-100 text-blue-800 font-medium" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                                    {opt.replace(" / original","").replace(" years ago","yr").replace("Within the last year","<1yr")}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}

                          {/* Compute button */}
                          <button
                            onClick={computeRefinedValue}
                            disabled={!refinementData.condition || refinementLoading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                          >
                            {refinementLoading ? "Calculating…" : "Calculate Adjusted Value"}
                          </button>

                          {/* Refined value result */}
                          {refinedValue && !refinementLoading && (
                            <div className="bg-white border border-blue-200 rounded-xl p-4 text-center space-y-2">
                              <p className="text-xs text-gray-400">Adjusted estimate based on your inputs</p>
                              <p className="text-2xl font-bold text-blue-700">{fmt(refinedValue)}</p>
                              <p className="text-[11px] text-gray-400">
                                {refinedValue > (avm?.price ?? 0)
                                  ? `+${fmt(refinedValue - (avm?.price ?? 0))} above Rentcast estimate`
                                  : `${fmt((avm?.price ?? 0) - refinedValue)} below Rentcast estimate`}
                              </p>
                              <button
                                onClick={applyRefinedValue}
                                className="mt-1 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                              >
                                Use {fmt(refinedValue)} as my home value
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Editable: Estimated monthly rent */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Estimated Monthly Rent
                        {avm?.rent && <span className="ml-1.5 text-blue-500 text-[11px]">Rentcast: {fmt(avm.rent)}/mo</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={confirmedRent}
                          onChange={e => setConfirmedRent(e.target.value)}
                          placeholder={avm?.rent ? Math.round(avm.rent).toLocaleString() : "Enter estimated rent"}
                          className="w-full pl-6 pr-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/mo</span>
                      </div>
                      {/* Rent subcopy — always shown */}
                      <div className="mt-2 p-3 bg-white/70 rounded-lg border border-blue-100">
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {avm?.rent
                            ? <>The <strong>{fmt(avm.rent)}/mo</strong> figure is based on local area averages. Your home&apos;s actual rental value may be higher depending on upgrades, lot size, location, and condition.</>
                            : <>Enter your estimated monthly rent, or leave blank and we&apos;ll use local area averages. Your home&apos;s actual rental value may be higher depending on upgrades, lot size, location, and condition.</>
                          }
                          {" "}<a href="/contact" className="text-blue-500 hover:underline font-medium whitespace-nowrap">Contact MasterKey</a> for a free, personalized rental analysis.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={applyConfirm}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                  >
                    Looks good — continue <ArrowRightIcon className="w-4 h-4" />
                  </button>
                  <button onClick={prevStep} className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" />Edit address
                  </button>
                </>
              )}

              {/* Error state */}
              {!rentcastLoading && rentcastError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <ExclamationCircleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Couldn't fetch property data</p>
                    <p className="text-xs text-yellow-600 mt-0.5">You can still continue — just enter your details manually.</p>
                    <button onClick={() => setStep(3)} className="mt-2 text-xs text-blue-600 font-medium hover:underline">Continue manually →</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 3: PURCHASE DETAILS ══ */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step {displayStep()} of {TOTAL_STEPS}</p>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">When did you buy, and for how much?</h2>
                <p className="text-sm text-gray-400">This determines your capital gains exposure.</p>
              </div>
              <div className="space-y-3">
                {/* Home value — only show if not already confirmed via Rentcast */}
                {!hasConfirmStep && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Estimated Current Home Value <span className="text-red-400">*</span></label>
                    {dollarInput(data.homeValue, v => set("homeValue", v), "950,000")}
                    <p className="text-[11px] text-gray-400 mt-1">Not sure? Use our <a href="/homevalue/questionnaire" className="text-blue-500 hover:underline">free valuation tool</a>.</p>
                  </div>
                )}
                {hasConfirmStep && data.homeValue && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center justify-between">
                    <p className="text-xs text-blue-600 font-medium">Confirmed value</p>
                    <p className="text-sm font-bold text-blue-700">${parseFloat(data.homeValue.replace(/[,$]/g, "")).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Original Purchase Price <span className="text-red-400">*</span></label>
                  {dollarInput(data.purchasePrice, v => set("purchasePrice", v), "600,000")}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Year Purchased <span className="text-red-400">*</span></label>
                  <select
                    value={data.purchaseYear}
                    onChange={e => set("purchaseYear", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="">Select year…</option>
                    {yearOptions.map(y => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Residency type — shown once year is selected */}
                {data.purchaseYear && (
                  <ResidencyQuestion
                    purchaseYear={data.purchaseYear}
                    residencyType={data.residencyType}
                    titleOwnership={data.titleOwnership}
                    onChange={(v) => set("residencyType", v)}
                  />
                )}
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 4: MORTGAGE ══ */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step {displayStep()} of {TOTAL_STEPS}</p>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Tell us about your mortgage</h2>
                <p className="text-sm text-gray-400">This affects your net proceeds and monthly cash flow as a landlord.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Remaining Mortgage Balance <span className="text-red-400">*</span></label>
                  {dollarInput(data.mortgageBalance, v => set("mortgageBalance", v), "350,000")}
                  <p className="text-[11px] text-gray-400 mt-1">Enter 0 if you own free and clear.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Interest Rate <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input type="text" inputMode="decimal" value={data.interestRate} onChange={e => set("interestRate", e.target.value)} placeholder="6.5" className="w-full pr-8 pl-3 py-2.5 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 5: TITLE OWNERSHIP (auto-advance) ══ */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step {displayStep()} of {TOTAL_STEPS}</p>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">How many people are on the title?</h2>
                <p className="text-sm text-gray-400">This determines your IRS Section 121 capital gains exclusion — $250K for one owner, $500K for joint ownership.</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: "single", label: "Just me", sub: "$250,000 exclusion (single filer)", Icon: UserIcon },
                  { value: "multiple", label: "Multiple people (married / joint)", sub: "$500,000 exclusion (joint return)", Icon: UsersIcon },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      set("titleOwnership", opt.value as "single" | "multiple");
                      setTimeout(() => setStep(6), 160);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-4 rounded-xl border text-left transition-colors ${data.titleOwnership === opt.value ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"}`}
                  >
                    <opt.Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${data.titleOwnership === opt.value ? "text-blue-500" : "text-gray-300"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${data.titleOwnership === opt.value ? "text-blue-700" : "text-gray-800"}`}>{opt.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                    </div>
                    {data.titleOwnership === opt.value && <CheckCircleIcon className="w-4 h-4 text-blue-500 ml-auto mt-1 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP 6: CONTACT ══ */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step {displayStep()} of {TOTAL_STEPS}</p>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Where should we send your results?</h2>
                <p className="text-sm text-gray-400">Your personalized analysis is ready — we'll also email you a copy so you have it for reference.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                  <input type="tel" value={data.phone} onChange={e => { set("phone", e.target.value); setPhoneError(e.target.value.trim() ? (validatePhoneFormat(e.target.value) ?? "") : ""); }} placeholder="(805) 555-0100" className={phoneError ? inputErrCls : inputCls} />
                  {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
                  <p className="mt-1 text-[11px] text-gray-400">We may reach out to walk through your results — no spam, ever.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input type="email" value={data.email} onChange={e => { set("email", e.target.value); setEmailError(e.target.value.trim() && !emailRegex.test(e.target.value) ? "Please enter a valid email" : ""); }} placeholder="jane@example.com" className={emailError ? inputErrCls : inputCls} />
                  {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 7: NAME ══ */}
          {step === 7 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Step {displayStep()} of {TOTAL_STEPS} — Last one!</p>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">What's your name?</h2>
                <p className="text-sm text-gray-400">We'll personalize your report with your name.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name <span className="text-red-400">*</span></label>
                  <input type="text" value={data.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                  <input type="text" value={data.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" className={inputCls} />
                </div>
              </div>
              <p className="text-[11px] text-gray-400">No spam. Your data is never sold.</p>
            </div>
          )}

          {/* ── Navigation (all steps except 1, 2, 5 which have their own CTAs) ── */}
          {step >= 3 && step !== 5 && (
            <div className="flex items-center gap-3 pt-2">
              <button onClick={prevStep} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />Back
              </button>
              {step < 7 ? (
                <button onClick={nextStep} disabled={!canAdvance() || validating} className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                  {validating ? "Verifying…" : "Continue"} <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!canAdvance() || isSubmitting} className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                  <ScaleIcon className="w-4 h-4" />
                  {isSubmitting ? "Calculating…" : "Show My Results →"}
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Footer strip ── */}
      <footer className="border-t border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between text-xs text-gray-300">
          <span>MasterKey Real Estate · Ventura County, CA</span>
          <span>DRE #01892427</span>
        </div>
      </footer>
    </div>
  );
}

export default function RentVsSellQuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
      </div>
    }>
      <QuizInner />
    </Suspense>
  );
}
