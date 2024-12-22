import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export async function middleware(request: NextRequest) {
  const tokenFromCookie = request.cookies.get('auth-token')?.value
  
  // 如果用户已登录且访问登录/注册页面，重定向到 dashboard
  if (tokenFromCookie && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jose.jwtVerify(tokenFromCookie, secret)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      // token 无效，清除 cookie
      const response = NextResponse.next()
      response.cookies.delete('auth-token')
      return response
    }
  }

  // 处理需要保护的路由
  const protectedRoutes = ['/dashboard', '/dashboard/invoices', '/dashboard/labs']
  
  // 如果是受保护的路由，进行 token 验证
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log('Protected route check:')
    console.log('- URL:', request.nextUrl.pathname)
    console.log('- Token from cookie:', tokenFromCookie)

    if (!tokenFromCookie) {
      console.log('No token found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jose.jwtVerify(tokenFromCookie, secret)
      
      // 创建一个新的响应，将用户信息添加到请求头中
      const response = NextResponse.next()
      response.headers.set('X-User-Id', payload.id as string)
      response.headers.set('X-User-Email', payload.email as string)
      
      return response
    } catch (error) {
      console.log('Token verification failed:', error)
      // 创建重定向响应
      const response = NextResponse.redirect(new URL('/login', request.url))
      // 清除过期的 cookie
      response.cookies.delete('auth-token')
      return response
    }
  }

  // 如果不是受保护的路由，直接放行
  return NextResponse.next()
}

export const config = {
  // 匹配需要处理的路由
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
}
