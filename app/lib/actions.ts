'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
// import { AuthError } from 'next-auth/errors';
import bcrypt from 'bcrypt';

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
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// TODO:状态
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
};
 
// TODO:创建
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error('Database Error: Failed to Create Invoice.', error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// TODO:更新
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    try {
      await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
// TODO:删除
  export async function deleteInvoice(id: string) {
    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.' };
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
  }

// TODO:登录
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 尝试登录
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: true,
      callbackUrl: '/dashboard'
    });

    return 'Success';
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong.';
  }
}

// TODO:注册
export async function register(prevState: string | undefined, formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');
    const name = (formData.get('name') || 'User')?.toString();  // 默认用户名

    if (typeof email !== 'string') {
      throw new Error('Email must be a string');
    }

    // 验证邮箱是否已存在
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return 'User already exists with this email';
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // 创建新用户
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    return undefined; // 注册成功
  } catch (error) {
    return `Database Error: Failed to register user----${JSON.stringify(error)}`;
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