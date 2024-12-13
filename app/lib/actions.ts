'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'

// TODO:表单验证
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })

// TODO:状态
export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string
  status?: number
}

// TODO:创建
// 创建发票 Server Action
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      status: 400,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  const { customerId, amount, status } = validatedFields.data

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amount}, ${status}, ${new Date().toISOString().split('T')[0]})
    `
  } catch (error) {
    return {
      status: 500,
      message: 'Database Error: Failed to Create Invoice.',
    }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
  return {
    status: 200,
    message: 'Invoice created successfully',
  }
}

// TODO:更新
const UpdateInvoice = FormSchema.omit({ id: true, date: true })
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  const amountInCents = amount * 100

  try {
    await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `
  } catch (error) {
    console.error('Failed to update invoice:', error)
    return { message: 'Database Error: Failed to Update Invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
// TODO:删除
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`
    revalidatePath('/dashboard/invoices')
    return { message: 'Deleted Invoice.' }
  } catch (error) {
    console.error('Failed to delete invoice:', error)
    return { message: 'Database Error: Failed to Delete Invoice.' }
  }
}

// TODO:登录
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log('开始登录流程...')
    const email = formData.get('email')
    const password = formData.get('password')
    console.log('登录信息:', { email, password: '***' })

    // 在服务器端组件中需要使用完整的 URL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    )

    console.log('登录响应状态:', response.status)
    const data = await response.json()
    console.log('登录响应数据:', data)

    if (!response.ok) {
      console.log('登录失败:', data.error)
      return data.error || 'Authentication failed'
    }

    if (data.code === 200) {
      console.log('登录成功，准备重定向...')
      // 返回 undefined 表示成功，让表单组件处理重定向
      return undefined
    }

    return 'Authentication failed with unknown error'
  } catch (error) {
    console.error('登录过程发生错误:', error)
    return 'An error occurred during authentication'
  }
}

// TODO:注册
export async function register(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get('email')
    const password = formData.get('password')
    const name = (formData.get('name') || 'User')?.toString() // 默认用户名

    if (typeof email !== 'string') {
      throw new Error('Email must be a string')
    }

    // 验证邮箱是否已存在
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUser.rows.length > 0) {
      return 'User already exists with this email'
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password as string, 10)

    // 创建新用户
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `

    return undefined // 注册成功
  } catch (error) {
    return `Database Error: Failed to register user----${JSON.stringify(error)}`
  }
}

// TODO:退出登录
// export async function handleSignOut() {
//   try {
//     await signOut({
//       redirect: true,
//       callbackUrl: '/'
//     });
//   } catch (error) {
//     console.error('退出登录失败:', error);
//     throw error;
//   }
// }
