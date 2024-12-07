import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        // 添加你的认证逻辑，例如检查数据库中的用户
        const user = { id: 1, name: "Test User", email: "test@example.com" };
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true; // 如果需要，添加自定义登录逻辑
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // 登录后重定向
    },
    async session({ session, token }) {
      session.user.id = token.id; // 将额外信息添加到会话中
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});