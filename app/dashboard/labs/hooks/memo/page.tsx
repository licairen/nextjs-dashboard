'use client'

import React, { useState, useCallback, useRef } from 'react'

// 简单示例的 Todo 接口
interface Todo {
  id: number
  text: string
  completed: boolean
}

// 未优化的 TodoItem 组件
const TodoItem = ({
  todo,
  onToggle,
}: {
  todo: Todo
  onToggle: (id: number) => void
}) => {
  console.log(
    `%c[未优化组件] ${todo.text}`,
    'color: #ff6b6b; font-weight: bold;',
    '重新渲染了 ❌'
  )

  return (
    <div className="flex items-center space-x-2 p-2 border rounded">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4"
      />
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.text}
      </span>
    </div>
  )
}

// 使用 React.memo 优化的 TodoItem 组件
const MemoizedTodoItem = React.memo(
  ({ todo, onToggle }: { todo: Todo; onToggle: (id: number) => void }) => {
    console.log(
      `%c[Memo优化组件] ${todo.text}`,
      'color: #40c057; font-weight: bold;',
      '由于使用了 memo，避免了不必要的渲染 ✅'
    )

    return (
      <div className="flex items-center space-x-2 p-2 border rounded">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-4 w-4"
        />
        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
          {todo.text}
        </span>
      </div>
    )
  },
  (prevProps, nextProps) => {
    const isEqual =
      prevProps.todo.id === nextProps.todo.id &&
      prevProps.todo.completed === nextProps.todo.completed &&
      prevProps.todo.text === nextProps.todo.text

    // 添加比较结果的日志
    console.log(
      `%c[Memo比较] ${prevProps.todo.text}`,
      'color: #228be6; font-weight: bold;',
      isEqual ? '属性未变化，将阻止重渲染 ✅' : '属性已变化，需要重渲染 ⚠️'
    )

    return isEqual
  }
)
MemoizedTodoItem.displayName = 'MemoizedTodoItem';

// 复杂示例的接口
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface Task {
  id: number
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  assignee: User | null
}

// 复杂示例的 TaskCard 组件
const TaskCard = ({
  task,
  onStatusChange,
  onAssigneeChange,
  users,
}: {
  task: Task
  onStatusChange: (id: number, status: Task['status']) => void
  onAssigneeChange: (id: number, userId: number | null) => void
  users: User[]
}) => {
  console.log(
    `%c[未优化任务卡片] ${task.title}`,
    'color: #ff6b6b; font-weight: bold;',
    {
      '重新渲染 ❌': {
        状态: task.status,
        负责人: task.assignee?.name || '未分配',
        优先级: task.priority,
      },
    }
  )

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex justify-between">
        <h3 className="font-medium">{task.title}</h3>
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as Task['status'])
          }
          className="text-sm border rounded"
        >
          <option value="pending">待处理</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      <div>
        <select
          value={task.assignee?.id || ''}
          onChange={(e) =>
            onAssigneeChange(
              task.id,
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="text-sm border rounded"
        >
          <option value="">未分配</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// 使用 React.memo 优化的 TaskCard 组件
const MemoizedTaskCard = React.memo(
  ({
    task,
    onStatusChange,
    onAssigneeChange,
    users,
  }: {
    task: Task
    onStatusChange: (id: number, status: Task['status']) => void
    onAssigneeChange: (id: number, userId: number | null) => void
    users: User[]
  }) => {
    console.log(
      `%c[Memo优化任务卡片] ${task.title}`,
      'color: #40c057; font-weight: bold;',
      {
        '避免重渲染 ✅': {
          状态: task.status,
          负责人: task.assignee?.name || '未分配',
          优先级: task.priority,
        },
      }
    )

    return (
      <div className="p-4 border rounded-lg space-y-3">
        <div className="flex justify-between">
          <h3 className="font-medium">{task.title}</h3>
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as Task['status'])
            }
            className="text-sm border rounded"
          >
            <option value="pending">待处理</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <div>
          <select
            value={task.assignee?.id || ''}
            onChange={(e) =>
              onAssigneeChange(
                task.id,
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="text-sm border rounded"
          >
            <option value="">未分配</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    const isEqual =
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.status === nextProps.task.status &&
      prevProps.task.priority === nextProps.task.priority &&
      prevProps.task.assignee?.id === nextProps.task.assignee?.id

    // 添加详细的比较日志
    console.log(
      `%c[Memo任务比较] ${prevProps.task.title}`,
      'color: #228be6; font-weight: bold;',
      {
        比较结果: isEqual
          ? '属性未变化，阻止重渲染 ✅'
          : '属性已变化，需要重渲染 ⚠️',
        变化分析: {
          ID相同: prevProps.task.id === nextProps.task.id,
          状态相同: prevProps.task.status === nextProps.task.status,
          优先级相同: prevProps.task.priority === nextProps.task.priority,
          负责人相同:
            prevProps.task.assignee?.id === nextProps.task.assignee?.id,
        },
      }
    )

    return isEqual
  }
)
MemoizedTaskCard.displayName = 'MemoizedTaskCard';

export default function MemoDemo() {
  // 简单示例的状态
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'React.memo', completed: false },
    { id: 2, text: '理解重渲染', completed: false },
  ])

  // 复杂示例的状态
  const [users] = useState<User[]>([
    { id: 1, name: '张三', email: 'zhang@example.com', role: 'admin' },
    { id: 2, name: '李四', email: 'li@example.com', role: 'user' },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: '实现用户认证',
      priority: 'high',
      status: 'in_progress',
      assignee: users[0],
    },
    {
      id: 2,
      title: '优化首页性能',
      priority: 'medium',
      status: 'pending',
      assignee: null,
    },
  ])

  const [count, setCount] = useState(0)
  const renderCount = useRef(0)

  // 简单示例的回调
  const handleToggle = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  // 复杂示例的回调
  const handleStatusChange = useCallback(
    (taskId: number, status: Task['status']) => {
      console.log('%c[状态变更]', 'color: #fd7e14; font-weight: bold;', {
        任务ID: taskId,
        新状态: status,
        变更时间: new Date().toLocaleTimeString(),
      })

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status } : task))
      )
    },
    []
  )

  const handleAssigneeChange = useCallback(
    (taskId: number, userId: number | null) => {
      console.log('%c[负责人变更]', 'color: #fd7e14; font-weight: bold;', {
        任务ID: taskId,
        新负责人ID: userId,
        变更时间: new Date().toLocaleTimeString(),
      })

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignee: userId
                  ? users.find((u) => u.id === userId) || null
                  : null,
              }
            : task
        )
      )
    },
    [users]
  )

  // 触发重渲染时添加分隔符
  const triggerRerender = () => {
    console.log(
      '%c========== 重渲染触发 ==========',
      'color: #845ef7; font-weight: bold; font-size: 14px;'
    )
    console.log(
      `%c[触发时间] ${new Date().toLocaleTimeString()}`,
      'color: #868e96'
    )
    console.log(`%c[当前计数] 第 ${count + 1} 次点击`, 'color: #868e96')
    console.log('%c[分析开始] 观察组件渲染情况 👇', 'color: #868e96')

    setCount((c) => c + 1)
    renderCount.current += 1
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <Link href="/dashboard/labs/hooks" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        返回 Hooks 总览
      </Link> */}

      <div className="space-y-8">
        {/* 重渲染触发器 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <button
            onClick={triggerRerender}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            触发重渲染 (点击次数: {count})
          </button>
          <div className="mt-2 text-sm text-blue-600">
            页面渲染次数: {renderCount.current}
          </div>
        </div>

        {/* 简单示例 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">简单示例：Todo List</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">使用 React.memo:</h3>
              <div className="space-y-2">
                {todos.map((todo) => (
                  <MemoizedTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">未使用 React.memo:</h3>
              <div className="space-y-2">
                {todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 复杂示例 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">复杂示例：任务管理</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">使用 React.memo:</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <MemoizedTaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    users={users}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">未使用 React.memo:</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    users={users}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 调试说明 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">调试指南：</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>打开浏览器控制台 (F12)</li>
            <li>点击 触发重渲染 按钮，观察两种实现的渲染差异</li>
            <li>修改任务状态或分配人，观察组件更新行为</li>
            <li>注意对比使用和未使用 React.memo 时的渲染次数</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
