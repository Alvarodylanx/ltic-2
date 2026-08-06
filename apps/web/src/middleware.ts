import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes; the login page itself is at /auth/login (public)
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const token = request.cookies.get('admin_jwt')?.value;
  if (token) return NextResponse.next();

  // No token — redirect to login, preserving the intended destination
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/auth/login';
  loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
