import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function GET() {
  const testKey = "storage-test"
  const testData = {
    timestamp: new Date().toISOString(),
    test: "KV Storage is working!",
    randomNumber: Math.random()
  }

  try {
    console.log("🧪 Testing KV Storage...")
    
    // Test 1: Write data
    console.log("📝 Step 1: Writing test data to KV...")
    await kv.set(testKey, testData)
    console.log("✅ Test data written successfully")
    
    // Test 2: Read data back
    console.log("📖 Step 2: Reading test data from KV...")
    const retrievedData = await kv.get(testKey)
    console.log("📊 Retrieved data:", retrievedData)
    
    // Test 3: Verify data integrity
    const isMatch = JSON.stringify(retrievedData) === JSON.stringify(testData)
    console.log("🔍 Step 3: Data integrity check:", isMatch ? "✅ PASS" : "❌ FAIL")
    
    // Test 4: Check CMS data
    console.log("🗂️  Step 4: Checking CMS data...")
    const cmsData = await kv.get("cms-content")
    const cmsExists = !!cmsData
    console.log("📋 CMS data exists:", cmsExists ? "✅ YES" : "❌ NO")
    
    // Clean up test data
    await kv.del(testKey)
    console.log("🧹 Test data cleaned up")
    
    return NextResponse.json({
      success: true,
      message: "KV Storage is working correctly!",
      tests: {
        write: true,
        read: !!retrievedData,
        integrity: isMatch,
        cmsDataExists: cmsExists
      },
      testData: retrievedData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("❌ KV Storage test failed:", error)
    return NextResponse.json({
      success: false,
      error: "KV Storage test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 