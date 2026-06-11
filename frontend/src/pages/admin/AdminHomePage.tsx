import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  AdminPanelSettingsOutlined as AdminIcon,
  PeopleAltOutlined as PeopleIcon,
  HistoryToggleOffOutlined as HistoryIcon,
  ManageAccountsOutlined as UserIcon,
  BarChartOutlined as ChartIcon,
  StarBorderOutlined as QualityIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

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

  const adminName = localStorage.getItem('accountName') || 'Quản trị viên';
  const adminEmail = localStorage.getItem('accountEmail') || 'admin@cuuho247.vn';

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Admin Profile Welcome Banner Card */}
          <Box
            sx={{
              p: 2.5,
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
                  Chào mừng trở lại, {adminName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.75)', mt: 0.5 }} noWrap>
                  Bạn đang đăng nhập dưới vai trò Quản trị viên hệ thống ({adminEmail})
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Metrics Alert */}
          {pendingCount !== null && pendingCount > 0 && (
            <Box
              onClick={() => navigate('/admin/companies/pending')}
              sx={{
                p: 2.5,
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
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: ORANGE }}>
                  Hồ sơ công ty cứu hộ chờ duyệt
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#4b5563', mt: 0.5 }}>
                  Hệ thống ghi nhận có {pendingCount} hồ sơ đăng ký mới của công ty cứu hộ cần xác minh.
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: CIRCLE_RADIUS,
                  bgcolor: ORANGE,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {pendingCount}
              </Box>
            </Box>
          )}

          {/* Action Cards Grid */}
          <Box>
            <Typography sx={{ mb: 2.5, fontSize: 16, fontWeight: 800, color: NAVY }}>Các chức năng chính</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
                gap: 2.5,
                pb: 4,
              }}
            >
              <ActionCard
                icon={<PeopleIcon sx={{ fontSize: 24 }} />}
                title="Duyệt hồ sơ công ty cứu hộ"
                description="Phê duyệt hồ sơ các công ty cứu hộ đăng ký mới vào hệ thống"
                onClick={() => navigate('/admin/companies/pending')}
              />
              <ActionCard
                icon={<UserIcon sx={{ fontSize: 24 }} />}
                title="Quản lý tài khoản"
                description="Xem danh sách, thông tin chi tiết và khóa/mở khóa tài khoản khách hàng, công ty"
                onClick={() => navigate('/admin/users')}
              />
              <ActionCard
                icon={<AdminIcon sx={{ fontSize: 24 }} />}
                title="Kiểm duyệt đánh giá"
                description="Theo dõi và gỡ bỏ đánh giá, phản hồi vi phạm quy định"
                onClick={() => navigate('/admin/reviews')}
              />
              <ActionCard
                icon={<ChartIcon sx={{ fontSize: 24 }} />}
                title="Báo cáo hoạt động"
                description="Thống kê số lượng yêu cầu cứu hộ và tần suất cuộc gọi theo thời gian"
                onClick={() => navigate('/admin/reports')}
              />
              <ActionCard
                icon={<QualityIcon sx={{ fontSize: 24 }} />}
                title="Thống kê chất lượng"
                description="Theo dõi tỷ lệ phản hồi cuộc gọi và mức độ hài lòng khách hàng"
                onClick={() => navigate('/admin/reports/service-quality')}
              />
              <ActionCard
                icon={<HistoryIcon sx={{ fontSize: 24 }} />}
                title="Nhật ký hoạt động"
                description="Xem lịch sử phê duyệt, từ chối hoặc khóa tài khoản của quản trị viên"
                onClick={() => navigate('/admin/logs')}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
