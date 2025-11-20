import { 
  ChartBarIcon,
  ScaleIcon, 
  MapPinIcon
} from '@heroicons/react/20/solid'
import { ChartLineInteractive } from './chart-line-interactive'


const features = [
  {
    name: 'Demand Signals',
    description: 'We track how quickly homes are selling in your area — a clear indicator of current buyer motivation.',
    icon: ChartBarIcon,
  },
  {
    name: 'Market Leverage',
    description: 'Shifts in days on market and inventory levels determine who has the advantage — buyers or sellers.',
    icon: ScaleIcon,
  },
  {
    name: 'Personalized Sell/Wait Insight',
    description: 'Your report applies these trends to your home\'s features and location to show whether selling now or waiting may be smarter.',
    icon: MapPinIcon,
  },
]

export default function ReportDemo2() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Suggestions?</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Timing is Everything
              </p>
              <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
                The difference between selling now or waiting 3–6 months can mean thousands in your pocket.
Here’s how current market conditions are shifting — and what that means for your decision.
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
          
         {/* <div className="w-full max-w-md p-4">
            <ChartLineInteractive />
         </div> */}
            
          
          <img
            alt="Landing chart screenshot"
            src="/images/landing-chart.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl    sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}
