import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/verify-otp']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isPublic = PUBLIC_ROUTES.some((r) => request.nextUrl.pathname.startsWith(r))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}
