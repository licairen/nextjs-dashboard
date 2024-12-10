import { Metadata } from 'next';
import { KeyIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: '认证系统 - Next.js 实验室',
  description: '实现用户认证、授权和中间件功能',
};

const AUTH_TOPICS = [
  {
    title: '身份验证基础',
    description: '使用 NextAuth.js 实现用户认证，支持多种认证提供商。',
    code: `// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      // 凭证登录配置
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});`
  },
  {
    title: '中间件保护',
    description: '使用 Next.js 中间件保护路由，确保只有授权用户可以访问特定页面。',
    code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}`
  },
  {
    title: '会话管理',
    description: '在服务器端和客户端组件中访问用户会话。',
    code: `// 服务器端组件
import { getServerSession } from 'next-auth';

export default async function ServerComponent() {
  const session = await getServerSession();
  return session ? <p>欢迎, {session.user.name}</p> : <p>请登录</p>;
}

// 客户端组件
'use client';
import { useSession } from 'next-auth/react';

export default function ClientComponent() {
  const { data: session } = useSession();
  return session ? <p>已登录</p> : <p>未登录</p>;
}`
  }
];

export default function AuthPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <KeyIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">认证系统</h1>
      </div>
      
      <div className="space-y-6">
        {AUTH_TOPICS.map((topic, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-200 p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <p className="text-gray-600">{topic.description}</p>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{topic.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
