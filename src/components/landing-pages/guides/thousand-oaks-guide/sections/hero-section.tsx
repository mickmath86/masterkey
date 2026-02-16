'use client'

export function HeroSection() {
  const scrollToScorecard = () => {
    const element = document.getElementById('purpose')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070')",
        }}
      />
      
      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4">
          Thousand Oaks Area Scorecard
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-2 font-light">
          A Deep-Dive, Area-by-Area Buyer Comparison
        </p>
        <p className="text-lg text-white/80 mb-8">
          MasterKey Real Estate & Property Management
        </p>
        <button
          onClick={scrollToScorecard}
          className="bg-[#29B6F6] hover:bg-[#1FA3E3] text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
        >
          Explore the Scorecard
        </button>
      </div>
    </section>
  )
}
