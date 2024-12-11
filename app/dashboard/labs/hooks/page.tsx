'use client';

import { useEffect, useState } from 'react';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

const HOOKS_TOPICS = [
  {
    title: '项目中使用的 Hooks',
    description: '在当前项目中实际应用的 React 和 Next.js Hooks。',
    comparison: [
      {
        title: 'useState',
        usage: '状态管理，如表单输入、加载状态等',
        example: '用于 LoginForm 中管理表单状态、Labs 页面的认证状态'
      },
      {
        title: 'useEffect',
        usage: '副作用处理，如数据获取、DOM 操作',
        example: '用于代码高亮初始化、水合检测、Intersection Observer'
      },
      {
        title: 'useRef',
        usage: '保存可变引用值，不触发重渲染',
        example: '用于保存 IntersectionObserver 实例'
      },
      {
        title: 'usePathname',
        usage: '获取当前路由路径',
        example: '用于面包屑导航和导航栏高亮'
      },
      {
        title: 'useRouter',
        usage: '路由操作和导航',
        example: '用于表单新增 编辑成功后跳转和页面刷新'
      }
    ],
    code: `// 状态管理
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

// 副作用处理
useEffect(() => {
  Prism.highlightAll();
}, []);

// 路由导航
const router = useRouter();
const pathname = usePathname();

// DOM 引用
const observerRef = useRef(null);`
  },
  {
    title: 'React 核心 Hooks',
    description: 'React 提供的基础 Hooks API。',
    comparison: [
      {
        title: 'useCallback',
        usage: '记忆化回调函数，优化性能',
        example: '适用于传递给子组件的回调函数'
      },
      {
        title: 'useMemo',
        usage: '记忆化计算结果，避免重复计算',
        example: '适用于复杂数据处理或过滤'
      },
      {
        title: 'useContext',
        usage: '跨组件共享状态',
        example: '适用于主题、用户认证等全局状态'
      },
      {
        title: 'useReducer',
        usage: '复杂状态逻辑管理',
        example: '适用于多个相关状态或复杂状态更新'
      },
      {
        title: 'useLayoutEffect',
        usage: '同步执行副作用',
        example: '适用于需要在浏览器绘制前执行的操作'
      }
    ],
    code: `// React 核心 Hooks 示例
// useCallback 示例
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);

// useMemo 示例
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);

// useContext 示例
const value = useContext(MyContext);

// useReducer 示例
const [state, dispatch] = useReducer(reducer, initialState);`
  },
  {
    title: 'Next.js 特有 Hooks',
    description: 'Next.js 框架提供的专用 Hooks。',
    comparison: [
      {
        title: 'useSearchParams',
        usage: '访问当前 URL 的查询参数',
        example: '用于获取和解析 URL 查询字符串'
      },
      {
        title: 'useSelectedLayoutSegment',
        usage: '获取当前激活的路由段',
        example: '用于构建复杂的导航菜单'
      },
      {
        title: 'useSelectedLayoutSegments',
        usage: '获取所有激活的路由段',
        example: '用于面包屑导航'
      },
      {
        title: 'useParams',
        usage: '访问动态路由参数',
        example: '用于获取路由中的动态部分'
      }
    ],
    code: `// Next.js Hooks 示例
// 查询参数
const searchParams = useSearchParams();
const query = searchParams.get('q');

// 路由段
const segment = useSelectedLayoutSegment();

// 动态参��
const params = useParams();
const id = params.id;

// 所有路由段
const segments = useSelectedLayoutSegments();`
  }
];

export default function HooksPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      Prism.highlightAll();
    }
  }, [isClient]);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <CpuChipIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Hooks 总览</h1>
      </div>
      
      <div className="space-y-6">
        {HOOKS_TOPICS.map((topic, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-200 p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <p className="text-gray-600">{topic.description}</p>
            
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hook</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">用途</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">示例场景</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topic.comparison.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.usage}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isClient && (
              <pre className="bg-[#1e1e1e] rounded-lg overflow-x-auto">
                <code className="language-typescript">
                  {topic.code}
                </code>
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 