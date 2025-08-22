import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('cms_session')?.value
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    const session = await verifySessionToken(token)
    if (!session?.userEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    // Bind session to user-agent
    const ua = request.headers.get('user-agent') || ''
    if (!session.userEmail.includes('::') || !session.userEmail.endsWith(`::${ua}`)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}


