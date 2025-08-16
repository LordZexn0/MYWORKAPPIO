import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Generate a safe filename
    const timestamp = Date.now()
    const sanitizedName = (file.name || "image").replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `uploads/${timestamp}-${sanitizedName}`

    // Prefer Vercel Blob when token/integration available
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN
    const isVercel = !!process.env.VERCEL

    if (hasBlobToken || isVercel) {
      try {
        const blob = await put(filename, file, { access: "public" })
        return NextResponse.json({ url: blob.url })
      } catch (blobError) {
        console.error("Upload error (blob):", blobError)
        // Fall through to local storage in dev
        if (!isVercel) {
          // continue to local fallback
        } else {
          return NextResponse.json({ error: "Failed to upload to blob storage" }, { status: 500 })
        }
      }
    }

    // Local filesystem fallback (development only; not persistent on Vercel)
    try {
      const publicDir = path.join(process.cwd(), "public")
      const uploadsDir = path.join(publicDir, "uploads")
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filePath = path.join(uploadsDir, `${timestamp}-${sanitizedName}`)
      fs.writeFileSync(filePath, buffer)

      const url = `/uploads/${timestamp}-${sanitizedName}`
      return NextResponse.json({ url })
    } catch (fsError) {
      console.error("Upload error (fs):", fsError)
      return NextResponse.json({ error: "Failed to save file locally" }, { status: 500 })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
