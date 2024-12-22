// 客户端通用请求工具类
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

interface RequestData {
  // 定义具体的数据结构
  [key: string]: unknown;
}

class Request {
  private baseURL: string;
  
  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...customConfig } = options;
    const headers = this.getHeaders();

    const config: RequestInit = {
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    };

    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('未授权访问');
      }

      if (!response.ok) {
        throw new Error('请求失败');
      }

      return response.json();
    } catch (error) {
      console.error('请求错误:', error);
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: RequestData, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const request = new Request(); 