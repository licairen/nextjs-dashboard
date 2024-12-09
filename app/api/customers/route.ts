import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = Number(searchParams.get('page')) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const customers = await sql`
      SELECT
        c.id,
        c.name,
        c.email,
        c.image_url,
        c.created_at,
        c.updated_at,
        COUNT(i.id) as total_invoices
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        c.email ILIKE ${`%${query}%`}
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    // 获取总数
    const count = await sql`
      SELECT COUNT(*)
      FROM customers
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);

    return NextResponse.json({
      code: 200,
      data: {
        customers: customers.rows,
        totalPages,
        currentPage: page
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        code: 500,
        message: 'Failed to fetch customers'
      },
      { status: 500 }
    );
  }
} 