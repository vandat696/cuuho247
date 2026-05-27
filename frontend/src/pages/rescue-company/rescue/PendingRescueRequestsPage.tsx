import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { AccessTimeOutlined as ClockIcon, LocationOnOutlined as LocationIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import {
  CardContainer,
  formatDistance,
  formatTimeAgo,
  NAVY,
  PrimaryActionButton,
  RescueListScaffold,
} from '@/components/rescue-company/RescueCompanyRequestShared';
import { rescueService } from '@/services/rescue.service';
import { PendingRescueRequest } from '@/types/rescue.type';

interface RequestCardProps {
  request: PendingRescueRequest;
  onViewDetail: () => void;
}

const RequestCard = ({ request, onViewDetail }: RequestCardProps) => (
  <CardContainer>
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>{request.title}</Typography>
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

    <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
  </CardContainer>
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
    <RescueListScaffold
      title="Yêu cầu đang chờ"
      totalLabel="yêu cầu"
      emptyMessage="Chưa có yêu cầu đang chờ"
      loading={loading}
      requests={requests}
      renderRequest={(request) => (
        <RequestCard
          key={request._id}
          request={request}
          onViewDetail={() => navigate(`/company/rescue/pending/detail/${request._id}`)}
        />
      )}
    />
  );
}
