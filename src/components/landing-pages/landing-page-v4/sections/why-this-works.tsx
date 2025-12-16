import { CurrencyIllustration } from "../components/currency-illustration";
import { VisualizationIllustration } from "../components/vizualization-illustration";
import { ChartIllustration } from '../components/chart-illustration';
import { ProtectionIllustration } from '../components/protection-illustration';

export default function WhyThisWorksSection() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        {/* <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Deploy faster</h2> */}
        <p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl dark:text-white">
         Why this works
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-t-4xl lg:rounded-tl-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              {/* <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png"
                className="h-80 object-cover object-left dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-performance.png"
                className="h-80 object-cover object-left not-dark:hidden"
              /> */}
              <div className="flex items-center justify-center p-4 h-[100%]">
                <CurrencyIllustration />
              </div>
               
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-sky-600 dark:text-sky-400">Pricing Confidence</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                 Verified Pricing Vs Guessing
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                 Most agents price homes based on opinions and hope the market agrees. We establish a verified value upfront using real data and an independent appraisal, so pricing decisions are grounded in reality from day one.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl lg:rounded-tl-4xl dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg bg-white lg:rounded-tr-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              {/* <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png"
                className="h-80 object-cover object-left lg:object-right dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-releases.png"
                className="h-80 object-cover object-left not-dark:hidden lg:object-right"
              />
              */}
               <div className="flex items-center justify-center p-4 h-[100%]">
                <VisualizationIllustration />   
              </div> 
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-sky-600 dark:text-sky-400">Seller Protection</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Appraisal-backed guarantee</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                 Your offer threshold is tied to a professional third-party appraisal — not an agent’s estimate. That verified number becomes the benchmark we’re held to, creating clarity and accountability.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-white lg:rounded-bl-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              {/* <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png"
                className="h-80 object-cover object-left dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-speed.png"
                className="h-80 object-cover object-left not-dark:hidden"
              /> */}
              <div className="max-h-96">
                    <ChartIllustration />
              </div>
              
             
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-sky-600 dark:text-sky-400">Market Advantage</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                Stronger First-Week Momentum
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                  Homes that launch with clarity and confidence attract serious buyers early. By verifying value before going live, we create urgency without overpricing — often eliminating the need for future price reductions.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-bl-4xl dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-white dark:bg-gray-800" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                <div className="pt-20 h-[100%]">
                    {/* <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                        className="h-[min(152px,40cqw)] object-cover dark:hidden"
                    />
                    <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png"
                        className="h-[min(152px,40cqw)] object-cover not-dark:hidden"
                    /> */}
                    <ProtectionIllustration />
                </div>
             
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-sky-600 dark:text-sky-400">Risk Reversal</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                 Risk shifted away from you
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                 If we don’t deliver an offer within 2% of your verified value in the agreed timeframe, we waive our commission. You’re not paying for promises — you’re paying for results.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-br-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png"
                className="h-80 object-cover dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-network.png"
                className="h-80 object-cover not-dark:hidden"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-sky-600 dark:text-sky-400">Execution</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                 Structured go-to-market plan
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                 Every listing follows a defined launch process — appraisal, inspection, pricing strategy, and a coordinated market debut — so nothing is rushed, missed, or left to chance.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-br-4xl dark:outline-white/15" />
          </div>
        </div>
      </div>
    </div>
  )
}
