import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { CustomerRegisterForm } from '@/components/auth/CustomerRegisterForm';

const CustomerRegisterPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <AppHeader title="Tạo tài khoản khách hàng" onBack={() => navigate('/register')} />

      <Box sx={{ flex: 1, bgcolor: 'common.white', display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Title */}
        <Typography variant="h2" sx={{ color: 'secondary.main', mt: 2, mb: 1, fontWeight: 'bold' }}>
          Đăng ký Khách hàng
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          Vui lòng điền đầy đủ thông tin bên dưới để tạo tài khoản mới.
        </Typography>

        {/* Form */}
        <CustomerRegisterForm />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, pb: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Đã có tài khoản?{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Typography>
          </Typography>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default CustomerRegisterPage;
