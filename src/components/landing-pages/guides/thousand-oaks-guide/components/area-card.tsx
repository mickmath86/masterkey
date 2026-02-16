import type { Quote } from '../data/quotes-data'
import { QuoteBox } from './quote-box'
import { ImageCarousel } from './image-carousel'

interface AreaCardProps {
  name: string
  score: number
  overview: string
  neighborhoods: string[]
  scores: {
    amenities: number
    transit: number
    schools: number
    economic: number
    health: number
    crime: number
    value: number
    space: number
  }
  whoItsFor: string
  notFor: string
  pros: string[]
  cons: string[]
  quotes?: Quote[]
  mapUrl?: string
  images?: string[]
  bgColor?: string
}

export function AreaCard({
  name,
  score,
  overview,
  neighborhoods,
  scores,
  whoItsFor,
  notFor,
  pros,
  cons,
  quotes,
  mapUrl,
  images,
  bgColor = 'bg-white'
}: AreaCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-green-500'
    if (score >= 7) return 'bg-[#29B6F6]'
    if (score >= 5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const scoreCategories = [
    { name: 'Amenities', value: scores.amenities },
    { name: 'Transit & Commute', value: scores.transit },
    { name: 'Schools', value: scores.schools },
    { name: 'Economic Stability', value: scores.economic },
    { name: 'Health & Safety', value: scores.health },
    { name: 'Crime', value: scores.crime },
    { name: 'Area Value', value: scores.value },
    { name: 'Space & Density', value: scores.space },
  ]

  return (
    <div id={name.toLowerCase().replace(/\s+/g, '-')} className={`py-16 px-6 ${bgColor}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-light text-[#29B6F6]">{name}</h3>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Area Score</div>
              <div className="text-4xl font-bold text-[#29B6F6]">{score.toFixed(1)}</div>
            </div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">{overview}</p>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((neighborhood) => (
              <span
                key={neighborhood}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {neighborhood}
              </span>
            ))}
          </div>
        </div>

        {/* Image Carousel */}
        {images && images.length > 0 && <ImageCarousel images={images} areaName={name} />}

        {/* Map */}
        {mapUrl ? (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${name} Neighborhood Map`}
            />
          </div>
        ) : (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <svg
                className="mx-auto h-20 w-20 text-[#29B6F6] mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-gray-600">{name} Neighborhood Map</p>
            </div>
          </div>
        )}

        {/* Score Breakdown */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Score Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreCategories.map((category) => (
              <div key={category.name} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{category.value}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(category.value)}`}
                      style={{ width: `${category.value * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-900 mb-3">Who It's For</h4>
            <p className="text-gray-700 leading-relaxed">{whoItsFor}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-900 mb-3">Not For</h4>
            <p className="text-gray-700 leading-relaxed">{notFor}</p>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Pros</h4>
            <ul className="space-y-2">
              {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Cons</h4>
            <ul className="space-y-2">
              {cons.map((con, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resident Quotes */}
        {quotes && quotes.length > 0 && <QuoteBox quotes={quotes} />}
      </div>
    </div>
  )
}
