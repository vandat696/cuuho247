import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { CompletedRescueRequest } from '@/types/rescue.type';

const NAVY = '#1B3A5D';
const CARD_RADIUS = '12px';
const BUTTON_RADIUS = '8px';

interface MetaRowProps {
  icon: ReactNode;
  value: ReactNode;
}

interface CompletedRequestCardProps {
  request: CompletedRescueRequest;
  onViewDetail: () => void;
}

const formatAddress = (address?: Record<string, unknown>) => {
  if (!address) return 'Chưa có địa chỉ';

  const parts = ['detail', 'ward', 'district', 'province']
    .map((key) => address[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return parts.length > 0 ? parts.join(', ') : 'Chưa có địa chỉ';
};

const formatDateTime = (dateValue?: string) => {
  if (!dateValue) return 'Chưa có thời gian';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Chưa có thời gian';

  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())} - ${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

const MetaRow = ({ icon, value }: MetaRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25, color: '#4b5563', display: 'flex', '& svg': { fontSize: 16 } }}>{icon}</Box>
    <Typography sx={{ minWidth: 0, fontSize: 14, color: '#374151', lineHeight: 1.35 }}>{value}</Typography>
  </Box>
);

const CompletedRequestCard = ({ request, onViewDetail }: CompletedRequestCardProps) => (
  <Box
    sx={{
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
    }}
  >
    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
      <Typography sx={{ minWidth: 0, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
        🔧 {request.title}
      </Typography>
      <Box
        component="span"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: '9999px',
          bgcolor: '#f0fdf4',
          color: '#16a34a',
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Hoàn thành
      </Box>
    </Box>

    <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <MetaRow icon={<TruckIcon />} value={request.vehicle.plate_number} />
      <MetaRow icon={<LocationIcon />} value={formatAddress(request.address)} />
      <MetaRow icon={<ClockIcon />} value={formatDateTime(request.completed_at || request.created_at)} />
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

export default function CompletedRescueRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CompletedRescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const fetchCompletedRequests = async () => {
    try {
      const response = await rescueService.getCompanyCompletedRequests();
      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching completed rescue requests:', error);
      toast.error('Không thể tải nhiệm vụ đã hoàn thành');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Đã hoàn thành" onBack={() => navigate('/company/home')} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>
          Tổng số: {requests.length} nhiệm vụ
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ fontSize: 14 }}>Chưa có nhiệm vụ đã hoàn thành</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {requests.map((request) => (
              <CompletedRequestCard
                key={request._id}
                request={request}
                onViewDetail={() => navigate(`/company/rescue/completed/detail/${request._id}`)}
              />
            ))}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
