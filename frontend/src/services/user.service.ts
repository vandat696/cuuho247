import { http } from './http';
import { ApiResponse } from '../types/common.type';

export interface UserProfile {
  _id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
}

export const userService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await http.get<ApiResponse<UserProfile>>('/users/me');
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    email?: string;
    avatar?: File;
  }): Promise<ApiResponse<UserProfile>> => {
    let response;
    if (data.avatar) {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.phone) formData.append('phone', data.phone);
      if (data.email) formData.append('email', data.email);
      formData.append('avatar', data.avatar);
      response = await http.put<ApiResponse<UserProfile>>('/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await http.put<ApiResponse<UserProfile>>('/users/me', data);
    }
    return response.data;
  },
};
