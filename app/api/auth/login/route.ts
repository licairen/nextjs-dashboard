import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

export async function POST(request: Request) {
  try {
    console.log('收到登录请求...');
    const { email, password } = await request.json();
    console.log('登录请求数据:', { email, password: '***' });

    // 查询用户
    console.log('开始查询用户...');
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    console.log('用户查询结果:', { found: user.rows.length > 0 });
    
    if (!user.rows[0]) {
      console.log('用户不存在');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 验证密码
    console.log('开始验证密码...');
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
    console.log('密码验证结果:', { passwordMatch });
    
    if (!passwordMatch) {
      console.log('密码不匹配');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('开始生成 JWT token...');
    // 创建 JWT token
    const token = await new SignJWT({ 
      id: user.rows[0].id,
      email: user.rows[0].email,
      name: user.rows[0].name
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secretKey);
    console.log('JWT token 生成成功');

    // 设置 cookie 通过 Response 的头部
    const response = NextResponse.json({
      code: 200,
      message: 'Login successful',
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // 确保 cookie 适用于全站
      maxAge: 24 * 60 * 60, // 24 小时
    });

    console.log('Cookie 设置成功');
    console.log('登录成功，返回用户信息');
    return response;
  } catch (error) {
    console.error('登录处理过程发生错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}