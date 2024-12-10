'use client';

import { useState, useEffect, useCallback } from 'react';
import { lusitana } from '@/app/ui/fonts';

// 示例 API 端点
const API_ENDPOINTS = {
  REST: '/api/lab/data?type=rest',
  SSR: '/api/lab/data?type=ssr',
  ISR: '/api/lab/data?type=isr',
  SSG: '/api/lab/data?type=ssg',
};

type ApiResponse = {
  message: string;
  data: Record<string, unknown>; // 更安全的类型定义，替代 any
};

export default function DataFetchingDemo() {
  const [activeDemo, setActiveDemo] = useState<keyof typeof API_ENDPOINTS>('REST');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS[activeDemo]);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [activeDemo]); // 只有 activeDemo 变化 才重新生成 fetchData

  useEffect(() => {
    fetchData(); // fetchData 引用稳定，useEffect 不会无限触发
  }, [fetchData]);

  return (
    <div className="space-y-4">
      <h1 className={`${lusitana.className} text-2xl`}>数据获取演示</h1>
      
      <div className="flex space-x-4">
        {Object.keys(API_ENDPOINTS).map((type) => (
          <button
            key={type}
            onClick={() => setActiveDemo(type as keyof typeof API_ENDPOINTS)}
            className={`px-4 py-2 rounded ${
              activeDemo === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="font-semibold mb-2">响应数据：</h2>
        {loading ? (
          <div>加载中...</div>
        ) : (
          <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
            {data ? JSON.stringify(data, null, 2) : '暂无数据'}
          </pre>
        )}
      </div>
    </div>
  );
}