import { RequestData, request } from '@/lib/utils/request';

interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
    token: string;
  };
}

interface LoginParams extends RequestData {
  email: string;
  password: string;
}

interface RegisterParams extends RequestData {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  success: boolean;
  code: number;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
  };
}

interface LogoutResponse {
  success: boolean;
  code: number;
  message: string;
}

export const authService = {
  // 登录请求
  login: async (params: LoginParams) => {
    const response = await request.post<LoginResponse>('/auth/login', params);
    if (!response.success) {
      throw new Error(response.message || '登录失败');
    }
    return response;
  },

  // 注册请求
  register: async (params: RegisterParams) => {
    const response = await request.post<RegisterResponse>('/auth/register', params);
    if (!response.success) {
      throw new Error(response.message || '注册失败');
    }
    return response;
  },

  // 登出请求
  logout: async () => {
    const response = await request.post<LogoutResponse>('/auth/logout');
    if (!response.success) {
      throw new Error(response.message || '登出失败');
    }
    window.location.href = '/login';
    return response;
  },
};
