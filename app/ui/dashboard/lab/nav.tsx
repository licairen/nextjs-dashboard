'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

// 定义实验室模块列表
const modules = [
  {
    name: '基础功能',
    links: [
      { name: '路由导航', href: '/lab/routing' },
      { name: '数据获取', href: '/lab/data-fetching' },
      { name: '状态管理', href: '/lab/state' },
    ],
  },
  {
    name: '进阶特性',
    links: [
      { name: '服务器组件', href: '/lab/server-components' },
      { name: '流式渲染', href: '/lab/streaming' },
      { name: '并行路由', href: '/lab/parallel' },
    ],
  },
  {
    name: '性能优化',
    links: [
      { name: '图片优化', href: '/lab/images' },
      { name: '路由缓存', href: '/lab/caching' },
      { name: '动态导入', href: '/lab/dynamic-imports' },
    ],
  },
]

export default function LabNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {modules.map((module) => (
          <div key={module.name} className="space-y-1">
            <h2 className="mb-2 px-2 text-sm font-semibold">{module.name}</h2>
            {module.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                  {
                    'bg-sky-100 text-blue-600': pathname === link.href,
                  }
                )}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
