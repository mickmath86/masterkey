import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/data/articles'

const SITE_URL = 'https://usemasterkey.com'

/**
 * POST /api/insights/lookup
 *
 * Webhook endpoint for GHL (GoHighLevel) automation.
 * Accepts a CTA keyword and returns the matching article data.
 *
 * Request body:
 *   { "keyword": "RATES" }
 *
 * Response:
 *   {
 *     "found": true,
 *     "keyword": "RATES",
 *     "article": {
 *       "title": "...",
 *       "summary": "...",
 *       "url": "https://usemasterkey.com/insights/iran-war-mortgage-rate-window",
 *       "audience": "buyer",
 *       "ctaKeyword": "RATES",
 *       "sourceTrend": "..."
 *     },
 *     "reply": "Here's your personalized market brief: ..."
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const keyword = (body.keyword || body.message || '').toString().trim().toUpperCase()

    if (!keyword) {
      return NextResponse.json(
        { found: false, error: 'Missing keyword parameter' },
        { status: 400 }
      )
    }

    // Find article matching the CTA keyword
    const article = articles.find(
      (a) => a.ctaKeyword.toUpperCase() === keyword
    )

    if (!article) {
      return NextResponse.json({
        found: false,
        keyword,
        reply: `Thanks for reaching out! We don't have a market brief for "${keyword}" right now, but one of our agents will follow up with you shortly.`,
      })
    }

    const articleUrl = `${SITE_URL}/insights/${article.slug}`

    // Build the auto-reply message
    const audienceLabel = article.audience === 'buyer' ? 'buyers' : 'sellers'
    const reply = [
      `Hey! Thanks for reaching out 👋`,
      ``,
      `Here's your market brief on what this means for ${audienceLabel} in Thousand Oaks:`,
      ``,
      `📊 ${article.title}`,
      `${articleUrl}`,
      ``,
      `${article.summary}`,
      ``,
      `Want to talk about how this affects your specific situation? Reply here or book a free consultation at ${SITE_URL}/contact`,
      ``,
      `— The Masterkey Team`,
    ].join('\n')

    return NextResponse.json({
      found: true,
      keyword,
      article: {
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        url: articleUrl,
        audience: article.audience,
        ctaKeyword: article.ctaKeyword,
        sourceTrend: article.sourceTrend,
        datePublished: article.datePublished,
      },
      reply,
      // GHL-specific fields for easy mapping
      tags: ['news-trend', `keyword-${keyword.toLowerCase()}`, article.audience],
      audienceAction: article.audience === 'buyer' ? 'buyer-nurture' : 'seller-nurture',
    })
  } catch {
    return NextResponse.json(
      { found: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword') || ''

  if (!keyword) {
    // Return all available keywords
    const keywords = articles.map((a) => ({
      keyword: a.ctaKeyword,
      title: a.title,
      audience: a.audience,
      url: `${SITE_URL}/insights/${a.slug}`,
    }))
    return NextResponse.json({ keywords })
  }

  // Simulate a POST with the keyword
  const fakeRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ keyword }),
    headers: { 'Content-Type': 'application/json' },
  })
  return POST(fakeRequest)
}
