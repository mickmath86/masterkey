import { 
  HomeIcon, 
  ClockIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  WrenchScrewdriverIcon, 
  MapIcon 
} from '@heroicons/react/20/solid'
import { ChartBarInteractive } from './chart-bar-interactive'
import { FadeIn, FadeInStagger } from '@/components/animations'
import { ChartLineInteractive } from './chart-line-interactive'
import PropertyProfileMobile from '@/components/property-profile-mobile'
const features = [
  {
    name: 'Home Value Estimate',
    description: 'A detailed price range based on comps, upgrades, and condition.',
    icon: HomeIcon,
  },
  {
    name: 'Market Timing Score',
    description: 'A clear Sell/Wait recommendation based on demand, DOM, and market signals.',
    icon: ClockIcon,
  },
  {
    name: 'Buyer Demand Snapshot',
    description: 'How many buyers are actively searching for homes like yours.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Recent Comparable Sales',
    description: 'The most relevant comps in your neighborhood — automatically selected.',
    icon: ChartBarIcon,
  },
  {
    name: 'Upgrade Value Breakdown',
    description: 'We factor in your improvements and depreciate upgrades over time.',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Next-Step Plan',
    description: 'Simple recommendations to maximize your sale price when you\'re ready.',
    icon: MapIcon,
  },
]

export default function Feature2() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Everything you need</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance dark:text-white">
                What's Inside Your Sell/Wait Report
          </p>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
             A detailed analysis of your home's value, market conditions, and the optimal timing for your sale — all in one clear report.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
       
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
             <FadeIn >
                <div className="mb-8 ">
                   <div className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:grow">
            <svg role="img" viewBox="0 0 366 729" className="mx-auto w-91.5 max-w-full drop-shadow-xl">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect rx={36} width={316} height={684} />
                </clipPath>
              </defs>
              <path
                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
                fill="#4B5563"
              />
              <path
                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
                fill="#343E4E"
              />
              <foreignObject
                width={316}
                height={684}
                clipPath="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
                transform="translate(24 24)"
              >
                {/* <img alt="" src="https://tailwindcss.com/plus-assets/img/component-images/mobile-app-screenshot.png" /> */}
                  <PropertyProfileMobile />
              </foreignObject>
            </svg>
          </div>
                </div>
                   
             </FadeIn>
          {/* <div aria-hidden="true" className="relative">
            <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-white pt-[7%] dark:from-gray-900" />
          </div> */}
        </div>
       
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 dark:text-gray-400">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900 dark:text-white">
                <feature.icon
                  aria-hidden="true"
                  className="absolute top-1 left-1 size-5 text-sky-600 dark:text-sky-400"
                />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
