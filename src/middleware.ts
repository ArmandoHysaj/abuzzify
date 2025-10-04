import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/cryptolytics/portfolio',
  '/cryptolytics/investment',
  '/profile',
  '/dashboard',
];

// Define public routes that should redirect to home if user is authenticated
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public auth route
  const isPublicAuthRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get the authentication token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing a public auth route while authenticated, redirect to home
  if (isPublicAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
