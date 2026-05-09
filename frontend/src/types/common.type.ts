// API Response Type
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T;
  errors?: string[];
}

// User type
export interface User {
  _id: string;
  email: string;
  full_name?: string;
  phone?: string;
  status?: string;
  is_verified?: boolean;
  last_login_at?: Date;
  [key: string]: any;
}

// Company type
export interface Company {
  _id: string;
  email: string;
  company_name: string;
  phone: string;
  address?: any;
  location?: any;
  license_url?: string;
  status?: string;
  rating_avg?: number;
  rating_count?: number;
  is_verified?: boolean;
  last_login_at?: Date;
  [key: string]: any;
}
