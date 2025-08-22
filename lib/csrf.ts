import { cookies } from 'next/headers'

const CSRF_COOKIE = 'csrf_token'

function randomToken(length = 32): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let s = ''
  for (let i = 0; i < length; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

export async function issueCsrfToken() {
  const token = randomToken(48)
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1h
  })
  return token
}

export async function getCsrfCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE)?.value ?? null
}

export async function validateCsrfToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false
  const cookieToken = await getCsrfCookie()
  if (!cookieToken) return false
  return headerToken === cookieToken
}



