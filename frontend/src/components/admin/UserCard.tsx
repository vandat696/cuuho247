import { Box, Typography } from '@mui/material';
import {
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  AccessTimeOutlined as ClockIcon,
} from '@mui/icons-material';
import { User } from '@/types/common.type';
import { NAVY, GREEN, RED, CARD_RADIUS } from '@/constants/colors';
import { formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import { Button } from '@/components/common/Button';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
  const isLocked = user.status === 'locked';

  return (
    <Box
      sx={{
        p: 2.5,
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
          {user.full_name || 'Chưa cập nhật tên'}
        </Typography>
        <Box
          component="span"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: '9999px',
            bgcolor: isLocked ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)',
            color: isLocked ? RED : GREEN,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          {isLocked ? 'Đã khóa' : 'Hoạt động'}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
      </Box>

      <Button variant="secondary" fullWidth onClick={onClick}>
        Xem chi tiết tài khoản
      </Button>
    </Box>
  );
};
