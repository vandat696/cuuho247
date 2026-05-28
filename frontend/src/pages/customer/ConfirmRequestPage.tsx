import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { ConfirmRequestCard } from '@/components/rescue/ConfirmRequestCard';
import { customerRescueService } from '@/services/customer-rescue.service';
import { CompanyResult } from '@/types/rescue.type';
import toast from 'react-hot-toast';

export default function ConfirmRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    formData: {
      incident_type?: string;
      incident_type_label?: string;
      description: string;
      location: { lat: number; lng: number; address: string } | null;
    };
    company: CompanyResult;
  } | null;

  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/rescue/request', { replace: true });
    }
  };

  if (!locationState) {
    return (
      <MobileLayout>
        <AppHeader title="Xác nhận yêu cầu" backFallback="/rescue/request" />
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
        service_types: formData.incident_type ? [formData.incident_type] : undefined,
      };

      const res = await customerRescueService.createRequest(payload);

      toast.success('Gửi yêu cầu thành công!');
      navigate(`/customer/tracking/${res.data._id}`, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Xác nhận yêu cầu" backFallback="/rescue/request" />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', p: 2 }}>
        <ConfirmRequestCard
          incidentTypeName={formData.incident_type_label || 'Chưa rõ'}
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
          onBack={handleBack}
          loading={loading}
        />
      </Box>
    </MobileLayout>
  );
}
