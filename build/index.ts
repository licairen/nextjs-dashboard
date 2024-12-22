/* eslint-disable @typescript-eslint/no-var-requires */

// import { execSync } from 'child_process';
const { execSync } = require('child_process');

console.log('🚀 Running custom postinstall script...');

try {
  // 执行 Prisma Client 生成
  console.log('✅ Prisma Client 生成---Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 运行其他钩子逻辑（例如数据库迁移）
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ 数据库迁移---Running Prisma Migrations in production...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  }

  // 其他自定义操作，例如清理缓存或运行脚本
  console.log('✅ 清理缓存---Cleaning up temporary files...');
  execSync('rm -rf .cache', { stdio: 'inherit' });

  console.log('🎉 脚本执行成功---Postinstall script completed successfully!');
} catch (error) {
  console.error('❌ 脚本执行失败---Error during postinstall:', error);
  process.exit(1);
}