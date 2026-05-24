import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { ConfirmRequestCard } from '@/components/rescue/ConfirmRequestCard';
import { rescueRequestService } from '@/services/rescueRequest.service';
import { CompanyResult, RescueFormData } from '@/types/rescue.type';
import toast from 'react-hot-toast';

export default function ConfirmRequestPage() {
  const navigate = useNavigate();
  const locationState = useLocation().state as { formData: RescueFormData; company: CompanyResult } | null;

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  if (!locationState) {
    return (
      <MobileLayout>
        <AppHeader title="Xác nhận yêu cầu" onBack={() => navigate(-1)} />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Không tìm thấy dữ liệu.</Typography>
          <Button variant="primary" onClick={() => navigate('/rescue/request')} sx={{ mt: 2 }}>
            Quay lại tìm kiếm
          </Button>
        </Box>
      </MobileLayout>
    );
  }

  const { formData, company } = locationState;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        company_id: company._id,
        description: formData.description,
        location: {
          lat: formData.location?.lat || 0,
          lng: formData.location?.lng || 0,
        },
        address: formData.location?.address,
      };

      const res = await rescueRequestService.createRequest(payload);

      setRequestId(res.data._id);
      setIsSubmitted(true);
      toast.success('Gửi yêu cầu thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!requestId) return;

    setLoading(true);
    try {
      await rescueRequestService.cancelRequest(requestId);

      toast.success('Đã hủy yêu cầu thành công');
      setIsSubmitted(false);
      setRequestId(null);
      // Quay về màn hình danh sách các công ty cứu hộ (quay lại 2 bước)
      navigate(-2);
    } catch (error: any) {
      toast.error(error.message || 'Không thể hủy yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Xác nhận yêu cầu" onBack={() => navigate(-1)} />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', p: 2 }}>
        <ConfirmRequestCard
          incidentTypeName={formData.incident_type?.label || 'Chưa rõ'}
          description={formData.description}
          locationText={formData.location?.address || 'Tọa độ GPS'}
          phone="0912 345 678" // Mock data for user's phone
          company={{
            id: company._id,
            name: company.company_name,
            rating: company.rating_avg || 4.8,
            reviews: company.rating_count || 342,
            etaMinutes: 15,
            minPrice: 150000,
            maxPrice: 300000,
          }}
          onConfirm={handleConfirm}
          onBack={() => {
            if (isSubmitted) {
              navigate('/'); // Quay về trang chủ
            } else {
              navigate(-1); // Quay lại trang công ty
            }
          }}
          loading={loading}
          isSubmitted={isSubmitted}
          onCancel={handleCancel}
        />
      </Box>
    </MobileLayout>
  );
}
