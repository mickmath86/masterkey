import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'MasterKey market insights and real estate analytics.',
}

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          Insights
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Market insights and real estate analytics — coming soon.
        </p>
        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-8">
          <p className="text-sm font-medium text-gray-500">
            This is a test page for the Insights section. Content will be added here.
          </p>
        </div>
      </div>
    </div>
  )
}
