### 概念
`useRef` 用于在函数组件中创建一个 `可变的引用对象`，这个对象在组件的整个生命周期中保持不变。它通常用于以下场景：
1.	访问和操作 DOM 元素。
2.	在组件的重新渲染之间存储数据，而不会触发重新渲染。
3.	实现稳定的引用，避免闭包问题

#### 语法
```typescript
const refContainer = useRef(initialValue); 

返回值
•	refContainer：一个对象，包含 current 属性，初始化时为 initialValue。
•	refContainer.current 用于存储引用的值。
•	修改 refContainer.current 不会导致组件重新渲染。
```

#### 2. useRef 的使用场景
2.1 操作 DOM 元素
2.2 在组件的重新渲染之间存储数据
2.3 实现稳定的引用，避免闭包问题

##### 2.1 操作 DOM 元素
* useRef 常用于访问和操作组件中的 DOM 元素，类似于类组件中的 React.createRef。
```typescript
const myRef = useRef(null);

useEffect(() => {
    // TODO: myRef.current：。直接引用 DOM 元素，允许手动操作
    myRef.current.focus();// 在组件加载时设置焦点 
}, []);
```
##### 2.2 在组件的重新渲染之间存储数据
* useRef 可以用来存储某些组件生命周期内需要保持稳定的值，而这些值的变化`不需要触发组件重新渲染`
* 例如，在处理表单时，可以使用 useRef 来存储表单的值，以便在组件重新渲染时保持这些值不变
```typescript
const myRef = useRef(null);

useEffect(() => {
    myRef.current = 10; // 在组件加载时设置值
}, []);
```
##### 2.3 实现稳定的引用，避免闭包问题
* 在函数组件中，闭包问题可能会导致某些变量在组件重新渲染时发生变化，从而影响组件的性能和稳定性
* 使用 useRef 可以创建一个稳定的引用，避免闭包问题
```typescript
定时器中的闭包问题
import { useRef, useEffect, useState } from 'react';

function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count; // 同步最新的 count 值
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(`Current Count: ${countRef.current}`); // 始终是最新的 count 值
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <button onClick={() => setCount(count + 1)}>Increment: {count}</button>
  );
}

•	问题：直接使用 count 会因为闭包捕获旧值，导致日志不更新。
•	解决：使用 countRef.current 始终引用最新的值。
```
##### 2.4 实现稳定的回调引用
* useRef 可以创建稳定的引用，避免函数在每次渲染时重新创建，适用于绑定事件监听等场景。
```typescript
import { useRef, useEffect } from 'react';

function EventListener() {
  const handleClick = useRef(() => {
    console.log('Clicked!');
  });

  useEffect(() => {
    const clickHandler = () => handleClick.current();
    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler); // 清理事件监听
    };
  }, []);

  return <div>Click anywhere and check the console!</div>;
}
`使用 useRef 创建的 handleClick.current 不会随组件的重新渲染而变化`
```

##### 2.5 实现组件间通信
* useRef 用于在多个组件之间共享数据。
```typescript
import { useRef } from 'react';

function ParentComponent() {
  const childRef = useRef(null);

  if (childRef.current) {
    childRef.current.sayHello(); // 调用子组件的方法
  }

  return <ChildComponent ref={childRef} />;
}

* useRef 结合 React.forwardRef 和 useImperativeHandle 可以实现组件间通信。
```
#### 3. 注意事项
1.	useRef 的修改`不会触发重新渲染`
    •	ref.current 的变化并不会导致组件重新渲染。
    •	如果需要更新状态并触发重新渲染，应该使用 useState。
2.	不要滥用 useRef 存储状态
    •	useRef 适合用于存储不需要触发渲染的值，如计数器、缓存等。
    •	对需要触发渲染的值，应使用 useState。
3.	`DOM 操作的默认选择`
    •	如果需要访问 DOM 元素，useRef 是最佳选择，而不是直接操作document.querySelector。

#### 4. 总结

`useRef 的核心特点`
	1.	稳定性：引用在组件的整个生命周期中保持不变。
	2.	高效性：修改 ref.current 不会触发组件重新渲染。
	3.	灵活性：适用于 DOM 操作、存储可变值、解决闭包问题等场景。

`使用场景`
	•	操作 DOM 元素（如焦点、滚动）。
	•	存储不需要触发重新渲染的可变值。
	•	防止闭包问题，确保事件中使用最新状态。
	•	绑定和清理事件监听。
	•	组件间通信（结合 forwardRef 和 useImperativeHandle）。
#### useRef面试题

```typescript
function Example() {
  // FIXME: 1. 引用 DOM 元素
  const domRef = useRef<HTMLDivElement>(null)

  // FIXME: 2. 保存任意可变值
  const countRef = useRef(0)

  // FIXME: 3. 在重渲染之间保持值
  const prevValueRef = useRef<string>()
  
  useEffect(() => {
    // 更新 ref 不会触发重渲染
    countRef.current++
    
    // 保存前一个值
    prevValueRef.current = someValue
  })
}
```
##### Q1: useRef 和 useState 的区别是什么？
```typescript
function DifferenceExample() {
  // useState: 值变化会触发重渲染
  const [count, setCount] = useState(0)
  
  // useRef: 值变化不会触发重渲染
  const countRef = useRef(0)
  
  const updateState = () => {
    setCount(count + 1)    // 触发重渲染
    countRef.current += 1  // 不触发重渲染
  }
}
```
##### Q2: 如何使用 useRef 实现防抖？

> 回过头来补充： 使用 useCallback 优化防抖函数
```typescript
import { useRef, useState } from 'react'
const DebounceExample = () => {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null)
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)

  if (timerRef.current) {
    clearTimeout(timerRef.current)
  }

  timerRef.current = setTimeout(() => {
    setDebouncedValue(value)
  }, 1000)
 }
}
```

##### Q3: 如何使用 useRef 获取前一个值？


##### Q4: 如何使用 useRef 存储定时器并清理？
```typescript
const Timer = () => {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timer>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1) // 函数式更新
    }, 1000)

    // 清理函数
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return <div>Count: {count}</div>
}
```

##### Q5: useRef 的实际应用场景
```typescript
// TODO: 1. 表单验证
function Form() {
  const formRef = useRef<HTMLFormElement>(null)
  
  const validate = () => {
    return formRef.current?.checkValidity()
  }
}

// TODO: 2. 视频播放控制
function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const handlePlay = () => {
    videoRef.current?.play()
  }
}

// TODO: 3. 滚动位置记录
function ScrollableList() {
  const listRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef(0)
  
  const saveScrollPosition = () => {
    scrollPosRef.current = listRef.current?.scrollTop || 0
  }
}
```