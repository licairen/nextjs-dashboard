'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { CpuChipIcon } from '@heroicons/react/24/outline'

interface Task {
  id: number
  title: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

type PrettyObject = Record<string, string | number | boolean | null | undefined>;

// 美化的日志函数
const prettyLog = (component: string, action: string, data?: PrettyObject) => {
  const styles = {
    component: 'color: #4f46e5; font-weight: bold;',
    action: 'color: #059669; font-weight: bold;',
    data: 'color: #9333ea;',
  }

  console.log(
    `%c${component} %c${action}` +
      (data ? ` %c${JSON.stringify(data, null, 2)}` : ''),
    styles.component,
    styles.action,
    styles.data
  )
}

// 渲染计数器组件
const RenderCounter = React.memo(
  ({ count, lastAction }: { count: number; lastAction: string }) => {
    useEffect(() => {
      prettyLog('RenderCounter', '重新渲染', { count, lastAction })
    })

    return (
      <div className="flex items-center space-x-3">
        <CpuChipIcon className="h-8 w-8 text-blue-500" />
        <div>
          <div className="text-sm font-medium">页面渲染次数: {count}</div>
          <div className="text-sm text-gray-500">
            最后操作: {lastAction || '无'}
          </div>
        </div>
      </div>
    )
  }
)

RenderCounter.displayName = 'RenderCounter'

// 添加任务按钮组件
const AddTaskButton = React.memo(({ onClick }: { onClick: () => void }) => {
  useEffect(() => {
    prettyLog('AddTaskButton', '重新渲染')
  })

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      添加任务
    </button>
  )
})

AddTaskButton.displayName = 'AddTaskButton'

// 任务卡片组件
const TaskCard = React.memo(
  ({
    task,
    onStatusChange,
    onPriorityChange,
  }: {
    task: Task
    onStatusChange: (id: number, status: Task['status']) => void
    onPriorityChange: (id: number, priority: Task['priority']) => void
  }) => {
    useEffect(() => {
      prettyLog('TaskCard', `重新渲染`, { id: task.id, title: task.title })
    })

    const statusColors = {
      pending: 'bg-yellow-50 text-yellow-700',
      'in-progress': 'bg-blue-50 text-blue-700',
      completed: 'bg-green-50 text-green-700',
    }

    const priorityColors = {
      low: 'bg-gray-50 text-gray-700',
      medium: 'bg-orange-50 text-orange-700',
      high: 'bg-red-50 text-red-700',
    }

    return (
      <div className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
        <h3 className="font-medium">{task.title}</h3>

        <div className="flex items-center space-x-4">
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as Task['status'])
            }
            className={`px-2 py-1 border rounded w-24 ${statusColors[task.status]}`}
          >
            <option value="pending">待处理</option>
            <option value="in-progress">进行中</option>
            <option value="completed">已完成</option>
          </select>

          <select
            value={task.priority}
            onChange={(e) =>
              onPriorityChange(task.id, e.target.value as Task['priority'])
            }
            className={`px-2 py-1 border rounded w-32 ${priorityColors[task.priority]}`}
          >
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
        </div>
      </div>
    )
  }
)

TaskCard.displayName = 'TaskCard'

// 统计数据计算组件
const StatsData = React.memo(({ tasks }: { tasks: Task[] }) => {
  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      highPriority: tasks.filter((t) => t.priority === 'high').length,
    }),
    [tasks]
  )

  useEffect(() => {
    prettyLog('StatsData', '重新渲染', stats)
  })

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <div className="text-sm text-blue-600">总任务</div>
        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
      </div>
      <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
        <div className="text-sm text-green-600">已完成</div>
        <div className="text-2xl font-bold text-green-700">
          {stats.completed}
        </div>
      </div>
      <div className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
        <div className="text-sm text-red-600">高优先级</div>
        <div className="text-2xl font-bold text-red-700">
          {stats.highPriority}
        </div>
      </div>
    </div>
  )
})

StatsData.displayName = 'StatsData'

// 说明提示组件
const Hint = React.memo(() => {
  useEffect(() => {
    prettyLog('Hint', '重新渲染')
  })

  return (
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <p className="text-yellow-800">
        💡 打开控制台查看组件重渲染的情况。通过使用 React.memo、useCallback 和
        useMemo，
        我们实现了更细粒度的组件更新控制，每个组件只在真正需要时才会重新渲染。
      </p>
    </div>
  )
})

Hint.displayName = 'Hint'

// 初始任务数据
const initialTasks: Task[] = [
  { id: 1, title: '完成项目文档', status: 'pending', priority: 'high' },
  { id: 2, title: '代码审查', status: 'in-progress', priority: 'medium' },
  { id: 3, title: '修复 Bug', status: 'pending', priority: 'high' },
  { id: 4, title: '更新依赖', status: 'completed', priority: 'low' },
]

// 任务列表组件
const TaskList = React.memo(
  ({
    tasks,
    onStatusChange,
    onPriorityChange,
  }: {
    tasks: Task[]
    onStatusChange: (id: number, status: Task['status']) => void
    onPriorityChange: (id: number, priority: Task['priority']) => void
  }) => {
    useEffect(() => {
      prettyLog('TaskList', '重新渲染', { taskCount: tasks.length })
    })

    return (
      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
          />
        ))}
      </div>
    )
  }
)

TaskList.displayName = 'TaskList'

export default function AdvancedMemoPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [renderCount, setRenderCount] = useState(0)
  const [lastAction, setLastAction] = useState<string>('')

  // 使用 useCallback 记忆化状态更新函数
  const handleStatusChange = useCallback(
    (id: number, status: Task['status']) => {
      setLastAction(`修改任务 ${id} 状态为 ${status}`)
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task))
      )
      setRenderCount((prev) => prev + 1)
    },
    []
  )

  const handlePriorityChange = useCallback(
    (id: number, priority: Task['priority']) => {
      setLastAction(`修改任务 ${id} 优先级为 ${priority}`)
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, priority } : task))
      )
      setRenderCount((prev) => prev + 1)
    },
    []
  )

  const handleAddTask = useCallback(() => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: `新任务 ${tasks.length + 1}`,
      status: 'pending',
      priority: 'medium',
    }
    setLastAction(`添加新任务: ${newTask.title}`)
    setTasks((prev) => [...prev, newTask])
    setRenderCount((prev) => prev + 1)
  }, [tasks.length])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <RenderCounter count={renderCount} lastAction={lastAction} />
        <AddTaskButton onClick={handleAddTask} />
      </div>

      <Hint />
      <StatsData tasks={tasks} />
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />
    </div>
  )
}
