import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // 基本验证
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    try {
      // 直接使用原始密码，让 UserService 处理哈希
      const result = await AuthService.register({
        email,
        password,
        name,
      })

      return NextResponse.json(result, { status: result.code })
    } catch (error) {
      console.error('注册错误:', error)
      return NextResponse.json(
        { success: false, message: '注册过程中发生错误', code: 500 },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { success: false, message: '注册过程中发生错误', code: 500 },
      { status: 500 }
    )
  }
}
