import { jwtVerify } from 'jose'

type VerifiedSession = {
	userEmail: string
}

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function getJwtSecret(): Uint8Array {
  const secret = getEnv('AUTH_SECRET', 'change-me-in-prod')
  return new TextEncoder().encode(secret)
}

export async function verifySessionToken(token: string): Promise<VerifiedSession | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    const sub = String(payload.sub || '')
    return { userEmail: sub }
  } catch {
    return null
  }
}


