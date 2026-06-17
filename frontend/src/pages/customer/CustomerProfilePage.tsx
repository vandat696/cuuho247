import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  CallOutlined,
  EmailOutlined,
  LocationOnOutlined,
  EditOutlined,
  LogoutOutlined,
  PersonOutlineOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { InfoField } from '@/components/common/InfoField';
import { Button } from '@/components/common/Button';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { userService, UserProfile } from '@/services/user.service';
import { authService } from '@/services/auth.service';
import { CircularProgress } from '@mui/material';
import { useLogout } from '@/hooks/useLogout';

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openLogout, setOpenLogout] = useState(false);

  const { handleLogout } = useLogout();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const name = profile?.full_name || localStorage.getItem('accountName') || 'Đang tải...';
  const phone = profile?.phone || localStorage.getItem('accountPhone') || 'Đang tải...';
  const email = profile?.email || localStorage.getItem('accountEmail') || 'Đang tải...';

  return (
    <MobileLayout>
      <AppHeader title="Hồ sơ cá nhân" backFallback="/customer/home" />

      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', pb: 4 }}>
        {/* Profile Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 4 }}>
          {loading ? (
            <CircularProgress sx={{ mb: 2 }} />
          ) : (
            <>
              <Avatar
                src={profile?.avatar_url || undefined}
                sx={{ width: 100, height: 100, bgcolor: 'secondary.main', fontSize: '3rem', mb: 2 }}
              >
                {!profile?.avatar_url && <PersonOutlineOutlined sx={{ fontSize: '4rem' }} />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {name}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ px: 3 }}>
          {/* Info Card */}
          <Card variant="shadow" sx={{ mb: 3 }}>
            <InfoField icon={<CallOutlined />} label="Số điện thoại" value={phone} />
            <InfoField icon={<EmailOutlined />} label="Email" value={email} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ color: 'text.secondary', fontSize: '20px', pt: 0.5 }}>
                <LocationOnOutlined />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: '13px' }}
                >
                  Địa chỉ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '15px' }}>
                  Hà Nội, Việt Nam
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Actions */}
          <Button
            variant="outline"
            fullWidth
            size="lg"
            startIcon={<EditOutlined />}
            onClick={() => navigate('/customer/profile/edit')}
            sx={{ mb: 2, justifyContent: 'flex-start', color: 'secondary.main', borderColor: 'divider', py: 1.5 }}
          >
            <Box component="span" sx={{ pl: 1, fontWeight: 500 }}>
              Chỉnh sửa thông tin
            </Box>
          </Button>

          <Button
            variant="outline"
            fullWidth
            size="lg"
            startIcon={<LogoutOutlined />}
            onClick={() => setOpenLogout(true)}
            sx={{
              justifyContent: 'center',
              color: 'error.main',
              borderColor: 'error.main',
              py: 1.5,
              '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' },
            }}
          >
            <Box component="span" sx={{ pl: 1, fontWeight: 600 }}>
              Đăng xuất
            </Box>
          </Button>

          <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
            <DialogTitle>Xác nhận đăng xuất</DialogTitle>
            <DialogContent>
              <DialogContentText>Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button variant="outline" onClick={() => setOpenLogout(false)}>
                Hủy
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
              >
                Đăng xuất
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </MobileLayout>
  );
}
