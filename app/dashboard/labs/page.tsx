import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BeakerIcon, 
  ArrowPathIcon, 
  KeyIcon, 
  CpuChipIcon 
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Next.js 实验室',
  description: '系统学习 Next.js 的各项特性和最佳实践',
};

const LAB_ITEMS = [
  {
    title: '基础特性',
    description: '学习 Next.js 的核心概念，包括 Server Components、Client Components 等',
    href: '/dashboard/labs/basic',
    icon: BeakerIcon,
  },
  {
    title: '路由系统',
    description: '探索 App Router、动态路由、路由组等路由系统特性',
    href: '/dashboard/labs/routing',
    icon: ArrowPathIcon,
  },
  {
    title: '认证系统',
    description: '实现用户认证、授权和中间件功能',
    href: '/dashboard/labs/auth',
    icon: KeyIcon,
  },
  {
    title: '性能优化',
    description: '掌握图片优化、字体优化、流式渲染等性能优化技巧',
    href: '/dashboard/labs/performance',
    icon: CpuChipIcon,
  },
];

export default function LabsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Next.js 实验室</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LAB_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group block space-y-3 rounded-lg border border-gray-200 p-6 hover:border-blue-500"
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-500" />
                <h2 className="text-xl font-semibold">{item.title}</h2>
              </div>
              <p className="text-gray-500 line-clamp-3">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 