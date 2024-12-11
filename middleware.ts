import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('auth-token'); // 或者其他验证登录状态的方法
  const { pathname } = request.nextUrl;
  console.log('middleware', isLoggedIn, pathname);
  
  // 如果用户已登录且访问登录页，重定向到 dashboard
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 如果用户未登录且访问需要认证的页面，重定向到登录页
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};