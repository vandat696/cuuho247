import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

export const useCustomerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleRegister = async () => {
    let newErrors = { fullName: '', phone: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Validate
    if (!formData.fullName) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
      isValid = false;
    }

    // If phone is entered, check format
    if (formData.phone) {
      if (formData.phone.length < 10 || formData.phone.length > 11 || !/^[0-9]+$/.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
        isValid = false;
      }
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email không hợp lệ (phải chứa ký tự @)';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải dài ít nhất 8 ký tự';
      isValid = false;
    }
    // Only accept alphabets, number and special characters
    else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]*$/.test(formData.password)) {
      newErrors.password = 'Mật khẩu chỉ được chứa chữ cái a-z, A-Z, số và ký tự đặc biệt không bao gồm khoảng cách';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
      isValid = false;
    }

    setErrors(newErrors);

    // Call API
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await authService.registerCustomer({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 'success') {
          toast.success('Đăng ký tài khoản Khách hàng thành công!');
          navigate('/login'); // Login after success
        }
      } catch (error: any) {
        const apiData = error.response?.data;
        const errorMsg =
          (Array.isArray(apiData?.errors) && apiData.errors.length > 0 ? apiData.errors.join('\n') : undefined) ||
          apiData?.message ||
          'Đăng ký thất bại. Vui lòng thử lại!';
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleRegister,
  };
};
