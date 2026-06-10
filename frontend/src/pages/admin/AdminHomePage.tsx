import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  AdminPanelSettingsOutlined as AdminIcon,
  PeopleAltOutlined as PeopleIcon,
  HistoryToggleOffOutlined as HistoryIcon,
  LogoutRounded as LogoutIcon,
  ManageAccountsOutlined as UserIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ActionCard } from '@/components/rescue-company/ActionCard';
import { adminService } from '@/services/admin.service';
import { NAVY, ORANGE, CARD_RADIUS, CIRCLE_RADIUS } from '@/constants/colors';

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingCompanies();
      if (response.status === 'success') {
        setPendingCount(response.data.length);
      }
    } catch (error) {
      console.error('Error fetching pending companies:', error);
      toast.error('Không thể tải số lượng hồ sơ chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('accountId');
    localStorage.removeItem('accountPhone');
    localStorage.removeItem('accountName');
    localStorage.removeItem('companyId');
    toast.success('Đăng xuất thành công');
    navigate('/login', { replace: true });
  };

  const adminName = localStorage.getItem('accountName') || 'Quản trị viên';
  const adminEmail = localStorage.getItem('accountEmail') || 'admin@cuuho247.vn';

  return (
    <MobileLayout>
      <AppHeader title="Admin Portal" showBack={false} logoIcon={<AdminIcon sx={{ fontSize: 24 }} />} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Admin Profile Card */}
            <Box
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: CARD_RADIUS,
                background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
                color: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: CIRCLE_RADIUS,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AdminIcon sx={{ fontSize: 34, color: '#fff' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.2 }} noWrap>
                    {adminName}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.75)', mt: 0.5 }} noWrap>
                    {adminEmail}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Metrics Alert */}
            {pendingCount !== null && pendingCount > 0 && (
              <Box
                onClick={() => navigate('/admin/companies/pending')}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: CARD_RADIUS,
                  bgcolor: 'rgba(255, 107, 0, 0.1)',
                  border: `2px solid ${ORANGE}`,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: ORANGE }}>Hồ sơ chờ duyệt</Typography>
                  <Typography sx={{ fontSize: 13, color: '#4b5563', mt: 0.5 }}>
                    Có {pendingCount} hồ sơ cứu hộ đang chờ xác minh
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: CIRCLE_RADIUS,
                    bgcolor: ORANGE,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {pendingCount}
                </Box>
              </Box>
            )}

            <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>Tính năng quản trị</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <ActionCard
                icon={<PeopleIcon sx={{ fontSize: 24 }} />}
                title="Duyệt hồ sơ công ty"
                description="Phê duyệt hồ sơ các đơn vị cứu hộ đăng ký mới"
                onClick={() => navigate('/admin/companies/pending')}
              />
              <ActionCard
                icon={<UserIcon sx={{ fontSize: 24 }} />}
                title="Quản lý người dùng"
                description="Xem thông tin và khóa/mở khóa tài khoản"
                onClick={() => navigate('/admin/users')}
              />
              <ActionCard
                icon={<AdminIcon sx={{ fontSize: 24 }} />}
                title="Kiểm duyệt nội dung"
                description="Gỡ bỏ đánh giá, phản hồi và bài viết/bình luận vi phạm"
                onClick={() => navigate('/admin/reviews')}
              />
              <ActionCard
                icon={<HistoryIcon sx={{ fontSize: 24 }} />}
                title="Nhật ký hoạt động"
                description="Xem lịch sử phê duyệt, từ chối của admin"
                onClick={() => navigate('/admin/logs')}
              />
            </Box>

            {/* Logout */}
            <Box sx={{ mt: 5, pt: 2, borderTop: '1px solid #e5e7eb' }}>
              <Box
                component="button"
                type="button"
                onClick={handleLogout}
                sx={{
                  width: '100%',
                  p: 2,
                  border: '2px solid #fee2e2',
                  borderRadius: CARD_RADIUS,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  color: '#dc2626',
                  fontSize: 16,
                  fontWeight: 700,
                  transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
                  '&:hover': { bgcolor: '#fff5f5', borderColor: '#fecaca' },
                  '&:active': { transform: 'scale(0.99)' },
                  cursor: 'pointer',
                }}
              >
                <LogoutIcon sx={{ fontSize: 22 }} />
                Đăng xuất
              </Box>
            </Box>
          </>
        )}
      </Box>
    </MobileLayout>
  );
}
