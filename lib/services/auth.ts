import { UserService } from './user'
import { AuthResponse } from '../types/auth'
import { CreateUserInput } from '../types/user'

export class AuthService {
  /**
   * 用户注册
   */
  static async register(userData: CreateUserInput): Promise<AuthResponse> {
    try {
      const existingUser = await UserService.findByEmail(userData.email)
      if (existingUser) {
        return this.createAuthResponse(false, '该邮箱已被注册', 400)
      }

      const user = await UserService.createUser(userData)
      return this.createAuthResponse(true, '注册成功', 201, user)
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
      const user = await UserService.findByEmail(email)
      if (!user) {
        return this.createAuthResponse(false, '邮箱不存在', 401)
      }
      console.log(user.id, '用户id', password, '密码');
      
      const validatedUser = await UserService.verifyCredentials(email, password)
      if (!validatedUser) {
        return this.createAuthResponse(false, '密码错误', 401)
      }

      const { password: _, ...userWithoutPassword } = validatedUser
      return this.createAuthResponse(true, '登录成功', 200, userWithoutPassword)
    } catch (error) {
      console.error('登录错误:', error)
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
