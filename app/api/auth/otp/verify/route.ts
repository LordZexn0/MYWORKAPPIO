import { NextResponse } from 'next/server'
import { ipKey, limit } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'
import { clearOtp, readOtp, getAdminAccount } from '@/lib/admin-store'
import { clearPending, createSessionToken, setSession } from '@/lib/auth'

export async function POST(request: Request) {
  const headers = new Headers(request.headers)
  const key = ipKey(headers, 'auth:otp:verify')
  const rl = await limit(key, 10, 300)
  if (!rl.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })

  const csrf = headers.get('x-csrf-token')
  const ok = await validateCsrfToken(csrf)
  if (!ok) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })

  const { code } = await request.json()
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

  const stored = await readOtp()
  if (!stored || stored !== code) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
  }

  const acct = await getAdminAccount()
  const ua = headers.get('user-agent') || ''
  const token = await createSessionToken(`${acct.email}::${ua}`)
  await setSession(token)
  await clearOtp()
  await clearPending()
  return NextResponse.json({ ok: true })
}



