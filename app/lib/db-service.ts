// 数据库服务层，统一处理数据库操作
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export const dbService = {
  // 用户验证
  async verifyUser(email: string, password: string) {
    const user = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (user.rows.length === 0) {
      throw new Error('用户不存在');
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password);
    console.log(isValid, 'isValid', user.rows);
    if (!isValid) {
      throw new Error('密码错误');
    }

    return user.rows[0];
  },

  // 用户注册
  async createUser(userData: { email: string; password: string; name: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${userData.name}, ${userData.email}, ${hashedPassword})
      RETURNING id, name, email
    `;

    return result.rows[0];
  },

  // 检查邮箱是否存在
  async checkEmailExists(email: string) {
    const result = await sql`
      SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email})
    `;
    return result.rows[0].exists;
  }
}; 