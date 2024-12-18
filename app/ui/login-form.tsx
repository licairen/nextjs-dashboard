'use client'

import { lusitana } from '@/app/ui/fonts'
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/app/lib/api-service'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email || !password) {
      setError('请填写所有必填字段')
      setIsLoading(false)
      return
    }

    try {
      // 直接使用原始密码
      const { data, code, success, message} = await authService.login({
        email,
        password,
      })

      console.log('登录响应:', data, code, success)

      if (success && code === 200) {
        console.log('准备跳转到 dashboard')
        // 使用 replace 而不是 push，防止用户返回到登录页
        router.replace('/dashboard')
        console.log('跳转完成')
        router.refresh()
      } else {
        setError(message || '登录失败，请重试')
      }
    } catch (err: any) {
      console.error('登录错误:', err)
      setError(err.message || '系统错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>请登录继续</h1>
        <div className="w-full">
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
                value={email}
                onChange={handleEmailChange}
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
                value={password}
                onChange={handlePasswordChange}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              登录 <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </>
          )}
        </Button>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          还没有账号？
          <button
            type="button"
            className="text-blue-500 hover:text-blue-600"
            onClick={() => {
              router.push('/register')
            }}
          >
            立即注册
          </button>
        </p>
      </div>
    </form>
  )
}
