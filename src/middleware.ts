import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authorizationCookie = request.cookies.get('AUTHORIZATION');

  // If trying to access dashboard without authorization
  if (pathname.startsWith('/dashboard') && !authorizationCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If has authorization and trying to access root, redirect to dashboard
  if (pathname === '/' && authorizationCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
