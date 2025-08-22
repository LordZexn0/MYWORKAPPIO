import { NextResponse } from 'next/server'
import { ipKey, limit } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'
import { generateOtpCode, storeOtp } from '@/lib/admin-store'

export async function POST(request: Request) {
  const headers = new Headers(request.headers)
  const key = ipKey(headers, 'auth:otp:req')
  const rl = await limit(key, 5, 300) // 5 per 5 minutes
  if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const csrf = headers.get('x-csrf-token')
  const ok = await validateCsrfToken(csrf)
  if (!ok) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })

  const { destination } = await request.json()
  if (destination !== 'email') {
    return NextResponse.json({ error: 'Only email OTP supported' }, { status: 400 })
  }

  const code = generateOtpCode()
  await storeOtp(code, 300)
  if (process.env.ALLOW_DEMO_OTP === '1') {
    return NextResponse.json({ ok: true, code })
  }
  return NextResponse.json({ ok: true })
}



