import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { CancelRequestSheet } from '@/components/rescue-customer/CancelRequestSheet';
import { CustomerRescueRequest, customerRescueService } from '@/services/customer-rescue.service';
import { CustomerHistoryCard } from '@/components/rescue-customer/CustomerHistoryCard';
import { NAVY, ORANGE } from '@/constants/colors';

const getRequestTimestamp = (request: CustomerRescueRequest) => {
  const value = request.updated_at || request.created_at;
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

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
      const response = await customerRescueService.getMyRequests();
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
      const response = await customerRescueService.cancelRequest(selectedRequest._id, reason);
      if (response.status === 'success') {
        setRequests((current) =>
          current.map((request) => (request._id === selectedRequest._id ? response.data : request))
        );
        toast.success('Đã hủy yêu cầu cứu hộ');
        setSelectedRequest(null);
      } else {
        console.error('Cancellation failed:', response.message);
      }
    } catch (error: any) {
      console.error('Error cancelling request:', error);
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
              <CustomerHistoryCard
                key={request._id}
                request={request}
                onCancel={handleOpenCancel}
                onClick={() => navigate(`/customer/tracking/${request._id}`)}
              />
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
