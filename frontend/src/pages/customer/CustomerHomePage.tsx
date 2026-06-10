import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AccessTimeOutlined,
  GroupsOutlined,
  HistoryOutlined,
  NotificationsNoneRounded,
  PersonOutlineOutlined,
  PhoneOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Typography, Badge } from '@mui/material';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { RequestSummaryCard } from '@/components/customer/RequestSummaryCard';
import { QuickActionButton } from '@/components/customer/QuickActionButton';
import {
  CustomerRescueRequest,
  CustomerRescueRequestStatus,
  customerRescueService,
} from '@/services/customer-rescue.service';
import { getSocket } from '@/utils/socket';
import { notificationService } from '@/services/notification.service';
import { NAVY, ORANGE, CARD_RADIUS, CIRCLE_RADIUS } from '@/constants/colors';
const ACTIVE_STATUSES: CustomerRescueRequestStatus[] = ['pending', 'accepted', 'in_progress', 'arrived'];

const statusTextByValue: Record<CustomerRescueRequestStatus, string> = {
  pending: 'Đang chờ công ty xác nhận',
  accepted: 'Công ty đã nhận yêu cầu',
  in_progress: 'Đội cứu hộ đang di chuyển',
  arrived: 'Xe đã đến nơi',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
  rejected: 'Bị từ chối',
  timeout: 'Hết thời gian phản hồi',
};

function RescueInfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 18, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{label}</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: accent ? ORANGE : NAVY, lineHeight: 1.35 }} noWrap>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

const getRequestTimestamp = (request: CustomerRescueRequest) => {
  const value = request.updated_at || request.created_at;
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getEtaText = (etaMinutes?: number) => {
  if (!etaMinutes) return 'Chưa có thời gian dự kiến';
  return `~${etaMinutes} phút`;
};

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CustomerRescueRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getMyNotifications();
      if (response.status === 'success') {
        const count = response.data.notifications.filter((n) => !n.is_read).length;
        setUnreadNotificationsCount(count);
      }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    fetchUnreadCount();

    const socket = getSocket();
    const handleStatusChanged = () => {
      // Refetch để cập nhật trạng thái mới nhất
      fetchMyRequests();
    };

    const handleNewNotification = () => {
      fetchUnreadCount();
    };

    socket.on('status_changed', handleStatusChanged);
    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('status_changed', handleStatusChanged);
      socket.off('new_notification', handleNewNotification);
    };
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await customerRescueService.getMyRequests();
      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching customer rescue requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const activeRequest = useMemo(() => {
    return requests
      .filter((request) => request.status && ACTIVE_STATUSES.includes(request.status))
      .sort((a, b) => getRequestTimestamp(b) - getRequestTimestamp(a))[0];
  }, [requests]);

  const recentRequests = useMemo(() => {
    return [...requests].sort((a, b) => getRequestTimestamp(b) - getRequestTimestamp(a)).slice(0, 3);
  }, [requests]);

  const userName = localStorage.getItem('accountName') || 'Khách hàng';

  return (
    <MobileLayout>
      <AppHeader
        title="Cứu hộ 247"
        showBack={false}
        logoIcon={<SecurityOutlined sx={{ fontSize: 24 }} />}
        rightSlot={
          <IconButton
            aria-label="Thông báo"
            size="small"
            sx={{ p: 1, color: '#fff' }}
            onClick={() => navigate('/customer/notifications')}
          >
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsNoneRounded sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>
        }
      />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', px: 3, py: 3 }}>
        {/* User greeting card */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: CARD_RADIUS,
            background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
            color: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: CIRCLE_RADIUS,
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PersonOutlineOutlined sx={{ fontSize: 34 }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.25 }} noWrap>
              {userName}
            </Typography>
          </Box>
        </Box>

        {/* Active rescue section */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: CARD_RADIUS,
            bgcolor: 'rgba(255, 107, 0, 0.1)',
            border: `2px solid ${ORANGE}`,
          }}
        >
          <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: ORANGE }}>Cứu hộ đang thực hiện</Typography>

          {loadingRequests ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : activeRequest ? (
            <>
              <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <RescueInfoRow
                  icon={<SecurityOutlined sx={{ fontSize: 18 }} />}
                  label="Trạng thái hiện tại"
                  value={activeRequest.status ? statusTextByValue[activeRequest.status] : 'Đang xử lý'}
                />
                <RescueInfoRow
                  icon={<SecurityOutlined sx={{ fontSize: 18 }} />}
                  label="Công ty cứu hộ"
                  value={activeRequest.company.company_name || 'Chưa có thông tin công ty'}
                />
                <RescueInfoRow
                  icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
                  label="Thời gian dự kiến đến"
                  value={getEtaText(activeRequest.eta_minutes)}
                  accent
                />
              </Box>

              <Box
                component="button"
                type="button"
                onClick={() => navigate('/customer/tracking/' + activeRequest._id)}
                sx={{
                  width: '100%',
                  minHeight: 48,
                  borderRadius: '8px',
                  bgcolor: ORANGE,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.28)',
                  '&:hover': { bgcolor: '#ff8533' },
                }}
              >
                Theo dõi cứu hộ
              </Box>
            </>
          ) : (
            <Typography sx={{ fontSize: 14, color: '#374151', lineHeight: 1.45 }}>
              Bạn chưa có yêu cầu cứu hộ nào đang xử lý.
            </Typography>
          )}
        </Box>

        {/* CTA button */}
        <Box
          component="button"
          type="button"
          onClick={() => {
            if (activeRequest) {
              toast.error('Bạn đang có một yêu cầu cứu hộ đang diễn ra. Không thể gửi thêm yêu cầu mới!');
              return;
            }
            navigate('/rescue/request');
          }}
          sx={{
            width: '100%',
            minHeight: 48,
            borderRadius: '8px',
            bgcolor: ORANGE,
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.28)',
            '&:hover': { bgcolor: '#ff8533' },
            mb: 3,
          }}
        >
          <PhoneOutlined sx={{ fontSize: 22 }} />
          Gửi yêu cầu cứu hộ
        </Box>

        {/* Recent requests */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Yêu cầu đã gửi gần đây</Typography>
            {requests.length > 0 && (
              <Box
                component="button"
                type="button"
                onClick={() => navigate('/customer/history')}
                sx={{ color: ORANGE, fontSize: 13, fontWeight: 700 }}
              >
                Xem tất cả
              </Box>
            )}
          </Box>

          {loadingRequests ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : recentRequests.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {recentRequests.map((request) => (
                <RequestSummaryCard
                  key={request._id}
                  request={request}
                  onClick={() => navigate(`/customer/tracking/${request._id}`)}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 2, borderRadius: CARD_RADIUS, bgcolor: '#f9fafb', border: '1px dashed #d1d5db' }}>
              <Typography sx={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                Bạn chưa gửi yêu cầu cứu hộ nào.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Quick actions */}
        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
          <QuickActionButton
            icon={<PersonOutlineOutlined sx={{ fontSize: 34 }} />}
            label="Hồ sơ"
            onClick={() => navigate('/customer/profile')}
          />
          <QuickActionButton
            icon={<HistoryOutlined sx={{ fontSize: 34 }} />}
            label="Lịch sử"
            onClick={() => navigate('/customer/history')}
          />
          <QuickActionButton
            icon={<GroupsOutlined sx={{ fontSize: 34 }} />}
            label="Cộng đồng"
            onClick={() => navigate('/community')}
          />
        </Box>

        {/* Tips section */}
        <Box sx={{ p: 2, borderRadius: CARD_RADIUS, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <Typography sx={{ mb: 1, fontSize: 16, fontWeight: 800, color: NAVY }}>Mẹo hữu ích</Typography>
          <Typography sx={{ fontSize: 14, color: '#374151', lineHeight: 1.45 }}>
            Hãy kiểm tra lốp xe và mức dầu thường xuyên để tránh những sự cố không mong muốn trên đường.
          </Typography>
        </Box>
      </Box>
    </MobileLayout>
  );
}
