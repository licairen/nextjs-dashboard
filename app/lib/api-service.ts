// API 服务层，统一处理前端 API 请求
export const authService = {
  // 登录请求
  async login(credentials: { email: string; password: string }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '登录失败')
    }

    return data
  },

  // 注册请求
  async register(userData: { email: string; password: string; name: string }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '注册失败')
    }

    return data
  },

  // 登出请求
  async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '登出失败')
    }

    return data
  },
}
