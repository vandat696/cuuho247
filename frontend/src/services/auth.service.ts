import axios from 'axios';
import { ApiResponse } from '../types/common.type';
import { LoginData, CustomerRegisterData } from '../types/auth.type';

// API URL
const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginData>> => {
    const response = await axios.post<ApiResponse<LoginData>>(`${API_URL}/auth/login`, {
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
    const response = await axios.post<ApiResponse<CustomerRegisterData>>(`${API_URL}/auth/customer-register`, data);
    return response.data;
  },
  registerCompany: async (data: {
    email: string;
    password: string;
    company_name: string;
    director_name: string;
    phone: string;
    address: string;
    service_area: string;
    license_file_url?: string;
    terms_accepted: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${API_URL}/auth/company-register`, data);
    return response.data;
  },
};
