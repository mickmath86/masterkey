import { HomeIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Local Expertise You Can Count On',
    description:
      'We\'re real agents and analysts based right here in Ventura County — not a national automated tool. We understand neighborhood nuances, seasonal patterns, and what buyers in our area actually care about.',
    icon: HomeIcon,
  },
  {
    name: 'Data Backed, Not Guesswork',
    description: 'Your report blends live market trends, days-on-market analysis, comparable sales, and upgrade adjustments to give you a clearer, more realistic value than generic online estimates.',
    icon: ChartBarIcon,
  },
  {
    name: 'No Pressure — Just Transparency',
    description: 'Whether you\'re selling now, later, or just curious, we\'re here to help you make the smartest move for your situation. No calls you don\'t want. No obligations. No hard sales tactics.',
    icon: ShieldCheckIcon,
  },
]

export default function Trust() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pt-4 lg:pl-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Why Choose MasterKey</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Built on Trust & Expertise
              </p>
              <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                We're not just another online tool. We're your local real estate partners, combining deep market knowledge with advanced data analysis to give you the insights you need.
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
          <div className="flex items-start justify-end lg:order-first">
            <img
              alt="Product screenshot"
              src="/images/ventura.jpg"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 dark:hidden dark:ring-white/10"
            />
            <img
              alt="Product screenshot"
              src="/images/ventura.jpg"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 dark:ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
