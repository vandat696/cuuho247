import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  ChatBubbleOutlineRounded as MessageIcon,
  CheckCircleOutlineRounded as CheckIcon,
  ErrorOutlineRounded as AlertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
const CIRCLE_RADIUS = '9999px';

type NotificationKind = 'success' | 'message' | 'warning';

interface CompanyNotification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  kind: NotificationKind;
  isRead: boolean;
}

const initialNotifications: CompanyNotification[] = [
  {
    id: '1',
    title: 'Yêu cầu cứu hộ mới',
    body: 'Bạn có yêu cầu cứu hộ mới đang chờ xử lý',
    timeAgo: 'Vừa xong',
    kind: 'warning',
    isRead: false,
  },
  {
    id: '2',
    title: 'Cứu hộ hoàn thành',
    body: 'Yêu cầu cứu hộ #1234 đã hoàn thành thành công',
    timeAgo: '30 phút trước',
    kind: 'success',
    isRead: false,
  },
  {
    id: '3',
    title: 'Tin nhắn mới',
    body: 'Bạn có tin nhắn mới từ khách hàng',
    timeAgo: '2 giờ trước',
    kind: 'message',
    isRead: false,
  },
  {
    id: '4',
    title: 'Nhắc nhở thanh toán',
    body: 'Vui lòng kiểm tra thanh toán cho yêu cầu #1233',
    timeAgo: '5 giờ trước',
    kind: 'warning',
    isRead: true,
  },
  {
    id: '5',
    title: 'Đánh giá đã được gửi',
    body: 'Khách hàng đã gửi đánh giá dịch vụ của công ty',
    timeAgo: '1 ngày trước',
    kind: 'success',
    isRead: true,
  },
];

const iconByKind = {
  success: <CheckIcon sx={{ fontSize: 24, color: '#22c55e' }} />,
  message: <MessageIcon sx={{ fontSize: 24, color: '#3b82f6' }} />,
  warning: <AlertIcon sx={{ fontSize: 24, color: '#eab308' }} />,
};

const NotificationCard = ({ notification }: { notification: CompanyNotification }) => (
  <Box
    sx={{
      p: 2,
      border: '2px solid',
      borderColor: notification.isRead ? '#e5e7eb' : ORANGE,
      borderRadius: CARD_RADIUS,
      bgcolor: notification.isRead ? '#fff' : 'rgba(255, 107, 0, 0.05)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ flexShrink: 0 }}>{iconByKind[notification.kind]}</Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
          {notification.title}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: 14, color: '#374151', lineHeight: 1.35 }}>{notification.body}</Typography>
        <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{notification.timeAgo}</Typography>
      </Box>

      {!notification.isRead && (
        <Box sx={{ mt: 1, width: 8, height: 8, borderRadius: CIRCLE_RADIUS, bgcolor: ORANGE, flexShrink: 0 }} />
      )}
    </Box>
  </Box>
);

export default function CompanyNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  return (
    <MobileLayout>
      <AppHeader title="Thông báo" onBack={() => navigate('/company/home')} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Tất cả thông báo</Typography>
          <Box
            component="button"
            type="button"
            onClick={markAllAsRead}
            sx={{
              color: NAVY,
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              '&:hover': { color: ORANGE },
            }}
          >
            Đánh dấu đã đọc
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </Box>
      </Box>
    </MobileLayout>
  );
}
