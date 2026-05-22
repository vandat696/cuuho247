import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AccessTimeOutlined as ClockIcon, LocationOnOutlined as LocationIcon } from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { PendingRescueRequest } from '@/types/rescue.type';
import { toast } from 'react-hot-toast';

const NAVY = '#1B3A5D';
const CARD_RADIUS = '12px';
const BUTTON_RADIUS = '8px';

interface RequestCardProps {
  request: PendingRescueRequest;
  onViewDetail: () => void;
}

const formatDistance = (distanceKm: number | null) => {
  if (distanceKm === null || Number.isNaN(distanceKm)) return '-- km';
  return `${distanceKm.toFixed(1)} km`;
};

const formatTimeAgo = (dateValue?: string) => {
  if (!dateValue) return 'Vừa xong';

  const createdAt = new Date(dateValue).getTime();
  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  return `${Math.floor(diffHours / 24)} ngày trước`;
};

const RequestCard = ({ request, onViewDetail }: RequestCardProps) => (
  <Box
    sx={{
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
    }}
  >
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>🔧 {request.title}</Typography>
    </Box>

    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 2, color: '#4b5563' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LocationIcon sx={{ fontSize: 16 }} />
        <Typography sx={{ fontSize: 14, lineHeight: 1.25 }}>{formatDistance(request.distance_km)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ClockIcon sx={{ fontSize: 16 }} />
        <Typography sx={{ fontSize: 14, lineHeight: 1.25 }}>{formatTimeAgo(request.created_at)}</Typography>
      </Box>
    </Box>

    <Box
      component="button"
      type="button"
      onClick={onViewDetail}
      sx={{
        width: '100%',
        py: 1,
        borderRadius: BUTTON_RADIUS,
        bgcolor: NAVY,
        color: '#fff',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.5,
        transition: 'background 0.15s, transform 0.1s',
        '&:hover': { bgcolor: '#2a5082' },
        '&:active': { transform: 'scale(0.99)' },
      }}
    >
      Xem chi tiết
    </Box>
  </Box>
);

export default function PendingRescueRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PendingRescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await rescueService.getCompanyPendingRequests();
      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching pending rescue requests:', error);
      toast.error('Không thể tải yêu cầu đang chờ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Yêu cầu đang chờ" onBack={() => navigate('/company/home')} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>
          Tổng số: {requests.length} yêu cầu
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ fontSize: 14 }}>Chưa có yêu cầu đang chờ</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {requests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onViewDetail={() => navigate(`/company/rescue/pending/${request._id}`)}
              />
            ))}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
