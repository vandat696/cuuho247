import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  AccessTimeOutlined as ClockIcon,
  HistoryToggleOffOutlined as HistoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { InfoCard, InfoRow, PrimaryActionButton } from '@/components/rescue-company/RescueCompanyRequestShared';
import { ActionReasonDialog } from '@/components/admin/ActionReasonDialog';
import { UserLogHistory } from '@/components/admin/UserLogHistory';
import { useAccountStatusActions } from '@/hooks/useAccountStatusActions';
import { adminService, AuditLog } from '@/services/admin.service';
import { User } from '@/types/common.type';
import { NAVY, GREEN, RED } from '@/constants/colors';
import { formatDateTime } from '@/utils/format';

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserDetailAndLogs();
    }
  }, [userId]);

  const fetchUserDetailAndLogs = async () => {
    try {
      setLoading(true);
      if (!userId) return;

      const [userRes, logsRes] = await Promise.all([
        adminService.getUserDetail(userId),
        adminService.getUserLogs(userId),
      ]);

      if (userRes.status === 'success') {
        setUser(userRes.data);
      }
      if (logsRes.status === 'success') {
        setLogs(logsRes.data);
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
      toast.error('Không thể tải chi tiết người dùng');
      navigate('/admin/users', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const { actionLoading, dialogConfig, setDialogConfig, handleOpenActionDialog, handleDialogConfirm } =
    useAccountStatusActions(userId, 'user', fetchUserDetailAndLogs, adminService.lockUser, adminService.unlockUser);

  if (loading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!user) return null;

  const isLocked = user.status === 'locked';

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Basic Details & Status / Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <InfoCard title="Thông tin cơ bản">
            <InfoRow icon={<PersonIcon />} label="Họ và tên" value={user.full_name || 'Chưa cập nhật'} />
            <InfoRow icon={<MailIcon />} label="Địa chỉ Email" value={user.email} />
            <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={user.phone || 'Chưa cập nhật'} />
            <InfoRow
              icon={<ClockIcon />}
              label="Thời gian tạo tài khoản"
              value={user.created_at ? formatDateTime(user.created_at as any) : 'Chưa rõ'}
            />
          </InfoCard>

          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: NAVY, mb: 1 }}>Trạng thái hiện tại</Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: '8px',
                bgcolor: isLocked ? 'rgba(220, 38, 38, 0.04)' : 'rgba(22, 163, 74, 0.04)',
                border: `1px solid ${isLocked ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 163, 74, 0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: isLocked ? RED : GREEN }}>
                {isLocked ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
              </Typography>

              <Box component="span" sx={{ fontSize: 13, color: '#6b7280' }}>
                Đăng nhập cuối: {user.last_login_at ? formatDateTime(user.last_login_at as any) : 'Chưa đăng nhập'}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {isLocked ? (
              <PrimaryActionButton
                onClick={() => handleOpenActionDialog('unlock')}
                disabled={actionLoading}
                variant="navy"
              >
                {actionLoading ? 'Đang xử lý...' : 'Mở khóa tài khoản'}
              </PrimaryActionButton>
            ) : (
              <PrimaryActionButton
                onClick={() => handleOpenActionDialog('lock')}
                disabled={actionLoading}
                variant="orange"
              >
                {actionLoading ? 'Đang xử lý...' : 'Khóa tài khoản'}
              </PrimaryActionButton>
            )}
          </Box>
        </Box>

        {/* Right Column: History Logs Card */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              color: NAVY,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HistoryIcon sx={{ fontSize: 20 }} />
            Lịch sử thay đổi trạng thái
          </Typography>

          <Box sx={{ pb: 4 }}>
            <UserLogHistory logs={logs} />
          </Box>
        </Box>
      </Box>

      {/* Action Dialog */}
      <ActionReasonDialog
        open={dialogConfig.open}
        title={dialogConfig.title}
        placeholder={dialogConfig.placeholder}
        loading={actionLoading}
        onClose={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
}
