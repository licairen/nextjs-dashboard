'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Breadcrumb() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  const pathNames: { [key: string]: string } = {
    dashboard: '控制台',
    labs: '实验室',
    basic: '基础特性',
    server: '服务器组件',
    client: '客户端组件',
    data: '数据获取',
    routing: '路由系统',
    auth: '认证系统',
    performance: '性能优化',
  }

  return (
    <nav className="flex items-center space-x-2 text-gray-500 mb-6">
      {paths.map((path, index) => (
        <div key={path} className="flex items-center">
          {index > 0 && <ChevronRightIcon className="w-4 h-4 mx-2" />}
          <Link
            href={`/${paths.slice(0, index + 1).join('/')}`}
            className="hover:text-blue-600"
          >
            {pathNames[path] || path}
          </Link>
        </div>
      ))}
    </nav>
  )
}
