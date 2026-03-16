"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Gradient } from "@/components/gradient";
import { GooglePlacesInput } from "@/components/ui/google-places-input";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HomeValueFormData {
  // Step 1 — Address
  propertyAddress: string;
  // Step 2 — Property basics
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  // Step 3 — Condition & features
  condition: string;
  garage: string;
  features: string[];
  // Step 4 — Recent updates
  kitchenUpdate: string;
  bathroomUpdate: string;
  roofUpdate: string;
  hvacUpdate: string;
  // Step 5 — Seller context
  timeline: string;
  reason: string;
  // Step 6 — Contact
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const INITIAL: HomeValueFormData = {
  propertyAddress: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  yearBuilt: "",
  condition: "",
  garage: "",
  features: [],
  kitchenUpdate: "",
  bathroomUpdate: "",
  roofUpdate: "",
  hvacUpdate: "",
  timeline: "",
  reason: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

// ─── Option sets ──────────────────────────────────────────────────────────────

const propertyTypes = [
  "Single Family Home",
  "Condo / Townhome",
  "Multi-Family (2–4 units)",
  "Land / Lot",
];

const bedroomOptions = ["1", "2", "3", "4", "5", "6+"];
const bathroomOptions = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5+"];
const garageOptions = ["None", "1-Car Garage", "2-Car Garage", "3-Car Garage", "Carport"];

const conditionOptions = [
  "Excellent — like new / recently renovated",
  "Good — well maintained, minor wear",
  "Fair — needs some updating",
  "Needs Work — significant repairs needed",
];

const featureOptions = [
  "Swimming Pool",
  "Mountain / Canyon View",
  "Solar Panels (owned)",
  "ADU / Guest House",
  "Smart Home System",
  "Updated Kitchen",
];

const updateOptions = [
  "Within the last year",
  "1–5 years ago",
  "5–10 years ago",
  "10+ years ago / original",
  "Not applicable",
];

const timelineOptions = [
  "ASAP / within 3 months",
  "3–6 months",
  "6–12 months",
  "1–2 years",
  "Just exploring / no set timeline",
];

const reasonOptions = [
  "Upsizing / growing family",
  "Downsizing",
  "Relocating",
  "Investment / portfolio optimization",
  "Estate / inherited property",
  "Life change (divorce, retirement, etc.)",
  "Other",
];

// ─── Reusable option button ───────────────────────────────────────────────────

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 text-left border rounded-lg transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50 text-blue-900"
          : "border-gray-300 hover:border-gray-400 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{label}</span>
        {selected && (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Reusable text input ──────────────────────────────────────────────────────

function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      />
    </div>
  );
}

// ─── Step validation ──────────────────────────────────────────────────────────

function isStepValid(step: number, data: HomeValueFormData): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  switch (step) {
    case 1: return !!data.propertyAddress.trim();
    case 2: return !!data.propertyType && !!data.bedrooms && !!data.bathrooms && !!data.sqft && !!data.yearBuilt;
    case 3: return !!data.condition && !!data.garage;
    case 4: return !!data.kitchenUpdate && !!data.bathroomUpdate && !!data.roofUpdate && !!data.hvacUpdate;
    case 5: return !!data.timeline && !!data.reason;
    case 6:
      return (
        !!data.firstName.trim() &&
        !!data.lastName.trim() &&
        !!data.phone.trim() &&
        !!data.email.trim() &&
        emailRegex.test(data.email)
      );
    default: return false;
  }
}

// ─── Webhook URL ──────────────────────────────────────────────────────────────

const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/63dbb140-9990-4cb4-8954-e6d59f3813ce";

// ─── Main component ───────────────────────────────────────────────────────────

function HomeValueQuestionnaireContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState<HomeValueFormData>(INITIAL);

  const totalSteps = 6;

  function set<K extends keyof HomeValueFormData>(key: K, value: HomeValueFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFeature(feature: string) {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }

  function handleEmailChange(email: string) {
    set("email", email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }

  async function handleSubmit() {
    if (!isStepValid(6, formData)) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        features: formData.features.join(", "),
        submittedAt: new Date().toISOString(),
        formType: "home-value",
        source: "homevalue-questionnaire",
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // continue to results regardless
    } finally {
      setIsSubmitting(false);
      // Store for results page
      sessionStorage.setItem("hv_form", JSON.stringify(formData));
      router.push("/homevalue/results");
    }
  }

  const valid = isStepValid(step, formData);

  // ── Step titles ──────────────────────────────────────────────────────────────

  const stepMeta: Record<number, { heading: string; sub: string }> = {
    1: {
      heading: "What's the address of the property you want to value?",
      sub: "Enter the full address so we can pull accurate market data and comparable sales.",
    },
    2: {
      heading: "Tell us about your property",
      sub: "Basic details help us find the most relevant comparable sales.",
    },
    3: {
      heading: "Condition and features",
      sub: "These factors significantly affect your home's market value.",
    },
    4: {
      heading: "Any recent updates or improvements?",
      sub: "Renovations and replacements can meaningfully boost your estimate.",
    },
    5: {
      heading: "What's your selling timeline?",
      sub: "This helps us tailor your report and market strategy.",
    },
    6: {
      heading: "Where should we send your valuation report?",
      sub: "Your report is ready the moment you submit.",
    },
  };

  return (
    <div className="h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden md:flex flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)",
          }}
        />
        <Gradient className="absolute inset-0 opacity-90" />
        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="secondary"
            href="/homevalue"
            className="flex items-center gap-2 text-sm bg-white/90 backdrop-blur-sm"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Find Out What Your Home Is Worth</h1>
            <p className="text-lg opacity-85 max-w-md mx-auto">
              Get a free, data-driven estimate based on live market data and
              comparable sales in your neighborhood.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-xs mx-auto text-sm">
              {["2 minutes", "100% Free", "No obligation", "Instant results"].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 font-medium"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-white flex flex-col overflow-scroll relative">
        {/* Header + stepper */}
        <div className="p-8 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Home Valuation</h2>
            <span className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Stepper value={step} className="w-full">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <StepperItem key={s} step={s} className="flex-1">
                <StepperTrigger>
                  <StepperIndicator>{s}</StepperIndicator>
                </StepperTrigger>
                {s < totalSteps && <StepperSeparator />}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        {/* Form body */}
        <div className="flex-1 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {stepMeta[step].heading}
          </h3>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            {stepMeta[step].sub}
          </p>

          {/* ── Step 1 — Address ── */}
          {step === 1 && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address <span className="text-red-500">*</span>
                </label>
                <GooglePlacesInput
                  value={formData.propertyAddress}
                  onChange={(address) => set("propertyAddress", address)}
                  placeholder="e.g., 123 Oak Ridge Drive, Thousand Oaks, CA 91360"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
            </div>
          )}

          {/* ── Step 2 — Property basics ── */}
          {step === 2 && (
            <div className="space-y-6 max-w-lg">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Property Type</p>
                <div className="grid grid-cols-1 gap-2">
                  {propertyTypes.map((t) => (
                    <OptionButton
                      key={t}
                      label={t}
                      selected={formData.propertyType === t}
                      onClick={() => set("propertyType", t)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Bedrooms</p>
                  <div className="flex flex-wrap gap-2">
                    {bedroomOptions.map((b) => (
                      <button
                        key={b}
                        onClick={() => set("bedrooms", b)}
                        className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                          formData.bedrooms === b
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Bathrooms</p>
                  <div className="flex flex-wrap gap-2">
                    {bathroomOptions.map((b) => (
                      <button
                        key={b}
                        onClick={() => set("bathrooms", b)}
                        className={`w-14 h-12 rounded-lg border text-sm font-medium transition-colors ${
                          formData.bathrooms === b
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  id="sqft"
                  label="Living Area (sqft)"
                  value={formData.sqft}
                  onChange={(v) => set("sqft", v)}
                  placeholder="2,100"
                  required
                />
                <TextInput
                  id="yearBuilt"
                  label="Year Built"
                  value={formData.yearBuilt}
                  onChange={(v) => set("yearBuilt", v)}
                  placeholder="1995"
                  required
                />
              </div>
            </div>
          )}

          {/* ── Step 3 — Condition & features ── */}
          {step === 3 && (
            <div className="space-y-6 max-w-lg">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Overall Condition</p>
                <div className="grid grid-cols-1 gap-2">
                  {conditionOptions.map((c) => (
                    <OptionButton
                      key={c}
                      label={c}
                      selected={formData.condition === c}
                      onClick={() => set("condition", c)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Garage</p>
                <div className="grid grid-cols-1 gap-2">
                  {garageOptions.map((g) => (
                    <OptionButton
                      key={g}
                      label={g}
                      selected={formData.garage === g}
                      onClick={() => set("garage", g)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Additional Features{" "}
                  <span className="text-gray-400 font-normal">(select all that apply)</span>
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {featureOptions.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                        formData.features.includes(f)
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-300 hover:border-gray-400 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{f}</span>
                        {formData.features.includes(f) && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4 — Updates ── */}
          {step === 4 && (
            <div className="space-y-6 max-w-lg">
              {[
                { label: "Kitchen Update", key: "kitchenUpdate" as const },
                { label: "Bathroom Update(s)", key: "bathroomUpdate" as const },
                { label: "Roof", key: "roofUpdate" as const },
                { label: "HVAC / Heating & Cooling", key: "hvacUpdate" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {updateOptions.map((opt) => (
                      <OptionButton
                        key={opt}
                        label={opt}
                        selected={formData[key] === opt}
                        onClick={() => set(key, opt)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 5 — Timeline ── */}
          {step === 5 && (
            <div className="space-y-6 max-w-lg">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  When are you thinking of selling?
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {timelineOptions.map((t) => (
                    <OptionButton
                      key={t}
                      label={t}
                      selected={formData.timeline === t}
                      onClick={() => set("timeline", t)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Primary reason for selling
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {reasonOptions.map((r) => (
                    <OptionButton
                      key={r}
                      label={r}
                      selected={formData.reason === r}
                      onClick={() => set("reason", r)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6 — Contact ── */}
          {step === 6 && (
            <div className="space-y-5 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  id="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={(v) => set("firstName", v)}
                  placeholder="John"
                  required
                />
                <TextInput
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(v) => set("lastName", v)}
                  placeholder="Doe"
                  required
                />
              </div>
              <TextInput
                id="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(v) => set("phone", v)}
                placeholder="(805) 555-0100"
                required
              />
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    emailError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                By submitting, you agree to receive communications from MasterKey Real
                Estate. We will never sell your information.
              </p>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div className="p-8 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!valid}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!valid || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting…" : "Get my valuation"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeValueQuestionnaire() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading…</div>}>
      <HomeValueQuestionnaireContent />
    </Suspense>
  );
}
