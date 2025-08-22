import { NextResponse } from 'next/server'
import { setPendingCookie } from '@/lib/auth'
import { verifyPasswordWithIdentifier } from '@/lib/auth'
import { ipKey, limit } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'

export async function POST(request: Request) {
  try {
    const headers = new Headers(request.headers)
    const key = ipKey(headers, 'auth:login')
    const rl = await limit(key, 10, 60) // 10/min per IP
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
    }

    const csrfHeader = headers.get('x-csrf-token')
    const csrfOk = await validateCsrfToken(csrfHeader)
    if (!csrfOk) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { emailOrUsername, password } = await request.json()
    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: 'Identifier and password required' }, { status: 400 })
    }

    const { ok, email } = await verifyPasswordWithIdentifier(emailOrUsername, password)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await setPendingCookie(email)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
}


