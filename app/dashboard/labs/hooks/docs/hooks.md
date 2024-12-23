# React Hooks 文档

## React.memo 和 useEffect 的结合使用

### React.memo 基础
React.memo 是一个高阶组件(HOC)，用于优化函数组件的性能。通过记忆化组件的渲染结果，避免不必要的重新渲染。

#### 使用场景
- 纯函数组件的性能优化
- 组件渲染开销较大时
- 组件树较深，需要避免不必要渲染时
- 大型列表渲染优化

#### 注意事项
- 只进行 props 的浅比较
- 如果 props 是复杂对象，可能需要自定义比较函数
- 不要过度使用，可能会适得其反

### useEffect 与 React.memo 的关系

#### useEffect 特性
- 用于处理组件中的副作用
- 在组件渲染后执行
- 可以通过依赖数组控制执行时机

#### 重要概念
1. **首次渲染**
   - useEffect 总是在组件首次渲染后执行
   - 与 React.memo 无关

2. **重新渲染**
   - 如果组件因 React.memo 优化而没有重新渲染，useEffect 不会执行
   - 只有在组件实际重新渲染时，useEffect 才会根据依赖数组决定是否执行

### 示例代码 