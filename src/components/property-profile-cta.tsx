import { FadeIn, FadeInUp } from "./animations";
import { TrendingUp, Home, DollarSign } from "lucide-react";
import { AnimatedNumber } from "./animated-number";

export default function PropertyProfileCTA() {
    return (
      <FadeIn className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 dark:bg-gray-800 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:inset-ring dark:after:inset-ring-white/10 dark:after:sm:rounded-3xl">
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            >
              <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#0ea5e9" />
                  <stop offset={1} stopColor="#22c55e" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Get your property's true market value today.
              </h2>
              <p className="mt-6 text-lg/8 text-pretty text-gray-300">
                Our AI-powered valuation engine analyzes thousands of data points to provide accurate property estimates. See what your home is really worth in today's market.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="/questionnaire/real-estate-sell"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-gray-700 dark:text-white dark:shadow-none dark:inset-ring dark:inset-ring-white/5 dark:hover:bg-gray-600 dark:focus-visible:outline-white"
                >
                  Get Free Valuation 
                </a>
                {/* <a href="#" className="text-sm/6 font-semibold text-white hover:text-gray-100">
                  Learn more
                  <span aria-hidden="true">→</span>
                </a> */}
              </div>
            </div>
            <div className="relative mt-16 w-full">
              {/* <img
                alt="Property valuation dashboard"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1824&h=1080&fit=crop&crop=center"
                width={1824}
                height={1080}
                className="absolute top-0 left-0 w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              /> */}
              <FadeInUp delay={0.2}>
              <div className="relative  top-10 w-full max-w-none rounded-sm bg-white/5 ring-1 ring-white/10 p-6">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-center">
                    <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Value</h3>
                    <div className="text-3xl font-bold text-green-600 mb-1">  $<AnimatedNumber start={0} end={950000} /></div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      +12% from last year
                    </div>
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-gray-500">Low: $750,000</span>
                      <span className="text-gray-500">High: $1,200,000</span>
                    </div>
                  </div>
                </div>
              </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </FadeIn> 
    )
  }
  