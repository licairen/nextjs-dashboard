import type { AuthConfig } from '@auth/core';

export const authConfig: AuthConfig = {
  secret: process.env.NEXTAUTH_SECRET, // 确保从环境变量中读取 secret
  pages: {
    signIn: '/login', // 登录页面路径
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // 将用户 ID 添加到 Token 中
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string; // 将用户 ID 添加到会话对象中
      }
      return session;
    },
  },
  providers: [], // 在这里添加你的 Provider 配置
  trustHost: true, // 允许跨域请求
};