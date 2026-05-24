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
    } else if (!email.includes('@')) {
      newErrors.email = 'Email không hợp lệ (phải chứa ký tự @)';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải dài ít nhất 8 ký tự';
      isValid = false;
    }
    // Only accept alphabets, number and special characters
    else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/.test(password)) {
      newErrors.password = 'Mật khẩu chỉ được chứa chữ cái a-z, A-Z, số và ký tự đặc biệt không bao gồm khoảng cách';
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
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('accountId', response.data.user._id);
          if (response.data.role === 'company') {
            localStorage.setItem('companyId', response.data.user._id);
          } else {
            localStorage.removeItem('companyId');
          }
          // Success
          toast.success('Đăng nhập thành công!');
          if (response.data.role === 'customer') {
            navigate('/', { replace: true });
          } else if (response.data.role === 'company') {
            navigate('/company', { replace: true });
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
