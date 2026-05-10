import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    let newErrors = { email: '', password: '' };
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

    setErrors(newErrors);

    // 3. Call API if form is valid
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await authService.login(email, password);
        if (response.status === 'success') {
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('authRole', response.data.role);
          localStorage.setItem('authUser', JSON.stringify(response.data.user));

          // Success
          toast.success('Đăng nhập thành công!');

          // TODO: replace with real dashboards when available.
          // Keep behavior consistent across roles for now.
          navigate('/');
        }
      } catch (error: any) {
        const apiData = error.response?.data;
        const errorMsg =
          (Array.isArray(apiData?.errors) && apiData.errors.length > 0 ? apiData.errors.join('\n') : undefined) ||
          apiData?.message ||
          'Đăng nhập thất bại. Vui lòng thử lại!';

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
