export function SentimentSummary() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-[#29B6F6] mb-4">
            What Residents Love About Thousand Oaks
          </h2>
          <p className="text-lg text-gray-600">
            Compiled from resident reviews, local realtors, and neighborhood profiles
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Across all neighborhoods, Thousand Oaks residents consistently emphasize the same core values: 
              <span className="font-semibold text-[#29B6F6]"> safety, exceptional schools, and unmatched access to nature</span>. 
              Whether living in hillside communities like Wildwood and Kevington or central areas like North Central TO, 
              families describe the city as a place where children can grow up with both suburban security and outdoor adventure.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              The <span className="font-semibold">trail systems and open space</span> are mentioned repeatedly—not as occasional amenities, 
              but as defining lifestyle features. Residents in Wildwood, Lang Ranch, and Sunset Hills speak of hiking, biking, 
              and walking as daily routines rather than weekend activities. The connection to nature is woven into the identity 
              of nearly every neighborhood.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              <span className="font-semibold">Community and social connection</span> emerge as unexpected strengths. From the 
              Conejo Family Country Club in Conejo Oaks to the tight-knit Eichler community's Halloween celebrations, 
              residents describe neighborhoods where people know each other, gather regularly, and maintain long-term ownership. 
              The phrase "people come back to raise their families here" appears across multiple sources.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              <span className="font-semibold">School quality</span> is not just a selling point—it's a retention driver. 
              Parents cite CVUSD schools as a primary reason for staying in Thousand Oaks even when job opportunities 
              or lifestyle changes might pull them elsewhere. Lang Ranch Elementary, Westlake High, and the MATES 
              charter school are mentioned by name as major draws.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              The trade-offs are acknowledged honestly: <span className="font-semibold">limited nightlife, early closing times, 
              higher cost of living, and car dependency</span> are common critiques. But residents frame these as acceptable 
              compromises for what they gain—predictability, cleanliness, low crime, and a family-first environment.
            </p>

            <p className="text-gray-700 leading-relaxed">
              What stands out most is the <span className="font-semibold text-[#29B6F6]">consistency of sentiment</span>. 
              Whether reviewing a gated Lang Ranch community or a custom Lynn Ranch estate, residents describe Thousand Oaks 
              as a place that delivers on its promise: a safe, stable, nature-connected environment where families can thrive 
              without sacrificing access to employment, healthcare, or quality education.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#29B6F6]">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#29B6F6] mb-2">Top 3</div>
              <div className="text-sm text-gray-600 mb-4">Most Mentioned Themes</div>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Safety & Low Crime
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Exceptional Schools
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Trails & Nature Access
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-green-500">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">Strengths</div>
              <div className="text-sm text-gray-600 mb-4">Consistent Positives</div>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li>• Family-friendly environment</li>
                <li>• Clean, well-maintained</li>
                <li>• Strong community bonds</li>
                <li>• Long-term ownership</li>
                <li>• Outdoor lifestyle</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-amber-500">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-500 mb-2">Trade-offs</div>
              <div className="text-sm text-gray-600 mb-4">Common Critiques</div>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li>• Limited nightlife</li>
                <li>• Higher cost of living</li>
                <li>• Car-dependent</li>
                <li>• Early closing times</li>
                <li>• Fire risk awareness</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Sources: Niche.com, Nextdoor public summaries, Homes.com, EmilyBerdon.com, ConejoValleyGuy.com, 
            Holbrook Realty, PODS.com, Eichler Network, and local realtor insights
          </p>
        </div>
      </div>
    </section>
  )
}
