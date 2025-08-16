import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    console.log("📁 File Test: Starting...")
    
    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local')
    const envExists = fs.existsSync(envPath)
    
    console.log("📁 File Test: .env.local exists:", envExists)
    console.log("📁 File Test: .env.local path:", envPath)
    
    if (envExists) {
      // Read the file content
      const envContent = fs.readFileSync(envPath, 'utf8')
      console.log("📁 File Test: .env.local content length:", envContent.length)
      console.log("📁 File Test: .env.local first 200 chars:", envContent.substring(0, 200))
      
      // Check for specific variables in the file
      const hasUrl = envContent.includes('UPSTASH_KV_REST_API_URL')
      const hasToken = envContent.includes('UPSTASH_KV_REST_API_TOKEN')
      
      console.log("📁 File Test: Contains URL variable:", hasUrl)
      console.log("📁 File Test: Contains Token variable:", hasToken)
      
      return NextResponse.json({
        success: true,
        fileExists: envExists,
        filePath: envPath,
        contentLength: envContent.length,
        contentPreview: envContent.substring(0, 200),
        containsUrl: hasUrl,
        containsToken: hasToken,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        fileExists: envExists,
        filePath: envPath,
        error: "File does not exist",
        timestamp: new Date().toISOString()
      })
    }
    
  } catch (error) {
    console.error("❌ File Test: Error:", error)
    
    return NextResponse.json({
      success: false,
      error: "File test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 