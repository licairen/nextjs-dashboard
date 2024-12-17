import { prisma } from '../prisma'
import { CreateUserInput, UpdateUserInput, User, UserWithoutPassword } from '../types/user'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

export class UserService {
  /**
   * 创建新用户
   */
  static async createUser(data: CreateUserInput): Promise<UserWithoutPassword> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10)

      const user = await prisma.users.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 是唯一约束违反的错误代码
        if (error.code === 'P2002') {
          throw new Error('该邮箱已被注册')
        }
      }
      throw error
    }
  }

  /**
   * 通过邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.users.findUnique({
      where: { email },
    })
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
      return userWithoutPassword
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
    const user = await this.findByEmail(email);
    if (!user) return null;

    console.log('输入的密码:', password);
    console.log('存储的哈希密码:', user.password);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', isPasswordValid);
    
    return isPasswordValid ? user : null;
  }
}
