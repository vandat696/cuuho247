import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { NotificationCard, CompanyNotificationData } from '@/components/rescue-company/NotificationCard';
import { companyRescueService } from '@/services/company-rescue.service';
import { formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import {
  ActiveRescueRequest,
  CanceledRescueRequest,
  CompletedRescueRequest,
  PendingRescueRequest,
} from '@/types/rescue.type';
import { NAVY, ORANGE } from '@/constants/colors';

const READ_NOTIFICATION_IDS_KEY = 'companyReadNotificationIds';

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

const toTimestamp = (dateValue?: string) => {
  if (!dateValue) return 0;
  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const buildPendingNotification = (request: PendingRescueRequest, readIds: Set<string>): CompanyNotificationData => {
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

const buildActiveNotification = (request: ActiveRescueRequest, readIds: Set<string>): CompanyNotificationData => {
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

const buildCompletedNotification = (request: CompletedRescueRequest, readIds: Set<string>): CompanyNotificationData => {
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

const buildCanceledNotification = (request: CanceledRescueRequest, readIds: Set<string>): CompanyNotificationData => {
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

export default function CompanyNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<CompanyNotificationData[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadNotificationIds());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const currentReadIds = getReadNotificationIds();
      setReadIds(currentReadIds);

      try {
        const [pendingResponse, activeResponse, completedResponse, canceledResponse] = await Promise.all([
          companyRescueService.getCompanyPendingRequests(),
          companyRescueService.getCompanyActiveRequests(),
          companyRescueService.getCompanyCompletedRequests(),
          companyRescueService.getCompanyCanceledRequests(),
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

  const openNotification = (notification: CompanyNotificationData) => {
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
