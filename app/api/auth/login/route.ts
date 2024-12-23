import { NextResponse } from 'next/server'
import { AuthService } from '@/app/lib/services/auth'
import { UserWithToken } from '@/app/lib/types/user'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段', code: 400 },
        { status: 400 }
      )
    }

    const result = await AuthService.login(email, password)
    
    if (result.success && result.user) {
      const userWithToken = result.user as UserWithToken
      const response = NextResponse.json({
        success: true,
        code: 200,
        message: '登录成功',
        data: userWithToken
      })

      // 设置 auth-token cookie
      response.cookies.set({
        name: 'auth-token',
        value: userWithToken.token ?? '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60, // 1 day
      })

      return response
    }

    return NextResponse.json({
      success: false,
      code: result.code,
      message: result.message,
    })

  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { success: false, message: '登录失败', code: 500 },
      { status: 500 }
    )
  }
}
