import { NextResponse } from "next/server"

export async function GET() {
  if (process.env.ALLOW_DEBUG_ROUTES !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
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
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
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