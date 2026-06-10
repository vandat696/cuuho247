import axios from 'axios';
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
    if (error.config.url.includes('login')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      const msg = error.response?.data?.message || '';
      const isLocked =
        msg.includes('khóa') ||
        msg.includes('locked') ||
        error.response?.data?.code === 'USER_LOCKED' ||
        error.response?.data?.code === 'COMPANY_LOCKED';

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
    }
    return Promise.reject(error);
  }
);

export { http };
