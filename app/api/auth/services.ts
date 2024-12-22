import { request } from '@/lib/utils/request';

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

export const authService = {
  login: async (email: string, password: string) => {
    const response = await request.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
}; 