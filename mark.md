### Server Actions 和 'use server' 指令说明

#### 1. 组件默认行为
- Next.js 中所有组件默认都是 Server Components
- 默认的 Server Components 中可以使用未标记的函数
- 但在标记为 'use client' 的组件中必须使用显式标记了 'use server' 的函数

#### 2. 使用规则
```typescript
// 默认 Server Component
// ✅ 可以使用未标记的函数
function ServerComponent() {
  async function handleAction() {
    // 这个函数在默认 Server Component 中可以使用
  }
  return <button onClick={handleAction}>点击</button>
}

// Client Component
'use client';
function ClientComponent() {
  // ❌ 错误：不能使用未标记的函数
  async function handleAction() {
    // 这个函数在 Client Component 中不能使用
  }
  
  // ✅ 正确：使用标记了 'use server' 的函数
  async function handleServerAction() {
    'use server';
    // 这个函数可以在 Client Component 中使用
  }
}
```

#### 3. 使用场景总结
| 组件类型 | 未标记函数 | 标记 'use server' 函数 |
|---------|-----------|---------------------|
| 默认 (Server Component) | ✅ 可以使用 | ✅ 可以使用 |
| 'use client' 组件 | ❌ 不能使用 | ✅ 可以使用 |

#### 4. 最佳实践
- 在需要跨组件边界（从 Client 到 Server）的函数上显式标记 'use server'
- 将服务器操作集中在单独的文件中，并在文件顶部标记 'use server'
- 保持函数命名清晰，表明其服务器端性质（例如：handleServerAction）