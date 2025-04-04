import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các đường dẫn không cần kiểm tra token
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// Danh sách các đường dẫn tĩnh không cần kiểm tra token
const staticPaths = [
  '/images',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra xem đường dẫn có phải là đường dẫn tĩnh không
  const isStaticPath = staticPaths.some(path => pathname.startsWith(path));
  if (isStaticPath) {
    return NextResponse.next();
  }
  
  // Kiểm tra xem đường dẫn có phải là đường dẫn công khai không
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Kiểm tra token trong localStorage
  const token = request.cookies.get('accessToken')?.value;
  
  // Nếu không có token và không phải đường dẫn công khai, điều hướng về trang đăng nhập
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Cấu hình các đường dẫn cần áp dụng middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 