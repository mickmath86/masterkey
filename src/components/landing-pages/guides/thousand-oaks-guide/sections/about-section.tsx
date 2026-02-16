export function AboutSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-light text-[#29B6F6] mb-6">
              About Thousand Oaks
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Thousand Oaks is a master-planned suburban city in the Conejo Valley, positioned 
              between Los Angeles and the coast. Employers like Amgen, Los Robles Health System, 
              Sage Publications, and regional finance and corporate offices create a high-income, 
              low-volatility employment base, which is a major reason Thousand Oaks remains 
              economically stable, predominantly owner-occupied, and more resilient during economic 
              downturns. Residents are drawn to strong schools, low crime, and extensive open space, 
              with a lifestyle defined by stability, privacy, and access to trails, parks, and nearby 
              job centers—without the density or volatility of LA.
            </p>
          </div>

          {/* Map Image */}
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/images/thousand-oaks-map.png"
              alt="Thousand Oaks Neighborhood Map"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
