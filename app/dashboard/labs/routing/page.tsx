import { Metadata } from 'next';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: '路由系统 - Next.js 实验室',
  description: '探索 App Router、动态路由、路由组等路由系统特性',
};

const ROUTING_CONCEPTS = [
  {
    title: 'App Router 基础',
    description: 'Next.js 13+ 引入的基于文件系统的 App Router，支持共享布局、嵌套路由等特性。',
    example: {
      structure: `app/
  ├── layout.tsx      # 根布局
  ├── page.tsx        # 首页
  └── dashboard/
      ├── layout.tsx  # 仪表板布局
      └── page.tsx    # 仪表板页面`,
      explanation: '文件系统即路由结构，访问 /dashboard 会渲染 dashboard/page.tsx'
    }
  },
  {
    title: '动态路由',
    description: '使用方括号 [...] 创建动态路由段，可以处理动态数据。',
    example: {
      structure: `app/
  └── posts/
      └── [id]/
          └── page.tsx`,
      explanation: '访问 /posts/123 会将 123 作为 id 参数传递给页面组件'
    }
  },
  {
    title: '路由组',
    description: '使用括号 (folder) 创建路由组，用于组织代码但不影响 URL 结构。',
    example: {
      structure: `app/
  └── (marketing)/
      ├── about/
      │   └── page.tsx
      └── blog/
          └── page.tsx`,
      explanation: '(marketing) 不会出现在 URL 中，但可以共享组件和布局'
    }
  }
];

export default function RoutingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <ArrowPathIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">路由系统</h1>
      </div>
      
      <div className="space-y-6">
        {ROUTING_CONCEPTS.map((concept, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-200 p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">{concept.title}</h2>
            <p className="text-gray-600">{concept.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <pre className="overflow-x-auto">
                <code className="text-sm">{concept.example.structure}</code>
              </pre>
              <p className="text-sm text-gray-600 mt-2">
                {concept.example.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
