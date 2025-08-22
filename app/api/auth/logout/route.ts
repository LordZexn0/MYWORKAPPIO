import { NextResponse } from 'next/server'
import { clearPending, clearSession } from '@/lib/auth'

export async function POST() {
  await clearSession()
  await clearPending()
  return NextResponse.json({ ok: true })
}



