'use client';

import { BeakerIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

const BASIC_TOPICS = [
  {
    title: 'Server Components vs Client Components',
    description: '了解 Next.js 中服务器组件和客户端组件的区别及使用场景。',
    comparison: [
      {
        title: '默认行为',
        server: '默认情况下，组件是 Server Components。',
        client: '必须显式添加 \'use client\'; 标记才是 Client Components。'
      },
      {
        title: '运行环境',
        server: '运行在服务器端，代码在服务器执行。',
        client: '运行在客户端，代码在浏览器执行。'
      },
      {
        title: '访问后端资源',
        server: '可以直接访问数据库、API 或其他服务器端资源。',
        client: '无法直接访问服务器端资源，必须通过 API 请求。'
      },
      {
        title: '发送到客户端的代码',
        server: '仅发送最小的 HTML 和必要的静态数据到客户端，无多余的 JS。',
        client: '发送整个组件的 JavaScript 代码到客户端运行。'
      },
      {
        title: '性能优化',
        server: '减少客户端 JavaScript 的体积，提高页面加载性能。',
        client: '可能导致客户端加载较多的 JavaScript，影响性能。'
      },
      {
        title: '交互性',
        server: '无法处理客户端交互（例如事件处理、状态管理）。',
        client: '支持完整的客户端交互（例如按钮点击、动态渲染）。'
      },
      {
        title: '\'use server\'; 标记',
        server: '默认行为，通常不需要显式声明 \'use server\';。',
        client: '不适用（仅能用于 Server Components）。'
      },
      {
        title: '\'use client\'; 标记',
        server: '无效，标记为 \'use client\'; 的组件会被视为 Client Components。',
        client: '必须显式声明为 \'use client\'; 才是 Client Components。'
      }
    ],
    code: `// Server Component (默认)
    // app/server-component.tsx
    async function ServerComponent() {
      // 可以直接访问数据库
      const data = await db.query('SELECT * FROM users');
      return <div>{/* 渲染数据 */}</div>;
    }

    // Client Component
    // app/client-component.tsx
    'use client';

    function ClientComponent() {
      // 可以使用浏览器 API 和状态
      const [state, setState] = useState(null);
      return <button onClick={() => setState()}>更新状态</button>;
    }`
  },
  {
    title: '水合检测 (Hydration Detection)',
    description: '理解和处理 React 中的水合过程，确保客户端功能正确初始化。',
    comparison: [
      {
        title: '什么是水合',
        server: '服务器端生成静态 HTML',
        client: 'React 接管 HTML，添加事件处理和状态管理'
      },
      {
        title: '为什么需要检测',
        server: '某些功能（如 Prism.js）需要在客户端完全准备好后才能初始化',
        client: '避免服务器端和客户端渲染不匹配的问题'
      },
      {
        title: '执行时机',
        server: '初始状态为 false，不执行客户端特定代码',
        client: 'useEffect 触发后设置为 true，表示水合完成'
      }
    ],
    code: `// 水合检测模式示例
    'use client';
    
    function HydrationExample() {
      // 1. 初始状态为 false（服务器端渲染阶段）
      const [isClient, setIsClient] = useState(false);
    
      // 2. 水合检测：仅在客户端执行
      useEffect(() => {
        setIsClient(true);
      }, []);
    
      // 3. 客户端特定功能初始化
      useEffect(() => {
        if (isClient) {
          // 例如：语法高亮初始化
          Prism.highlightAll();
        }
      }, [isClient]);
    
      return (
        <div>
          {/* 条件渲染：仅在客户端水合后显示 */}
          {isClient && (
            <div>仅客户端渲染的内容</div>
          )}
        </div>
      );
    }`
  },
  {
    title: '数据获取策略',
    description: 'Next.js 提供多种数据获取方式，适应不同场景需求。',
    code: `// 1. 服务器组件获取数据
      async function ServerComponent() {
        const data = await fetch('https://api.example.com/data');
        return <div>{/* 使用数据 */}</div>;
      }

      // 2. 静态数据获取
      export async function generateStaticParams() {
        return [{ id: '1' }, { id: '2' }];
      }

      // 3. 增量静态再生成 (ISR)
      fetch('https://api.example.com/data', { next: { revalidate: 3600 } });

      // 4. 动态数据获取
      fetch('https://api.example.com/data', { cache: 'no-store' });`
  },
  {
    title: '路由处理器 (Route Handlers)',
    description: '使用 Route Handlers 创建 API 端，处理 HTTP 请求。',
    code: `// app/api/route.ts
    import { NextResponse } from 'next/server';
    
    export async function GET(request: Request) {
      const { searchParams } = new URL(request.url);
      return NextResponse.json({ data: 'Hello' });
    }

    export async function POST(request: Request) {
      const data = await request.json();
      return NextResponse.json({ received: data });
    }`
  },
  {
    title: '元数据 (Metadata)',
    description: '通过配置元数据优化 SEO 和社交分享。',
    code: `// app/layout.tsx 或 page.tsx
      import { Metadata } from 'next';

      export const metadata: Metadata = {
        title: '页面标题',
        description: '页面描述',
        openGraph: {
          title: '社交分享标题',
          description: '社交分享描述',
          images: ['/og-image.jpg'],
        },
      };`
  },
  {
    title: '中间件 (Middleware)',
    description: '使用中间件处理请求，实现认证、重定向等功能。',
    code: `// middleware.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      export function middleware(request: NextRequest) {
        // 检查认证状态
        const isAuthenticated = request.cookies.has('auth');
        
        if (!isAuthenticated) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
        
        return NextResponse.next();
      }`
  },
  {
    title: '错误处理',
    description: '使用错误边界和错误页面处理异常情况。',
    code: `// app/error.tsx
      'use client';
      
      export default function Error({
        error,
        reset,
      }: {
        error: Error;
        reset: () => void;
      }) {
        return (
          <div>
            <h2>出错了！</h2>
            <button onClick={() => reset()}>重试</button>
          </div>
        );
      }

      // app/not-found.tsx
      export default function NotFound() {
        return <div>404 - 页面未找到</div>;
      }`
  },
  {
    title: '环境变量和配置',
    description: '管理不同环境的配置和敏感信息。',
    code: `// .env.local
      DATABASE_URL="mysql://user:pass@localhost:3306/db"
      API_KEY="your-api-key"

      // 使用环境变量
      const dbUrl = process.env.DATABASE_URL
      const apiKey = process.env.API_KEY

      // next.config.js
      /** @type {import('next').NextConfig} */
      const nextConfig = {
        env: {
          customKey: 'custom-value',
        },
        // 其他配置...
      }`
  }
];

export default function BasicPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      Prism.highlightAll();
      
      // 设置 Intersection Observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -60% 0px'
        }
      );

      // 观察所有章节
      document.querySelectorAll('[data-section]').forEach((section) => {
        observerRef.current?.observe(section);
      });

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [isClient]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 主要内容区域 - 添加上边距来避免被面包屑遮挡 */}
      <div className="flex flex-1">
        {/* 左侧导航 */}
        <nav className="w-64 p-4 border-r top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="text-xl font-bold mb-4">概述</div>
          <div className="space-y-4">
            {BASIC_TOPICS.map((topic, index) => (
              <a 
                key={index} 
                href={`#${topic.title}`}
                className={`block py-1.5 px-3 rounded-lg transition-colors ${
                  activeSection === topic.title
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {topic.title}
              </a>
            ))}
          </div>
        </nav>
      
        {/* 主内容区域 */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-8">
            <BeakerIcon className="h-12 w-12 text-blue-500" />
            <h1 className="text-2xl font-bold">基础特性</h1>
          </div>
        
          <div className="space-y-6">
            {BASIC_TOPICS.map((topic, index) => (
              <div 
                key={index}
                id={topic.title}
                data-section
                className="rounded-lg border border-gray-200 p-6 space-y-4"
              >
                <h2 className="text-xl font-semibold">{topic.title}</h2>
                <p className="text-gray-600">{topic.description}</p>
                
                {topic.comparison && (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">特性</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Server Components</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Client Components</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {topic.comparison.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.title}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.server}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.client}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {
                  isClient && <pre className="bg-[#1e1e1e] rounded-lg overflow-x-auto">
                    <code className="language-typescript">
                      {topic.code}
                    </code>
                  </pre>
                }
                
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
