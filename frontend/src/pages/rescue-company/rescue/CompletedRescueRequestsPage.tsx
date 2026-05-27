import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import {
  CardContainer,
  formatAddress,
  formatDateTime,
  GREEN,
  MetaRow,
  NAVY,
  PrimaryActionButton,
  RescueListScaffold,
} from '@/components/rescue-company/RescueCompanyRequestShared';
import { rescueService } from '@/services/rescue.service';
import { CompletedRescueRequest } from '@/types/rescue.type';

interface CompletedRequestCardProps {
  request: CompletedRescueRequest;
  onViewDetail: () => void;
}

const CompletedRequestCard = ({ request, onViewDetail }: CompletedRequestCardProps) => (
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
          bgcolor: '#f0fdf4',
          color: GREEN,
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

    <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
  </CardContainer>
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
    <RescueListScaffold
      title="Đã hoàn thành"
      totalLabel="nhiệm vụ"
      emptyMessage="Chưa có nhiệm vụ đã hoàn thành"
      loading={loading}
      requests={requests}
      renderRequest={(request) => (
        <CompletedRequestCard
          key={request._id}
          request={request}
          onViewDetail={() => navigate(`/company/rescue/completed/detail/${request._id}`)}
        />
      )}
    />
  );
}
