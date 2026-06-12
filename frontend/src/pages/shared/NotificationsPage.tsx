import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { NotificationCard, SharedNotificationData, NotificationKind } from '@/components/common/NotificationCard';
import { notificationService, NotificationData } from '@/services/notification.service';
import { formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import { NAVY, ORANGE } from '@/constants/colors';

const mapKind = (type: string): NotificationKind => {
  if (
    type === 'request_completed' ||
    type === 'review_submitted' ||
    type === 'company_approved' ||
    type === 'review_replied'
  ) {
    return 'success';
  }
  if (type === 'chat_message' || type === 'new_comment') {
    return 'message';
  }
  return 'warning';
};

const mapDetailPath = (notification: NotificationData, role: 'customer' | 'company'): string => {
  const requestId = notification.payload?.rescue_request_id;
  const postId = notification.payload?.post_id;

  if (role === 'customer') {
    switch (notification.type) {
      case 'request_created':
      case 'request_accepted':
      case 'request_rejected':
      case 'request_in_progress':
      case 'request_completed':
      case 'request_cancelled':
      case 'request_timeout':
      case 'eta_updated':
      case 'review_replied':
        return requestId ? `/customer/tracking/${requestId}` : '';
      case 'chat_message':
        return requestId ? `/chat/${requestId}` : '';
      case 'new_comment':
        return postId ? `/community/${postId}` : '';
      case 'content_removed':
      case 'review_submitted':
      default:
        return '';
    }
  } else {
    switch (notification.type) {
      case 'request_created':
        return requestId ? `/company/rescue/pending/${requestId}` : '';
      case 'request_accepted':
      case 'request_in_progress':
      case 'eta_updated':
        return requestId ? `/company/rescue/active/${requestId}` : '';
      case 'chat_message':
        return requestId ? `/chat/${requestId}` : '';
      case 'request_completed':
        return requestId ? `/company/rescue/completed/${requestId}` : '';
      case 'request_cancelled':
      case 'request_rejected':
      case 'request_timeout':
        return requestId ? `/company/rescue/canceled/${requestId}` : '';
      case 'company_document_requested':
        return '/company/profile/edit';
      case 'review_submitted':
        return requestId ? `/company/rescue/completed/${requestId}` : '/company/reviews';
      case 'new_comment':
        return postId ? `/community/${postId}` : '';
      case 'company_approved':
      case 'company_rejected':
      case 'content_removed':
      default:
        return '';
    }
  }
};

interface NotificationsPageProps {
  role: 'customer' | 'company';
}

export default function NotificationsPage({ role }: NotificationsPageProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getMyNotifications();
      if (response.status === 'success') {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error(`Error fetching ${role} notifications:`, error);
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  const markAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.status === 'success') {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        toast.success('Đã đánh dấu tất cả là đã đọc');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    const detailPath = mapDetailPath(notification, role);

    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification._id);
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, is_read: true } : n)));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    if (detailPath) {
      navigate(detailPath);
    }
  };

  const mappedNotifications: SharedNotificationData[] = useMemo(() => {
    return notifications.map((n) => ({
      id: n._id,
      title: n.title,
      body: n.body,
      timeAgo: formatTimeAgo(n.created_at),
      createdAt: new Date(n.created_at).getTime(),
      kind: mapKind(n.type),
      isRead: n.is_read,
      detailPath: mapDetailPath(n, role),
    }));
  }, [notifications, role]);

  const backFallback = role === 'customer' ? '/customer/home' : '/company/home';

  return (
    <MobileLayout>
      <AppHeader title="Thông báo" backFallback={backFallback} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY }}>
            {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Tất cả thông báo'}
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={markAllAsRead}
            disabled={notifications.length === 0 || unreadCount === 0}
            sx={{
              color: unreadCount === 0 ? '#9ca3af' : NAVY,
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              cursor: unreadCount === 0 ? 'default' : 'pointer',
              border: 0,
              background: 'transparent',
              p: 0,
              '&:hover': { color: unreadCount === 0 ? '#9ca3af' : ORANGE },
            }}
          >
            Đánh dấu đã đọc
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ fontSize: 14 }}>Chưa có thông báo nào</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {mappedNotifications.map((sharedNotif, index) => {
              const rawNotif = notifications[index];
              return (
                <NotificationCard
                  key={sharedNotif.id}
                  notification={sharedNotif}
                  onClick={() => handleNotificationClick(rawNotif)}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
