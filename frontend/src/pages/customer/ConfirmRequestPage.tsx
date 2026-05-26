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
  const customerPhone = localStorage.getItem('accountPhone') || 'Chưa có số điện thoại';

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

      await rescueRequestService.createRequest(payload);

      toast.success('Gửi yêu cầu thành công!');
      navigate('/'); // Redirect to home immediately
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi yêu cầu');
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
          location={formData.location}
          phone={customerPhone}
          company={{
            id: company._id,
            name: company.company_name,
            rating: company.rating_avg,
            reviews: company.rating_count,
            etaMinutes: company.eta_minutes,
            minPrice: company.min_price,
            maxPrice: company.max_price,
          }}
          onConfirm={handleConfirm}
          onBack={() => navigate(-1)}
          loading={loading}
        />
      </Box>
    </MobileLayout>
  );
}
