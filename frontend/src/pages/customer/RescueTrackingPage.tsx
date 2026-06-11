import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import toast from 'react-hot-toast';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { customerRescueService, CustomerRescueRequest } from '@/services/customer-rescue.service';
import { getSocket } from '@/utils/socket';
import { CancelRequestSheet } from '@/components/rescue-customer/CancelRequestSheet';

import { TrackingETASection } from '@/components/rescue-customer/TrackingETASection';
import { TrackingStatusStepper } from '@/components/rescue-customer/TrackingStatusStepper';
import { TrackingVehicleInfo } from '@/components/rescue-customer/TrackingVehicleInfo';
import { TrackingActionButtons } from '@/components/rescue-customer/TrackingActionButtons';

export default function RescueTrackingPage() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();

  const [request, setRequest] = useState<CustomerRescueRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingEta, setRemainingEta] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  useEffect(() => {
    if (!request) return;

    if (
      request.status === 'completed' ||
      request.status === 'cancelled' ||
      request.status === 'rejected' ||
      request.status === 'arrived'
    ) {
      setRemainingEta(null);
      return;
    }

    if (!request.eta_minutes) {
      setRemainingEta(null);
      return;
    }

    const baseTime = request.accepted_at || request.updated_at || request.created_at;
    if (!baseTime) {
      setRemainingEta(request.eta_minutes);
      return;
    }

    const calculateRemaining = () => {
      const targetTime = new Date(baseTime).getTime() + request.eta_minutes! * 60000;
      const now = Date.now();
      const diffMinutes = Math.max(0, Math.ceil((targetTime - now) / 60000));
      setRemainingEta(diffMinutes);
    };

    calculateRemaining();
    const intervalId = setInterval(calculateRemaining, 30000);
    return () => clearInterval(intervalId);
  }, [request]);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      try {
        const response = await customerRescueService.getMyRequests();
        const found = response.data.requests.find((r) => r._id === requestId);
        if (found) {
          setRequest(found);
          // Try to set initial vehicle location to customer's location as fallback,
          // or ideally the company's location if available in the API response.
          // For now, we will wait for Socket updates or use customer location.
        } else {
          toast.error('Không tìm thấy yêu cầu', { id: 'request-not-found-error' });
          navigate('/customer/home');
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, navigate]);

  useEffect(() => {
    if (!requestId || loading || !request) return;

    const socket = getSocket();

    socket.emit('join_tracking', { rescue_request_id: requestId });

    const handleStatusChanged = (data: { rescue_request_id: string; status: string }) => {
      if (data.rescue_request_id === requestId) {
        setRequest((prev) => {
          if (!prev) return prev;

          // Re-fetch to get full updated object with new timestamps
          customerRescueService.getMyRequests().then((response) => {
            const found = response.data.requests.find((r) => r._id === requestId);
            if (found) setRequest(found);
          });

          return { ...prev, status: data.status as any };
        });
      }
    };

    socket.on('status_changed', handleStatusChanged);

    return () => {
      socket.off('status_changed', handleStatusChanged);
    };
  }, [requestId, loading, request?._id]);

  const handleConfirmCancel = async (reason: string) => {
    if (!request) return;
    setCancelling(true);
    try {
      const response = await customerRescueService.cancelRequest(request._id, reason);
      if (response.status === 'success') {
        setRequest(response.data);
        toast.success('Đã hủy yêu cầu cứu hộ');
        setShowCancelSheet(false);
      } else {
        toast.error(response.message || 'Không thể hủy yêu cầu');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể hủy yêu cầu');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <AppHeader title="Theo dõi cứu hộ" onBack={() => navigate('/customer/home')} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 10 }}>
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  if (!request) return null;

  return (
    <MobileLayout>
      <AppHeader title="Theo dõi cứu hộ" onBack={() => navigate('/customer/home')} />

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', bgcolor: '#f4f5f7' }}>
        {remainingEta !== null && <TrackingETASection remainingEta={remainingEta} />}

        <Box sx={{ px: 2, pb: 4, position: 'relative', zIndex: 2 }}>
          <TrackingStatusStepper request={request} />

          {request.status && ['accepted', 'in_progress', 'arrived', 'completed'].includes(request.status) && (
            <TrackingVehicleInfo request={request} />
          )}

          <Box sx={{ mt: 2 }}>
            <TrackingActionButtons
              requestId={requestId!}
              status={request.status}
              onCancelClick={() => setShowCancelSheet(true)}
            />
          </Box>
        </Box>
      </Box>

      <CancelRequestSheet
        isOpen={showCancelSheet}
        isLoading={cancelling}
        onClose={() => !cancelling && setShowCancelSheet(false)}
        onConfirm={handleConfirmCancel}
      />
    </MobileLayout>
  );
}
