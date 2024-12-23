import { NextResponse } from 'next/server'
import { AuthService } from '@/app/lib/services/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    console.log('收到注册请求:', { email, name });

    // 基本验证
    if (!email || !password || !name) {
      console.log('缺少必填字段');
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段', code: 400 },
        { status: 400 }
      )
    }

    console.log('开始调用注册服务');
    const result = await AuthService.register({
      email,
      password,
      name,
    })

    console.log('注册服务返回结果:', {
      success: result.success,
      code: result.code,
      message: result.message
    });

    return NextResponse.json(
      { 
        success: result.success, 
        message: result.message,
        code: result.code,
        data: result.user
      }, 
      { status: result.code }
    )
    
  } catch (error) {
    console.error('注册路由错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '注册失败，请稍后重试',
        code: 500 
      },
      { status: 500 }
    )
  }
}
