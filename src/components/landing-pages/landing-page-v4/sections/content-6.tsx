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
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
