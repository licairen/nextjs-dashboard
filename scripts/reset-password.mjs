import pkg from '@vercel/postgres';
const { sql } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function resetPassword() {
  try {
    // 使用 bcrypt 加密新密码
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 更新数据库中的密码
    const result = await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = 'user@nextmail.com'
      RETURNING id, email;
    `;
    
    if (result.rows.length > 0) {
      console.log('Password updated successfully for user:', result.rows[0]);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  }
}

resetPassword().catch(console.error);
