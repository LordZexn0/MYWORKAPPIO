import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { authenticator } from 'otplib'
import bcrypt from 'bcryptjs'
import { getAdminAccount, verifyAdminPassword } from '@/lib/admin-store'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'

type VerifiedSession = {
	userEmail: string
}

const SESSION_COOKIE = 'cms_session'
const PENDING_COOKIE = 'cms_pending'

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function getJwtSecret(): Uint8Array {
  const secret = getEnv('AUTH_SECRET', 'change-me-in-prod')
  return new TextEncoder().encode(secret)
}

export async function verifyPasswordWithIdentifier(identifier: string, plain: string): Promise<{ ok: boolean; email: string }> {
  return await verifyAdminPassword(identifier, plain)
}

export function verifyTotp(code: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET
  if (!secret) return false
  return authenticator.verify({ token: code, secret })
}

export async function createSessionToken(userEmail: string): Promise<string> {
  const secret = getJwtSecret()
  const token = await new SignJWT({ sub: userEmail })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.SESSION_TTL || '1d')
    .sign(secret)
  return token
}

export async function verifySessionToken(token: string): Promise<VerifiedSession | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    return { userEmail: String(payload.sub || '') }
  } catch {
    return null
  }
}

export async function setPendingCookie(email: string) {
  const cookieStore = await cookies()
  cookieStore.set(PENDING_COOKIE, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 5 * 60, // 5 minutes
  })
}

export async function getPendingEmail(): Promise<string | null> {
  const cookieStore = await cookies()
  const c = cookieStore.get(PENDING_COOKIE)
  return c?.value ?? null
}

export async function clearPending() {
  const cookieStore = await cookies()
  cookieStore.set(PENDING_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export async function setSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export async function getSessionFromRequest(request: NextRequest): Promise<VerifiedSession | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  return await verifySessionToken(token)
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const session = await getSessionFromRequest(request)
  return !!session?.userEmail
}


