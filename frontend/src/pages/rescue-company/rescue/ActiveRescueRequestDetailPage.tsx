import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
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
import { ActiveRescueRequestDetail } from '@/types/rescue.type';
import {
  DetailContentState,
  formatAddress,
  formatDateTime,
  InfoCard,
  InfoRow,
  NAVY,
  PrimaryActionButton,
  StatusBanner,
  VehiclePanel,
} from './rescueCompanyShared';

export default function ActiveRescueRequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<ActiveRescueRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [finalAmount, setFinalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'e_wallet'>('cash');
  const [completionNote, setCompletionNote] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

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

  const handleCompleteRequest = async () => {
    if (!requestId) return;

    const amount = Number(finalAmount);
    if (!finalAmount.trim() || Number.isNaN(amount) || amount < 0) {
      toast.error('Vui lòng nhập số tiền thanh toán thực tế');
      return;
    }

    try {
      setCompleteLoading(true);
      const response = await rescueService.completeCompanyActiveRequest(requestId, {
        amount,
        method: paymentMethod,
        note: completionNote.trim() || undefined,
      });

      if (response.status === 'success') {
        toast.success('Đã hoàn tất nhiệm vụ và chốt thanh toán');
        navigate(`/company/rescue/completed/detail/${requestId}`, { replace: true });
      }
    } catch (error) {
      console.error('Error completing rescue request:', error);
      toast.error('Không thể hoàn tất nhiệm vụ');
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết cứu hộ" backFallback="/company/rescue/active" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <DetailContentState loading={loading} missingMessage="Không tìm thấy nhiệm vụ" hasData={Boolean(request)}>
          {request && (
            <>
              <StatusBanner label="Đang thực hiện" color={NAVY} background="rgba(27, 58, 93, 0.10)" />

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
                  onChange={(event) => setPaymentMethod(event.target.value as 'cash' | 'bank_transfer' | 'e_wallet')}
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
                  placeholder="Ví dụ: phát sinh thêm phí kéo xe, giảm giá, khách đã thanh toán..."
                />
              </InfoCard>

              <PrimaryActionButton onClick={handleCompleteRequest} disabled={completeLoading} variant="orange">
                {completeLoading ? 'Đang hoàn tất...' : 'Hoàn thành và chốt thanh toán'}
              </PrimaryActionButton>
            </>
          )}
        </DetailContentState>
      </Box>
    </MobileLayout>
  );
}
