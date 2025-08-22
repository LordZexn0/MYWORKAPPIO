import { NextRequest, NextResponse } from 'next/server'
import { getAdminAccount, updateAdminAccount } from '@/lib/admin-store'
import { validateCsrfToken } from '@/lib/csrf'
import bcrypt from 'bcryptjs'
import { getSessionFromRequest } from '@/lib/auth'
import { ipKey, limit } from '@/lib/rate-limit'

export async function GET() {
  const acct = await getAdminAccount()
  return NextResponse.json({ email: acct.email, username: acct.username })
}

export async function POST(request: NextRequest) {
  const headers = new Headers(request.headers)
  const rl = await limit(ipKey(headers, 'admin:account:update'), 10, 300)
  if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const session = await getSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const csrf = request.headers.get('x-csrf-token')
  const ok = await validateCsrfToken(csrf)
  if (!ok) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })

  const { email, username, password } = await request.json()
  if (!email || !username) return NextResponse.json({ error: 'Email and username required' }, { status: 400 })

  const update: any = { email, username }
  if (password && String(password).length >= 8) {
    update.passwordHash = await bcrypt.hash(password, 12)
  }

  const next = await updateAdminAccount(update)
  return NextResponse.json({ email: next.email, username: next.username })
}



