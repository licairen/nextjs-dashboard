import { UserService } from './user'
import { AuthResponse } from '../types/auth'
import { CreateUserInput } from '../types/user'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export class AuthService {
  /**
   * 用户注册
   */
  static async register(userData: CreateUserInput): Promise<AuthResponse> {
    try {
      const result = await UserService.createUser(userData)
      return {
        success: result.success,
        message: result.message,
        code: result.code,
        user: result.user
      }
    } catch (error) {
      console.error('注册错误:', error)
      return this.createAuthResponse(false, '注册过程中发生错误', 500)
    }
  }

  /**
   * 用户登录
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('开始登录流程，邮箱:', email);
      const user = await UserService.findByEmail(email)
      
      if (!user) {
        console.log('用户不存在:', email);
        return this.createAuthResponse(false, '用户不存在', 401)
      }

      console.log('找到用户，开始验证密码');
      const validatedUser = await UserService.verifyCredentials(email, password)
      
      if (!validatedUser) {
        console.log('密码验证失败');
        return this.createAuthResponse(false, '密码错误', 401)
      }

      console.log('密码验证成功，生成 token');
      const { password: _, ...userWithoutPassword } = validatedUser

      const secret = new TextEncoder().encode(JWT_SECRET)
      const token = await new jose.SignJWT({ 
        id: userWithoutPassword.id, 
        email: userWithoutPassword.email 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(secret)

      return this.createAuthResponse(true, '登录成功', 200, {
        ...userWithoutPassword,
        token
      })
    } catch (error) {
      console.error('登录服务错误:', error)
      return this.createAuthResponse(false, error instanceof Error ? error.message : '登录失败', 500)
    }
  }

  /**
   * 创建认证响应
   */
  private static createAuthResponse(success: boolean, message: string, code: number, user?: any): AuthResponse {
    return { success, message, code, user }
  }
}
