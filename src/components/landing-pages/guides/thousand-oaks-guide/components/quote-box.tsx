import type { Quote } from '../data/quotes-data'

interface QuoteBoxProps {
  quotes: Quote[]
}

export function QuoteBox({ quotes }: QuoteBoxProps) {
  if (!quotes || quotes.length === 0) return null

  return (
    <div className="mt-8 space-y-4">
      <h4 className="text-xl font-semibold text-gray-900 mb-4">What Residents Say</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((quote, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#29B6F6] p-6 rounded-r-lg shadow-sm"
          >
            <div className="flex items-start">
              <svg
                className="h-8 w-8 text-[#29B6F6] opacity-50 flex-shrink-0 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="flex-1">
                <p className="text-gray-700 italic leading-relaxed mb-3">
                  "{quote.text}"
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{quote.author}</p>
                  <p className="text-gray-600">{quote.source}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
