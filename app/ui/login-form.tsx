'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/api-service';

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  async function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isRegistering && !name.trim()) {
      setErrorMessage('请输入用户名');
      return;
    }

    try {
      if (isRegistering) {
        await authService.register({ email, password, name });
        setIsRegistering(false);
        setErrorMessage('注册成功，请登录');
      } else {
        const response = await authService.login({ email, password });
        console.log(response, 'response');
        
        if (response.success && response.code === 200) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setErrorMessage('登录失败，请重试');
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '操作失败');
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          {isRegistering ? '注册新账号' : '请登录继续'}
        </h1>
        <div className="w-full">
          {isRegistering && (
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                用户名
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入您的用户名"
                  required
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          )}

          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              邮箱
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="输入您的邮箱地址"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              密码
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="输入密码"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {isRegistering ? (
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-500">
            注册 <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        ) : (
          <Button className="mt-4 w-full">
            登录 <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        )}

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isRegistering ? (
            <span>已有账号？ 
              <button
                type="button"
                className="text-blue-500 hover:text-blue-600"
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMessage(null);
                }}
              >
                点击登录
              </button>
            </span>
          ) : (
            <span>还没有账号？ 
              <button
                type="button"
                className="text-blue-500 hover:text-blue-600"
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMessage(null);
                }}
              >
                立即注册
              </button>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}