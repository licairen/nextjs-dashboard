'use client'

import { formatDateToLocal } from '@/app/lib/utils'
import { CustomersTableType } from '@/app/lib/definitions'
import Image from 'next/image'

export default function CustomersTable({
  customers,
}: {
  customers: CustomersTableType[]
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          {/* 大屏幕表格视图 */}
          <div className="hidden md:block overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    客户
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    邮箱
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    创建时间
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    更新时间
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    订单数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {customers?.map((customer) => (
                  <tr
                    key={customer.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={customer.image_url}
                          className="rounded-full max-h-7 max-w-7 object-none bg-blue-300"
                          width={28}
                          height={28}
                          alt={`${customer.name}的头像`}
                        />
                        <p>{customer.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {customer.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(customer.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(customer.updated_at)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {customer.total_invoices || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 移动端卡片视图 */}
          <div className="md:hidden">
            {customers?.map((customer) => (
              <div
                key={customer.id}
                className="mb-2 w-full rounded-lg bg-white p-4 shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={customer.image_url}
                    className="rounded-full max-h-10 max-w-10 object-none bg-blue-300"
                    width={40}
                    height={40}
                    alt={`${customer.name}的头像`}
                  />
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex justify-between py-1">
                    <span>创建时间</span>
                    <span>{formatDateToLocal(customer.created_at)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>更新时间</span>
                    <span>{formatDateToLocal(customer.updated_at)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>订单数</span>
                    <span>{customer.total_invoices || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
