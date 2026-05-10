import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import  CompanyRegisterForm  from '@/components/auth/CompanyRegisterForm';

const CompanyRegisterPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <AppHeader title="Tạo tài khoản công ty" onBack={() => navigate('/register')} />

      <Box sx={{ flex: 1, bgcolor: 'common.white', display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Title */}
        <Typography variant="h2" sx={{ color: 'secondary.main', mt: 2, mb: 1, fontWeight: 'bold' }}>
          Đăng ký Công ty
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          Vui lòng điền đầy đủ thông tin bên dưới để tạo tài khoản công ty. Tài khoản sẽ cần được xác minh trước khi kích hoạt.
        </Typography>

        <CompanyRegisterForm />
      </Box>
    </MobileLayout>
  );
};

export default CompanyRegisterPage;
