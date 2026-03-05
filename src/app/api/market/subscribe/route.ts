import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // ── TODO: Pipe to your CRM / email list ──────────────────────────────────
    // Examples:
    //   await addToMailchimp(email)
    //   await addToKlaviyo(email)
    //   await db.insert({ email, createdAt: new Date() })
    //
    // For now we just log and return success so the gate opens immediately.
    console.log('[market/subscribe] New subscriber:', email)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
