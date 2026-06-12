import axios from 'axios';
import { toast } from 'react-hot-toast';

// Extend AxiosRequestConfig to support skipGlobalErrorToast flag
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalErrorToast?: boolean;
  }
}

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// Create an axios instance
const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
http.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors (e.g., 401)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipGlobalToast = error.config?.skipGlobalErrorToast;

    // 1. Handle Auth errors (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const apiData = error.response?.data;
      const msg = apiData?.message || '';

      // Special handling for non-active company: redirect to company home, keep tokens
      if (apiData?.code === 'COMPANY_NOT_ACTIVE') {
        window.location.href = '/company/home';
        return Promise.reject(error);
      }

      // Do not auto-redirect if it is a login request
      if (error.config?.url?.includes('login')) {
        return Promise.reject(error);
      }

      const isLocked =
        msg.includes('khóa') ||
        msg.includes('locked') ||
        apiData?.code === 'USER_LOCKED' ||
        apiData?.code === 'COMPANY_LOCKED';

      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('accountId');
      localStorage.removeItem('accountPhone');
      localStorage.removeItem('accountName');
      localStorage.removeItem('companyId');

      if (isLocked) {
        window.location.href = `/login?error=${encodeURIComponent(msg)}`;
      } else {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 2. Handle global toast for other errors (status >= 400 or network issues)
    if (!skipGlobalToast) {
      if (error.response) {
        // Auto-toast server response errors only for mutations (POST, PUT, PATCH, DELETE)
        // to prevent duplicate toasts with page-level GET fetch error handlers.
        const isGetRequest = error.config?.method?.toLowerCase() === 'get';
        if (error.response.status >= 400 && !isGetRequest) {
          const apiData = error.response.data;
          const errorMsg =
            (Array.isArray(apiData?.errors) && apiData.errors.length > 0 ? apiData.errors.join('\n') : undefined) ||
            apiData?.message ||
            'Đã xảy ra lỗi. Vui lòng thử lại!';
          toast.error(errorMsg);
        }
      } else {
        // Network error (server offline, no internet, CORS, etc.) - always toast
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!');
      }
    }

    return Promise.reject(error);
  }
);

export { http };
