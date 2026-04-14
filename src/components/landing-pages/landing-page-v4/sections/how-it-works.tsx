const steps = [
  {
    letter: "M",
    title: "Market Assessment",
    subtitle: "Establishing a Smart, Defensible Listing Price",
    body: "We begin by performing a detailed market assessment using recent neighborhood sales, active listings, buyer demand, and current market conditions. This allows us to recommend a listing price that reflects how buyers are actually behaving — not just what similar homes were listed for. This step sets the foundation for everything that follows.",
  },
  {
    letter: "A",
    title: "Appraisal",
    subtitle: "Independent, Third-Party Valuation (Paid for by MasterKey)",
    body: "Next, we bring in a licensed, third-party appraiser — at our expense — to establish an objective baseline value for your home. This appraisal is independent, unbiased, and grounded in real market data. It removes guesswork and gives both you and potential buyers confidence in the value of the property.",
  },
  {
    letter: "S",
    title: "Systems Review",
    subtitle: "Identifying Issues Before Buyers Do",
    body: "We then hire a professional home inspector to review the home's major systems — roof, plumbing, electrical, HVAC, and structure. This step helps surface any unresolved issues early, reducing surprises during escrow and strengthening buyer confidence. Transparency here protects your price and your timeline.",
  },
  {
    letter: "T",
    title: "True Price Approval",
    subtitle: "Arriving at Your Verified Value",
    body: "With the market assessment, appraisal, and systems review complete, we align on your home's Verified Value — the number our guarantee is based on. This verified value sets the threshold for our offer commitment. Our guarantee: if we don't secure an offer within 2% of this verified value, you don't pay us a commission. This is where clarity replaces uncertainty.",
  },
  {
    letter: "E",
    title: "Enhanced Listing Placement",
    subtitle: "Launching With Maximum Impact From Day One",
    body: "Once your verified value is established, we activate our enhanced listing process designed to drive immediate buyer attention and momentum. This includes professional photography and cinematic video, drone imagery to showcase the property and surrounding area, strategic pricing and positioning across all major real estate platforms, targeted exposure to qualified buyer networks and local agents, and a coordinated launch strategy to maximize first-week activity. The goal is simple: strong demand early, without price reductions later.",
  },
  {
    letter: "R",
    title: "Risk-Free Sale",
    subtitle: "Our Commission Is on the Line",
    body: "Once your home goes live, your Verified Value Guarantee is active. If we don't deliver a written offer within 2% of your verified value during the agreed timeframe, we waive our commission. You're not paying for effort — you're paying for results. This is how we align our incentives with yours.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:text-center mb-16 sm:mb-20">
          <p className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">
            The M.A.S.T.E.R.™ System
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            How It Works
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
            Six steps that replace guesswork with a structured, data-backed process — and put our commission on the line if we don't deliver.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            aria-hidden="true"
            className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"
            style={{ marginLeft: "calc(2.75rem - 0.5px)" }}
          />

          <ol className="space-y-0">
            {steps.map((step, i) => (
              <li key={step.letter} className="relative flex gap-6 sm:gap-10">
                {/* Letter badge */}
                <div className="relative flex flex-col items-center flex-shrink-0">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white text-2xl font-bold shadow-md ring-4 ring-white dark:ring-gray-900">
                    {step.letter}
                  </div>
                  {/* Connector to next step */}
                  {i < steps.length - 1 && (
                    <div className="flex-1 w-px bg-gray-200 dark:bg-white/10 sm:hidden my-2" />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-12 pt-1 flex-1 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-sky-600 dark:text-sky-400 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-base/7 text-gray-600 dark:text-gray-400">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
