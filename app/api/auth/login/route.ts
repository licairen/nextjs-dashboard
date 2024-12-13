import { dbService } from '@/app/lib/db-service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const user = await dbService.verifyUser(email, password)

    // 生成时间戳作为 traceId
    const traceId = Date.now().toString()

    // 创建响应
    const response = NextResponse.json({
      success: true,
      code: 200,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    // 设置响应头的 traceId
    response.headers.set('traceId', traceId)

    // 设置认证 cookie
    response.cookies.set({
      name: 'auth-token',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    const errorResponse = NextResponse.json(
      {
        success: false,
        code: 401,
        message: error instanceof Error ? error.message : '登录失败',
      },
      { status: 401 }
    )

    // 错误响应也添加 traceId
    errorResponse.headers.set('traceId', Date.now().toString())

    return errorResponse
  }
}
