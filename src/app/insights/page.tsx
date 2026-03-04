import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/data/articles'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Market Insights',
  description:
    'Real estate market insights, trend analysis, and actionable advice for Thousand Oaks and Conejo Valley buyers and sellers from MasterKey.',
}

function AudienceBadge({ audience }: { audience: string }) {
  const colors =
    audience === 'buyer'
      ? 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/25'
      : audience === 'seller'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/25'
        : 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colors}`}
    >
      {audience === 'buyer' ? 'For Buyers' : audience === 'seller' ? 'For Sellers' : 'For Everyone'}
    </span>
  )
}

export default function InsightsPage() {
  const articles = getAllArticles()

  return (
    <>
      <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
        <Navbar3 />
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="insights-grid"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect fill="url(#insights-grid)" width="100%" height="100%" strokeWidth={0} />
        </svg>
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sm/6 font-semibold text-sky-600 ring-1 ring-sky-600/20 ring-inset dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/25">
                Market Insights
              </span>
            </div>
            <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
              Stay ahead of the market
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
              Trend-driven real estate analysis for Thousand Oaks and the Conejo
              Valley. We connect the dots between national headlines and your
              local housing market.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={article.datePublished}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {new Date(article.datePublished).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </time>
                  <AudienceBadge audience={article.audience} />
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                    <Link href={`/insights/${article.slug}`}>
                      <span className="absolute inset-0" />
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-x-2">
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                    {article.sourceTrend}
                  </span>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/insights/${article.slug}`}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    Read analysis <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
