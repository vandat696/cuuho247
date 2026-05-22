import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  DescriptionOutlined as FileIcon,
  ErrorOutline as AlertIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutline as UserIcon,
  PhoneOutlined as PhoneIcon,
  PhotoCameraOutlined as CameraIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { PendingRescueRequestDetail } from '@/types/rescue.type';

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

  const orderedParts = ['detail', 'ward', 'district', 'province']
    .map((key) => address[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return orderedParts.length > 0 ? orderedParts.join(', ') : 'Chưa có địa chỉ';
};

const formatDistance = (distanceKm: number | null) => {
  if (distanceKm === null || Number.isNaN(distanceKm)) return '-- km';
  return `${distanceKm.toFixed(1)} km`;
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

export default function PendingRescueRequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<PendingRescueRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (!requestId) {
        navigate('/company/rescue/pending', { replace: true });
        return;
      }

      try {
        const response = await rescueService.getCompanyPendingRequestDetail(requestId);
        if (response.status === 'success') {
          setRequest(response.data.request);
        }
      } catch (error) {
        console.error('Error fetching pending rescue request detail:', error);
        toast.error('Không thể tải chi tiết yêu cầu');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [navigate, requestId]);

  const photoSlots = request?.incident_photos.length ? request.incident_photos : ['', ''];

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết yêu cầu" onBack={() => navigate('/company/rescue/pending')} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : !request ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ fontSize: 14 }}>Không tìm thấy yêu cầu</Typography>
          </Box>
        ) : (
          <>
            <InfoCard title="Thông tin khách hàng">
              <InfoRow icon={<UserIcon />} label="Tên khách hàng" value={request.customer.full_name || 'Khách hàng'} />
              <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={request.customer.phone || 'Chưa có số'} />
            </InfoCard>

            <InfoCard title="Thông tin sự cố">
              <InfoRow icon={<AlertIcon />} label="Loại sự cố" value={`🔧 ${request.title}`} />
              <InfoRow icon={<FileIcon />} label="Mô tả" value={request.description || 'Chưa có mô tả'} />
              <InfoRow
                icon={<LocationIcon />}
                label="Vị trí"
                value={
                  <>
                    <Typography component="span" sx={{ display: 'block', fontSize: 16, fontWeight: 500 }}>
                      {formatAddress(request.address)}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 14, color: ORANGE, lineHeight: 1.35 }}>
                      📍 Khoảng cách: {formatDistance(request.distance_km)}
                    </Typography>
                  </>
                }
              />
              <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatRequestTime(request.created_at)} />
              <InfoRow
                icon={<CameraIcon />}
                label="Hình ảnh sự cố"
                value={
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 1 }}>
                    {photoSlots.map((photo, index) => (
                      <Box
                        key={`${photo || 'placeholder'}-${index}`}
                        sx={{
                          aspectRatio: '1 / 1',
                          borderRadius: BUTTON_RADIUS,
                          bgcolor: '#e5e7eb',
                          overflow: 'hidden',
                        }}
                      >
                        {photo ? (
                          <Box
                            component="img"
                            src={photo}
                            alt={`Hình ảnh sự cố ${index + 1}`}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : null}
                      </Box>
                    ))}
                  </Box>
                }
              />
            </InfoCard>

            <Box
              sx={{
                height: 192,
                mb: 3,
                borderRadius: CARD_RADIUS,
                bgcolor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocationIcon sx={{ fontSize: 48, color: '#9ca3af' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box
                component="button"
                type="button"
                onClick={() => toast.success('Đã nhận thao tác chấp nhận yêu cầu')}
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
                Chấp nhận yêu cầu
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => toast('Đã nhận thao tác từ chối')}
                sx={{
                  width: '100%',
                  px: 3,
                  py: 1.5,
                  borderRadius: BUTTON_RADIUS,
                  bgcolor: '#fff',
                  color: NAVY,
                  border: `2px solid ${NAVY}`,
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  transition: 'background 0.15s, transform 0.1s',
                  '&:hover': { bgcolor: '#f9fafb' },
                  '&:active': { transform: 'scale(0.99)' },
                }}
              >
                Từ chối
              </Box>
            </Box>
          </>
        )}
      </Box>
    </MobileLayout>
  );
}
