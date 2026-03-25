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
      <FinalCTASection />
    </>
  );
}

/* ═══════════════════════════════════════════════
   1. HERO — two-column: text + form left, visual right
   Modeled after Perplexity Enterprise hero
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
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-mk-cream overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — text + form */}
          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] text-gray-900 leading-[1.1] mb-6">
              AI-powered market data for your team
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-[520px]">
              One platform that combines real-time MLS data, AI analysis, and
              neighborhood intelligence to help you make smarter real estate
              decisions across the Conejo Valley.
            </p>

            {/* email gate form */}
            {submitted ? (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-8 max-w-[480px]">
                <CheckCircle2 className="w-10 h-10 text-mk-green mb-3" />
                <h2 className="font-display text-xl text-gray-900 mb-2">
                  You&apos;re in
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Welcome to MarketPulse, {form.firstName}. Check your inbox for
                  your first market report.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-7 max-w-[480px]"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-mk-teal mb-4">
                  Get free access
                </p>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="firstName" className="sr-only">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First name *"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                        errors.firstName
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last name *"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                        errors.lastName
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="sr-only">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone (optional)"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                      errors.phone
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email *"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                      errors.email
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-mk-teal text-white text-sm font-medium px-7 py-2.5 hover:bg-mk-teal/90 transition-colors"
                  >
                    Get started
                  </button>
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-mk-teal text-mk-teal text-sm font-medium px-7 py-2.5 hover:bg-mk-teal/5 transition-colors"
                  >
                    Request a demo
                  </a>
                </div>

                <p className="text-[11px] text-gray-400 mt-3">
                  Free access · No credit card required
                </p>
              </form>
            )}
          </div>

          {/* RIGHT — product visual */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-mk-teal via-mk-teal-light to-emerald-300 p-1">
              <div className="rounded-xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl">
                {/* mock header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mk-mint text-xs font-medium text-mk-teal">
                    <BarChart3 className="w-3.5 h-3.5" />
                    MarketPulse
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500">
                    <Home className="w-3.5 h-3.5" />
                    Dashboard
                  </div>
                </div>

                {/* mock content */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400 mb-1">Median price</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      $1,245,000
                    </p>
                    <p className="text-xs text-mk-green font-medium mt-1">
                      ↑ 4.2% vs last month
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-[10px] text-gray-400">Active</p>
                      <p className="text-lg font-semibold text-gray-900">
                        342
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-[10px] text-gray-400">DOM</p>
                      <p className="text-lg font-semibold text-gray-900">28</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-[10px] text-gray-400">$/sqft</p>
                      <p className="text-lg font-semibold text-gray-900">
                        $587
                      </p>
                    </div>
                  </div>

                  {/* mock chart bars */}
                  <div className="flex items-end gap-1.5 h-20 px-2">
                    {[40, 52, 45, 58, 62, 55, 68, 72, 65, 78, 74, 82].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-mk-teal/70"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 px-2">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>Jun</span>
                    <span>Sep</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* floating card */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-56">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-mk-green/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-mk-green" />
                </div>
                <span className="text-xs font-medium text-gray-900">
                  Westlake Village
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Median up 6.8% YoY. Inventory down 12%. Seller&apos;s market
                signal.
              </p>
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
    <section className="py-12 bg-mk-cream border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-sm text-gray-400 mb-8">
          Trusted by homeowners, investors, and agents across the Conejo Valley
        </p>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-mk-cream to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-mk-cream to-transparent z-10" />
          <div className="flex gap-12 items-center logo-carousel">
            {[...logoNames, ...logoNames].map((name, i) => (
              <span
                key={i}
                className="flex-shrink-0 text-sm font-medium text-gray-300 tracking-wide whitespace-nowrap"
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
   3. FEATURE ROWS — badge + two-column alternating
   ═══════════════════════════════════════════════ */
function FeatureRows() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* section badge + heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mk-mint text-xs font-medium text-mk-teal mb-5">
            <BarChart3 className="w-3.5 h-3.5" />
            MasterKey MarketPulse
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] text-gray-900 leading-tight max-w-[720px] mx-auto">
            Accurate market data is just the start. What you do with it is
            everything.
          </h2>
        </div>

        {/* alternating rows */}
        <div className="space-y-24">
          {featureRowsData.map((row, i) => (
            <div
              key={row.headline}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* text */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mk-mint text-[11px] font-medium text-mk-teal mb-4">
                  {row.badgeIcon}
                  {row.badge}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[36px] text-gray-900 leading-tight mb-4">
                  {row.headline}
                </h3>
                <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-[460px]">
                  {row.body}
                </p>
                <a
                  href="#top"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 px-5 py-2.5 hover:border-mk-teal hover:text-mk-teal transition-colors"
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
      <div className="rounded-2xl bg-gradient-to-br from-mk-mint to-mk-teal-light/30 p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="px-2 py-1 rounded bg-mk-teal text-white font-medium">
              MLS
            </span>
            <span>Conejo Valley · Updated today</span>
          </div>
          <div className="space-y-3">
            {[
              { area: "Thousand Oaks", price: "$1,245,000", change: "+4.2%" },
              { area: "Westlake Village", price: "$1,890,000", change: "+6.8%" },
              { area: "Newbury Park", price: "$985,000", change: "+3.1%" },
              { area: "Agoura Hills", price: "$1,120,000", change: "+5.5%" },
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
                  <span className="text-xs font-medium text-mk-green">
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
    <div className="rounded-2xl bg-gradient-to-br from-mk-blue/10 to-mk-teal-light/20 p-6 lg:p-8">
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
   4. DARK SECTION — Conejo Valley data (like Comet)
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
    <section className="py-20 lg:py-28 bg-mk-dark text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium text-mk-teal-light mb-5">
            <Globe className="w-3.5 h-3.5" />
            Conejo Valley Intelligence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] text-white leading-tight max-w-[700px] mx-auto">
            Market intelligence at the speed of thought.
          </h2>
          <p className="text-gray-400 mt-4 max-w-[540px] mx-auto">
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
                  className={`rounded-xl px-6 py-5 transition-colors ${
                    expanded === i ? "bg-white/10" : "bg-white/5 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{item.title}</span>
                    <span className="text-white/50">
                      {expanded === i ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                  {expanded === i && (
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                      {item.body}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* visual */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-mk-green" />
              <span className="text-xs text-gray-400">Live data feed</span>
            </div>
            <div className="space-y-3">
              {[
                {
                  neighborhood: "Thousand Oaks - Lynn Ranch",
                  event: "New listing · $1,350,000",
                },
                {
                  neighborhood: "Westlake Village - North Ranch",
                  event: "Price reduced · $2,100,000 → $1,975,000",
                },
                {
                  neighborhood: "Newbury Park - Dos Vientos",
                  event: "Sold · $1,050,000 · 8 DOM",
                },
                {
                  neighborhood: "Oak Park",
                  event: "New listing · $875,000",
                },
              ].map((item) => (
                <div
                  key={item.neighborhood}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/80">
                    {item.neighborhood}
                  </span>
                  <span className="text-xs text-gray-500">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-14">
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full bg-white text-mk-dark text-sm font-medium px-7 py-2.5 hover:bg-white/90 transition-colors"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   5. BENEFITS — three columns
   ═══════════════════════════════════════════════ */
function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {benefitsData.map((b) => (
            <div key={b.title} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-mk-mint flex items-center justify-center mx-auto mb-5">
                <b.icon className="w-5 h-5 text-mk-teal" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {b.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {b.body}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="#top"
            className="inline-flex items-center px-7 py-2.5 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   6. SECURITY — 3×2 card grid on mint bg
   ═══════════════════════════════════════════════ */
function SecuritySection() {
  return (
    <section className="py-20 lg:py-28 bg-mk-mint">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] text-gray-900 leading-tight mb-4">
            Keep your clients&apos; data airtight.
          </h2>
          <p className="text-gray-500 max-w-[520px] mx-auto">
            MasterKey manages client data with the highest standards of privacy
            and security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {securityCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <card.icon className="w-5 h-5 text-mk-teal mb-4" />
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 px-6 py-2.5 hover:border-mk-teal hover:text-mk-teal transition-colors"
          >
            Learn more about our data practices
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   7. DEPARTMENT TABS — horizontal tabs
   ═══════════════════════════════════════════════ */
function DepartmentTabs() {
  const [active, setActive] = useState(0);
  const current = departmentTabs[active];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] text-gray-900 text-center leading-tight mb-12">
          Supercharge productivity for every role.
        </h2>

        {/* tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {departmentTabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                active === i
                  ? "bg-mk-teal text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-gray-900 leading-tight mb-4">
              {current.headline}
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              {current.body}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-8 min-h-[240px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-mk-teal/30 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                {current.label} dashboard preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   8. TESTIMONIALS — stats + quote grid
   ═══════════════════════════════════════════════ */
function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] text-gray-900 text-center leading-tight mb-14">
          Make more time for the work that matters.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col"
            >
              <div className="mb-4">
                <span className="text-4xl font-bold text-mk-teal">
                  {t.stat}
                </span>
                <p className="text-xs text-gray-400 mt-1">{t.statLabel}</p>
              </div>
              <blockquote className="text-sm text-gray-600 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   9. FAQ — accordion
   ═══════════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[760px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-gray-900 text-center mb-12">
          FAQs
        </h2>

        <div className="divide-y divide-gray-100">
          {faqItems.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-sm font-medium text-gray-900 pr-8 group-hover:text-mk-teal transition-colors">
                  {item.q}
                </span>
                <span className="flex-shrink-0 text-gray-400">
                  {openIndex === i ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              {openIndex === i && (
                <p className="text-sm text-gray-500 leading-relaxed pb-5 pr-12">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   10. FINAL CTA — gradient bg with dual buttons
   ═══════════════════════════════════════════════ */
function FinalCTASection() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-mk-teal via-mk-teal to-mk-teal-light overflow-hidden">
      {/* decorative shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-white/10 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-[800px] mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-8">
          Get started with MasterKey MarketPulse today
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#top"
            className="inline-flex items-center px-8 py-3 rounded-full bg-white text-mk-teal text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Get started
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center px-8 py-3 rounded-full border-2 border-white text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
