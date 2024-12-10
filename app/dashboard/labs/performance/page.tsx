import { Metadata } from 'next';
import { CpuChipIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: '性能优化 - Next.js 实验室',
  description: '掌握图片优化、字体优化、流式渲染等性能优化技巧',
};

const PERFORMANCE_TOPICS = [
  {
    title: '图片优化',
    description: 'Next.js 内置的 Image 组件自动进行图片优化，包括调整大小、格式转换和延迟加载。',
    code: `import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile picture"
      width={640}
      height={480}
      placeholder="blur"
      priority={true}
    />
  );
}`
  },
  {
    title: '字体优化',
    description: '使用 next/font 自动优化和加载自定义字体，包括自托管 Google Fonts。',
    code: `import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}`
  },
  {
    title: '流式渲染',
    description: '使用 React Suspense 实现流式渲染，提供更好的用户体验。',
    code: `import { Suspense } from 'react';
import Loading from './loading';

async function SlowComponent() {
  const data = await fetch('https://slow-api.example.com');
  return <div>{/* 渲染数据 */}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}`
  },
  {
    title: '路由预取',
    description: 'Next.js 会自动预取视口中的链接，提高页面导航速度。',
    code: `import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  
  return (
    <>
      {/* 自动预取 */}
      <Link href="/about">关于我们</Link>
      
      {/* 手动预取 */}
      <button
        onMouseEnter={() => router.prefetch('/dashboard')}
        onClick={() => router.push('/dashboard')}
      >
        仪表板
      </button>
    </>
  );
}`
  }
];

export default function PerformancePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <CpuChipIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">性能优化</h1>
      </div>
      
      <div className="space-y-6">
        {PERFORMANCE_TOPICS.map((topic, index) => (
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
