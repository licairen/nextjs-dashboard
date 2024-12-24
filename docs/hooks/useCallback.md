### useCallback 概念
* `useCallback` 在函数组件中 `缓存函数引用`。它的主要目的是`优化性能`
* 避免在每次渲染时重新创建函数，导致子组件重新渲染或浪费资源

`useCallback` 用于缓存函数的引用。
它的作用是避免函数重新创建，特别是在将函数作为 props 传递给子组件时，`避免不必要的子组件重新渲染`

只有当依赖项发生变化时，useCallback 才会返回一个新的函数引用。

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

const memoizedCallback = useCallback(
  (args) => {
    // 函数逻辑
  },
  [dependencies]
);
```

### 2. useCallback 的作用

1.	避免函数重新创建：
	•	默认情况下，函数组件在每次渲染时都会重新创建函数。
	•	如果这些函数作为 props 传递给子组件，可能导致子组件不必要的重新渲染。
2.	与 React.memo 配合：
	•	当子组件使用 React.memo 缓存时，useCallback 可以确保传递给子组件的函数引用不变，避免子组件重新渲染。
useCallback 用于缓存函数的引用。
	•	它的作用是避免函数重新创建，特别是在将函数作为 props 传递给子组件时，避免不必要的子组件重新渲染
### 3. 使用场景
#### 3.1 优化子组件渲染 【示例：避免子组件的无意义渲染】
```js
import React, { useState, useCallback } from 'react';

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click Me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // 空依赖，handleClick 的引用始终不变

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child onClick={handleClick} />
    </div>
  );
}

export default Parent;
```


### 面试题

```js
5.2 useCallback 和 useMemo 有什么区别？
 `useCallback：` 用于缓存函数引用。 返回的是一个缓存的函数。
 `useMemo：` 用于缓存计算结果 返回的是一个计算值。


 5.3 使用 useCallback 有哪些场景？
 * 避免子组件重新渲染。
 * 防止事件处理函数的重新创建。
 * 缓存异步请求逻辑。
 * 避免闭包问题，确保函数使用最新的依赖值。
 * 
 6.2 useMemo 的适用场景有哪些？
* 缓存复杂计算结果（如数学计算）。
* 优化子组件渲染（避免因 props 引用变化导致子组件重新渲染）。
* 优化副作用依赖，确保数组或对象引用稳定。

6.3 useMemo 和 React.memo 有什么区别？
* useMemo：缓存计算结果，避免高开销计算重复执行。
* React.memo：缓存组件渲染结果，避免子组件不必要的重新渲染。
* useCallback 缓存函数引用 避免重复创建函数
```
