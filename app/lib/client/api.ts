// 客户端 API 方法集合
import { request } from './request';

interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: async (email: string, password: string) => {
    return request.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
  },

  logout: async () => {
    try {
      await request.post('/auth/logout');
    } finally {
      window.location.href = '/login';
    }
  },
}; 