import { NextResponse } from 'next/server';

export async function GET(_req: Request) {
  console.log('这是一个受保护的路由', _req);
  return NextResponse.json({ message: '这是一个受保护的路由' });
} 