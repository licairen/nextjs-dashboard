
### 1. 基础概念问题
**Q: Server Components 和 Client Components 的主要区别是什么？**
**A:**
Server Components:
- 在服务器端渲染，不会增加客户端 JavaScript 包大小
- 可以直接访问后端资源（数据库、文件系统等）
- 不能使用浏览器 API 和 React hooks
- 默认情况下，Next.js 中的组件都是 Server Components

Client Components:
- 在浏览器端运行，会增加 JavaScript 包大小
- 可以使用浏览器 API 和交互功能（useState, useEffect 等）
- 需要显式使用 'use client' 指令声明
- 适合需要客户端交互的场景


### 2. 使用场景问题

**Q: 什么情况下应该选择使用 Server Component 或 Client Component？**
**A:**
使用 Server Components 的场景：
- 数据获取
- 访问后端资源
- 保持敏感信息在服务器端
- 大量静态内容渲染
- SEO 优化需求

使用 Client Components 的场景：
- 需要用户交互（表单、按钮点击等）
- 需要使用浏览器 API
- 需要使用 React hooks
- 需要添加事件监听器
- 需要使用 useState 或 useEffect


### 3. 性能相关问题

**Q: Server Components 如何提升应用性能？**
**A:**
1. 减少客户端 JavaScript 包大小
2. 减少客户端渲染工作
3. 自动代码分割
4. 更快的首次加载时间
5. 更好的SEO优化

### 4. 实践问题

**Q: 如何在同一个应用中混合使用 Server 和 Client Components？**
**A:**
```javascript
// ServerComponent.tsx
// 默认是 Server Component
export default function ServerComponent() {
  // 可以直接访问数据库
  const data = await prisma.users.findMany();
  return <div>{/* 渲染数据 */}</div>;
}

// ClientComponent.tsx
'use client'
// 明确声明为 Client Component
export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```


### 5. 数据流问题

**Q: Server Components 和 Client Components 之间如何传递数据？**
**A:**
1. 从 Server 到 Client：
   - 通过 props 传递数据
   - Server Component 可以作为 Client Component 的子组件

2. 从 Client 到 Server：
   - 使用 Server Actions
   - 使用 API 路由

### 6. 错误处理问题

**Q: 如何处理 Server Components 中的错误？**
**A:**
```javascript
// error.tsx
'use client' // 错误边界需要是 Client Component

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>出错了！</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}

```


### 7. 状态管理问题

**Q: 在使用 Server Components 时如何管理状态？**
**A:**
1. Server State:
   - 使用数据库或缓存
   - 使用 Server Actions 更新

2. Client State:
   - 在 Client Components 中使用 useState
   - 使用状态管理库（Zustand, Jotai 等）
   - 使用 URL 参数管理状态


### 8. 优化问题

**Q: 如何优化 Server Components 和 Client Components 的性能？**
**A:**
Server Components 优化：
1. 使用 React Suspense 进行流式渲染
2. 实现适当的缓存策略
3. 使用 generateStaticParams 进行静态生成

Client Components 优化：
1. 合理拆分组件
2. 使用 React.memo 避免不必要的重渲染
3. 延迟加载非关键组件
4. 使用 React.lazy 进行代码分割
5. 使用 React.Suspense 进行流式渲染
6. 使用 React.useTransition 进行过渡管理
7. 使用 React.useDeferredValue 进行延迟加载
8. 使用 React.useCallback 避免不必要的函数创建
9. 使用 React.useMemo 避免不必要的计算
10. 使用 React.useEffect 进行副作用管理


### 数据流问题  demo

#### 1. 从 Server 到 Client 的数据流

1.1 通过 Props 传递
```typescript
// ServerComponent.tsx
async function ServerComponent() {
  // 在服务器端获取数据
  const data = await fetch('https://api.example.com/data');
  const users = await data.json();

  return <ClientComponent users={users} />;
}

// ClientComponent.tsx
'use client'
 
interface User {
  id: number;
  name: string;
}

function ClientComponent({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div>
      {users.map(user => (
        <button key={user.id} onClick={() => setSelectedUser(user)}>
          {user.name}
        </button>
      ))}
      {selectedUser && <div>Selected: {selectedUser.name}</div>}
    </div>
  );
}
```

#### 2. 从 Client 到 Server 的数据流
2.1 使用 Server Actions
```typescript
// FormComponent.tsx
'use client'
 
function FormComponent() {
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    // 调用 Server Action
    const result = await saveData(formData);
    setMessage(result.message);
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="data" />
      <button type="submit">提交</button>
      {message && <p>{message}</p>}
    </form>
  );
}

// ServerAction.ts
'use server'
 
export async function saveData(formData: FormData) {
  const data = formData.get('data');
  
  // 在服务器端处理数据
  await prisma.data.create({
    data: { content: data as string }
  });

  return { message: '保存成功！' };
}
```

2.2 使用 API 路由
```typescript
// API 路由
export async function POST(request: Request) {
  const data = await request.json();
  
  // 在服务器端处理数据
  await prisma.data.create({
    data: { content: data.content }
  });

  return Response.json({ message: '成功' });
}

// ClientComponent.tsx
'use client'
 
function ClientComponent() {
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify({
        content: formData.get('data')
      })
    });
    
    const result = await response.json();
    setMessage(result.message);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="data" />
      <button type="submit">提交</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```
#### 3. 复杂数据流示例
```typescript
// 复杂数据流示例，结合了多种方式
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Server Component
async function TodoList() {
  // 服务器端获取数据
  const todos = await prisma.todo.findMany();

  return (
    <div>
      <h1>Todo List</h1>
      <TodoItems initialTodos={todos} />
    </div>
  );
}

// Client Component
'use client'
 
function TodoItems({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // 使用 Server Action 更新数据
  async function toggleTodo(formData: FormData) {
    'use server'
    const id = parseInt(formData.get('id') as string);
    const todo = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed }
    });
    return todo;
  }

  // 使用 API 路由添加新 Todo
  async function addTodo(title: string) {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title })
    });
    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
  }

  return (
    <div>
      <form action={toggleTodo}>
        {todos.map(todo => (
          <div key={todo.id}>
            <input type="hidden" name="id" value={todo.id} />
            <button type="submit">
              {todo.title} - {todo.completed ? '完成' : '未完成'}
            </button>
          </div>
        ))}
      </form>

      <input
        type="text"
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addTodo(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        placeholder="添加新任务"
      />
    </div>
  );
}
```




### 错误问题 demo
#### 1. 全局错误处理
```typescript
'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold text-red-600">出错了！</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
          {error.digest && (
            <p className="text-sm text-gray-500">错误ID: {error.digest}</p>
          )}
          <button
            onClick={() => reset()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
```

#### 2. 局部错误处理
```typescript
'use client'
 
import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 可以在这里记录错误到日志服务
    console.error('错误详情:', error)
  }, [error])

  return (
    <div className="rounded-lg border border-red-100 p-4 bg-red-50">
      <h2 className="text-red-800 font-semibold">发生了一些错误</h2>
      <p className="text-red-600 text-sm mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        重试
      </button>
    </div>
  )
}
```
#### 3. 加载状态和错误处理示例
```typescript
// loading.tsx
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

// error.tsx
'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4 border border-red-200 rounded">
      <p className="text-red-500">{error.message}</p>
      <button
        onClick={reset}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
      >
        重试
      </button>
    </div>
  )
}

// page.tsx
import { Suspense } from 'react'
import Loading from './loading'
import UserList from './UserList'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UserList />
    </Suspense>
  )
}
```
#### 4. 实际应用示例：用户数据获取
```typescript
// UserService.ts
export class UserService {
  static async getUser(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })
      
      if (!user) {
        throw new Error('用户不存在')
      }
      
      return user
    } catch (error) {
      throw new Error(`获取用户信息失败: ${error.message}`)
    }
  }
}

// UserProfile.tsx
interface User {
  id: string
  name: string
  email: string
}

async function UserProfile({ userId }: { userId: string }) {
  let user: User | null = null
  
  try {
    user = await UserService.getUser(userId)
  } catch (error) {
    // 这里的错误会被上层的 error.tsx 捕获
    throw new Error(`无法加载用户资料: ${error.message}`)
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  )
}

// UserProfileWrapper.tsx
'use client'
 
import { useState } from 'react'

function UserProfileWrapper({ userId }: { userId: string }) {
  const [error, setError] = useState<Error | null>(null)

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">{error.message}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-red-500 hover:text-red-600"
        >
          重试
        </button>
      </div>
    )
  }

  return <UserProfile userId={userId} />
}
```
#### 5. 表单提交错误处理
```typescript
'use client'
 
interface FormError {
  field: string
  message: string
}

export default function UserForm() {
  const [errors, setErrors] = useState<FormError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setErrors([])

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        setErrors(error.errors || [{ field: 'general', message: '提交失败' }])
        return
      }

      // 成功处理
      router.refresh()
    } catch (error) {
      setErrors([{ field: 'general', message: '网络错误，请重试' }])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit}>
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          {errors.map((error, index) => (
            <p key={index} className="text-red-600 text-sm">
              {error.message}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          className="w-full p-2 border rounded"
          placeholder="用户名"
        />
        <input
          type="email"
          name="email"
          className="w-full p-2 border rounded"
          placeholder="邮箱"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {isSubmitting ? '提交中...' : '提交'}
        </button>
      </div>
    </form>
  )
}
```

### 状态管理问题 demo
* 包括 Server State 和 Client State 的处理方式

### 1. Server State 管理

```typescript
// 1. 使用数据库管理服务器状态
import { prisma } from '@/lib/prisma'

export async function getTodos() {
  return await prisma.todo.findMany()
}

export async function createTodo(data: { title: string }) {
  return await prisma.todo.create({ data })
}

// 2. 使用 Server Actions 更新状态
'use server'
 
export async function toggleTodoComplete(id: string) {
  const todo = await prisma.todo.findUnique({ where: { id } })
  return await prisma.todo.update({
    where: { id },
    data: { completed: !todo?.completed }
  })
}
```

### 2. Client State 管理
2.1 使用 React useState
```typescript
'use client'
 
export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```
2.2 使用 Zustand 状态管理
```typescript
import create from 'zustand'

interface Store {
  count: number
  increment: () => void
  decrement: () => void
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

// 使用 Store
'use client'
 
export function CounterWithZustand() {
  const { count, increment, decrement } = useStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

2.3 使用 URL 状态管理
```typescript
'use client'
 
import { useSearchParams, useRouter } from 'next/navigation'

export function SearchWithURL() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const search = searchParams.get('q') || ''

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <input
      type="search"
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  )
}
```
#### 3. 复杂状态管理示例
```typescript
// types.ts
interface Todo {
  id: string
  title: string
  completed: boolean
}

// store/todoStore.ts
import create from 'zustand'

interface TodoStore {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  addTodo: (title: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filter: 'all',
  setFilter: (filter) => set({ filter }),
  addTodo: async (title) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title })
    })
    const newTodo = await response.json()
    set((state) => ({ todos: [...state.todos, newTodo] }))
  },
  toggleTodo: async (id) => {
    await toggleTodoComplete(id) // Server Action
    set((state) => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }
}))

// TodoApp.tsx
'use client'
 
export function TodoApp() {
  const { todos, filter, setFilter, addTodo, toggleTodo } = useTodoStore()
  const [newTodo, setNewTodo] = useState('')

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    await addTodo(newTodo)
    setNewTodo('')
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="添加新任务..."
        />
      </form>

      <div className="space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded ${
            filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          进行中
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded ${
            filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          已完成
        </button>
      </div>

      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center p-2 border rounded"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```
#### 4. 状态持久化示例

```typescript
'use client'
 
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

// 使用示例
export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded bg-gray-200"
    >
      当前主题: {theme}
    </button>
  )
}
```
