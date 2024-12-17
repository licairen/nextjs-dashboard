import '@/app/ui/global.css'
import { Inter } from 'next/font/google'
import 'prismjs/themes/prism-tomorrow.css'

import { prisma } from '@/lib/prisma'

// 初始化 Inter 字体
const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const customers = await prisma.customers.findMany()
  console.log(customers, 99999)

  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
