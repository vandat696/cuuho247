import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ShieldOutlined as ShieldOutlinedIcon } from '@mui/icons-material';
import { Button } from '@/components/common/Button';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box className="mobile-shell screen--dark" sx={{ alignItems: 'center', justifyContent: 'center', px: 4 }}>
      {/* LOGO */}
      <Box 
        sx={{ 
          width: 120, height: 120, bgcolor: 'common.white', borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4
        }}
      >
        <ShieldOutlinedIcon sx={{ fontSize: 72, color: 'primary.main' }} />
      </Box>

      {/* HEADER */}
      <Typography variant="h1" sx={{ color: 'common.white', mb: 1, fontSize: '28px', fontWeight: 'bold' }}>
        Cứu hộ 247
      </Typography>
      
      <Typography variant="body1" sx={{ color: 'common.white', textAlign: 'center', opacity: 0.9, mb: 6 }}>
        Tìm kiếm dịch vụ cứu hộ xe nhanh chóng 24/7
      </Typography>

      {/* BUTTON */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/login')}>
          Đăng nhập
        </Button>
        <Button variant="white" size="lg" fullWidth onClick={() => navigate('/register')}>
          Đăng ký
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
