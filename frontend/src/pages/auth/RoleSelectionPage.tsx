import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { PersonOutline as CustomerIcon, BusinessOutlined as CompanyIcon } from '@mui/icons-material';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <AppHeader title="Đăng ký" onBack={() => navigate('/')} />

      <Box sx={{ flex: 1, bgcolor: 'common.white', display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Title */}
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', color: 'secondary.main', mt: 2, mb: 1, fontWeight: 'bold' }}
        >
          Chọn loại tài khoản
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 5 }}>
          Bạn muốn đăng ký với tư cách nào?
        </Typography>

        {/* Role Selection */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Customer */}
          <Box
            onClick={() => navigate('/register/customer')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              border: '1.5px solid',
              borderColor: 'secondary.main',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255, 107, 0, 0.04)' },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'secondary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
              }}
            >
              <CustomerIcon sx={{ fontSize: 32, color: 'common.white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                Khách hàng
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Tìm kiếm dịch vụ cứu hộ
              </Typography>
            </Box>
          </Box>

          {/* Company */}
          <Box
            onClick={() => navigate('/register/company')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              border: '1.5px solid',
              borderColor: 'secondary.main',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255, 107, 0, 0.04)' },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(255, 107, 0, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
              }}
            >
              <CompanyIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                Công ty cứu hộ
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Cung cấp dịch vụ cứu hộ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default RoleSelectionPage;
