import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  ArticleOutlined as FileIcon,
  ErrorOutline as AlertIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutline as UserIcon,
  PhoneOutlined as PhoneIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { ActiveRescueRequestDetail } from '@/types/rescue.type';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
const BUTTON_RADIUS = '8px';

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
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

  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())} - ${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

const InfoCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box
    sx={{
      p: 2,
      mb: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
    }}
  >
    <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>{title}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>{children}</Box>
  </Box>
);

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25, color: NAVY, display: 'flex', '& svg': { fontSize: 20 } }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{label}</Typography>
      <Box sx={{ mt: 0.25, fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: '#111827' }}>{value}</Box>
    </Box>
  </Box>
);

export default function ActiveRescueRequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<ActiveRescueRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (!requestId) {
        navigate('/company/rescue/active', { replace: true });
        return;
      }

      try {
        const response = await rescueService.getCompanyActiveRequestDetail(requestId);
        if (response.status === 'success') {
          setRequest(response.data.request);
        }
      } catch (error) {
        console.error('Error fetching active rescue request detail:', error);
        toast.error('Không thể tải chi tiết nhiệm vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [navigate, requestId]);

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết cứu hộ" backFallback="/company/rescue/active" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : !request ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ fontSize: 14 }}>Không tìm thấy nhiệm vụ</Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                p: 2,
                mb: 2,
                border: `2px solid ${NAVY}`,
                borderRadius: CARD_RADIUS,
                bgcolor: 'rgba(27, 58, 93, 0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '9999px', bgcolor: NAVY }} />
                <Typography sx={{ fontSize: 16, fontWeight: 500, color: NAVY, lineHeight: 1.25 }}>
                  Đang thực hiện
                </Typography>
              </Box>
            </Box>

            <InfoCard title="Thông tin khách hàng">
              <InfoRow icon={<UserIcon />} label="Tên khách hàng" value={request.customer.full_name || 'Khách hàng'} />
              <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={request.customer.phone || 'Chưa có số'} />
            </InfoCard>

            <InfoCard title="Thông tin sự cố">
              <InfoRow icon={<AlertIcon />} label="Loại sự cố" value={`🔧 ${request.title}`} />
              <InfoRow icon={<FileIcon />} label="Mô tả" value={request.description || 'Chưa có mô tả'} />
              <InfoRow icon={<LocationIcon />} label="Vị trí" value={formatAddress(request.address)} />
              <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatRequestTime(request.created_at)} />
            </InfoCard>

            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: CARD_RADIUS,
                background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
                color: '#fff',
              }}
            >
              <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, lineHeight: 1.25 }}>Thông tin xe</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TruckIcon sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>{request.vehicle.vehicle_type}</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
                  {request.vehicle.plate_number}
                </Typography>
              </Box>
            </Box>

            <Box
              component="button"
              type="button"
              onClick={() => toast.success('Đã ghi nhận thao tác hoàn thành nhiệm vụ')}
              sx={{
                width: '100%',
                px: 3,
                py: 1.5,
                borderRadius: BUTTON_RADIUS,
                bgcolor: ORANGE,
                color: '#fff',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.5,
                boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.25)',
                transition: 'background 0.15s, transform 0.1s',
                '&:hover': { bgcolor: '#ff8533' },
                '&:active': { transform: 'scale(0.99)' },
              }}
            >
              Hoàn thành nhiệm vụ
            </Box>
          </>
        )}
      </Box>
    </MobileLayout>
  );
}
