import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  BuildOutlined as WrenchIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { ActiveRescueRequest } from '@/types/rescue.type';

const NAVY = '#1B3A5D';
const CARD_RADIUS = '12px';
const BUTTON_RADIUS = '8px';

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

interface ActiveRequestCardProps {
  request: ActiveRescueRequest;
  onViewDetail: () => void;
}

const formatAddress = (address?: Record<string, unknown>) => {
  if (!address) return 'Chưa có địa chỉ';

  const parts = ['detail', 'ward', 'district', 'province']
    .map((key) => address[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return parts.length > 0 ? parts.join(', ') : 'Chưa có địa chỉ';
};

const formatRequestTime = (dateValue?: string) => {
  if (!dateValue) return 'Chưa có thời gian';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Chưa có thời gian';

  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25, color: NAVY, display: 'flex', '& svg': { fontSize: 20 } }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{label}</Typography>
      <Typography sx={{ mt: 0.25, fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: '#111827' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const ActiveRequestCard = ({ request, onViewDetail }: ActiveRequestCardProps) => (
  <Box
    sx={{
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
    }}
  >
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
        Thông tin cứu hộ
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <InfoRow icon={<WrenchIcon />} label="Loại sự cố" value={request.title} />
        <InfoRow icon={<LocationIcon />} label="Vị trí" value={formatAddress(request.address)} />
        <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatRequestTime(request.created_at)} />
      </Box>
    </Box>

    <Box
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: CARD_RADIUS,
        background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
        color: '#fff',
      }}
    >
      <Typography sx={{ mb: 1, fontSize: 16, fontWeight: 800, lineHeight: 1.25 }}>Thông tin xe</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TruckIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>{request.vehicle.vehicle_type}</Typography>
        </Box>
        <Typography sx={{ pl: 3.5, fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
          {request.vehicle.plate_number}
        </Typography>
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

export default function ActiveRescueRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ActiveRescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    try {
      const response = await rescueService.getCompanyActiveRequests();
      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching active rescue requests:', error);
      toast.error('Không thể tải nhiệm vụ đang thực hiện');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Nhiệm vụ đang thực hiện" backFallback="/company/home" />

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
            <Typography sx={{ fontSize: 14 }}>Chưa có nhiệm vụ đang thực hiện</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {requests.map((request) => (
              <ActiveRequestCard
                key={request._id}
                request={request}
                onViewDetail={() => navigate(`/company/rescue/active/detail/${request._id}`)}
              />
            ))}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
