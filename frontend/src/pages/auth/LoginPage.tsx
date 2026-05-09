import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ShieldOutlined as ShieldOutlinedIcon } from '@mui/icons-material';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { LoginForm } from '@/components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <AppHeader title="Đăng nhập" onBack={() => navigate('/')} />

      <Box sx={{ flex: 1, bgcolor: 'common.white', display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 3 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'secondary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 60, color: 'common.white' }} />
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="h2" sx={{ textAlign: 'center', color: 'secondary.main', mb: 1, fontWeight: 'bold' }}>
          Chào mừng trở lại
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
          Đăng nhập để tiếp tục
        </Typography>

        {/* Form */}
        <LoginForm />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Chưa có tài khoản?{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Đăng ký
            </Typography>
          </Typography>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default LoginPage;
