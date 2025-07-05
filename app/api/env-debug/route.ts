import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 Environment Debug: Starting...")
  
  // Get all environment variables
  const allEnvVars = process.env
  
  // Filter for Upstash-related variables
  const upstashVars = Object.keys(allEnvVars)
    .filter(key => key.includes('UPSTASH'))
    .reduce((obj, key) => {
      obj[key] = allEnvVars[key]
      return obj
    }, {} as Record<string, string | undefined>)
  
  console.log("🔍 Environment Debug: All Upstash variables:", upstashVars)
  
  // Check specific variables we need
  const specificVars = {
    UPSTASH_KV_REST_API_URL: process.env.UPSTASH_KV_REST_API_URL,
    UPSTASH_KV_REST_API_TOKEN: process.env.UPSTASH_KV_REST_API_TOKEN,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    UPSTASH_KV_URL: process.env.UPSTASH_KV_URL,
  }
  
  console.log("🔍 Environment Debug: Specific variables:", specificVars)
  
  return NextResponse.json({
    success: true,
    allUpstashVariables: upstashVars,
    specificVariables: specificVars,
    totalEnvVars: Object.keys(allEnvVars).length,
    timestamp: new Date().toISOString()
  })
} 