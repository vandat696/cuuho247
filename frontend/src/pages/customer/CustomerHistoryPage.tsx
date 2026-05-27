import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessTimeOutlined, SecurityOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { CancelButton } from '@/components/rescue/CancelButton';
import { CancelRequestSheet } from '@/components/rescue/CancelRequestSheet';
import {
  CustomerRescueRequest,
  CustomerRescueRequestStatus,
  rescueRequestService,
} from '@/services/rescueRequest.service';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';

const statusTextByValue: Record<CustomerRescueRequestStatus, string> = {
  pending: 'Đang chờ công ty xác nhận',
  accepted: 'Công ty đã nhận yêu cầu',
  in_progress: 'Đội cứu hộ đang di chuyển',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
  rejected: 'Bị từ chối',
  timeout: 'Hết thời gian phản hồi',
};

const cancellableStatuses: CustomerRescueRequestStatus[] = ['pending'];

const getRequestTimestamp = (request: CustomerRescueRequest) => {
  const value = request.updated_at || request.created_at;
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
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

function HistoryCard({
  request,
  onCancel,
}: {
  request: CustomerRescueRequest;
  onCancel: (request: CustomerRescueRequest) => void;
}) {
  const canCancel = request.status ? cancellableStatuses.includes(request.status) : false;

  return (
    <Box sx={{ p: 2, border: '2px solid #e5e7eb', borderRadius: CARD_RADIUS, bgcolor: '#fff' }}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }} noWrap>
            {request.company.company_name || 'Chưa có thông tin công ty'}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: '#4b5563', lineHeight: 1.35 }}>
            {request.description}
          </Typography>
        </Box>
        <Typography sx={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: ORANGE, lineHeight: 1.25 }}>
          {request.status ? statusTextByValue[request.status] : 'Đang xử lý'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#6b7280' }}>
          <AccessTimeOutlined sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, lineHeight: 1.25 }}>{formatTime(request.created_at)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#6b7280' }}>
          <SecurityOutlined sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, lineHeight: 1.25 }}>
            Dự kiến đến: {request.eta_minutes ? `~${request.eta_minutes} phút` : 'Chưa có thời gian dự kiến'}
          </Typography>
        </Box>
      </Box>

      {canCancel && (
        <Box sx={{ mt: 1.5 }}>
          <CancelButton status={request.status!} onCancel={() => onCancel(request)} />
        </Box>
      )}
    </Box>
  );
}

export default function CustomerHistoryPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CustomerRescueRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CustomerRescueRequest | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await rescueRequestService.getMyRequests();
      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching customer rescue history:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => getRequestTimestamp(b) - getRequestTimestamp(a));
  }, [requests]);

  const handleOpenCancel = (request: CustomerRescueRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseCancel = () => {
    if (!cancelling) {
      setSelectedRequest(null);
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedRequest) return;

    setCancelling(true);
    try {
      const response = await rescueRequestService.cancelRequest(selectedRequest._id, reason);
      if (response.status === 'success') {
        setRequests((current) =>
          current.map((request) => (request._id === selectedRequest._id ? response.data : request))
        );
        toast.success('Đã hủy yêu cầu cứu hộ');
        setSelectedRequest(null);
      } else {
        toast.error(response.message || 'Không thể hủy yêu cầu');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể hủy yêu cầu');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Lịch sử cứu hộ" backFallback="/customer/home" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>
          Tổng số: {sortedRequests.length} yêu cầu
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : sortedRequests.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ mb: 2, fontSize: 14 }}>Bạn chưa gửi yêu cầu cứu hộ nào.</Typography>
            <Box
              component="button"
              type="button"
              onClick={() => navigate('/rescue/request')}
              sx={{
                px: 3,
                py: 1.25,
                borderRadius: '8px',
                bgcolor: ORANGE,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Gửi yêu cầu cứu hộ
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {sortedRequests.map((request) => (
              <HistoryCard key={request._id} request={request} onCancel={handleOpenCancel} />
            ))}
          </Box>
        )}
      </Box>

      <CancelRequestSheet
        isOpen={Boolean(selectedRequest)}
        isLoading={cancelling}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
      />
    </MobileLayout>
  );
}
