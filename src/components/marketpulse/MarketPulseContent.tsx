"use client";

import { useState } from "react";
import { insertLead } from "@/lib/queries";
import {
  BarChart3,
  TrendingUp,
  Home,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Search,
  Globe,
  Send,
  Shield,
  Lock,
  Clock,
  Users,
  Key,
  Bell,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   VALIDATION HELPERS
   ═══════════════════════════════════════════════ */
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v: string) {
  if (!v.trim()) return true;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const logoNames = [
  "Coldwell Banker",
  "Keller Williams",
  "RE/MAX",
  "Compass",
  "eXp Realty",
  "Century 21",
  "Sotheby's",
  "Berkshire Hathaway",
  "Redfin",
  "Zillow",
];

const featureRowsData = [
  {
    badge: "Market Intelligence",
    badgeIcon: <TrendingUp className="w-3.5 h-3.5" />,
    headline: "Real-time pricing & inventory data",
    body: "Surface answers from live MLS feeds. Find deep pricing insights in seconds using integrations that centralize your market's data — from the sources agents already trust.",
    cta: "Explore data sources",
    visual: "pricing",
  },
  {
    badge: "Neighborhood Analysis",
    badgeIcon: <MapPin className="w-3.5 h-3.5" />,
    headline: "Hyper-local neighborhood research",
    body: "Get verifiable, data-backed answers to any neighborhood question. Compare schools, crime rates, walkability, and appreciation — then dive deeper with AI-generated follow-up analysis.",
    cta: "Start analyzing",
    visual: "neighborhood",
  },
];

const benefitsData = [
  {
    icon: Search,
    title: "Out-research the competition",
    body: "Get precise market answers with data citations you can trust and smart follow-up analysis that helps you stay ahead of other agents.",
  },
  {
    icon: Globe,
    title: "Use AI where you already work",
    body: "Have MarketPulse answer questions, generate CMAs, and prepare listing presentations — all from your browser, desktop, or phone.",
  },
  {
    icon: Send,
    title: "Tackle complex transactions",
    body: "Analyze comps, create market reports, build investment models, and more — just by asking MarketPulse in plain language.",
  },
];

const securityCards = [
  {
    icon: Shield,
    title: "MLS-verified data",
    body: "Every data point is sourced from verified MLS feeds and public records you can trust.",
  },
  {
    icon: Lock,
    title: "Client data privacy",
    body: "Client information is never shared, sold, or used for training. Your data stays yours.",
  },
  {
    icon: Clock,
    title: "Real-time updates",
    body: "Market data refreshes daily so you're always working with the latest numbers.",
  },
  {
    icon: Users,
    title: "Team management",
    body: "Easily manage who on your team can access reports and how insights are shared.",
  },
  {
    icon: Key,
    title: "Secure access",
    body: "Single sign-on and role-based access keep your brokerage data airtight.",
  },
  {
    icon: Bell,
    title: "Market alerts",
    body: "Get notified the moment a listing hits, a price drops, or a neighborhood trend shifts.",
  },
];

const departmentTabs = [
  {
    label: "Buyers",
    headline: "Empower buyers with market clarity",
    body: "Help buyers make confident offers with real-time comp analysis, neighborhood scoring, and AI-powered price predictions that show exactly what a home is worth.",
    visual: "buyers",
  },
  {
    label: "Sellers",
    headline: "Price listings to sell faster",
    body: "Use AI-driven CMA tools and absorption rate analysis to recommend the perfect list price — backed by data your sellers can see and trust.",
    visual: "sellers",
  },
  {
    label: "Investors",
    headline: "Identify high-yield opportunities",
    body: "Analyze cap rates, cash-on-cash returns, and rental demand across the Conejo Valley to surface properties with the strongest investment potential.",
    visual: "investors",
  },
  {
    label: "Agents",
    headline: "Accelerate every transaction",
    body: "From prospecting to close, MarketPulse handles the research so you can focus on relationships. Generate listing presentations, buyer tours, and market updates in seconds.",
    visual: "agents",
  },
  {
    label: "Brokers",
    headline: "Scale your brokerage intelligence",
    body: "Give every agent on your team access to the same AI-powered market data. Track market share, identify growth opportunities, and keep your brokerage ahead.",
    visual: "brokers",
  },
];

const testimonials = [
  {
    name: "Sarah & David M.",
    role: "Thousand Oaks sellers",
    stat: "4",
    statLabel: "days to multiple offers",
    quote:
      "MarketPulse gave us clarity we never had. We listed at the right price, received multiple offers in four days, and closed above asking.",
  },
  {
    name: "James R.",
    role: "Westlake Village buyer",
    stat: "12%",
    statLabel: "below initial budget",
    quote:
      "My agent used MarketPulse to find a neighborhood I never would have considered. We ended up paying 12% less than I expected for a better home.",
  },
  {
    name: "Linda K.",
    role: "Real estate investor",
    stat: "3x",
    statLabel: "faster deal analysis",
    quote:
      "I used to spend days analyzing a potential investment property. With MarketPulse, I get the full picture in under an hour.",
  },
];

const faqItems = [
  {
    q: "What is MarketPulse?",
    a: "MarketPulse is MasterKey's AI-powered market intelligence platform. It combines real-time MLS data, public records, and AI analysis to deliver instant insights about pricing trends, inventory, and neighborhood dynamics in the Conejo Valley.",
  },
  {
    q: "How is the data sourced and how current is it?",
    a: "MarketPulse pulls from verified MLS feeds, county assessor records, and public data sources. Market data refreshes daily, so you're always working with the latest numbers.",
  },
  {
    q: "Is MarketPulse free?",
    a: "Yes — sign up to receive monthly market reports and basic neighborhood insights at no cost. Premium features including real-time alerts, investment scoring, and team access are available for MasterKey clients.",
  },
  {
    q: "What areas does MarketPulse cover?",
    a: "MarketPulse currently covers the entire Conejo Valley including Thousand Oaks, Westlake Village, Newbury Park, Agoura Hills, Oak Park, and surrounding communities.",
  },
  {
    q: "Can I use MarketPulse as a real estate agent?",
    a: "Absolutely. Many agents use MarketPulse to prepare listing presentations, generate CMAs, and provide clients with data-backed recommendations. Team and brokerage plans are available.",
  },
  {
    q: "How does MarketPulse protect my data?",
    a: "Your personal information and search history are never shared, sold, or used for model training. We use industry-standard encryption and access controls to keep your data secure.",
  },
];

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function MarketPulseContent({
  onGateCleared,
}: {
  onGateCleared?: () => void;
}) {
  return (
    <>
      <HeroSection onGateCleared={onGateCleared} />
      <LogoBar />
      <FeatureRows />
      <DarkSection />
      <BenefitsSection />
      <SecuritySection />
      <DepartmentTabs />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection onGateCleared={onGateCleared} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   1. HERO — dark theme matching buyerguide
   ═══════════════════════════════════════════════ */
function HeroSection({ onGateCleared }: { onGateCleared?: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name];
        return copy;
      });
    }
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      next.email = "Please enter a valid email";
    }
    if (form.phone.trim() && !isValidPhone(form.phone)) {
      next.phone = "Please enter a valid phone number";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    // Save lead to Supabase
    try {
      await insertLead({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
      });
    } catch (err) {
      // If duplicate email, that's OK — still let them through
      console.log("Lead insert:", err);
    }

    setSubmitted(true);
    if (onGateCleared) {
      // brief delay to show success before transitioning to dashboard
      setTimeout(() => onGateCleared(), 1200);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gray-950 pb-0 pt-0">
      {/* Background glow blobs — matches buyerguide exactly */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-500/[0.08] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — copy + form */}
          <div className="py-12 lg:py-20">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full mb-6">
              <BarChart3 className="w-3.5 h-3.5" />
              Live Market Intelligence — Conejo Valley
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              AI-powered data for<br />
              <span className="text-green-400">smarter decisions</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              One platform that combines real-time MLS data, AI analysis, and
              neighborhood intelligence to help you navigate the Conejo Valley
              market with confidence.
            </p>

            {/* Form */}
            {submitted ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-[480px]">
                <CheckCircle2 className="w-10 h-10 text-green-400 mb-3" />
                <h2 className="text-xl font-bold text-white mb-2">
                  You&apos;re in
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Welcome to MarketPulse, {form.firstName}. Loading your
                  dashboard now…
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-4 max-w-[480px]"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  Get free access
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className={`w-full px-3 py-2.5 bg-white/10 border rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                        errors.firstName
                          ? "border-red-400 focus:ring-red-400"
                          : "border-white/20 focus:border-green-400"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-red-400 mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Smith"
                      className={`w-full px-3 py-2.5 bg-white/10 border rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                        errors.lastName
                          ? "border-red-400 focus:ring-red-400"
                          : "border-white/20 focus:border-green-400"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-red-400 mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">
                    Phone{" "}
                    <span className="text-white/30 font-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(805) 555-0100"
                    className={`w-full px-3 py-2.5 bg-white/10 border rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:outline-none ${
                      errors.phone
                        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                        : "border-white/20 focus:ring-green-400 focus:border-green-400"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={`w-full px-3 py-2.5 bg-white/10 border rounded-lg text-sm text-white placeholder-white/30 focus:ring-2 focus:outline-none ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                        : "border-white/20 focus:ring-green-400 focus:border-green-400"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  View the Dashboard — Free
                </button>

                <p className="text-xs text-white/30 text-center leading-relaxed">
                  No spam, ever. We will never sell your information.
                </p>
              </form>
            )}

            {/* What's inside checklist */}
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
              What&apos;s inside
            </p>
            <ul className="space-y-2.5">
              {[
                "Live median prices across 6 Conejo Valley submarkets",
                "Months of supply, active inventory & absorption rates",
                "AI-generated market summaries updated daily",
                "Recent comp sales with price-per-sqft analysis",
                "Buyer vs. seller market signals at a glance",
                "Historical price trends going back 12+ months",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — dashboard preview card */}
          <div className="hidden lg:flex justify-end items-center pb-12 lg:pb-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-green-500/20 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl w-80">
                {/* mock header */}
                <div className="bg-gray-800/60 border-b border-white/10 px-4 py-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-xs font-medium text-green-400">
                    <BarChart3 className="w-3 h-3" />
                    MarketPulse
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/40">
                    <Home className="w-3 h-3" />
                    Dashboard
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Median price */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] text-white/40 mb-1">Median Price · Thousand Oaks</p>
                    <p className="text-2xl font-bold text-white">$975,000</p>
                    <p className="text-xs text-green-400 font-medium mt-1">
                      ↑ 4.2% vs last month
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Active", val: "103" },
                      { label: "MOS", val: "3.4" },
                      { label: "$/sqft", val: "$542" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg bg-white/5 border border-white/[0.07] p-2.5">
                        <p className="text-[9px] text-white/30">{s.label}</p>
                        <p className="text-sm font-semibold text-white">{s.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart */}
                  <div className="flex items-end gap-1 h-14 px-1">
                    {[40, 52, 45, 58, 62, 55, 68, 72, 65, 78, 74, 82].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-green-500/60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-white/25 px-1">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>Jun</span>
                    <span>Sep</span>
                    <span>Dec</span>
                  </div>

                  {/* Market signal */}
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <p className="text-[11px] text-green-400 font-medium">Seller&apos;s market — low supply</p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                FREE
              </div>

              {/* Floating insight card */}
              <div className="absolute -bottom-4 -left-6 bg-gray-800 rounded-xl shadow-xl border border-white/10 p-3.5 w-52">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-green-400/10 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-white">Westlake Village</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Median up 6.8% YoY. Inventory down 12%. Seller&apos;s market signal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   2. LOGO BAR — social proof carousel
   ═══════════════════════════════════════════════ */
function LogoBar() {
  return (
    <section className="py-10 bg-gray-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <p className="text-center text-sm text-white/30 mb-6">
          Trusted by homeowners, investors, and agents across the Conejo Valley
        </p>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-950 to-transparent z-10" />
          <div className="flex gap-12 items-center logo-carousel">
            {[...logoNames, ...logoNames].map((name, i) => (
              <span
                key={i}
                className="flex-shrink-0 text-sm font-medium text-white/20 tracking-wide whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   3. FEATURE ROWS — alternating two-column
   ═══════════════════════════════════════════════ */
function FeatureRows() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* section heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-xs font-medium text-green-700 mb-5">
            <BarChart3 className="w-3.5 h-3.5" />
            MasterKey MarketPulse
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight max-w-2xl mx-auto">
            Accurate market data is just the start. What you do with it is
            everything.
          </h2>
        </div>

        <div className="space-y-24">
          {featureRowsData.map((row, i) => (
            <div
              key={row.headline}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
            >
              {/* text */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-[11px] font-medium text-green-700 mb-4">
                  {row.badgeIcon}
                  {row.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-950 leading-tight mb-4">
                  {row.headline}
                </h3>
                <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-[460px]">
                  {row.body}
                </p>
                <a
                  href="#top"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 px-5 py-2.5 hover:border-green-500 hover:text-green-600 transition-colors"
                >
                  {row.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* visual */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <FeatureVisual type={row.visual} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureVisual({ type }: { type: string }) {
  if (type === "pricing") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-green-50 to-teal-50/60 p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="px-2 py-1 rounded bg-green-600 text-white font-medium">
              MLS
            </span>
            <span>Conejo Valley · Updated today</span>
          </div>
          <div className="space-y-3">
            {[
              { area: "Thousand Oaks", price: "$975,000", change: "+4.2%" },
              { area: "Westlake Village", price: "$1,599,000", change: "+6.8%" },
              { area: "Newbury Park", price: "$998,000", change: "+3.1%" },
              { area: "Camarillo", price: "$899,000", change: "+5.5%" },
            ].map((r) => (
              <div
                key={r.area}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-gray-700">{r.area}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    {r.price}
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    {r.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-50/40 to-teal-50/40 p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <p className="text-sm text-gray-700 font-medium">
          &ldquo;Compare school ratings and walkability for Thousand Oaks vs
          Westlake Village&rdquo;
        </p>
        <div className="flex gap-2 text-xs text-gray-400">
          <span className="px-2 py-0.5 rounded-full bg-gray-50">
            Sources · 12
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-50">
            GreatSchools
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-50">
            Walk Score
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-[10px] text-gray-400 mb-1">Thousand Oaks</p>
            <p className="text-sm font-semibold text-gray-900">8.4 / 10</p>
            <p className="text-[10px] text-gray-400">School rating</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-[10px] text-gray-400 mb-1">Westlake Village</p>
            <p className="text-sm font-semibold text-gray-900">9.1 / 10</p>
            <p className="text-[10px] text-gray-400">School rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   4. DARK SECTION — full dark, accordion
   ═══════════════════════════════════════════════ */
function DarkSection() {
  const [expanded, setExpanded] = useState(0);
  const accordionItems = [
    {
      title: "Real-time",
      body: "Live MLS data refreshed daily, so every number you see is the latest available.",
    },
    {
      title: "Contextual",
      body: "AI analysis tailored to your specific question and neighborhood context.",
    },
    {
      title: "Actionable",
      body: "Every insight comes with a clear recommendation — not just data, but direction.",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-500/[0.06] blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-xs font-medium text-green-400 mb-5">
            <Globe className="w-3.5 h-3.5" />
            Conejo Valley Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto">
            Market intelligence at the speed of thought.
          </h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto">
            Instant answers across every neighborhood, price point, and property
            type.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* accordion */}
          <div className="space-y-4">
            {accordionItems.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setExpanded(i)}
                className="w-full text-left"
              >
                <div
                  className={`rounded-xl px-6 py-5 transition-colors border ${
                    expanded === i
                      ? "bg-white/10 border-white/10"
                      : "bg-white/5 border-white/[0.05] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">{item.title}</span>
                    <span className="text-white/30">
                      {expanded === i ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                  {expanded === i && (
                    <p className="mt-3 text-sm text-white/50 leading-relaxed">
                      {item.body}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* stats visual */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Conejo Valley Snapshot
            </p>
            {[
              { area: "Thousand Oaks", mos: "3.4 mo", signal: "Seller's" },
              { area: "Westlake Village", mos: "4.3 mo", signal: "Balanced" },
              { area: "Ventura", mos: "4.9 mo", signal: "Balanced" },
              { area: "Camarillo", mos: "4.1 mo", signal: "Balanced" },
              { area: "Newbury Park", mos: "3.5 mo", signal: "Seller's" },
              { area: "Oxnard", mos: "4.9 mo", signal: "Balanced" },
            ].map((r) => (
              <div
                key={r.area}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-sm text-white/70">{r.area}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">{r.mos}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      r.signal === "Seller's"
                        ? "bg-green-400/10 text-green-400"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {r.signal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   5. BENEFITS — 3-up cards
   ═══════════════════════════════════════════════ */
function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
            Built for real estate professionals
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Whether you&apos;re a buyer, agent, or investor — MarketPulse gives
            you an edge.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {benefitsData.map((b) => (
            <div
              key={b.title}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6"
            >
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <b.icon className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-950 text-sm mb-2">
                {b.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   6. SECURITY — 6-card grid
   ═══════════════════════════════════════════════ */
function SecuritySection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Data you can rely on
          </h2>
          <p className="text-white/40 mt-3 max-w-lg mx-auto">
            Built with integrity at every layer — from data sourcing to access
            controls.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityCards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="w-9 h-9 rounded-xl bg-green-400/10 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-green-400" />
              </div>
              <p className="font-semibold text-white text-sm mb-1.5">
                {c.title}
              </p>
              <p className="text-xs text-white/40 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   7. DEPARTMENT TABS
   ═══════════════════════════════════════════════ */
function DepartmentTabs() {
  const [active, setActive] = useState(0);
  const tab = departmentTabs[active];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
            Designed for every role
          </h2>
        </div>

        {/* tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {departmentTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                i === active
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-950 mb-4">
              {tab.headline}
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">{tab.body}</p>
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Learn more
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* placeholder visual */}
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-teal-50/60 border border-green-100 p-8 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">{tab.label} Dashboard</p>
              <p className="text-xs text-gray-400 mt-1">Live data · Updated daily</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   8. TESTIMONIALS
   ═══════════════════════════════════════════════ */
function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Results that speak for themselves
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col"
            >
              <div className="mb-4">
                <p className="text-3xl font-bold text-green-400">{t.stat}</p>
                <p className="text-xs text-white/40 mt-0.5">{t.statLabel}</p>
              </div>
              <p className="text-sm text-white/60 leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-white/30">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   9. FAQ
   ═══════════════════════════════════════════════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-gray-950">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   10. FINAL CTA — dark, full-width
   ═══════════════════════════════════════════════ */
function FinalCTASection({
  onGateCleared,
}: {
  onGateCleared?: () => void;
}) {
  return (
    <section className="relative py-20 lg:py-28 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-500/[0.07] blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full mb-6">
          <BarChart3 className="w-3.5 h-3.5" />
          Free access — no credit card
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          Ready to see the<br />
          <span className="text-green-400">Conejo Valley market?</span>
        </h2>
        <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md mx-auto">
          Get instant access to live pricing, inventory, and AI market summaries
          across all 6 submarkets — completely free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            View the Dashboard — Free
          </button>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-medium px-8 py-3.5 rounded-full transition-colors text-sm"
          >
            Request a demo
          </a>
        </div>
        <p className="text-white/20 text-xs mt-6">
          No spam, ever. We will never sell your information.
        </p>
      </div>
    </section>
  );
}
