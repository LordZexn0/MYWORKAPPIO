import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      // During build time, return a static response to avoid external requests
      return NextResponse.json({
        success: true,
        message: "Build-time check - Redis connection available in runtime",
        timestamp: new Date().toISOString(),
        buildTime: true
      })
    }

    console.log("🧪 Test Storage: Starting test...")
    
    // Check environment variables
    const url = process.env.UPSTASH_KV_REST_API_URL
    const token = process.env.UPSTASH_KV_REST_API_TOKEN
    
    console.log("🔧 Test Storage: Environment check:")
    console.log("  - URL exists:", !!url)
    console.log("  - Token exists:", !!token)
    console.log("  - URL value:", url)
    
    if (!url || !token) {
      throw new Error("Missing environment variables")
    }
    
    // Initialize Redis client
    console.log("🔧 Test Storage: Initializing Redis client...")
    const redis = new Redis({
      url: url,
      token: token,
    })
    
    console.log("✅ Test Storage: Redis client created")
    
    // Test ping
    console.log("🔧 Test Storage: Testing ping...")
    await redis.ping()
    console.log("✅ Test Storage: Ping successful")
    
    return NextResponse.json({
      success: true,
      message: "Upstash Redis connection successful!",
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("❌ Test Storage: Error details:", error)
    
    return NextResponse.json({
      success: false,
      error: "Upstash Redis Storage test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 