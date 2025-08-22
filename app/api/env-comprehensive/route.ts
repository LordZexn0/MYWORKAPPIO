import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  if (process.env.ALLOW_DEBUG_ROUTES !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  try {
    console.log("🔍 Comprehensive Environment Check: Starting...")
    
    const cwd = process.cwd()
    console.log("🔍 Current working directory:", cwd)
    
    // Check for various .env files
    const envFiles = [
      '.env.local',
      '.env',
      '.env.development',
      '.env.development.local',
      '.env.production',
      '.env.production.local'
    ]
    
    const fileResults: Record<string, any> = {}
    
    for (const fileName of envFiles) {
      const filePath = path.join(cwd, fileName)
      const exists = fs.existsSync(filePath)
      
      if (exists) {
        try {
          const content = fs.readFileSync(filePath, 'utf8')
          const hasUpstashVars = content.includes('UPSTASH')
          
          fileResults[fileName] = {
            exists: true,
            size: content.length,
            hasUpstashVars,
            preview: content.substring(0, 100),
            lines: content.split('\n').length
          }
        } catch (error) {
          fileResults[fileName] = {
            exists: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      } else {
        fileResults[fileName] = {
          exists: false
        }
      }
    }
    
    // Check NODE_ENV
    const nodeEnv = process.env.NODE_ENV
    console.log("🔍 NODE_ENV:", nodeEnv)
    
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development'
    console.log("🔍 Is development mode:", isDev)
    
    return NextResponse.json({
      success: true,
      currentWorkingDirectory: cwd,
      nodeEnv,
      isDevelopment: isDev,
      envFiles: fileResults,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("❌ Comprehensive Environment Check: Error:", error)
    
    return NextResponse.json({
      success: false,
      error: "Comprehensive environment check failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 