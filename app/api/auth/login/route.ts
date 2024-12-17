import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 基本验证
    if (!email || !password) {
      return NextResponse.json(
        { message: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    console.log(email, password, '邮箱和密码');
    

    try {
      // 直接使用原始密码进行验证
      const { success, code, message, user } = await AuthService.login(email, password)
      console.log(success, code, message, user, '登录结果');

      
      if (success && user) {
        // 设置认证 cookie
        const response = NextResponse.json({
          success: true,
          code: 200,
          message: '登录成功',
          data: user,
        })

        response.cookies.set({
          name: 'auth-token',
          value: user.id,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })

        return response
      }

      return NextResponse.json({
        success: false,
        code: code,
        message: message || '邮箱或密码错误',
      })
    } catch (error) {
      console.error('登录错误:', error)
      return NextResponse.json(
        { success: false, message: '登录失败', code: 500 },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { success: false, message: '登录失败', code: 500 },
      { status: 500 }
    )
  }
}
