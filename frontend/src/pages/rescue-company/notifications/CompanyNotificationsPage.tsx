import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  ChatBubbleOutlineRounded as MessageIcon,
  CheckCircleOutlineRounded as CheckIcon,
  ErrorOutlineRounded as AlertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import {
  ActiveRescueRequest,
  CanceledRescueRequest,
  CompletedRescueRequest,
  PendingRescueRequest,
} from '@/types/rescue.type';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
const CIRCLE_RADIUS = '9999px';
const READ_NOTIFICATION_IDS_KEY = 'companyReadNotificationIds';

type NotificationKind = 'success' | 'message' | 'warning';

interface CompanyNotification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  createdAt: number;
  kind: NotificationKind;
  isRead: boolean;
  detailPath: string;
}

const iconByKind = {
  success: <CheckIcon sx={{ fontSize: 24, color: '#22c55e' }} />,
  message: <MessageIcon sx={{ fontSize: 24, color: '#3b82f6' }} />,
  warning: <AlertIcon sx={{ fontSize: 24, color: '#eab308' }} />,
};

const getReadNotificationIds = () => {
  try {
    const savedIds = localStorage.getItem(READ_NOTIFICATION_IDS_KEY);
    return new Set<string>(savedIds ? JSON.parse(savedIds) : []);
  } catch {
    return new Set<string>();
  }
};

const saveReadNotificationIds = (ids: Set<string>) => {
  localStorage.setItem(READ_NOTIFICATION_IDS_KEY, JSON.stringify(Array.from(ids)));
};

const formatTimeAgo = (dateValue?: string) => {
  if (!dateValue) return 'Vừa xong';

  const createdAt = new Date(dateValue).getTime();
  if (Number.isNaN(createdAt)) return 'Vừa xong';

  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  return `${Math.floor(diffHours / 24)} ngày trước`;
};

const toTimestamp = (dateValue?: string) => {
  if (!dateValue) return 0;

  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const buildPendingNotification = (request: PendingRescueRequest, readIds: Set<string>): CompanyNotification => {
  const id = `pending-${request._id}`;

  return {
    id,
    title: 'Yêu cầu cứu hộ mới',
    body: `${request.title || 'Yêu cầu cứu hộ'} đang chờ xử lý${request.distance_km !== null ? `, cách ${request.distance_km.toFixed(1)} km` : ''}.`,
    timeAgo: formatTimeAgo(request.created_at),
    createdAt: toTimestamp(request.created_at),
    kind: 'warning',
    isRead: readIds.has(id),
    detailPath: `/company/rescue/pending/detail/${request._id}`,
  };
};

const buildActiveNotification = (request: ActiveRescueRequest, readIds: Set<string>): CompanyNotification => {
  const id = `active-${request._id}`;

  return {
    id,
    title: 'Yêu cầu đang thực hiện',
    body: `${request.title || 'Yêu cầu cứu hộ'} đã được nhận và đang trong quá trình xử lý.`,
    timeAgo: formatTimeAgo(request.accepted_at || request.created_at),
    createdAt: toTimestamp(request.accepted_at || request.created_at),
    kind: 'message',
    isRead: readIds.has(id),
    detailPath: `/company/rescue/active/detail/${request._id}`,
  };
};

const buildCompletedNotification = (request: CompletedRescueRequest, readIds: Set<string>): CompanyNotification => {
  const id = `completed-${request._id}`;

  return {
    id,
    title: 'Cứu hộ hoàn thành',
    body: `${request.title || 'Yêu cầu cứu hộ'} đã hoàn thành thành công.`,
    timeAgo: formatTimeAgo(request.completed_at || request.created_at),
    createdAt: toTimestamp(request.completed_at || request.created_at),
    kind: 'success',
    isRead: readIds.has(id),
    detailPath: `/company/rescue/completed/detail/${request._id}`,
  };
};

const buildCanceledNotification = (request: CanceledRescueRequest, readIds: Set<string>): CompanyNotification => {
  const id = `canceled-${request._id}`;
  const reason = request.cancellation?.reason ? ` Lý do: ${request.cancellation.reason}.` : '';

  return {
    id,
    title: 'Yêu cầu đã hủy',
    body: `${request.title || 'Yêu cầu cứu hộ'} đã bị hủy.${reason}`,
    timeAgo: formatTimeAgo(request.cancelled_at || request.created_at),
    createdAt: toTimestamp(request.cancelled_at || request.created_at),
    kind: 'warning',
    isRead: readIds.has(id),
    detailPath: `/company/rescue/canceled/detail/${request._id}`,
  };
};

const NotificationCard = ({ notification, onClick }: { notification: CompanyNotification; onClick: () => void }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      width: '100%',
      p: 2,
      border: '2px solid',
      borderColor: notification.isRead ? '#e5e7eb' : ORANGE,
      borderRadius: CARD_RADIUS,
      bgcolor: notification.isRead ? '#fff' : 'rgba(255, 107, 0, 0.05)',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
      '&:hover': { borderColor: notification.isRead ? '#cbd5e1' : ORANGE, bgcolor: '#fff7ed' },
      '&:active': { transform: 'scale(0.99)' },
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
  const [notifications, setNotifications] = useState<CompanyNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadNotificationIds());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const currentReadIds = getReadNotificationIds();
      setReadIds(currentReadIds);

      try {
        const [pendingResponse, activeResponse, completedResponse, canceledResponse] = await Promise.all([
          rescueService.getCompanyPendingRequests(),
          rescueService.getCompanyActiveRequests(),
          rescueService.getCompanyCompletedRequests(),
          rescueService.getCompanyCanceledRequests(),
        ]);

        const nextNotifications = [
          ...(pendingResponse.status === 'success'
            ? pendingResponse.data.requests.map((request) => buildPendingNotification(request, currentReadIds))
            : []),
          ...(activeResponse.status === 'success'
            ? activeResponse.data.requests.map((request) => buildActiveNotification(request, currentReadIds))
            : []),
          ...(completedResponse.status === 'success'
            ? completedResponse.data.requests.map((request) => buildCompletedNotification(request, currentReadIds))
            : []),
          ...(canceledResponse.status === 'success'
            ? canceledResponse.data.requests.map((request) => buildCanceledNotification(request, currentReadIds))
            : []),
        ].sort((a, b) => b.createdAt - a.createdAt);

        setNotifications(nextNotifications);
      } catch (error) {
        console.error('Error fetching company notifications:', error);
        toast.error('Không thể tải thông báo');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const markAllAsRead = () => {
    const nextReadIds = new Set([...readIds, ...notifications.map((notification) => notification.id)]);
    saveReadNotificationIds(nextReadIds);
    setReadIds(nextReadIds);
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const openNotification = (notification: CompanyNotification) => {
    const nextReadIds = new Set(readIds);
    nextReadIds.add(notification.id);
    saveReadNotificationIds(nextReadIds);
    setReadIds(nextReadIds);
    setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)));
    navigate(notification.detailPath);
  };

  return (
    <MobileLayout>
      <AppHeader title="Thông báo" backFallback="/company/home" />

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
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => openNotification(notification)}
              />
            ))}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
