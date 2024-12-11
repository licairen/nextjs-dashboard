'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BeakerIcon, 
  ArrowPathIcon, 
  KeyIcon, 
  CpuChipIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import '@/app/ui/dashboard/labs/auth-form.css';

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

const PASSWORD_KEY = 'labs_auth_password';

export default function LabsPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    if (storedPassword === '111') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password === '111') {
      localStorage.setItem(PASSWORD_KEY, password);
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 1000);
    } else {
      setError('密码错误，请重试');
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center form-password">
        <div className="form-container">
          <div className="form-title">实验室访问验证</div>
          <form onSubmit={handleSubmit} className="relative rounded-full bg-white shadow-xl w-87">
            <input
              className="input bg-transparent outline-none border-none pl-6 pr-10 py-5 w-full font-sans text-xl"
              placeholder="请输入访问密码"
              name="text"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {error && (
              <div className="error-message">
                <ExclamationCircleIcon className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="absolute right-2 top-[0.4em]">
              <button type="submit" className="form-button-container" disabled={isLoading}>
                <div className="form-button">
                  {isLoading ? (
                    <div className="button-loader" />
                  ) : (
                    <svg
                      className="relative z-10"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 64 64"
                      height="50"
                      width="50"
                    >
                      <path
                        fillOpacity="0.01"
                        fill="white"
                        d="M63.6689 29.0491L34.6198 63.6685L0.00043872 34.6194L29.0496 1.67708e-05L63.6689 29.0491Z"
                      ></path>
                      <path
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="3.76603"
                        stroke="white"
                        d="M42.8496 18.7067L21.0628 44.6712"
                      ></path>
                      <path
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="3.76603"
                        stroke="white"
                        d="M26.9329 20.0992L42.85 18.7067L44.2426 34.6238"
                      ></path>
                    </svg>
                  )}
                </div>
                <div className="bg-animation"></div>
                <div className="bg-animation"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
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
  );
}