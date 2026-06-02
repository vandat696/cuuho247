import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AccessTimeOutlined,
  GroupsOutlined,
  HistoryOutlined,
  LocationOnOutlined,
  NotificationsNoneRounded,
  PersonOutlineOutlined,
  PhoneOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';

import { MobileLayout } from '@/components/layout/MobileLayout';
import {
  CustomerRescueRequest,
  CustomerRescueRequestStatus,
  rescueRequestService,
} from '@/services/rescueRequestCustomer.service';
import { getSocket } from '@/utils/socket';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
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

function CustomerHeader() {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: NAVY,
        color: '#fff',
        px: 2,
        py: 2,
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
        <SecurityOutlined sx={{ fontSize: 24, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.25 }} noWrap>
          Cứu hộ 247
        </Typography>
      </Box>

      <IconButton aria-label="Thông báo" size="small" sx={{ p: 1, color: '#fff' }}>
        <NotificationsNoneRounded sx={{ fontSize: 24 }} />
      </IconButton>
    </Box>
  );
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="contained"
      fullWidth
      onClick={onClick}
      sx={{
        minHeight: 48,
        borderRadius: '8px',
        bgcolor: ORANGE,
        color: '#fff',
        fontSize: 16,
        fontWeight: 700,
        boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.28)',
        '&:hover': { bgcolor: '#ff8533', boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.34)' },
      }}
    >
      {children}
    </Button>
  );
}

function RescueInfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
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

function QuickAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        minHeight: 104,
        p: 2,
        bgcolor: '#fff',
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: NAVY,
        transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
        '&:hover': { bgcolor: '#F5F7FA', borderColor: '#d1d5db' },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#374151', lineHeight: 1.25 }}>{label}</Typography>
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

const formatTime = (dateValue?: string) => {
  if (!dateValue) return 'Chưa rõ thời gian';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Chưa rõ thời gian';

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

function RequestSummaryCard({ request, onClick }: { request: CustomerRescueRequest; onClick?: () => void }) {
  return (
    <Box
      component={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      sx={{
        width: '100%',
        p: 2,
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        bgcolor: '#fff',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        '&:active': onClick ? { transform: 'scale(0.98)' } : {},
      }}
    >
      <Typography sx={{ mb: 0.75, fontSize: 15, fontWeight: 800, color: NAVY, lineHeight: 1.25 }} noWrap>
        {request.company.company_name || 'Chưa có thông tin công ty'}
      </Typography>
      <Typography sx={{ mb: 0.75, fontSize: 13, color: '#4b5563', lineHeight: 1.35 }} noWrap>
        {request.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>
          {formatTime(request.created_at)}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: ORANGE, lineHeight: 1.25 }}>
          {request.status ? statusTextByValue[request.status] : 'Đang xử lý'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CustomerRescueRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    fetchMyRequests();

    const socket = getSocket();
    const handleStatusChanged = () => {
      // Refetch để cập nhật trạng thái mới nhất
      fetchMyRequests();
    };
    socket.on('status_changed', handleStatusChanged);

    return () => {
      socket.off('status_changed', handleStatusChanged);
    };
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await rescueRequestService.getMyRequests();
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
      <CustomerHeader />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', px: 3, py: 3 }}>
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
                borderRadius: '9999px',
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
                  icon={<LocationOnOutlined sx={{ fontSize: 18 }} />}
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

              <PrimaryButton onClick={() => navigate('/customer/tracking/' + activeRequest._id)}>
                Theo dõi cứu hộ
              </PrimaryButton>
            </>
          ) : (
            <Typography sx={{ fontSize: 14, color: '#374151', lineHeight: 1.45 }}>
              Bạn chưa có yêu cầu cứu hộ nào đang xử lý.
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <PrimaryButton
            onClick={() => {
              if (activeRequest) {
                toast.error('Bạn đang có một yêu cầu cứu hộ đang diễn ra. Không thể gửi thêm yêu cầu mới!');
                return;
              }
              navigate('/rescue/request');
            }}
          >
            <PhoneOutlined sx={{ mr: 1, fontSize: 22 }} />
            Gửi yêu cầu cứu hộ
          </PrimaryButton>
        </Box>

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

        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
          <QuickAction
            icon={<PersonOutlineOutlined sx={{ fontSize: 34 }} />}
            label="Hồ sơ"
            onClick={() => navigate('/customer/profile')}
          />
          <QuickAction
            icon={<HistoryOutlined sx={{ fontSize: 34 }} />}
            label="Lịch sử"
            onClick={() => navigate('/customer/history')}
          />
          <QuickAction
            icon={<GroupsOutlined sx={{ fontSize: 34 }} />}
            label="Cộng đồng"
            onClick={() => navigate('/customer/community')}
          />
        </Box>

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
