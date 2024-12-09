// API 服务层，统一处理前端 API 请求
export const authService = {
  // 登录请求
  async login(credentials: { email: string; password: string }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '登录失败');
    }
    
    const data = await response.json();
    console.log(response, 'response2222222', data);
    // 确保返回正确的数据结构
    return {
        ...data,
      success: true,
      data: data.data
    //   data: data.user
    };
  },

  // 注册请求
  async register(userData: { email: string; password: string; name: string }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '注册失败');
    }
    
    return response.json();
  }
}; 