// 通用请求工具类
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

// 定义基础的请求数据类型
export interface RequestData {
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
        return response.json();
      }

      return response.json();
    } catch (error) {
      console.error('请求错误:', error);
      throw error;
    }
  }

  // 使用 RequestData 作为数据类型约束
  post<T>(endpoint: string, data?: RequestData) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const request = new Request(); 