import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  DescriptionOutlined as FileIcon,
  ErrorOutline as AlertIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutline as UserIcon,
  PhoneOutlined as PhoneIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { MiniMap } from '@/components/location/MiniMap';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { rescueService } from '@/services/rescue.service';
import { vehicleService } from '@/services/vehicle.service';
import { PendingRescueRequestDetail } from '@/types/rescue.type';
import { IVehicle } from '@/types/vehicle.types';

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

const getRequestCoordinates = (request: PendingRescueRequestDetail) => {
  const [lng, lat] = request.location?.coordinates ?? [];

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  return { lat, lng };
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
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [etaMinutes, setEtaMinutes] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

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

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(data.filter((vehicle) => vehicle.status === 'available'));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleAcceptRequest = async () => {
    if (!requestId) return;

    const eta = Number(etaMinutes);
    if (!vehicleId) {
      toast.error('Vui lòng chọn xe cứu hộ');
      return;
    }

    if (!Number.isInteger(eta) || eta <= 0) {
      toast.error('Vui lòng nhập thời gian dự kiến đến hợp lệ');
      return;
    }

    try {
      setAccepting(true);
      await rescueService.acceptCompanyPendingRequest(requestId, {
        vehicle_id: vehicleId,
        eta_minutes: eta,
        note: note.trim() || undefined,
      });
      toast.success('Đã nhận yêu cầu cứu hộ');
      navigate('/company/rescue/active');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Không thể nhận yêu cầu');
    } finally {
      setAccepting(false);
    }
  };

  const requestCoordinates = request ? getRequestCoordinates(request) : null;

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
              <InfoRow icon={<AlertIcon />} label="Loại sự cố" value={request.title} />
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
                      Khoảng cách: {formatDistance(request.distance_km)}
                    </Typography>
                  </>
                }
              />
              <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatRequestTime(request.created_at)} />
            </InfoCard>

            <InfoCard title="Nhận yêu cầu">
              <Box>
                <Typography sx={{ mb: 1, fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>
                  Bản đồ vị trí khách hàng
                </Typography>
                {requestCoordinates ? (
                  <MiniMap lat={requestCoordinates.lat} lng={requestCoordinates.lng} zoom={15} />
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#f9fafb',
                      border: '1px dashed #d1d5db',
                      borderRadius: CARD_RADIUS,
                      color: '#6b7280',
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  >
                    Chưa có tọa độ để hiển thị bản đồ
                  </Box>
                )}
              </Box>
              <TextField
                select
                label="Xe cứu hộ"
                value={vehicleId}
                onChange={(event) => setVehicleId(event.target.value)}
                fullWidth
                size="small"
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle._id} value={vehicle._id}>
                    {vehicle.plate_number} - {vehicle.vehicle_type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Thời gian dự kiến đến (phút)"
                type="number"
                value={etaMinutes}
                onChange={(event) => setEtaMinutes(event.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Ghi chú"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
              />
            </InfoCard>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box
                component="button"
                type="button"
                onClick={handleAcceptRequest}
                disabled={accepting}
                sx={{
                  width: '100%',
                  px: 3,
                  py: 1.5,
                  borderRadius: BUTTON_RADIUS,
                  border: 0,
                  bgcolor: accepting ? '#f3a267' : ORANGE,
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
                {accepting ? 'Đang nhận...' : 'Chấp nhận yêu cầu'}
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
