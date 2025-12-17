import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

export default function Content6() {

  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 dark:bg-gray-900">

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">The Verified Value Guarantee</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Selling Isn’t Just About Price — It’s About Certainty
              </h1>
              <p className="mt-6 text-xl/8 text-gray-700 dark:text-gray-300">
                If you’re like most homeowners, you don’t just want to sell — you want to sell confidently. You want to know your home is priced correctly, 
                that serious buyers will show up, and that you won’t be forced into price cuts or second-guessing weeks later. The problem is most sellers are
                asked to trust opinions, not data — and hope the market cooperates.
              </p>
              <p className="mt-4 text-xl/8 text-gray-700 dark:text-gray-300">Our process is designed to remove that uncertainty from day one.</p>
            </div>
          </div>
        </div>
        <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt=""
            src="/images/house-for-sale.jpg"
            className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228 dark:bg-gray-800 dark:ring-white/10"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg dark:text-gray-400">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">How Our M.A.S.T.E.R.™ System Removes the Guesswork</h1>
                <p className="mt-4">
                Instead of guessing what the market might pay, we establish your home’s Verified Value upfront using a professional third-party appraisal — which we pay for — 
                alongside real-time neighborhood market data. That verified number becomes the benchmark for everything we do. From pricing strategy to buyer targeting, every 
                decision is engineered to attract offers that align with that value, not undercut it.And because we stand behind that number, we put our commission on the line.
                </p>
                <p className="mt-4">
                  This means when you sell with us, you’re not just getting a price — you’re getting a guarantee. No more wondering if you priced too high or too low. No more 
                  second-guessing after the listing drops. Just clarity, confidence, and a sale that delivers exactly what your home is worth.
                </p>
              <h1 className=" mt-4 text-2xl font-semibold text-gray-900 dark:text-white">How it Works</h1>
             
              <ul role="list" className="mt-8 space-y-8 text-gray-600 dark:text-gray-400">
                <li className="flex gap-x-3">
                  {/* <CloudArrowUpIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none text-sky-600 dark:text-sky-400"
                  /> */}
                  <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3">M</h1>
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white"> Market Assessment</strong> <br />
                    <strong className="text-gray-900 dark:text-white">Establishing a Smart, Defensible Listing Price</strong> <br />
                    We begin by performing a detailed market assessment using recent neighborhood sales, active listings, buyer demand, and current market conditions. This allows us to recommend a listing price that reflects how buyers are actually behaving — not just what similar homes were listed for. This step sets the foundation for everything that follows.
                  </span>
                </li>
                <li className="flex gap-x-3">
                
                  <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3">A</h1>
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Appraisal</strong> <br />
                    <strong className="text-gray-900 dark:text-white">Independent, Third-Party Valuation (Paid for by MasterKey)</strong> <br />
                    Next, we bring in a licensed, third-party appraiser — at our expense — to establish an objective baseline value for your home. This appraisal is independent, unbiased, and grounded in real market data. It removes guesswork and gives both you and potential buyers confidence in the value of the property.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3">S</h1>
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Systems Review</strong> <br />
                    <strong className="text-gray-900 dark:text-white">Identifying Issues Before Buyers Do</strong> <br />
                    We then hire a professional home inspector to review the home's major systems — roof, plumbing, electrical, HVAC, and structure. This step helps surface any unresolved issues early, reducing surprises during escrow and strengthening buyer confidence. Transparency here protects your price and your timeline.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3">T</h1>
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">True Price Approval</strong> <br />
                    <strong className="text-gray-900 dark:text-white">Arriving at Your Verified Value</strong> <br />
                    With the market assessment, appraisal, and systems review complete, we align on your home's Verified Value — the number our guarantee is based on. This verified value sets the threshold for our offer commitment.
                    Our guarantee: if we don't secure an offer within 2% of this verified value, you don't pay us a commission.
                    This is where clarity replaces uncertainty.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3">E</h1>
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Enhanced Listing Placement</strong> <br />
                    <strong className="text-gray-900 dark:text-white">Launching With Maximum Impact From Day One</strong> <br />
                    Once your verified value is established, we activate our enhanced listing process designed to drive immediate buyer attention and momentum. This includes:
                    Professional photography and cinematic video, drone imagery to showcase the property and surrounding area, strategic pricing and positioning across all major real estate platforms, targeted exposure to qualified buyer networks and local agents, and a coordinated launch strategy to maximize first-week activity.
                    The goal is simple: strong demand early, without price reductions later.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mr-3">R</h1>
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Risk-Free Sale</strong> <br />
                    <strong className="text-gray-900 dark:text-white">Our Commission Is on the Line</strong> <br />
                    Once your home goes live, your Verified Value Guarantee is active. If we don't deliver a written offer within 2% of your verified value during the agreed timeframe, we waive our commission. You're not paying for effort — you're paying for results.
                    This is how we align our incentives with yours.
                  </span>
                </li>
              </ul>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
