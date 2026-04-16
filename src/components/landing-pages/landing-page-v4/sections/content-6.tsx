"use client";

import { Reveal } from "../components/reveal";

export default function Content6() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 dark:bg-gray-900">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">

        {/* ── Headline block (left col, row 1) ── */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <Reveal type="left">
              <div className="lg:max-w-lg">
                <p className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">The Verified Value Guarantee</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                  Selling Isn't Just About Price — It's About Certainty
                </h1>
                <p className="mt-6 text-xl/8 text-gray-700 dark:text-gray-300">
                  If you're like most homeowners, you don't just want to sell — you want to sell confidently. You want to know your home is priced correctly,
                  that serious buyers will show up, and that you won't be forced into price cuts or second-guessing weeks later. The problem is most sellers are
                  asked to trust opinions, not data — and hope the market cooperates.
                </p>
                <p className="mt-4 text-xl/8 text-gray-700 dark:text-gray-300">
                  Our process is designed to remove that uncertainty from day one.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Sticky image (right col, rows 1–2) ── */}
        <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <Reveal type="scale" delay={1}>
            <img
              alt=""
              src="/images/house-for-sale.jpg"
              className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228 dark:bg-gray-800 dark:ring-white/10"
            />
          </Reveal>
        </div>

        {/* ── Body copy + MASTER steps (left col, row 2) ── */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg dark:text-gray-400">
              <Reveal type="up">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  How Our M.A.S.T.E.R.™ System Removes the Guesswork
                </h1>
                <p className="mt-4">
                  Instead of guessing what the market might pay, we establish your home's Verified Value upfront using a professional third-party appraisal — which we pay for —
                  alongside real-time neighborhood market data. That verified number becomes the benchmark for everything we do. From pricing strategy to buyer targeting, every
                  decision is engineered to attract offers that align with that value, not undercut it. And because we stand behind that number, we put our commission on the line.
                </p>
                <p className="mt-4">
                  This means when you sell with us, you're not just getting a price — you're getting a guarantee. No more wondering if you priced too high or too low. No more
                  second-guessing after the listing drops. Just clarity, confidence, and a sale that delivers exactly what your home is worth.
                </p>
                <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">How it Works</h1>
              </Reveal>

              <ul role="list" className="mt-8 space-y-8 text-gray-600 dark:text-gray-400">
                {[
                  { letter: "M", title: "Market Assessment", sub: "Establishing a Smart, Defensible Listing Price", delay: 1 as const,
                    body: "We begin by performing a detailed market assessment using recent neighborhood sales, active listings, buyer demand, and current market conditions. This allows us to recommend a listing price that reflects how buyers are actually behaving — not just what similar homes were listed for. This step sets the foundation for everything that follows." },
                  { letter: "A", title: "Appraisal", sub: "Independent, Third-Party Valuation (Paid for by MasterKey)", delay: 2 as const,
                    body: "Next, we bring in a licensed, third-party appraiser — at our expense — to establish an objective baseline value for your home. This appraisal is independent, unbiased, and grounded in real market data. It removes guesswork and gives both you and potential buyers confidence in the value of the property." },
                  { letter: "S", title: "Systems Review", sub: "Identifying Issues Before Buyers Do", delay: 3 as const,
                    body: "We then hire a professional home inspector to review the home's major systems — roof, plumbing, electrical, HVAC, and structure. This step helps surface any unresolved issues early, reducing surprises during escrow and strengthening buyer confidence. Transparency here protects your price and your timeline." },
                  { letter: "T", title: "True Price Approval", sub: "Arriving at Your Verified Value", delay: 4 as const,
                    body: "With the market assessment, appraisal, and systems review complete, we align on your home's Verified Value — the number our guarantee is based on. Our guarantee: if we don't secure an offer within 2% of this verified value, you don't pay us a commission. This is where clarity replaces uncertainty." },
                  { letter: "E", title: "Enhanced Listing Placement", sub: "Launching With Maximum Impact From Day One", delay: 5 as const,
                    body: "Once your verified value is established, we activate our enhanced listing process: professional photography and cinematic video, drone imagery, strategic pricing across all major platforms, targeted exposure to qualified buyer networks, and a coordinated launch strategy to maximize first-week activity. Strong demand early, without price reductions later." },
                  { letter: "R", title: "Risk-Free Sale", sub: "Our Commission Is on the Line", delay: 5 as const,
                    body: "Once your home goes live, your Verified Value Guarantee is active. If we don't deliver a written offer within 2% of your verified value during the agreed timeframe, we waive our commission. You're not paying for effort — you're paying for results. This is how we align our incentives with yours." },
                ].map((step) => (
                  <Reveal key={step.letter} type="up" delay={step.delay}>
                    <li className="flex gap-x-3">
                      <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3 flex-shrink-0">{step.letter}</h1>
                      <span>
                        <strong className="font-semibold text-gray-900 dark:text-white">{step.title}</strong>{" "}
                        <br />
                        <strong className="text-gray-900 dark:text-white">{step.sub}</strong>{" "}
                        <br />
                        {step.body}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
