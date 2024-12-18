'use client'

import { lusitana } from '@/app/ui/fonts'
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/app/lib/api-service'

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData.email || !formData.password || !formData.name) {
      setError('请填写所有必填字段')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      setIsLoading(false)
      return
    }

    try {
      // 直接使用原始密码
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      if (response.success && response.code === 201) {
        router.push('/login')
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      // 如果是响应错误，使用响应中的错误信息
      if (err.response?.data) {
        setError(err.response.data.message)
      } else {
        setError(err.message || '注册失败')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>注册账号</h1>
        <div className="w-full">
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
                name="name"
                placeholder="输入您的用户名"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
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
                value={formData.email}
                onChange={handleInputChange}
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
                value={formData.password}
                onChange={handleInputChange}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              确认密码
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="再次输入密码"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {error && (
            <div
              className="mt-4 flex items-center gap-x-2 rounded-md bg-red-50 p-3 text-red-700"
              id="error-message"
            >
              <ExclamationCircleIcon className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            className="mt-4 w-full"
            aria-disabled={isLoading}
            disabled={isLoading}
          >
            注册 <ArrowRightIcon className="ml-auto h-5 w-5" />
          </Button>

          <div className="mt-4 text-center text-sm">
            已有账号？{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
