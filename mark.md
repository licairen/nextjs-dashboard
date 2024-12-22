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

| 组件类型                | 未标记函数  | 标记 'use server' 函数 |
| ----------------------- | ----------- | ---------------------- |
| 默认 (Server Component) | ✅ 可以使用 | ✅ 可以使用            |
| 'use client' 组件       | ❌ 不能使用 | ✅ 可以使用            |

#### 4. 最佳实践

- 在需要跨组件边界（从 Client 到 Server）的函数上显式标记 'use server'
- 将服务器操作集中在单独的文件中，并在文件顶部标记 'use server'
- 保持函数命名清晰，表明其服务器端性质（例如：handleServerAction）






# 路由组的核心特性 
## 1. 组织结构 📁 
• 提供清晰的文件层级组织 
• 帮助管理复杂的应用结构
• 使代码结构更有逻辑性 
## 2. URL 简洁性 🔗 
• 路由组名称(括号包裹)不会出现在 URL 中 
• 保持 URL 结构清晰简洁 
• 示例：(marketing)/about/page.tsx → /about 
## 3. 功能分组 🎯 
• 将相关功能页面组织在一起 
• 分离不同业务逻辑的代码 
• 如：后台管理与前台展示分离 
## 使用路由组的优势 
### 代码组织 💡 
• 按功能或模块分组管理页面 
• 提高代码的可维护性 
• 便于团队协作开发 
### 共享资源 🔄 
• 每个路由组可以有独立的布局 
• 可以共享组件和样式 
• 方便复用公共功能 
### 项目扩展 📈 
• 适合大型项目的代码管理 
• 便于后期功能扩展 
• 减少代码冲突风险