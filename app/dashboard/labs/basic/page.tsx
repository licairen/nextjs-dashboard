import { Metadata } from 'next';
import { BeakerIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: '基础特性 - Next.js 实验室',
  description: '学习 Next.js 的核心概念，包括 Server Components、Client Components 等',
};

const FEATURES = [
  {
    title: 'Server Components',
    description: '默认情况下，Next.js 应用中的组件都是 Server Components。它们在服务器端预渲染，可以直接访问数据库等后端资源，并减少发送到客户端的 JavaScript 数量。',
    code: `// 这是一个 Server Component
export default function ServerComponent() {
  return <h1>在服务器端渲染</h1>;
}`
  },
  {
    title: 'Client Components',
    description: '当需要添加交互性或使用浏览器 API 时，我们可以使用 Client Components。通过在文件顶部添加 "use client" 指令来声明。',
    code: `'use client';
 
export default function ClientComponent() {
  return <button onClick={() => alert('客户端交互')}>点击我</button>;
}`
  },
  {
    title: '数据获取',
    description: 'Next.js 提供了多种数据获取方式，包括服务器端获取、静态生成和增量静态再生成（ISR）。',
    code: `// 服务器端数据获取
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}
 
export default async function Page() {
  const data = await getData();
  return <main>{/* 使用数据 */}</main>;
}`,
    demo: '/dashboard/labs/basic/data-fetching'
  }
];

export default function BasicFeatures() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <BeakerIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">基础特性</h1>
      </div>
      
      <div className="space-y-6">
        {FEATURES.map((feature, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-200 p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{feature.code}</code>
            </pre>
            {feature.demo && (
              <div className="mt-4">
                <a
                  href={feature.demo}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  查看演示 →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
