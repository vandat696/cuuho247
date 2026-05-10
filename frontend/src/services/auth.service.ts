import { http } from './http';
import { ApiResponse } from '../types/common.type';
import { LoginData, CustomerRegisterData } from '../types/auth.type';

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginData>> => {
    const response = await http.post<ApiResponse<LoginData>>(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  },
  registerCustomer: async (data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
  }): Promise<ApiResponse<CustomerRegisterData>> => {
    const response = await http.post<ApiResponse<CustomerRegisterData>>(`/auth/customer-register`, data);
    return response.data;
  },
};
