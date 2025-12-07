import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protected Routes: /dashboard and /admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/login', 
    '/register'
  ],
};