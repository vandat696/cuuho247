import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    // 1. Reset errors
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // 2. Validate
    if (!email) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }
    setErrors(newErrors);

    // 3. Call API if form is valid
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await authService.login(email, password);
        if (response.status === 'success') {
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('accountId', response.data.user._id);
          localStorage.setItem('accountPhone', response.data.user.phone || '');
          localStorage.setItem('accountAvatar', response.data.user.avatar_url || '');
          localStorage.setItem(
            'accountName',
            response.data.role === 'company'
              ? response.data.user.company_name || ''
              : response.data.user.full_name || ''
          );
          if (response.data.role === 'company') {
            localStorage.setItem('companyId', response.data.user._id);
          } else {
            localStorage.removeItem('companyId');
          }
          // Success
          toast.success('Đăng nhập thành công!');
          if (response.data.role === 'customer') {
            navigate('/customer/home', { replace: true });
          } else if (response.data.role === 'company') {
            navigate('/company/home', { replace: true });
          } else if (response.data.role === 'admin') {
            navigate('/admin/home', { replace: true });
          }
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMsg = axiosError.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';

        // Error
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
  };
};
