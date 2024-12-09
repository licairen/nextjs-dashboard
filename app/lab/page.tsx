import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'CIMC Lab | Next.js 学习实验室',
  description: '系统学习 Next.js 的各项特性和最佳实践',
};

// 学习路径数据
const LEARNING_PATHS = [
  {
    title: '1. 基础概念',
    topics: [
      { name: '路由系统', desc: '文件系统路由、动态路由、路由组' },
      { name: '页面渲染', desc: '客户端组件 vs 服务器组件' },
      { name: '数据获取', desc: 'fetch、cache、revalidate' },
      { name: '元数据', desc: 'metadata、SEO、Open Graph' },
    ]
  },
  {
    title: '2. 核心功能',
    topics: [
      { name: '状态管理', desc: 'useState、Context、Zustand' },
      { name: '表单处理', desc: 'Server Actions、表单验证' },
      { name: 'API 路由', desc: 'Route Handlers、中间件' },
      { name: '认证授权', desc: 'NextAuth.js、JWT、Session' },
    ]
  },
  {
    title: '3. 高级特性',
    topics: [
      { name: '流式渲染', desc: 'Streaming、Suspense、Loading UI' },
      { name: '并行路由', desc: 'Parallel Routes、Intercepting Routes' },
      { name: '国际化', desc: '多语言支持、本地化' },
      { name: '中间件', desc: '路由保护、重定向、请求修改' },
    ]
  },
  {
    title: '4. 性能优化',
    topics: [
      { name: '静态生成', desc: 'SSG、ISR、动态渲染' },
      { name: '图片优化', desc: 'next/image、图片加载策略' },
      { name: '字体优化', desc: 'next/font、字体加载' },
      { name: '脚本优化', desc: 'next/script、代码分割' },
    ]
  },
  {
    title: '5. 部署和监控',
    topics: [
      { name: '部署策略', desc: 'Vercel、Docker、自托管' },
      { name: '环境配置', desc: '环境变量、配置管理' },
      { name: '性能监控', desc: 'Analytics、性能指标' },
      { name: '错误处理', desc: '错误边界、错误日志' },
    ]
  }
];

export default function LabPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Next.js 学习路径</h1>
      </div>
      
      <div className="mt-8 space-y-8">
        {LEARNING_PATHS.map((path) => (
          <div key={path.title} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">{path.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {path.topics.map((topic) => (
                <div
                  key={topic.name}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{topic.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{topic.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900">学习建议</h3>
        <ul className="mt-2 space-y-2 text-sm text-blue-800">
          <li>• 按照路径顺序循序渐进学习</li>
          <li>• 每个主题都动手实践</li>
          <li>• 参考官方文档深入理解</li>
          <li>• 构建小项目来巩固知识</li>
        </ul>
      </div>
    </div>
  );
} 