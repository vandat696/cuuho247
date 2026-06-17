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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a response interceptor to handle common errors (e.g., 401)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipGlobalToast = error.config?.skipGlobalErrorToast;

    // 1. Handle Auth errors (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const originalRequest = error.config;
      const apiData = error.response?.data;
      const msg = apiData?.message || '';

      // Special handling for non-active company: redirect to company home, keep tokens
      if (apiData?.code === 'COMPANY_NOT_ACTIVE') {
        window.location.href = '/company/home';
        return Promise.reject(error);
      }

      // Do not auto-redirect if it is a login request or refresh token request
      if (originalRequest?.url?.includes('login') || originalRequest?.url?.includes('refresh-token')) {
        return Promise.reject(error);
      }

      const isLocked =
        msg.includes('khóa') ||
        msg.includes('locked') ||
        apiData?.code === 'USER_LOCKED' ||
        apiData?.code === 'COMPANY_LOCKED';

      if (!originalRequest._retry && error.response.status === 401 && !isLocked) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return http(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return new Promise(function (resolve, reject) {
            axios
              .post(`${API_URL}/auth/refresh-token`, { refresh_token: refreshToken })
              .then(({ data }) => {
                const newAccessToken = data.data.access_token;
                localStorage.setItem('accessToken', newAccessToken);
                if (data.data.refresh_token) {
                  localStorage.setItem('refreshToken', data.data.refresh_token);
                }
                http.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                resolve(http(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                // Clear tokens and redirect
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('role');
                localStorage.removeItem('accountId');
                localStorage.removeItem('accountPhone');
                localStorage.removeItem('accountName');
                localStorage.removeItem('companyId');
                window.location.href = '/login';
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }
      }

      // Fallback for locked or missing refresh token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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
      if (!error.response) {
        // Network error (server offline, no internet, CORS, etc.) - always toast
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!');
      }
    }

    return Promise.reject(error);
  }
);

export { http };
