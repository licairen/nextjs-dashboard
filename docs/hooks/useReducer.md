### useReducer
useReducer 是 React 提供的一个 Hook，用于管理复杂的组件状态逻辑。它是状态管理的一种替代方案，尤其适合以下场景

- 状态逻辑复杂且包含多个子状态
- 需要处理异步操作
- 需要根据不同的 action 类型更新不同的状态

#### useReducer 的基本语法
```typescript
import { useReducer } from 'react'
const [state, dispatch] = useReducer(reducer, initialState, initializer);
参数解析
reducer: 函数 定义状态更新逻辑 接受两个参数：当前状态（state）和动作（action），返回新的状态
initialState：初始状态值 
initializer：可选参数 一个懒初始化函数，用于延迟计算初始状态（类似于 useState 的惰性初始化）


function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error('Unknown action type');
  }
}

```

#### useReducer 的使用场景
##### 2.1 替代 useState 管理复杂状态
如果组件的状态更新逻辑包含多个分支（如 if 或 switch），或者状态之间有依赖关系，useReducer 会比 useState 更加清晰。
```typescript
const initialState = { count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action type');
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

##### 2.2 多状态协同管理
当组件中存在多个互相关联的状态时，使用多个 useState 会变得复杂，而 useReducer 可以更好地组织这些状态
```typescript
示例：表单管理
import { useReducer } from 'react';

const initialState = { username: '', email: '', password: '' };
// TODO: 这就是状态逻辑分离
const reducer = (state, action) => {
  switch (action.type) {
    case 'updateField':
      return { ...state, [action.field]: action.value };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action type');
  }
}

const SignupForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    dispatch({ type: 'updateField', field: e.target.name, value: e.target.value });
  };

  return (
    <form>
      <input name="username" value={state.username} onChange={handleChange} />
      <input name="email" value={state.email} onChange={handleChange} />
      <input name="password" value={state.password} onChange={handleChange} />
      <button type="button" onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </form>
  );
}
```

##### 2.3 状态逻辑分离
通过 useReducer，可以将状态逻辑提取到组件外部，实现更好的复用和测试。
```typescript

```

#### 3. useReducer 使用场景总结
1.	复杂状态逻辑：
    •	状态更新涉及多个步骤或依赖关系（如增删改查操作）。
	•	需要在不同的地方触发状态变化。
2.	状态结构复杂：
	•	状态是对象或数组，且需要操作多个字段。
3.	多状态相关联：
	•	例如表单中，多个字段的值互相影响。
4.	逻辑可复用和测试：
	•	将状态更新逻辑提取到 reducer 中，便于复用和单元测试。

#### 4. useReducer 的注意事项
1.	不要滥用：
	•	s对于简单的状态管理（如计数器或单一状态值），useState 更加直观。
	•	useReducer 适用于复杂状态逻辑，否则可能导致代码冗长。
2.	避免复杂的 reducer：
	•	如果 reducer 过于复杂，可以将其拆分为多个子 reducer，分别处理不同部分的状态。
3.	结合上下文管理全局状态：
	•	useReducer 常与 useContext 结合，用于全局状态管理。
4.	注意 reducer 的纯函数特性：
	•	reducer 必须是纯函数，确保状态更新是可预测的。
5.	考虑性能问题：
	•	在大型应用中，频繁的 dispatch 可能会影响性能，可以考虑使用 Immer 等库来优化性能。
6.	文档和注释：
	•	为 reducer 添加清晰的注释和文档，便于理解和维护。
#### 5. 总结
`useReducer` 的优点
	1.	更清晰地组织复杂状态逻辑。
	2.	状态更新逻辑独立于组件，便于复用和测试。
	3.	在复杂场景下，比 useState 更易维护。

`useReducer` 的缺点
	1.	对于简单场景可能显得过于复杂。
	2.	学习成本略高，需要理解 reducer 和 dispatch 的机制。

### 面试题
#### 1.1 什么是 useReducer？它的作用是什么？
* `useReducer` 是 React 提供的一个 Hook，用于管理组件中的复杂状态逻辑