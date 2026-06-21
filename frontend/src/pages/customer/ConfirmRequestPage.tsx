import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { ConfirmRequestCard } from '@/components/rescue-customer/ConfirmRequestCard';
import { customerRescueService, CreateRequestPayload } from '@/services/customer-rescue.service';
import { CompanyResult } from '@/types/rescue.type';
import toast from 'react-hot-toast';
import { clearRescueSearchCache } from '@/utils/rescueSearchCache';

export default function ConfirmRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    formData: {
      incident_type?: string;
      incident_type_label?: string;
      description: string;
      location: { lat: number; lng: number; address: string } | null;
      images?: File[];
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

  const handleConfirm = async () => {
    setLoading(true);
    try {
      let payload: CreateRequestPayload | FormData;

      if (formData.images && formData.images.length > 0) {
        const formDataObj = new FormData();
        formDataObj.append('company_id', company._id);
        formDataObj.append('description', formData.description);
        formDataObj.append(
          'location',
          JSON.stringify({
            lat: formData.location?.lat || 0,
            lng: formData.location?.lng || 0,
          })
        );
        if (formData.location?.address) {
          formDataObj.append('address', formData.location.address);
        }
        if (formData.incident_type) {
          formDataObj.append('service_types', JSON.stringify([formData.incident_type]));
        }
        formData.images.forEach((image: File) => {
          formDataObj.append('incident_photos', image);
        });
        payload = formDataObj;
      } else {
        payload = {
          company_id: company._id,
          description: formData.description,
          location: {
            lat: formData.location?.lat || 0,
            lng: formData.location?.lng || 0,
          },
          address: formData.location?.address,
          service_types: formData.incident_type ? [formData.incident_type] : undefined,
        };
      }

      const res = await customerRescueService.createRequest(payload);

      toast.success('Gửi yêu cầu thành công!');
      clearRescueSearchCache();
      navigate(`/customer/tracking/${res.data._id}`, { replace: true });
    } catch (error: any) {
      console.error('Error confirming rescue request:', error);
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
          images={formData.images}
          company={{
            id: company._id,
            name: company.company_name,
            rating: company.rating_avg,
            reviews: company.rating_count,
            distanceKm: company.distance_km,
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
