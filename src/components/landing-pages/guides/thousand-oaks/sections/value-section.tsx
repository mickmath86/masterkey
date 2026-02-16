import { HomeIcon, AcademicCapIcon, MapPinIcon, ShieldCheckIcon, ChartBarIcon, BuildingOfficeIcon, HeartIcon, CubeIcon, StarIcon } from '@heroicons/react/24/outline'

const categories = [
  {
    name: 'Amenities',
    description: 'Parks, shopping, dining, entertainment, and recreational facilities in each neighborhood.',
    icon: HomeIcon,
  },
  {
    name: 'Transit & Commute',
    description: 'Access to highways, public transportation, and average commute times to major employment centers.',
    icon: MapPinIcon,
  },
  {
    name: 'Schools',
    description: 'Quality of local schools, test scores, and educational opportunities for families.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Economic Stability',
    description: 'Job market strength, income levels, and overall economic health of the area.',
    icon: ChartBarIcon,
  },
  {
    name: 'Health & Safety Access',
    description: 'Proximity to hospitals, medical facilities, and emergency services.',
    icon: HeartIcon,
  },
  {
    name: 'Crime',
    description: 'Safety ratings, crime statistics, and overall security of each neighborhood.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Area Value',
    description: 'Property values, appreciation trends, and investment potential.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Space & Density',
    description: 'Lot sizes, home spacing, population density, and overall neighborhood feel.',
    icon: CubeIcon,
  },
  {
    name: 'Overall Score',
    description: 'Comprehensive rating averaging all categories for an at-a-glance comparison.',
    icon: StarIcon,
  },
]

export default function ValueSection() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">
            Data-Driven Insights
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Everything You Need to Know About Thousand Oaks Neighborhoods
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
            Our comprehensive guide rates each of the 10 neighborhoods across 9 critical categories. 
            Make informed decisions about where to live, invest, or sell based on real data and expert analysis.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {categories.map((category) => (
              <div key={category.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-sky-600">
                    <category.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {category.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">
                  {category.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* What's Included Section */}
        <div className="mx-auto mt-24 max-w-7xl sm:mt-32">
          <div className="rounded-2xl bg-gray-50 p-8 lg:p-12 dark:bg-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  What's Included in Your Free Guide
                </h3>
                <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <svg className="size-6 text-sky-600 mr-3 flex-shrink-0 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-gray-900 dark:text-white">Detailed scorecards</strong> for all 10 Thousand Oaks neighborhoods</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="size-6 text-sky-600 mr-3 flex-shrink-0 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-gray-900 dark:text-white">Ratings out of 10</strong> across 9 essential categories</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="size-6 text-sky-600 mr-3 flex-shrink-0 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-gray-900 dark:text-white">Expert video reviews</strong> filmed on-location in each neighborhood</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="size-6 text-sky-600 mr-3 flex-shrink-0 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-gray-900 dark:text-white">Side-by-side comparisons</strong> to help you make the right choice</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="size-6 text-sky-600 mr-3 flex-shrink-0 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-gray-900 dark:text-white">Local insights</strong> from MasterKey's experienced real estate team</span>
                  </li>
                </ul>
              </div>

              {/* Right Column - Image */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src="/images/scorecard-preview.png"
                    alt="Thousand Oaks Scorecard Preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
