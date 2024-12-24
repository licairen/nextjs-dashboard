
### 概念
`useEffect` 可以看作是（如 componentDidMount、componentDidUpdate、componentWillUnmount）的替代品，支持在组件渲染后执行逻辑、清理副作用以及根据依赖条件触发更新。
```typescript
useEffect(() => 
    {
    return () => {}; // 清理副作用（可选）
    }, // 第一个参数：`一个函数`
    [dependencies] // 第二个参数：`依赖数组`
);

参数解析
•第一个参数：`一个函数`，用于定义副作用逻辑和可选的清理函数。
•	在组件首次渲染或依赖更新时执行。
•	清理函数在组件卸载或下一次副作用执行前调用。
•第二个参数（`依赖数组`）：控制副作用触发的条件。
    如果为空数组 []，只在组件首次渲染时(加载时)执行。
	如果未传递依赖数组，副作用在每次渲染后都会执行。
```
### 使用场景
1. 数据获取：在组件渲染后获取数据。
2. 副作用处理：在组件渲染后执行副作用操作，如订阅事件、设置定时器等。
3. 清理操作：在组件卸载前清理副作用，如取消订阅、清除定时器等。
4. 依赖项更新：根据特定依赖项的变化触发更新。

`副作用`是指在组件的渲染过程中，执行了与渲染无直接关系的逻辑。常见的副作用包括：
•	数据请求（如 API 调用）。
•	DOM 操作（如手动更改标题、设置焦点）。
•	订阅/取消订阅（如 WebSocket、事件监听）。
•	定时器（如 setInterval、setTimeout）。
•	日志记录或调试。

#### 例子 订阅事件 定时任务
```typescript
组件挂载时订阅事件，并在组件卸载时取消订阅
useEffect(() => {
    const handleResize = () => {};

    window.addEventListener('resize', handleResize);

    return () => {
      // 清理副作用：移除事件监听
      window.removeEventListener('resize', handleResize);
    };
}, []); // 空依赖数组：只订阅一次


// TODO: 设置输入框焦点
import { useEffect, useRef } from 'react';
function AutoFocusInput() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus(); // 设置输入框焦点
  }, []); // 仅在组件加载时执行

  return <input ref={inputRef} />;
}
// TODO: 定时任务
useEffect(() => {
    const interval = setInterval(() => {}, 1000);
    return () => clearInterval(interval);;
  }, []); 
// TODO: 避免无限循环
useEffect(() => {
  setCount(count + 1); // 每次更新都会触发副作用
}, [count]); // 修复：添加条件或避免直接依赖更新
```


### useEffect 面试题
#### useEffect 的作用是什么？
* useEffect 用于在函数组件中执行副作用操作，例如数据获取、订阅、手动更改 DOM 等。
#### useEffect 的依赖数组有什么作用？
`控制副作用的执行时机`。
• 空数组 []：副作用只在组件首次渲染时执行一次。
• 不传依赖数组：副作用在每次渲染后都会执行。
• 指定依赖数组 [a, b]：副作用在 a 或 b 的值发生变化时执行。

#### 如何模拟 componentDidMount？
* 通过传递一个空数组 [] 作为依赖项

#### 如何清除副作用？
* 在副作用函数中返回一个清理函数，用于在组件卸载或下一次副作用执行前调用。
```typescript
   useEffect(() => {
     const subscription = someAPI.subscribe()
     return () => {
       subscription.unsubscribe()
     }
   }, [someDependency])
```
#### useEffect 和 useLayoutEffect 的区别是什么？
* `useEffect` 在浏览器完成布局与绘制后异步执行
* `useLayoutEffect` 在 DOM 变更后同步执行，适合需要同步读取布局的场景
##### 使用建议：
* 默认使用 useEffect
* 只在出现视觉闪烁或需要同步 DOM 操作时使用 useLayoutEffect
* 注意性能影响，因为 useLayoutEffect 是同步的
* 在 SSR 中要小心使用，因为 useLayoutEffect 在服务端不会执行
这些场景都有一个共同点：需要在浏览器重新绘制之前进行 DOM 操作，以避免视觉闪烁或确保正确的布局计算。


#### 如何避免 useEffect 中的无限循环？
* 确保依赖数组中只包含必要的依赖项，避免在 `useEffect` 中直接更新依赖项
* 使用 `useCallback` 或 `useMemo` 来优化依赖项
* 使用 `useRef` 来存储依赖项，避免在 `useEffect` 中直接更新
* 使用 `useReducer` 来管理状态，避免在 `useEffect` 中直接更新状态
* 使用 `useState` 来管理状态，避免在 `useEffect` 中直接更新状态

#### useEffect 的执行顺序是怎样的？
* 在组件渲染后，React 会按照 `useEffect` 的定义顺序`依次执行`

#### useEffect 和类组件的生命周期方法之间的关系
* `componentDidMount`：依赖数组为空时（[]）。
* `componentDidUpdate`：依赖数组不为空且依赖发生变化时。
* `componentWillUnmount`：返回的清理函数。
