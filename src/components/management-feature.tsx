import { BuildingOfficeIcon, CreditCardIcon, ChartBarSquareIcon } from '@heroicons/react/20/solid'
import { FadeInUp } from './animations'

const features = [
  {
    name: 'Smart Property Operations',
    description:
      'Automated maintenance scheduling, tenant communications, and property inspections powered by IoT sensors and predictive analytics.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Digital Payment Processing',
    description: 'Seamless rent collection, automated late fee processing, and instant financial reporting through our integrated payment platform.',
    icon: CreditCardIcon,
  },
  {
    name: 'Performance Analytics',
    description: 'Comprehensive dashboards tracking occupancy rates, maintenance costs, and ROI with real-time market comparisons.',
    icon: ChartBarSquareIcon,
  },
]

export default function ManagementFeature() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <FadeInUp>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pt-4 lg:pl-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-primary dark:text-indigo-400">Property Management</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Intelligent Portfolio Management
              </p>
              <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                Maximize your property investments with our comprehensive management platform. From tenant screening to maintenance coordination, we handle every aspect of property management with cutting-edge technology.
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
          <div className="flex items-start justify-end lg:order-first">
            <img
              alt="Modern apartment building with smart technology features"
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2432&h=1442&fit=crop&crop=center"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 dark:hidden dark:ring-white/10"
            />
            <img
              alt="Property management dashboard on tablet with building analytics"
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2432&h=1442&fit=crop&crop=center"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 dark:ring-white/10"
            />
          </div>
        </div>
        </FadeInUp>
      </div>
    </section>
  )
}
