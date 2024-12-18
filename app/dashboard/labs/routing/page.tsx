"use client"

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import { useEffect } from 'react'

const ROUTING_CONCEPTS = [
  {
    title: 'App Router 基础',
    description: 'Next.js 13+ 的路由系统完全基于文件系统。只要在 app 目录下创建 page.tsx，它就会自动成为一个可访问的路由页面。',
    code: `// 文件系统路由示例
app/
    ├── page.tsx           # → /
    ├── about/page.tsx     # → /about
    ├── blog/page.tsx      # → /blog
    └── deep/
        └── nested/
            └── page.tsx   # → /deep/nested`,
    explanation: '文件路径直接映射到URL。例如：app/1/2/3/4/5/page.tsx 会映射到 /1/2/3/4/5，支持任意深度的嵌套路由。',
    demo: {
      path: '/dashboard',
      description: '当前页面的路径就反映了它在文件系统中的位置',
    },
  },
  {
    title: '动态路由',
    description: '使用方括号 [...] 创建动态路由段，可以处理动态数据。Next.js 支持单层和多层级的动态路由。',
    code: `// 1. 单层动态路由 - 发票详情页
app/dashboard/invoices/[id]/page.tsx
export default function InvoicePage({ params }: { params: { id: string } }) {
  return <div>发票ID: {params.id}</div>
}

// 2. 多层级动态路由 - 用户帖子页
app/[userId]/posts/[postId]/page.tsx
export default function PostPage({ 
  params 
}: { 
  params: { 
    userId: string
    postId: string 
  } 
}) {
  return (
    <div>
      <h1>用户ID: {params.userId}</h1>
      <h2>帖子ID: {params.postId}</h2>
    </div>
  )
}`,
    explanation: '动态路由可以捕获 URL 中的参数。单个 [id] 捕获一个参数，多层级如 [userId]/posts/[postId] 可以捕获多个参数。这些参数会通过 params 对象传递给页面组件。',
    demo: {
      path: '/dashboard/invoices',
      description: '查看发票列表页面示例',
    },
  },
  {
    title: '路由组',
    description: '使用括号 (group) 创建路由组，用于组织代码而不影响 URL 结构。路由组是 Next.js 13+ 中一个强大的功能，可以帮助我们更好地组织代码。',
    code: `// 路由组示例
app/
  ├── (marketing)/      # 营销相关页面
  │   ├── about/
  │   │   └── page.tsx  # → /about
  │   └── contact/
  │       └── page.tsx  # → /contact
  │
  └── (dashboard)/      # 管理后台页面
      ├── settings/
      │   └── page.tsx  # → /settings
      └── users/
          └── page.tsx  # → /users
      
// 实际项目中的应用
app/dashboard/
  ├── (overview)/       # 仪表盘概览组
  │   └── page.tsx      # → /dashboard
  │
  └── (invoices)/       # 发票管理组
      ├── create/
      │   └── page.tsx  # → /dashboard/create
      └── [id]/
          └── page.tsx  # → /dashboard/[id]`,
    explanation: `# 路由组的核心特性 #

## 1. 组织结构 📁
• 提供清晰的文件层级组织 • 帮助管理复杂的应用结构 • 使代码结构更有逻辑性

## 2. URL 简洁性 🔗
• 路由组名称(括号包裹)不会出现在 URL 中 • 保持 URL 结构清晰简洁 • 示例：(marketing)/about/page.tsx → /about

## 3. 功能分组 🎯
• 将相关功能页面组织在一起 • 分离不同业务逻辑的代码 • 如：后台管理与前台展示分离

# 使用路由组的优势 #

## 代码组织 💡
• 按功能或模块分组管理页面 • 提高代码的可维护性 • 便于团队协作开发

## 共享资源 🔄
• 每个路由组可以有独立的布局 • 可以共享组件和样式 • 方便复用公共功能

## 项目扩展 📈
• 适合大型项目的代码管理 • 便于后期功能扩展 • 减少代码冲突风险`,
    demo: {
      path: '/dashboard',
      description: '查看我们项目中的路由组示例',
    },
  },
  {
    title: '并行路由',
    description: '使用 @folder 语法创建并行路由，可以同时加载多个页面。',
    code: `// 并行路由示例
app/
    └── dashboard/
        ├── page.tsx
        ├── @analytics/   # 并行路由
        │   └── page.tsx
        └── @team/        # 并行路由
            └── page.tsx`,
    explanation: '可以在同一个页面同时显示多个独立路由的内容，常用于复杂布局',
  },
  {
    title: '拦截路由',
    description: '使用 (.) 语法拦截子路由，常用于模态框等场景。',
    code: `// 拦截路由示例
app/
    ├── feed/
    │   └── page.tsx
    └── (.)photo/        # 拦截路由
        └── [id]/
            └── page.tsx`,
    explanation: '当从 /feed 访问 /photo/123 时，photo 页面会以模态框形式显示',
  },
  {
    title: '私有文件夹',
    description: '使用下划线 _components 创建私有文件夹，用于存放不会生成路由的文件。',
    code: `// 私有文件夹示例
app/
    └── _components/     # 私有文件夹
        ├── Button.tsx   # 不会生成路由
        └── Card.tsx     # 不会生成路由`,
    explanation: '_components 中的文件不会生成路由，只用于组织代码',
  },
]

export default function RoutingPage() {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Next.js 路由系统</h1>
        <Button>
          <ArrowPathIcon className="h-4 w-4" /> 刷新
        </Button>
      </div>

      <div className="grid gap-6">
        {ROUTING_CONCEPTS.map((concept, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {concept.title}
            </h2>
            <p className="text-gray-600 mb-4">{concept.description}</p>

            <div className="space-y-4">
              <pre className="rounded-lg bg-gray-900 p-4">
                <code className="text-sm text-gray-100 whitespace-pre">
                  {concept.code}
                </code>
              </pre>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-blue-800 text-sm">{concept.explanation}</p>
              </div>

              {concept.demo && (
                <div className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <Link href={concept.demo.path} className="flex items-center gap-1">
                    {concept.demo.description}
                    <ArrowPathIcon className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Next.js 13+ 路由最佳实践
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-blue-800">
          <li>使用 App Router 而不是 Pages Router 以获得更好的性能和功能</li>
          <li>合理使用路由组来组织代码，提高可维护性</li>
          <li>利用并行路由实现复杂的页面布局</li>
          <li>使用拦截路由创建无缝的用户体验</li>
          <li>保持URL结构清晰和语义化</li>
        </ul>
      </div>
    </div>
  )
}
