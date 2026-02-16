import { HomeIcon, TruckIcon, AcademicCapIcon, ChartBarIcon, HeartIcon, ShieldCheckIcon, CurrencyDollarIcon, MapIcon } from '@heroicons/react/24/outline'

const categories = [
  {
    title: 'Amenities',
    description: 'Access to parks, trails, shopping, dining, recreation, and everyday conveniences. Higher scores indicate stronger lifestyle convenience without long drives.',
    icon: HomeIcon,
  },
  {
    title: 'Transit & Commute',
    description: 'Ease of getting in and out of the area, freeway proximity, internal road flow, and commute efficiency. Public transit is considered but weighted lightly given local norms.',
    icon: TruckIcon,
  },
  {
    title: 'Schools',
    description: 'Quality and reputation of the actual local feeder schools serving the area (elementary → middle → high). This category reflects resale impact even for buyers without children.',
    icon: AcademicCapIcon,
  },
  {
    title: 'Economic Stability',
    description: 'Income profile, ownership tenure, demand consistency, and how well the area historically holds value during market cycles.',
    icon: ChartBarIcon,
  },
  {
    title: 'Health & Safety Access',
    description: 'Proximity to hospitals, urgent care, fire stations, police services, and overall emergency response efficiency.',
    icon: HeartIcon,
  },
  {
    title: 'Crime',
    description: 'Relative safety compared to other Thousand Oaks areas, focusing on violent crime rarity and overall neighborhood security.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Area Value',
    description: 'Cost relative to lifestyle quality, schools, safety, and long-term fundamentals. This is not affordability alone.',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'Space & Density',
    description: 'Lot sizes, spacing between homes, traffic volume, visual openness, and overall crowding. Higher scores reflect a more open, less congested living environment.',
    icon: MapIcon,
  },
]

export function ScoringFramework() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-[#29B6F6] mb-4">
            MasterKey Scoring Framework
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Each area is evaluated across 8 categories, with each category scored on a 1–10 scale. 
            The Area Score represents the average of these category scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#29B6F6]/10 p-3 rounded-lg">
                  <category.icon className="h-6 w-6 text-[#29B6F6]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#29B6F6] mb-3">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
