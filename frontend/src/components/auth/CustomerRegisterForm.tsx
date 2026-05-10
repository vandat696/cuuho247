import { Box } from '@mui/material';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useCustomerRegister } from '@/hooks/useCustomerRegister';

export const CustomerRegisterForm = () => {
  const { formData, errors, isLoading, handleChange, handleRegister } = useCustomerRegister();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Input
        label="Họ và tên"
        placeholder="Nhập họ và tên của bạn"
        value={formData.fullName}
        onChange={handleChange('fullName')}
        error={errors.fullName}
      />

      <Input
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        type="tel"
        value={formData.phone}
        onChange={handleChange('phone')}
        error={errors.phone}
      />

      <Input
        label="Email"
        placeholder="Nhập email của bạn"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
      />

      <Input
        label="Mật khẩu"
        type="password"
        placeholder="Tạo mật khẩu (Ít nhất 8 ký tự)"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
      />

      <Input
        label="Xác nhận mật khẩu"
        type="password"
        placeholder="Nhập lại mật khẩu"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={errors.confirmPassword}
      />

      <Box sx={{ mt: 2 }}>
        <Button variant="primary" size="lg" fullWidth onClick={handleRegister} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
      </Box>
    </Box>
  );
};
