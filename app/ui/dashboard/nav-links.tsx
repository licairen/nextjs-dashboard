"use client"
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BeakerIcon,
  // CommandLineIcon,
  // ArrowPathIcon,
  // CloudArrowDownIcon,
  // KeyIcon,
  // CpuChipIcon,
  ChevronDownIcon, // 新增箭头图标
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react'; // 新增 state 管理展开状态

// 首先定义子菜单项的类型
type SubLink = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>;
};

// 定义主菜单项的类型
type NavLink = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>;
  children?: SubLink[];  // 添加可选的 children 属性
};

const links: NavLink[] = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { 
    name: 'Labs', 
    href: '/dashboard/labs',
    icon: BeakerIcon,
    // children: [
    //   { name: '基础特性', href: '/dashboard/labs/basic', icon: CommandLineIcon },
    //   { name: '路由系统', href: '/dashboard/labs/routing', icon: ArrowPathIcon },
    //   { name: '数据获取', href: '/dashboard/labs/data-fetch', icon: CloudArrowDownIcon },
    //   { name: '认证系统', href: '/dashboard/labs/auth', icon: KeyIcon },
    //   { name: '性能优化', href: '/dashboard/labs/optimization', icon: CpuChipIcon },
    // ]
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]); // 记录展开的菜单

  // 检查路径是否匹配
  const isActive = (href: string) => {
    // 完全匹配
    if (pathname === href) return true;
    
    // 处理 labs 模块的子路径
    if (href === '/dashboard/labs' && pathname.startsWith('/dashboard/labs/')) return true;
    
    // 处理 invoices 模块的子路径（新建和编辑页面）
    if (href === '/dashboard/invoices' && (
      pathname.startsWith('/dashboard/invoices/create') ||
      pathname.includes('/dashboard/invoices/') && pathname.includes('/edit')
    )) return true;
    
    return false;
  };

  // 处理菜单展开/收起
  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };
  
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        // 如果有子菜单
        if (link.children) {
          const isExpanded = expandedMenus.includes(link.name);
          return (
            <div key={link.name} className="space-y-1">
              {/* 父菜单项 - 添加点击事件和箭头图标 */}
              <button 
                onClick={() => toggleMenu(link.name)}
                className="flex h-[48px] w-full items-center justify-between gap-2 rounded-md p-3 text-sm font-medium text-gray-400 hover:bg-sky-100 hover:text-blue-600"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-6" />
                  <p className="hidden md:block">{link.name}</p>
                </div>
                <ChevronDownIcon 
                  className={clsx(
                    "w-5 transition-transform duration-200",
                    { "rotate-180": isExpanded }
                  )} 
                />
              </button>
              
              {/* 子菜单项 - 根据展开状态显示/隐藏 */}
              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {link.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={clsx(
                          'flex h-[40px] items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                          {
                            'bg-sky-100 text-blue-600': pathname === child.href,
                          },
                        )}
                      >
                        <ChildIcon className="w-5" />
                        <p className="hidden md:block">{child.name}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        
        // 普通菜单项保持不变
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': isActive(link.href),
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}