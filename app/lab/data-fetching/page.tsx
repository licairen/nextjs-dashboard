'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';

// 示例 API 端点
const API_ENDPOINTS = {
  REST: '/api/lab/data?type=rest',
  SSR: '/api/lab/data?type=ssr',
  ISR: '/api/lab/data?type=isr',
  SSG: '/api/lab/data?type=ssg',
};

export default function DataFetchingDemo() {
  const [activeDemo, setActiveDemo] = useState<keyof typeof API_ENDPOINTS>('REST');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS[activeDemo]);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className={`${lusitana.className} text-2xl`}>数据获取演示</h1>
      
      <div className="flex space-x-4">
        {Object.keys(API_ENDPOINTS).map((type) => (
          <button
            key={type}
            onClick={() => setActiveDemo(type as keyof typeof API_ENDPOINTS)}
            className={`px-4 py-2 rounded ${
              activeDemo === type 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {loading ? '加载中...' : '获取数据'}
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      <div className="mt-4 space-y-4">
        <h2 className="text-xl font-semibold">说明</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>REST: 传统的客户端数据获取</li>
          <li>SSR: 服务器端渲染时获取数据</li>
          <li>ISR: 增量静态再生成</li>
          <li>SSG: 静态站点生成</li>
        </ul>
      </div>
    </div>
  );
} 