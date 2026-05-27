import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { rescueService } from '@/services/rescue.service';
import { CanceledRescueRequest } from '@/types/rescue.type';
import {
  CardContainer,
  formatAddress,
  formatDateTime,
  MetaRow,
  NAVY,
  PrimaryActionButton,
  RED,
  RescueListScaffold,
} from './rescueCompanyShared';

interface CanceledRequestCardProps {
  request: CanceledRescueRequest;
  onViewDetail: () => void;
}

const CanceledRequestCard = ({ request, onViewDetail }: CanceledRequestCardProps) => (
  <CardContainer>
    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
      <Typography sx={{ minWidth: 0, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
        {request.title}
      </Typography>
      <Box
        component="span"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: '9999px',
          bgcolor: '#fef2f2',
          color: RED,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Đã hủy
      </Box>
    </Box>

    <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <MetaRow icon={<TruckIcon />} value={request.vehicle.plate_number} />
      <MetaRow icon={<LocationIcon />} value={formatAddress(request.address)} />
      <MetaRow icon={<ClockIcon />} value={formatDateTime(request.cancelled_at || request.created_at)} />
    </Box>

    <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
  </CardContainer>
);

export default function CanceledRescueRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CanceledRescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCanceledRequests();
  }, []);

  const fetchCanceledRequests = async () => {
    try {
      const response = await rescueService.getCompanyCanceledRequests();
      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching canceled rescue requests:', error);
      toast.error('Không thể tải nhiệm vụ đã hủy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RescueListScaffold
      title="Đã hủy"
      totalLabel="nhiệm vụ"
      emptyMessage="Chưa có nhiệm vụ đã hủy"
      loading={loading}
      requests={requests}
      renderRequest={(request) => (
        <CanceledRequestCard
          key={request._id}
          request={request}
          onViewDetail={() => navigate(`/company/rescue/canceled/detail/${request._id}`)}
        />
      )}
    />
  );
}
