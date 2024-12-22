import { prisma } from '@/lib/prisma'
import { CreateUserInput, UpdateUserInput, User, UserWithoutPassword } from '../types/user'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

export class UserService {
  /**
   * 创建新用户
   */
  static async createUser(data: CreateUserInput): Promise<{ success: boolean; message: string; code: number; user?: UserWithoutPassword }> {
    try {
      console.log('开始创建用户:', { email: data.email, name: data.name });
      
      // 先检查用户是否已存在
      const existingUser = await prisma.users.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        console.log('用户已存在:', data.email);
        return {
          success: false,
          message: '该邮箱已被注册',
          code: 400
        };
      }

      // 加密密码
      console.log('开始加密密码');
      const hashedPassword = await bcrypt.hash(data.password, 10)
      
      // 创建用户
      console.log('开始创建用户记录');
      const user = await prisma.users.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
        },
      })

      console.log('用户创建成功:', { id: user.id, email: user.email });

      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        message: '注册成功',
        code: 201,
        user: userWithoutPassword as UserWithoutPassword
      }
    } catch (error) {
      // 详细记录错误信息
      console.error('创建用户错误:', error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma错误代码:', error.code);
        console.error('Prisma错误详情:', error.message);
        
        if (error.code === 'P2002') {
          return {
            success: false,
            message: '该邮箱已被注册',
            code: 400
          }
        }
      }
      
      // 返回具体的错误信息
      return {
        success: false,
        message: error instanceof Error ? error.message : '注册失败，请稍后重试',
        code: 500
      }
    }
  }

  /**
   * 通过邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.users.findUnique({
        where: { email }
      })
    } catch (error) {
      console.error('查找用户错误:', error)
      throw error
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(
    userId: string,
    data: UpdateUserInput
  ): Promise<UserWithoutPassword> {
    try {
      // 如果更新包含密码，先加密
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
      }

      const user = await prisma.users.update({
        where: { id: userId },
        data,
      })

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as UserWithoutPassword
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('用户不存在')
        }
      }
      throw error
    }
  }

  /**
   * 删除用户
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await prisma.users.delete({
        where: { id: userId },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('用户不存在')
        }
      }
      throw error
    }
  }

  /**
   * 验证用户凭据
   */
  static async verifyCredentials(email: string, password: string): Promise<any> {
    try {
      const user = await this.findByEmail(email)
      if (!user) return null

      console.log('输入的密码:', password)
      console.log('数据库中的密码哈希:', user.password)
      
      const isValid = await bcrypt.compare(password, user.password)
      console.log('密码验证结果:', isValid)
      
      return isValid ? user : null
    } catch (error) {
      console.error('验证用户凭证错误:', error)
      throw error
    }
  }
}
