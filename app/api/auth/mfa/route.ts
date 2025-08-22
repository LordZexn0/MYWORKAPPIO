import { NextResponse } from 'next/server'
import { clearPending, createSessionToken, getPendingEmail, setSession, verifyTotp } from '@/lib/auth'
import { ipKey, limit } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'

export async function POST(request: Request) {
  try {
    const headers = new Headers(request.headers)
    const key = ipKey(headers, 'auth:mfa')
    const rl = await limit(key, 10, 60) // 10/min per IP
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
    }

    const csrfHeader = headers.get('x-csrf-token')
    const csrfOk = await validateCsrfToken(csrfHeader)
    if (!csrfOk) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { code } = await request.json()
    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 })
    }

    const email = await getPendingEmail()
    if (!email) {
      return NextResponse.json({ error: 'No pending login' }, { status: 401 })
    }

    const ok = verifyTotp(code)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    const ua = headers.get('user-agent') || ''
    const token = await createSessionToken(`${email}::${ua}`)
    await setSession(token)
    await clearPending()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
}


