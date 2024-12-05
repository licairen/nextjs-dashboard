import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '客户管理',
};

export default async function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">客户管理</h1>
      <p className="text-gray-600">客户列表将在这里显示</p>
    </main>
  );
}