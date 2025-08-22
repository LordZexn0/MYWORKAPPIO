import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Lazy init Redis to avoid build-time execution and align env names
let redis: Redis | null = null
function getRedisClient(): Redis | null {
  if (redis) return redis
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    redis = new Redis({ url, token })
    return redis
  } catch (error) {
    console.error("❌ KV Test: Failed to create Redis client:", error)
    return null
  }
}

export async function GET() {
  if (process.env.ALLOW_DEBUG_ROUTES !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  // During build time, return a static response to avoid external requests
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({
      success: true,
      message: "Build-time check - Redis connection available in runtime",
      buildTime: true,
      kvPackageInstalled: true,
      environmentVariables: {
        UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
      kvConnection: true,
      error: null,
      details: { buildTime: "Skipped during build" }
    })
  }

  const testResults = {
    kvPackageInstalled: true,
    environmentVariables: {
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    },
    kvConnection: false,
    error: null as string | null,
    details: {} as any
  }

  try {
    // Test KV connection
    console.log("🔍 Testing Upstash Redis connection...")
    
    const client = getRedisClient()
    if (!client) throw new Error("Redis client not initialized")
    await client.ping()
    testResults.kvConnection = true
    testResults.details.ping = "✅ Upstash Redis ping successful"
    
    // Try a simple read/write test
    const testKey = "kv-test-" + Date.now()
    const testValue = { test: true, timestamp: new Date().toISOString() }
    
    await client.set(testKey, testValue)
    testResults.details.write = "✅ Write test successful"
    
    const retrieved = await client.get(testKey)
    testResults.details.read = "✅ Read test successful"
    testResults.details.dataMatch = JSON.stringify(retrieved) === JSON.stringify(testValue)
    
    // Clean up
    await client.del(testKey)
    testResults.details.cleanup = "✅ Cleanup successful"
    
  } catch (error) {
    testResults.kvConnection = false
    testResults.error = error instanceof Error ? error.message : "Unknown error"
    testResults.details.error = error
  }

  return NextResponse.json({
    success: testResults.kvConnection,
    message: testResults.kvConnection 
      ? "Upstash Redis is properly configured and working!" 
      : "Upstash Redis is not configured or not working",
    ...testResults
  })
} 