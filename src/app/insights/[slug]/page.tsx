import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/data/articles'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.datePublished,
    },
  }
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <Navbar3 />
      </div>

      <article className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/insights"
              className="hover:text-sky-600 dark:hover:text-sky-400"
            >
              Insights
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-gray-900 dark:text-white">
              {article.title}
            </span>
          </nav>

          {/* Header */}
          <div className="mt-8">
            <div className="flex items-center gap-x-4 text-xs">
              <time
                dateTime={article.datePublished}
                className="text-gray-500 dark:text-gray-400"
              >
                {new Date(article.datePublished).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <AudienceBadge audience={article.audience} />
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              {article.title}
            </h1>
            <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
              {article.summary}
            </p>
            <div className="mt-4 flex items-center gap-x-2">
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                {article.sourceTrend}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-200 dark:border-white/10" />

          {/* Article body */}
          <div
            className="article-body mt-10 text-base/7 text-gray-700 dark:text-gray-300 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-700 dark:[&_li]:text-gray-300 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_em]:italic [&_a]:text-sky-600 [&_a]:hover:text-sky-500 dark:[&_a]:text-sky-400 dark:[&_a]:hover:text-sky-300"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gray-50 p-8 dark:bg-gray-800/50">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Want personalized advice?
            </h3>
            <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-400">
              {article.audience === 'buyer'
                ? "Get a free buyer consultation tailored to today's Thousand Oaks market."
                : "Get a free seller strategy session and learn how to position your home in today's market."}
            </p>
            <div className="mt-6 flex items-center gap-x-4">
              <a
                href={
                  article.audience === 'buyer'
                    ? '/questionnaire/real-estate-buy'
                    : '/questionnaire/real-estate-sell'
                }
                className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                Get Started
              </a>
              <a
                href="/contact"
                className="text-sm/6 font-semibold text-gray-900 dark:text-white"
              >
                Contact us <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Back to insights */}
          <div className="mt-16">
            <Link
              href="/insights"
              className="text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
            >
              <span aria-hidden="true">&larr;</span> Back to all insights
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </>
  )
}
