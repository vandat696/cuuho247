import { Box, Typography } from '@mui/material';
import {
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  AccessTimeOutlined as ClockIcon,
} from '@mui/icons-material';
import { User } from '@/types/common.type';
import { NAVY, GREEN, RED } from '@/constants/colors';
import { formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import AdminCard from './AdminCard';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
  const isLocked = user.status === 'locked';

  return (
    <AdminCard
      title={user.full_name || 'Chưa cập nhật tên'}
      badgeLabel={isLocked ? 'Đã khóa' : 'Hoạt động'}
      badgeBg={isLocked ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)'}
      badgeColor={isLocked ? RED : GREEN}
      buttonText="Xem chi tiết tài khoản"
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
        <MailIcon sx={{ fontSize: 18, color: NAVY }} />
        <Typography sx={{ fontSize: 14, lineHeight: 1.3 }} noWrap>
          {user.email}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
        <PhoneIcon sx={{ fontSize: 18, color: NAVY }} />
        <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>Số điện thoại: {user.phone || 'Chưa cập nhật'}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
        <ClockIcon sx={{ fontSize: 16 }} />
        <Typography sx={{ fontSize: 12, lineHeight: 1.3 }}>
          Tham gia {formatTimeAgo(user.created_at || user.updated_at)}
        </Typography>
      </Box>
    </AdminCard>
  );
};
