export function CTASection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-light text-[#29B6F6] mb-6">
          Final Takeaway
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          There is no single "best" area in Thousand Oaks—only the best fit. This scorecard 
          is designed to help buyers understand tradeoffs clearly and choose strategically based 
          on lifestyle, schools, commute needs, and long-term value.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            Thinking about buying in Thousand Oaks? Schedule a free, no-obligation homebuyer 
            consultation with MasterKey Real Estate & Property Management. We'll help you interpret 
            these scores, narrow the right areas, and build a smart buying strategy.
          </p>
          <a
            href="tel:805-262-9707"
            className="inline-block bg-[#29B6F6] hover:bg-[#1FA3E3] text-white px-8 py-3 rounded-md text-lg font-medium transition-colors mb-4"
          >
            Schedule Your Consultation
          </a>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium">Phone: (805) 262-9707</p>
            <p>Website: <a href="https://usemasterkey.com" className="text-[#29B6F6] hover:underline">usemasterkey.com</a></p>
          </div>
        </div>
      </div>
    </section>
  )
}
