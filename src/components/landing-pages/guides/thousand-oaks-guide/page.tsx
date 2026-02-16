import { HeroSection } from './sections/hero-section'
import { PurposeSection } from './sections/purpose-section'
import { AboutSection } from './sections/about-section'
import { AreasOverview } from './sections/areas-overview'
import { ScoringFramework } from './sections/scoring-framework'
import { ComparisonTable } from './sections/comparison-table'
import { SentimentSummary } from './sections/sentiment-summary'
import { CTASection } from './sections/cta-section'
import { AreaCard } from './components/area-card'
import { StickyNav } from './components/sticky-nav'
import { areasData } from './data/areas-data'
import { quotesData } from './data/quotes-data'

export default function ThousandOaksGuide() {
  return (
    <>
      <HeroSection />
      <StickyNav />
      <PurposeSection />
      <AboutSection />
      <AreasOverview />
      <ScoringFramework />
      <ComparisonTable />
      
      {/* Resident Sentiment Summary */}
      <SentimentSummary />
      
      {/* Area Breakdowns */}
      <div className="bg-white">
        {areasData.map((area, index) => (
          <AreaCard
            key={area.name}
            name={area.name}
            score={area.score}
            overview={area.overview}
            neighborhoods={area.neighborhoods}
            scores={area.scores}
            whoItsFor={area.whoItsFor}
            notFor={area.notFor}
            pros={area.pros}
            cons={area.cons}
            quotes={quotesData[area.name]}
            mapUrl={area.mapUrl}
            images={area.images}
            bgColor={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
          />
        ))}
      </div>

      <CTASection />
    </>
  )
}
