import { Redis } from '@upstash/redis'
import bcrypt from 'bcryptjs'
import { authenticator } from 'otplib'

type AdminAccount = {
  email: string
  username: string
  passwordHash: string | null
  totpSecret: string | null
}

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null

const ACCOUNT_KEY = 'admin:account'
const OTP_KEY = 'admin:otp'

function envOr<T extends string | null | undefined>(v: T, fallback: string): string {
  return (v ?? '').trim() || fallback
}

export async function getAdminAccount(): Promise<AdminAccount> {
  if (!redis) {
    return {
      email: envOr(process.env.ADMIN_EMAIL, 'admin@example.com'),
      username: envOr(process.env.ADMIN_USERNAME, 'admin'),
      passwordHash: process.env.ADMIN_PASSWORD_HASH || null,
      totpSecret: process.env.ADMIN_TOTP_SECRET || null,
    }
  }
  const data = await redis.get<string>(ACCOUNT_KEY)
  if (!data) {
    return await initDefaultAdminAccount()
  }
  return JSON.parse(data)
}

export async function initDefaultAdminAccount(): Promise<AdminAccount> {
  const email = envOr(process.env.ADMIN_EMAIL, 'admin@example.com')
  const username = envOr(process.env.ADMIN_USERNAME, 'admin')
  const passwordHashEnv = process.env.ADMIN_PASSWORD_HASH || null
  const plain = process.env.ADMIN_PASSWORD
  const passwordHash = passwordHashEnv || (plain ? await bcrypt.hash(plain, 12) : null)
  const totpSecret = process.env.ADMIN_TOTP_SECRET || null
  const account: AdminAccount = { email, username, passwordHash, totpSecret }
  if (redis) {
    await redis.set(ACCOUNT_KEY, JSON.stringify(account))
  }
  return account
}

export async function updateAdminAccount(partial: Partial<Pick<AdminAccount, 'email' | 'username' | 'passwordHash' | 'totpSecret'>>): Promise<AdminAccount> {
  const current = await getAdminAccount()
  const next: AdminAccount = {
    email: partial.email ?? current.email,
    username: partial.username ?? current.username,
    passwordHash: partial.passwordHash === undefined ? current.passwordHash : partial.passwordHash,
    totpSecret: partial.totpSecret === undefined ? current.totpSecret : partial.totpSecret,
  }
  if (redis) {
    await redis.set(ACCOUNT_KEY, JSON.stringify(next))
  }
  return next
}

export async function verifyAdminPassword(identifier: string, password: string): Promise<{ ok: boolean; email: string }>
{
  const account = await getAdminAccount()
  const matchesId = identifier.toLowerCase() === account.email.toLowerCase() || identifier.toLowerCase() === account.username.toLowerCase()
  if (!matchesId) return { ok: false, email: '' }
  if (account.passwordHash) {
    try {
      const ok = await bcrypt.compare(password, account.passwordHash)
      return { ok, email: account.email }
    } catch {
      return { ok: false, email: '' }
    }
  }
  // fallback to env plain (dev only)
  const plain = process.env.ADMIN_PASSWORD
  if (!plain) return { ok: false, email: '' }
  return { ok: password === plain, email: account.email }
}

export function isTotpEnabled(): boolean {
  return !!(process.env.ADMIN_TOTP_SECRET || null)
}

export function generateOtpCode(): string {
  // 6-digit numeric
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function storeOtp(code: string, ttlSeconds = 300): Promise<void> {
  if (redis) {
    await redis.set(OTP_KEY, code, { ex: ttlSeconds })
  } else {
    ;(globalThis as any).__inmem_otp = { code, expires: Date.now() + ttlSeconds * 1000 }
  }
}

export async function readOtp(): Promise<string | null> {
  if (redis) {
    return (await redis.get<string>(OTP_KEY)) ?? null
  }
  const v = (globalThis as any).__inmem_otp
  if (!v) return null
  if (Date.now() > v.expires) return null
  return v.code as string
}

export async function clearOtp(): Promise<void> {
  if (redis) {
    await redis.del(OTP_KEY)
  } else {
    ;(globalThis as any).__inmem_otp = null
  }
}



