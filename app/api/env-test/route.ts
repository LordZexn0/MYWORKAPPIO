import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    UPSTASH_KV_REST_API_URL: process.env.UPSTASH_KV_REST_API_URL,
    UPSTASH_KV_REST_API_TOKEN: process.env.UPSTASH_KV_REST_API_TOKEN ? "EXISTS" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  }

  return NextResponse.json({
    success: true,
    message: "Environment variables check",
    envVars,
    timestamp: new Date().toISOString()
  })
} 