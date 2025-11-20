import { 
  HomeIcon, 
  ClockIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  WrenchScrewdriverIcon, 
  MapIcon 
} from '@heroicons/react/20/solid'

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

export default function ReportDemo() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Suggestions?</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                What's Inside Your Sell/Wait Report
              </p>
              <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
                Get a personalized, data-backed breakdown of your home's value, neighborhood trends, and whether selling now or waiting could be the smarter financial move.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
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
          <img
            alt="Product screenshot"
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 md:-ml-4 lg:-ml-0 dark:ring-white/10"
          />
          <img
            alt="Product screenshot"
            src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0 dark:hidden dark:ring-white/10"
          />
        </div>
      </div>
    </div>
  )
}
