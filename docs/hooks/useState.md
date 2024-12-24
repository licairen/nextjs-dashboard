### useState 面试题
#### 为什么需要 useState？直接用变量不行吗？
答：普通变量的改变`不会触发组件重新渲染`，而 useState 会在状态改变时通知 React 重新渲染组件。
```typescript
// ❌ 错误方式：直接使用变量
let email = ''
function LoginForm() {
  const updateEmail = (value: string) => {
    email = value    // 更新不会触发重新渲染
  }
}

// ✅ 正确方式：使用 useState
function LoginForm() {
  const [email, setEmail] = useState('')  // 状态更新会触发重新渲染
}
```
#### useState 的更新是同步还是异步的？

答：useState 的更新通常是`异步`的，因为 React 会在事件循环结束后批量处理更新
```typescript
const [count, setCount] = useState(0)
setCount(count + 1)
console.log(count)  // 输出可能是 0 或 1，取决于 React 的批量更新策略

const LoginForm = () => {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setCount(count + 1)
    console.log(count)    // 还是旧值
    
    // 如果需要立即使用新值
    setCount(prev => {
      console.log(prev)   // 能获取到最新值
      return prev + 1
    })
  }
}
```


```typescript
// TODO: 在 useEffect 中，React 的更新不受批量更新机制的影响，因此是同步的。
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1);
  console.log(count); // 输出更新后的值
}, []);
```

#### 3. 如何处理对象类型的状态？
答：更新对象状态时需要保持不变性，使用展开运算符复制旧值。
```typescript
function LoginForm() {
  // ❌ 错误方式
  const [form, setForm] = useState({ email: '', password: '' })
  setForm({ email: 'new@example.com' })  // 会丢失 password
  
  // ✅ 正确方式
  setForm(prev => ({ ...prev, email: 'new@example.com' }))
}
```

#### 4. useState 的惰性初始化是什么？
答：传递函数给 `useState(() => expensiveComputation()` 可以实现惰性初始化，避免每次渲染都执行昂贵计算。


```typescript
// ❌ 每次渲染都会执行昂贵计算
const [user, setUser] = useState(expensiveComputation())

// ✅ 只在首次渲染时执行
const [user, setUser] = useState(() => expensiveComputation())


> 使用场景
const [items, setItems] = useState(() => loadDefaultItems());

useEffect(() => {
  fetch('/api/items').then((res) => setItems(res));
}, []);

```
| 特性                                | useState(() => expensiveComputation())                  | useEffect(() => expensiveComputation(), [])            |
|-------------------------------------|--------------------------------------------------------|--------------------------------------------------------|
| 触发时机                           | 渲染阶段（初始化渲染前）                               | 副作用阶段（初始化渲染后，DOM 已更新）                |
| 影响渲染                           | 直接影响初始化状态，可能延缓渲染速度                   | 不影响初始化状态或渲染过程，延迟到渲染后执行           |
| 用途                                | 用于初始化状态                                        | 用于处理副作用                                         |
| 适用场景                           | 状态初始化逻辑，如依赖复杂计算的默认值                 | 副作用逻辑，如网络请求、事件监听或 DOM 操作           |
```bash
`useState` 懒初始化 和 `useEffect` 副作用 的核心区别在于：
• useState 是 用于`状态初始化` 的（影响渲染阶段）。
• useEffect 是 用于`副作用处理` 的（发生在渲染完成后）。
如果只是为了状态初始化，应优先使用 useState；
如果是处理副作用，应使用 useEffect。
```
#### 5. 如何处理数组类型的状态？
答：更新数组状态时，使用展开运算符复制旧值，并添加新元素。
```typescript
function TodoList() {
  const [todos, setTodos] = useState([{ id: 1, text: 'Learn React' }])
  setTodos([...todos, { id: 2, text: 'Learn TypeScript' }])
}
```


#### 5. 如何处理多个相关状态？
答：根据状态的关联程度和使用场景选择合适的管理方式。
```typescript
// 方式1：分开管理
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
}

// 方式2：合并管理
function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    error: ''
  })
}
```
#### 6. useState 和 useEffect 的关系？
useState：用于管理组件的 状态 | 当状态发生变化时，组件会重新渲染
useEffect：用于处理组件的 副作用 | 当状态发生变化时，组件会重新渲染
```typescript
const LoginForm = () => {
  const [email, setEmail] = useState('')
  
  // 状态变化会触发 effect
  useEffect(() => {
    validateEmail(email)
  }, [email])  // 依赖 email 状态
}



const [user, setUser] = useState(null);

useEffect(async() => {
  await fetch('/api/user')
    .then((res) => res.json())
    .then((data) => setUser(data)); // 设置状态
}, []);
```

#### 7. 如何避免不必要的重渲染？
答：使用 `useCallback`、`useMemo` 等钩子优化性能。
```typescript
// TODO: ❌ 每次渲染都创建新函数
const [form, setForm] = useState({ email: '', password: '' })
const handleChange = (field: string) => (e: ChangeEvent) => {
  setForm(prev => ({ ...prev, [field]: e.target.value }))
}

`发生的行为：`
• 每次组件渲染时，handleChange 都会重新创建一个新的函数。
• 如果 handleChange 被传递给子组件（作为 props），可能会导致子组件的 不必要的重新渲染。
`性能问题:`
• 当组件频繁重新渲染时，会多次创建新函数，占用内存和计算资源。
• 如果 handleChange 被用作子组件的依赖，可能导致 useEffect 或 React.memo 的优化失效。

// TODO:✅ 使用 useCallback 缓存函数
const handleChange = useCallback((field: string) => (e: ChangeEvent) => {
  setForm(prev => ({ ...prev, [field]: e.target.value }))
}, [])

`发生的行为：`
• useCallback 会缓存 handleChange 函数的引用，确保在依赖未变化时，返回的是相同的函数实例。
• 依赖数组 [] 表示 handleChange 的引用在组件的生命周期中始终保持一致。
`性能优势：`
• 减少了函数的重复创建。
• 在将 handleChange 作为子组件的 props 或 useEffect 的依赖时，可以避免不必要的更新或副作用的重新执行。


这两个代码实现的功能相同，但它们在 函数的创建频率 和 性能优化 上存在显著区别。

```
##### 使用场景
如果 `handleChange` 被作为 `props` 传递给子组件，使用 `useCallback` 可以`避免`子组件的`重复渲染`。
`const [form, setForm] = useState({ email: '', password: '' });`
```typescript
❌ 未使用 useCallback 的问题：
每次 Parent 重新渲染时，handleChange 都是新的函数实例，Child 也会重新渲染。
const Parent = () => {

  const handleChange = (field: string) => (e: ChangeEvent) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return <Child handleChange={handleChange} />;
};

const Child = React.memo(({ handleChange }) => {
  console.log('Child re-rendered');
  return <input onChange={handleChange('email')} />;
});


```

```typescript
✅ 使用 useCallback 的解决方案：
const Parent = () => {
  const handleChange = useCallback((field: string) => (e: ChangeEvent) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  return <Child handleChange={handleChange} />;
};

const Child = React.memo(({ handleChange }) => {
  console.log('Child re-rendered');
  return <input onChange={handleChange('email')} />;
});
```

3. 哪种情况下可以不使用 useCallback？

如果 handleChange：
	1.	不会被传递给子组件。
	2.	不会作为其他副作用的依赖项。

那么可以直接创建新函数，而无需 useCallback。这是因为 React 的函数重新创建本身是廉价的，只有在需要避免引用变化引发的问题时才需要 useCallback。

4. useCallback 的注意事项
1.	过度使用可能适得其反：
•	useCallback 本身也有一定的性能开销（如创建缓存和依赖比较）。
•	在不必要的情况下使用 useCallback，可能会让代码复杂且带来微不足道的优化。
2.	与 React.memo 搭配使用：
•	如果子组件没有用 React.memo 包裹，useCallback 的优化是无效的，因为子组件本身每次都会重新渲染。


```
方式 |	行为	|使用场景
直接创建函数 |	每次渲染都会创建新的函数实例	| 简单场景，函数未被传递给子组件或未作为依赖项时使用
useCallback |  缓存函数	缓存函数引用，避免重复创建函数	| 复杂场景，函数被传递给子组件（优化渲染）或作为依赖项（优化副作用执行）时使用

```

### 8. 状态更新的优先级问题
答：React 会对状态更新进行批处理，多个更新会合并成一个更新。
```typescript
function LoginForm() {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    // 批量更新会合并
    setCount(c => c + 1)
    setCount(c => c + 1)
    setCount(c => c + 1)
    // 最终只加1
  }
}
```
