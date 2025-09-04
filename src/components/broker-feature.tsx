import { ChartBarIcon, DevicePhoneMobileIcon, CpuChipIcon } from '@heroicons/react/20/solid'
import { FadeInStagger, FadeInUp } from './animations'
import {Button} from './button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Market Analysis',
    description:
      'Advanced algorithms analyze market trends, comparable sales, and neighborhood data to provide accurate property valuations and investment insights.',
    icon: CpuChipIcon,
  },
  {
    name: 'Mobile-First Platform',
    description: 'Access your entire real estate portfolio, client communications, and market data from anywhere with our cutting-edge mobile app.',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Real-Time Analytics',
    description: 'Track property performance, market shifts, and client engagement with comprehensive dashboards and automated reporting.',
    icon: ChartBarIcon,
  },
]

export default function BrokerFeature() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <FadeInUp >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
           
         
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-primary dark:text-indigo-400">Technology-Driven</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Next-Gen Real Estate
              </p>
              <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
                Experience the future of real estate with our innovative technology platform. We combine cutting-edge tools with expert market knowledge to deliver exceptional results for buyers, sellers, and investors.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-sky-500 dark:text-sky-400"
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
            alt="Modern real estate office with technology displays"
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2432&h=1442&fit=crop&crop=center"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 md:-ml-4 lg:-ml-0 dark:ring-white/10"
          />
          <img
            alt="Professional real estate team using tablets and technology"
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=2432&h=1442&fit=crop&crop=center"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0 dark:hidden dark:ring-white/10"
          />
        <Link href="/real-estate-buy" className="flex flew-row items-center gap-2 text-sky-500">Get Started <ArrowRight /></Link>
        </div>
        </FadeInUp>
      </div>
    </section>
  )
}
