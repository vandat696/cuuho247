import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  DescriptionOutlined as FileIcon,
  ErrorOutline as AlertIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutline as UserIcon,
  PhoneOutlined as PhoneIcon,
  ChatBubbleOutline,
  StarOutline,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import {
  CARD_RADIUS,
  DetailContentState,
  formatAddress,
  formatDateTime,
  formatDistance,
  InfoCard,
  InfoRow,
  ORANGE,
  PrimaryActionButton,
  StatusBanner,
  VehiclePanel,
  NAVY,
  GREEN,
  RED,
} from '@/components/rescue-company/RescueCompanyRequestShared';
import { MiniMap } from '@/components/location/MiniMap';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { companyRescueService } from '@/services/company-rescue.service';
import { vehicleService } from '@/services/vehicle.service';
import { getSocket } from '@/utils/socket';
import { IVehicle } from '@/types/vehicle.type';

type RequestStatus = 'pending' | 'active' | 'completed' | 'canceled';

const getRequestCoordinates = (request: any) => {
  const [lng, lat] = request.location?.coordinates ?? [];
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }
  return { lat, lng };
};

export default function RescueRequestDetailPage() {
  const navigate = useNavigate();
  const { status, requestId } = useParams<{ status: RequestStatus; requestId: string }>();

  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // States for pending
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [etaMinutes, setEtaMinutes] = useState('');
  const [pendingNote, setPendingNote] = useState('');
  const [accepting, setAccepting] = useState(false);

  // States for active
  const [finalAmount, setFinalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'e_wallet'>('cash');
  const [completionNote, setCompletionNote] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (!requestId || !status) {
        navigate('/company/rescue/pending', { replace: true });
        return;
      }

      try {
        setLoading(true);
        let response;
        switch (status) {
          case 'pending':
            response = await companyRescueService.getCompanyPendingRequestDetail(requestId);
            break;
          case 'active':
            response = await companyRescueService.getCompanyActiveRequestDetail(requestId);
            break;
          case 'completed':
            response = await companyRescueService.getCompanyCompletedRequestDetail(requestId);
            break;
          case 'canceled':
            response = await companyRescueService.getCompanyCanceledRequestDetail(requestId);
            break;
          default:
            throw new Error('Invalid status');
        }

        if (response.status === 'success') {
          setRequest(response.data.request);
        }
      } catch (error) {
        console.error('Error fetching rescue request detail:', error);
        toast.error('Không thể tải chi tiết yêu cầu');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [navigate, requestId, status]);

  useEffect(() => {
    if (status === 'pending') {
      const fetchVehicles = async () => {
        try {
          const data = await vehicleService.getVehicles();
          setVehicles(data.filter((vehicle) => vehicle.status === 'available'));
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      };
      fetchVehicles();
    }
  }, [status]);

  // Location Sync over Socket for 'active' request
  useEffect(() => {
    if (status !== 'active' || !requestId) return;
    const socket = getSocket();
    let watchId: number;

    const startLocationSync = () => {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, heading } = position.coords;
            socket.emit('update_location', {
              rescue_request_id: requestId,
              lat: latitude,
              lng: longitude,
              heading,
            });
          },
          (error) => {
            console.error('Error watching position:', error);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }
    };
    startLocationSync();

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [status, requestId]);

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
      await companyRescueService.acceptCompanyPendingRequest(requestId, {
        vehicle_id: vehicleId,
        eta_minutes: eta,
        note: pendingNote.trim() || undefined,
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

  const [startLoading, setStartLoading] = useState(false);

  const handleStartTrip = async () => {
    if (!requestId) return;
    try {
      setStartLoading(true);
      const response = await companyRescueService.startCompanyActiveRequest(requestId);
      if (response.status === 'success') {
        toast.success('Đã bắt đầu chuyến đi');
        setRequest(response.data.request);
      }
    } catch (error: any) {
      console.error('Error starting trip:', error);
      const msg = error.response?.data?.message || 'Không thể cập nhật trạng thái';
      toast.error(msg);
    } finally {
      setStartLoading(false);
    }
  };

  const [arriveLoading, setArriveLoading] = useState(false);

  const handleArrive = async () => {
    if (!requestId) return;
    try {
      setArriveLoading(true);
      const response = await companyRescueService.arriveCompanyActiveRequest(requestId);
      if (response.status === 'success') {
        toast.success('Đã cập nhật trạng thái xe đến nơi');
        setRequest(response.data.request);
      }
    } catch (error: any) {
      console.error('Error arriving:', error);
      const msg = error.response?.data?.message || 'Không thể cập nhật trạng thái';
      toast.error(msg);
    } finally {
      setArriveLoading(false);
    }
  };

  const handleCompleteRequest = async () => {
    if (!requestId) return;

    const amount = Number(finalAmount);
    if (!finalAmount.trim() || Number.isNaN(amount) || amount < 0) {
      toast.error('Vui lòng nhập số tiền thanh toán thực tế');
      return;
    }

    try {
      setCompleteLoading(true);
      const response = await companyRescueService.completeCompanyActiveRequest(requestId, {
        amount,
        method: paymentMethod,
        note: completionNote.trim() || undefined,
      });

      if (response.status === 'success') {
        toast.success('Đã hoàn tất nhiệm vụ và chốt thanh toán');
        navigate(`/company/rescue/completed/${requestId}`, { replace: true });
      }
    } catch (error) {
      console.error('Error completing rescue request:', error);
      toast.error('Không thể hoàn tất nhiệm vụ');
    } finally {
      setCompleteLoading(false);
    }
  };

  if (!status) return null;

  const requestCoordinates = request ? getRequestCoordinates(request) : null;
  const backFallback = `/company/rescue/${status}`;

  const renderStatusBanner = () => {
    switch (status) {
      case 'active':
        if (request?.status === 'accepted') {
          return <StatusBanner label="Đã tiếp nhận" color={NAVY} background="rgba(27, 58, 93, 0.10)" />;
        }
        if (request?.status === 'in_progress') {
          return <StatusBanner label="Đang di chuyển" color="#ea580c" background="rgba(234, 88, 12, 0.1)" />;
        }
        if (request?.status === 'arrived') {
          return <StatusBanner label="Xe đã đến" color={GREEN} background="#f0fdf4" />;
        }
        return <StatusBanner label="Đang thực hiện" color={NAVY} background="rgba(27, 58, 93, 0.10)" />;
      case 'completed':
        return <StatusBanner label="Đã hoàn thành" color={GREEN} background="#f0fdf4" />;
      case 'canceled':
        return <StatusBanner label="Đã hủy" color={RED} background="#fef2f2" />;
      default:
        return null;
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết yêu cầu" backFallback={backFallback} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <DetailContentState loading={loading} missingMessage="Không tìm thấy yêu cầu" hasData={Boolean(request)}>
          {request && (
            <>
              {renderStatusBanner()}

              <InfoCard title="Thông tin khách hàng">
                <InfoRow
                  icon={<UserIcon />}
                  label="Tên khách hàng"
                  value={request.customer?.full_name || 'Khách hàng'}
                />
                <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={request.customer?.phone || 'Chưa có số'} />
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
                      {status === 'pending' && (
                        <Typography sx={{ mt: 0.5, fontSize: 14, color: ORANGE, lineHeight: 1.35 }}>
                          Khoảng cách: {formatDistance(request.distance_km)}
                        </Typography>
                      )}
                    </>
                  }
                />
                <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatDateTime(request.created_at)} />
              </InfoCard>

              {status !== 'pending' && <VehiclePanel vehicle={request.vehicle} />}

              {status === 'pending' && (
                <>
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
                      sx={{ mt: 2 }}
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
                      sx={{ mt: 2 }}
                      inputProps={{ min: 1 }}
                    />
                    <TextField
                      label="Ghi chú"
                      value={pendingNote}
                      onChange={(event) => setPendingNote(event.target.value)}
                      fullWidth
                      size="small"
                      sx={{ mt: 2 }}
                      multiline
                      minRows={2}
                    />
                  </InfoCard>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <PrimaryActionButton onClick={handleAcceptRequest} disabled={accepting} variant="orange">
                      {accepting ? 'Đang nhận...' : 'Chấp nhận yêu cầu'}
                    </PrimaryActionButton>
                    <PrimaryActionButton onClick={() => toast('Đã nhận thao tác từ chối')} variant="outline">
                      Từ chối
                    </PrimaryActionButton>
                  </Box>
                </>
              )}

              {status === 'active' && (
                <>
                  {request.status === 'arrived' && (
                    <InfoCard title="Chốt thanh toán">
                      <TextField
                        fullWidth
                        label="Số tiền thực tế"
                        type="number"
                        value={finalAmount}
                        onChange={(event) => setFinalAmount(event.target.value)}
                        inputProps={{ min: 0, step: 1000 }}
                        InputProps={{ endAdornment: <Typography sx={{ color: '#6b7280' }}>VND</Typography> }}
                      />
                      <TextField
                        select
                        fullWidth
                        label="Phương thức thanh toán"
                        value={paymentMethod}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value as 'cash' | 'bank_transfer' | 'e_wallet')
                        }
                        sx={{ mt: 2 }}
                      >
                        <MenuItem value="cash">Tiền mặt</MenuItem>
                        <MenuItem value="bank_transfer">Chuyển khoản</MenuItem>
                        <MenuItem value="e_wallet">Ví điện tử</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Ghi chú"
                        value={completionNote}
                        onChange={(event) => setCompletionNote(event.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="Ví dụ: phát sinh thêm phí kéo xe, giảm giá, khách đã thanh toán..."
                      />
                    </InfoCard>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {request.status === 'accepted' && (
                      <PrimaryActionButton onClick={handleStartTrip} disabled={startLoading} variant="navy">
                        {startLoading ? 'Đang bắt đầu...' : 'Bắt đầu chuyến đi'}
                      </PrimaryActionButton>
                    )}

                    {request.status === 'in_progress' && (
                      <PrimaryActionButton onClick={handleArrive} disabled={arriveLoading} variant="orange">
                        {arriveLoading ? 'Đang cập nhật...' : 'Xe đã đến'}
                      </PrimaryActionButton>
                    )}

                    {request.status === 'arrived' && (
                      <PrimaryActionButton onClick={handleCompleteRequest} disabled={completeLoading} variant="navy">
                        {completeLoading ? 'Đang hoàn tất...' : 'Hoàn thành và chốt thanh toán'}
                      </PrimaryActionButton>
                    )}

                    <PrimaryActionButton onClick={() => navigate(`/chat/${requestId}`)} variant="outline">
                      <ChatBubbleOutline sx={{ fontSize: 20, mr: 1 }} />
                      Nhắn tin với khách hàng
                    </PrimaryActionButton>
                  </Box>
                </>
              )}

              {(status === 'completed' || status === 'canceled') && (
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {status === 'completed' && (
                    <PrimaryActionButton onClick={() => navigate('/company/reviews')} variant="orange">
                      <StarOutline sx={{ fontSize: 20, mr: 1 }} />
                      Xem đánh giá khách hàng
                    </PrimaryActionButton>
                  )}
                  <PrimaryActionButton onClick={() => navigate('/company/home')} variant="navy">
                    Quay về trang chủ
                  </PrimaryActionButton>
                </Box>
              )}
            </>
          )}
        </DetailContentState>
      </Box>
    </MobileLayout>
  );
}
