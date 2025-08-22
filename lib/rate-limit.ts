import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
	? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
	: null

export type RateLimitResult = { allowed: boolean; remaining: number; reset: number }

export async function limit(key: string, limitCount: number, windowSeconds: number): Promise<RateLimitResult> {
	if (!redis) {
		return { allowed: true, remaining: limitCount, reset: Date.now() + windowSeconds * 1000 }
	}

	const now = Math.floor(Date.now() / 1000)
	const redisKey = `ratelimit:${key}:${Math.floor(now / windowSeconds)}`
	const count = await redis.incr(redisKey)
	if (count === 1) {
		await redis.expire(redisKey, windowSeconds)
	}
	const remaining = Math.max(0, limitCount - count)
	return { allowed: count <= limitCount, remaining, reset: (Math.floor(now / windowSeconds) + 1) * windowSeconds * 1000 }
}

export function ipKey(headers: Headers, prefix: string): string {
	const xff = headers.get('x-forwarded-for') || ''
	const ip = xff.split(',')[0].trim() || headers.get('x-real-ip') || 'unknown'
	return `${prefix}:${ip}`
}



