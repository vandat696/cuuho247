import { Box, Link as MuiLink } from '@mui/material';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useLogin } from '@/hooks/useLogin';

export const LoginForm = () => {
  const { email, setEmail, password, setPassword, errors, isLoading, handleLogin } = useLogin();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Input
        label="Email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <Input
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MuiLink component="button" variant="body2" underline="none" sx={{ color: 'secondary.main', fontWeight: 600 }}>
          Quên mật khẩu?
        </MuiLink>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Button variant="secondary" size="lg" fullWidth onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </Box>
    </Box>
  );
};
