import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  ArticleOutlined as FileIcon,
  ErrorOutline as AlertIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutline as UserIcon,
  PhoneOutlined as PhoneIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { CanceledRescueRequestDetail } from '@/types/rescue.type';
import {
  DetailContentState,
  formatAddress,
  formatDateTime,
  InfoCard,
  InfoRow,
  RED,
  StatusBanner,
  VehiclePanel,
} from './rescueCompanyShared';

export default function CanceledRescueRequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<CanceledRescueRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (!requestId) {
        navigate('/company/rescue/canceled', { replace: true });
        return;
      }

      try {
        const response = await rescueService.getCompanyCanceledRequestDetail(requestId);
        if (response.status === 'success') {
          setRequest(response.data.request);
        }
      } catch (error) {
        console.error('Error fetching canceled rescue request detail:', error);
        toast.error('Không thể tải chi tiết nhiệm vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [navigate, requestId]);

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết cứu hộ" backFallback="/company/rescue/canceled" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <DetailContentState loading={loading} missingMessage="Không tìm thấy nhiệm vụ" hasData={Boolean(request)}>
          {request && (
            <>
              <StatusBanner label="Đã hủy" color={RED} background="#fef2f2" />

              <InfoCard title="Thông tin khách hàng">
                <InfoRow
                  icon={<UserIcon />}
                  label="Tên khách hàng"
                  value={request.customer.full_name || 'Khách hàng'}
                />
                <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={request.customer.phone || 'Chưa có số'} />
              </InfoCard>

              <InfoCard title="Thông tin sự cố">
                <InfoRow icon={<AlertIcon />} label="Loại sự cố" value={request.title} />
                <InfoRow icon={<FileIcon />} label="Mô tả" value={request.description || 'Chưa có mô tả'} />
                <InfoRow icon={<LocationIcon />} label="Vị trí" value={formatAddress(request.address)} />
                <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatDateTime(request.created_at)} />
              </InfoCard>

              <VehiclePanel vehicle={request.vehicle} />

              <InfoCard title="Thông tin hủy">
                <InfoRow icon={<ClockIcon />} label="Thời gian hủy" value={formatDateTime(request.cancelled_at)} />
                <InfoRow
                  icon={<FileIcon />}
                  label="Lý do hủy"
                  value={request.cancellation?.reason || 'Chưa có lý do'}
                />
              </InfoCard>
            </>
          )}
        </DetailContentState>
      </Box>
    </MobileLayout>
  );
}
