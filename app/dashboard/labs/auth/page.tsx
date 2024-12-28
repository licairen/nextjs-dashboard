'use client'

import { KeyIcon } from '@heroicons/react/24/outline'
import { useState,useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

const AUTH_TOPICS = [
  {
    title: '认证流程概述',
    description: '完整的用户认证和授权流程，包括登录、JWT 令牌验证和会话管理。',
    code: `// 认证流程示意图 
1. 用户登录流程
   Client (login-form.tsx)                Server
   ├─ 提交登录表单 ────────────────────> API (login/route.ts)
   │                                     ├─ 验证用户凭据
   │                                     ├─ 生成 JWT token
   │  <─────────────────────────────────┤ 设置 HTTP-only cookie
   └─ 重定向到仪表板

2. 路由保护流程
   Client (访问受保护页面)               Middleware
   ├─ 请求页面 ──────────────────────> middleware.ts
   │                                   ├─ 检查 auth-token cookie
   │                                   ├─ 验证 JWT token
   │                                   ├─ 解析用户信息
   │  <───────────────────────────────┤ 添加用户信息到请求头
   └─ 访问页面或重定向到登录

3. 会话管理流程
   Client (useAuth hook)                Server
   ├─ 检查会话状态 ───────────────────> API (verify)
   │                                    ├─ 验证 token
   │  <────────────────────────────────┤ 返回用户信息
   └─ 更新 UI 状态`,
  },
  {
    title: '登录实现',
    description: '基于 JWT 的登录系统实现，包含前端表单、API 路由和认证服务。',
    code: `// app/ui/login-form.tsx
'use client'
export function LoginForm() {
  const [error, setError] = useState('')
  
  async function handleSubmit(formData: FormData) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        // 登录成功，重定向到仪表板
        router.push('/dashboard')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('登录过程中发生错误')
    }
  }
  
  return (
    <form action={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">登录</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}

// @/app/lib/services/auth.ts
export class AuthService {
  static async verifyCredentials(email: string, password: string) {
    const user = await UserService.findByEmail(email)
    if (!user) return null
    
    // 使用 bcrypt 验证密码
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return null
    
    return user
  }
}

// app/api/auth/verify/route.ts
export async function GET(request: Request) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return Response.json({ success: false, message: '未登录' })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jose.jwtVerify(token, secret)
    
    // 从数据库获取最新的用户信息
    const user = await UserService.findById(payload.sub as string)
    if (!user) {
      return Response.json({ success: false, message: '用户不存在' })
    }

    const { password: _, ...userWithoutPassword } = user
    return Response.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: 'token 验证失败' 
    })
  }
}`,
  },
  {
    title: '自定义认证系统',
    description: '使用 TypeScript 实现的轻量级认证系统，包含用户注册、登录和会话管理。',
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
});`,
  },
  {
    title: 'JWT 验证中间件',
    description: '使用 jose 库实现 JWT 令牌验证的中间件，保护需要认证的路由。',
    code: `// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'
 
export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 验证 JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jose.jwtVerify(token, secret)
    
    // 验证通过，将用户信息添加到请求头
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.sub as string)
    requestHeaders.set('x-user-email', payload.email as string)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token 无效或过期
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/dashboard/:path*',
}`,
  },
  {
    title: '会话管理',
    description: '在服务器端和客户端组件中访问用户会话。',
    code: `// hooks/useAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { jwtVerify } from 'jose'

interface User {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  return { user, loading }
}

// 服务器端组件
async function ServerComponent() {
  const headers = headers()
  const userId = headers.get('x-user-id')
  const userEmail = headers.get('x-user-email')
  
  return userId ? <p>欢迎, {userEmail}</p> : <p>请登录</p>
}

// 客户端组件
'use client'
function ClientComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <p>加载中...</p>
  return user ? <p>已登录: {user.email}</p> : <p>未登录</p>
}`,
  },
  {
    title: 'Middleware 中间件详解',
    description: 'Next.js 中间件的工作原理、配置方式和最佳实践指南。',
    code: `// middleware.ts 工作流程与实现示例
  
  1. 中间件执行流程
     客户端请求                   中间件                 目标路由
     ├─ 发起请求 ────────────> middleware.ts ─────────> 页面/API
     │                         ├─ 请求拦截
     │                         ├─ 身份验证
     │                         ├─ 请求修改
     │                         └─ 响应处理
  
  2. 基础中间件实现
  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'
  import * as jose from 'jose'
  
  export async function middleware(request: NextRequest) {
    try {
      // 1. 获取认证令牌
      const token = request.cookies.get('auth-token')?.value
      
      if (!token) {
        // 未登录用户重定向到登录页
        return NextResponse.redirect(new URL('/login', request.url))
      }
  
      // 2. JWT 令牌验证
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jose.jwtVerify(token, secret)
      
      // 3. 添加用户信息到请求头
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.sub as string)
      requestHeaders.set('x-user-role', payload.role as string)
      
      // 4. 继续处理请求
      return NextResponse.next({
        request: { headers: requestHeaders }
      })
    } catch (error) {
      // 5. 错误处理
      console.error('中间件验证失败:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  3. 高级配置示例
  export const config = {
    // 匹配需要验证的路由
    matcher: [
      // 保护 dashboard 路由
      '/dashboard/:path*',
      // 保护 API 路由
      '/api/((?!auth).*)/*',
      // 排除静态资源
      '/((?!_next/static|favicon.ico).*)'
    ]
  }
  
  4. 常见使用场景
  // 国际化处理
  if (!request.nextUrl.pathname.startsWith('/_next')) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'zh'
    return NextResponse.rewrite(
      new URL(\`/\${locale}\${request.nextUrl.pathname}\`, request.url)
    )
  }
  
  // API 请求限流
  const ip = request.ip || '127.0.0.1'
  const rateLimit = await redis.incr(\`rate_limit:\${ip}\`)
  if (rateLimit > 100) { // 每分钟最多 100 次请求
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  // 响应头修改
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response`,
  },
  {
    title: '授权系统概述',
    description: '详细介绍常见的授权模型、概念以及在 Next.js 应用中的实现方案。',
    code: `// 授权(Authorization)基础概念
  
  1. 常见授权模型
     
     1.1 基于角色的访问控制(RBAC)
     用户 ──────> 角色 ──────> 权限
     特点:
     - 易于管理和维护
     - 适合层级分明的组织架构
     - 角色可以继承
     示例:
     用户(张三) -> 角色(编辑) -> 权限(创建文章、编辑文章)
  
     1.2 基于属性的访问控制(ABAC)
     访问规则 = f(主体属性, 对象属性, 操作, 环境)
     特点:
     - 更细粒度的控制
     - 可以基于上下文做决策
     - 规则更灵活
     示例:
     规则: 编辑只能修改自己所在部门的文档
     
     1.3 基于权限的访问控制(PBAC)
     用户 ──────> 权限
     特点:
     - 直接管理权限
     - 适合简单系统
     - 维护成本较高
  
  2. 关键概念解释
  
     2.1 Authentication(认证) vs Authorization(授权)
     - 认证: 验证用户身份 (Who you are)
     - 授权: 控制访问权限 (What you can do)
  
     2.2 Principal(主体)
     - 可以是用户、服务或系统
     - 具有一个或多个身份标识
     
     2.3 Resource(资源)
     - 被保护的对象
     - 例如: API、页面、数据
     
     2.4 Action(操作)
     - 对资源的操作类型
     - 常见: CRUD (Create/Read/Update/Delete)
  
  3. 最佳实践建议
  
     3.1 授权原则
     - 最小权限原则
     - 职责分离
     - 明确拒绝
     
     3.2 实现建议
     - 集中管理权限配置
     - 使用声明式授权
     - 实现细粒度控制
     - 添加审计日志
     
     3.3 安全考虑
     - 防止权限提升
     - 定期权限审查
     - 异常行为监控
  
  4. Next.js 中的实现方式
  
     4.1 中间件层
     - 路由级别的权限控制
     - 统一的权限验证
     
     4.2 组件层
     - HOC 包装需保护的组件
     - 条件渲染
     
     4.3 API 层
     - 装饰器模式
     - 中间件链
     
  示例实现架构:
     
  Client ──────────────────────> Next.js Server
     │                              │
     ├─ 组件级权限控制              ├─ 中间件授权
     ├─ 客户端路由保护              ├─ API 路由保护
     └─ UI 权限适配                 └─ 业务逻辑授权
  
  权限验证流程:
  1. 用户请求资源
  2. 中间件检查权限
  3. 通过 -> 继续处理
  4. 失败 -> 返回 403`,
  },
  {
    title: '权限控制与授权管理',
    description: '基于角色(RBAC)和基于权限(PBAC)的访问控制实现，包含权限验证中间件和 React 组件。',
    code: `// 1. 权限类型定义
  // types/auth.ts
  interface Permission {
    action: 'create' | 'read' | 'update' | 'delete'
    resource: string
  }
  
  interface Role {
    name: string
    permissions: Permission[]
  }
  
  interface User {
    id: string
    email: string
    roles: Role[]
  }
  
  // 2. 权限验证 Hook
  // hooks/useAuthorization.ts
  export function useAuthorization() {
    const { user } = useAuth()
    
    const hasPermission = (action: string, resource: string) => {
      if (!user?.roles) return false
      
      return user.roles.some(role =>
        role.permissions.some(
          p => p.action === action && p.resource === resource
        )
      )
    }
  
    const hasRole = (roleName: string) => {
      return user?.roles?.some(role => role.name === roleName)
    }
  
    return { hasPermission, hasRole }
  }
  
  // 3. 权限控制组件
  // components/AuthGuard.tsx
  interface AuthGuardProps {
    children: React.ReactNode
    action: string
    resource: string
    fallback?: React.ReactNode
  }
  
  export function AuthGuard({
    children,
    action,
    resource,
    fallback = <p>无权访问</p>
  }: AuthGuardProps) {
    const { hasPermission } = useAuthorization()
    
    if (!hasPermission(action, resource)) {
      return fallback
    }
    
    return children
  }
  
  // 4. 使用示例
  function DashboardPage() {
    return (
      <div>
        <h1>仪表板</h1>
        
        {/* 基于权限控制按钮显示 */}
        <AuthGuard action="create" resource="posts">
          <button>新建文章</button>
        </AuthGuard>
        
        {/* 基于角色控制内容显示 */}
        <RoleGuard role="admin">
          <AdminPanel />
        </RoleGuard>
      </div>
    )
  }
  
  // 5. 权限验证中间件
  // middleware/authz.ts
  export async function authorizationMiddleware(
    req: NextRequest,
    res: NextResponse
  ) {
    const userRole = req.headers.get('x-user-role')
    const requiredPermissions = getRoutePermissions(req.nextUrl.pathname)
    
    if (!hasRequiredPermissions(userRole, requiredPermissions)) {
      return new NextResponse(
        JSON.stringify({ message: '权限不足' }),
        { status: 403 }
      )
    }
    
    return NextResponse.next()
  }
  
  // 6. API 路由权限控制
  // app/api/posts/route.ts
  import { withAuth } from '@/lib/auth'
  
  export const POST = withAuth(
    async (req: Request) => {
      // 处理创建文章的逻辑
    },
    { action: 'create', resource: 'posts' }
  )
  
  // 7. 权限配置示例
  const ROLES_AND_PERMISSIONS = {
    admin: {
      name: 'admin',
      permissions: [
        { action: 'create', resource: '*' },
        { action: 'read', resource: '*' },
        { action: 'update', resource: '*' },
        { action: 'delete', resource: '*' }
      ]
    },
    editor: {
      name: 'editor',
      permissions: [
        { action: 'create', resource: 'posts' },
        { action: 'update', resource: 'posts' },
        { action: 'read', resource: '*' }
      ]
    },
    user: {
      name: 'user',
      permissions: [
        { action: 'read', resource: 'posts' },
        { action: 'create', resource: 'comments' }
      ]
    }
  }
  
  // 8. 实用工具函数
  // utils/auth.ts
  export function checkPermission(
    userRoles: string[],
    requiredAction: string,
    requiredResource: string
  ): boolean {
    return userRoles.some(roleName => {
      const role = ROLES_AND_PERMISSIONS[roleName]
      return role.permissions.some(
        p => (p.action === requiredAction || p.action === '*') &&
            (p.resource === requiredResource || p.resource === '*')
      )
    })
  }
  
  // 9. 使用示例笔记
  /**
   * 权限系统使用笔记:
   * 
   * 1. 组件级权限控制:
   *    <AuthGuard action="create" resource="posts">
   *      <CreatePostButton />
   *    </AuthGuard>
   * 
   * 2. API 路由保护:
   *    export const POST = withAuth(handler, {
   *      action: 'create',
   *      resource: 'posts'
   *    })
   * 
   * 3. 自定义 Hook 使用:
   *    const { hasPermission } = useAuthorization()
   *    if (hasPermission('update', 'posts')) {
   *      // 显示编辑按钮
   *    }
   * 
   * 4. 权限配置:
   *    - 使用 ROLES_AND_PERMISSIONS 定义角色权限
   *    - 可以使用通配符 '*' 表示所有资源或操作
   *    - 建议将权限配置放在环境变量或数据库中
   */`
  }
]

export default function AuthPage() {

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      Prism.highlightAll()
    }
  }, [isClient])

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
            {isClient && <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code className="language-typescript">{topic.code}</code>
            </pre>}
          </div>
        ))}
      </div>
    </div>
  )
}