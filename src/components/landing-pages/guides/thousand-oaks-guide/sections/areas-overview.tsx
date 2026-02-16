import { areasData } from '../data/areas-data'

export function AreasOverview() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-[#29B6F6] mb-4">
            10 Neighborhoods Covered
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore detailed scorecards for each of Thousand Oaks' distinct neighborhoods. 
            Click any area below to jump directly to its full analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasData.map((area) => (
            <a
              key={area.name}
              href={`#${area.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-[#29B6F6]"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#29B6F6] transition-colors">
                  {area.name}
                </h3>
                <div className="flex items-center bg-[#29B6F6] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {area.score}/10
                </div>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {area.overview}
              </p>

              <div className="flex items-center text-[#29B6F6] text-sm font-medium group-hover:translate-x-1 transition-transform">
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
