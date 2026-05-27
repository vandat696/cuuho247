import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  ArticleOutlined as FileIcon,
  ErrorOutline as AlertIcon,
  LocationOnOutlined as LocationIcon,
  PaidOutlined as PaymentIcon,
  PersonOutline as UserIcon,
  PhoneOutlined as PhoneIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { CompletedRescueRequestDetail } from '@/types/rescue.type';
import {
  CARD_RADIUS,
  DetailContentState,
  formatAddress,
  formatCurrency,
  formatDateTime,
  GREEN,
  InfoCard,
  InfoRow,
  NAVY,
  paymentMethodLabel,
  StatusBanner,
  VehiclePanel,
} from './rescueCompanyShared';

export default function CompletedRescueRequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<CompletedRescueRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (!requestId) {
        navigate('/company/rescue/completed', { replace: true });
        return;
      }

      try {
        const response = await rescueService.getCompanyCompletedRequestDetail(requestId);
        if (response.status === 'success') {
          setRequest(response.data.request);
        }
      } catch (error) {
        console.error('Error fetching completed rescue request detail:', error);
        toast.error('Không thể tải chi tiết nhiệm vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [navigate, requestId]);

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết cứu hộ" backFallback="/company/rescue/completed" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <DetailContentState loading={loading} missingMessage="Không tìm thấy nhiệm vụ" hasData={Boolean(request)}>
          {request && (
            <>
              <StatusBanner label="Hoàn thành" color={GREEN} background="#f0fdf4" />

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

              <InfoCard title="Thanh toán">
                <InfoRow
                  icon={<PaymentIcon />}
                  label="Số tiền thực tế"
                  value={formatCurrency(request.payment?.amount)}
                />
                <InfoRow
                  icon={<PaymentIcon />}
                  label="Phương thức"
                  value={
                    request.payment?.method
                      ? paymentMethodLabel[request.payment.method] || request.payment.method
                      : 'Chưa có'
                  }
                />
                <InfoRow
                  icon={<ClockIcon />}
                  label="Thời gian thanh toán"
                  value={formatDateTime(request.payment?.paid_at)}
                />
              </InfoCard>

              <Box
                sx={{
                  p: 2,
                  border: '2px solid #e5e7eb',
                  borderRadius: CARD_RADIUS,
                  bgcolor: '#fff',
                }}
              >
                <Typography sx={{ mb: 1, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
                  Thời gian hoàn thành
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#374151', lineHeight: 1.35 }}>
                  {formatDateTime(request.completed_at)}
                </Typography>
              </Box>
            </>
          )}
        </DetailContentState>
      </Box>
    </MobileLayout>
  );
}
