'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'
import CustomersTable from '@/app/ui/customers/table'
import CustomersTableSkeleton from '@/app/ui/customers/skeleton'
import Pagination from '@/app/ui/invoices/pagination'
import { CustomersTableType } from '@/app/lib/definitions'

// 客户列表内容组件
function CustomersContent() {
  const searchParams = useSearchParams()
  const [customers, setCustomers] = useState<CustomersTableType[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const query = searchParams.get('query') || ''
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/customers?query=${query}&page=${page}`
        )
        const data = await response.json()

        if (data.code === 200) {
          setCustomers(data.data.customers)
          setTotalPages(data.data.totalPages)
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, page])

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="搜索客户..." />
      </div>
      {loading ? (
        <CustomersTableSkeleton />
      ) : (
        <CustomersTable customers={customers} />
      )}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}

// 主页面组件
export default function CustomersPage() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>客户管理</h1>
      </div>
      {/* 使用 Suspense 包裹使用 useSearchParams 的组件 */}
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersContent />
      </Suspense>
    </div>
  )
}
