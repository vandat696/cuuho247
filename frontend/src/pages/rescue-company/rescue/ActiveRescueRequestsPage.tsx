import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  BuildOutlined as WrenchIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { rescueService } from '@/services/rescue.service';
import { ActiveRescueRequest } from '@/types/rescue.type';
import {
  CardContainer,
  CARD_RADIUS,
  formatAddress,
  formatTimeOnly,
  InfoRow,
  NAVY,
  PrimaryActionButton,
  RescueListScaffold,
} from './rescueCompanyShared';

interface ActiveRequestCardProps {
  request: ActiveRescueRequest;
  onViewDetail: () => void;
}

const ActiveRequestCard = ({ request, onViewDetail }: ActiveRequestCardProps) => (
  <CardContainer>
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
        Thông tin cứu hộ
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <InfoRow icon={<WrenchIcon />} label="Loại sự cố" value={request.title} />
        <InfoRow icon={<LocationIcon />} label="Vị trí" value={formatAddress(request.address)} />
        <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatTimeOnly(request.created_at)} />
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

    <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
  </CardContainer>
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
    <RescueListScaffold
      title="Nhiệm vụ đang thực hiện"
      totalLabel="nhiệm vụ"
      emptyMessage="Chưa có nhiệm vụ đang thực hiện"
      loading={loading}
      requests={requests}
      renderRequest={(request) => (
        <ActiveRequestCard
          key={request._id}
          request={request}
          onViewDetail={() => navigate(`/company/rescue/active/detail/${request._id}`)}
        />
      )}
    />
  );
}
