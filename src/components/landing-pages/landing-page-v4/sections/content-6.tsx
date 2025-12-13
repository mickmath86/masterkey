import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

export default function Content6() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 dark:bg-gray-900">
      {/* <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200 dark:stroke-gray-800"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
        </svg>
      </div> */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Deploy faster</p>
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">How Our Verified Value™ System Removes the Guesswork</h1>
              <p className="mt-4">
               Instead of guessing what the market might pay, we establish your home’s Verified Value upfront using a professional third-party appraisal — which we pay for — 
               alongside real-time neighborhood market data. That verified number becomes the benchmark for everything we do. From pricing strategy to buyer targeting, every 
               decision is engineered to attract offers that align with that value, not undercut it.And because we stand behind that number, we put our commission on the line.
              </p>
              <p className="mt-4">
                This means when you sell with us, you’re not just getting a price — you’re getting a guarantee. No more wondering if you priced too high or too low. No more 
                second-guessing after the listing drops. Just clarity, confidence, and a sale that delivers exactly what your home is worth.
              </p>
               <h1 className=" mt-4 text-2xl font-semibold text-gray-900 dark:text-white">How Our Verified Value™ System Removes the Guesswork</h1>
             
              <ul role="list" className="mt-8 space-y-8 text-gray-600 dark:text-gray-400">
                <li className="flex gap-x-3">
                  <CloudArrowUpIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none text-sky-600 dark:text-sky-400"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Step 1 — Book Your Consultation & Pricing Review</strong> <br />
                   You start by calling or texting to schedule a listing consultation. On that call, we answer your questions about your neighborhood market, timing, and pricing. Before we meet, we prepare a recommended list price based on local comps and send you our full Listing Presentation Package so you know exactly how the process works.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <LockClosedIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none text-sky-600 dark:text-sky-400"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Step 2 — Set Your Verified Value & Prepare to Launch</strong> <br />
                     Once you decide to move forward and sign the listing agreement, we begin our 7-day go-to-market preparation. During this time, we schedule a professional appraisal at our expense, coordinate a property inspection with an approved vendor of your choice, and finalize your pricing and marketing strategy. The appraisal establishes your Verified Value — the number your guarantee is based on.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <ServerIcon
                    aria-hidden="true"
                    className="mt-1 size-5 flex-none text-sky-600 dark:text-sky-400"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">Step 3 — Go Live With the Verified Value Guarantee</strong> <br />
                    At the end of the 7-day prep period, your home goes live across all major platforms. From that moment, your 60-day Verified Value Guarantee begins. If we don’t secure a written offer within 2% of your verified appraised value, you don’t pay us a commission. We put our performance — and our fee — on the line.
                  </span>
                </li>
              </ul>
              <p className="mt-8">
                Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor
                fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac
                adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
              </p>
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                No server? No problem.
              </h2>
              <p className="mt-6">
                Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
                Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
                tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam
                turpis ipsum eu a sed convallis diam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
