import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IncidentType, RescueFormData, RescueFormErrors, RescueLocation } from '../types/rescue.type';
import { customerRescueService } from '../services/customer-rescue.service';
import { useCurrentLocation } from './useCurrentLocation';

export function useRescueRequest() {
  const navigate = useNavigate();
  const geo = useCurrentLocation();

  const [form, setForm] = useState<RescueFormData>({
    incident_type: null,
    description: '',
    images: [],
    location: null,
  });

  const [errors, setErrors] = useState<RescueFormErrors>({});
  const [isSearching, setIsSearching] = useState(false);

  // Auto-get GPS on mount
  useEffect(() => {
    geo.getCurrentLocation();
  }, []);

  // Sync GPS location into form when it arrives
  useEffect(() => {
    if (geo.status === 'success' && geo.location) {
      setForm((prev) => ({ ...prev, location: geo.location }));
    }

    if (geo.status === 'denied') {
      toast.error('Quyền truy cập vị trí bị từ chối. Vui lòng nhập địa chỉ thủ công.');
    }
  }, [geo.status, geo.location]);

  const setIncidentType = (type: IncidentType | null) => {
    setForm((prev) => ({ ...prev, incident_type: type }));
    if (type) setErrors((prev) => ({ ...prev, incident_type: undefined }));
  };

  const setDescription = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, description: undefined }));
  };

  const setImages = (files: File[]) => {
    setForm((prev) => ({ ...prev, images: files }));
  };

  const setLocation = (loc: RescueLocation | null) => {
    setForm((prev) => ({ ...prev, location: loc }));
    if (loc) setErrors((prev) => ({ ...prev, location: undefined }));
  };

  const retryGps = () => {
    geo.getCurrentLocation();
  };

  const validate = (): boolean => {
    const newErrors: RescueFormErrors = {};

    if (!form.incident_type) {
      newErrors.incident_type = 'Vui lòng chọn loại sự cố';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Vui lòng mô tả tình trạng xe';
    }

    if (!form.location || typeof form.location.lat !== 'number' || typeof form.location.lng !== 'number') {
      newErrors.location = 'Vui lòng chọn địa chỉ từ gợi ý';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validate()) {
      const missingFields = [];
      if (!form.incident_type) missingFields.push('Loại sự cố');
      if (!form.description.trim()) missingFields.push('Mô tả');
      if (!form.location) missingFields.push('Vị trí');

      toast.error(`Vui lòng điền: ${missingFields.join(', ')}`);
      return;
    }

    const loc = form.location!;
    const searchToast = toast.loading('Đang tìm kiếm đội cứu hộ gần nhất...');

    setIsSearching(true);
    try {
      const res = await customerRescueService.searchCompanies({
        lat: loc.lat,
        lng: loc.lng,
        incident_type: form.incident_type?.slug,
      });

      if (res.status === 'success') {
        toast.success(`Tìm thấy ${res.data.total} đơn vị cứu hộ`, { id: searchToast });
        navigate('/rescue/search', {
          state: {
            formData: {
              incident_type: form.incident_type?.slug,
              incident_type_label: form.incident_type?.label ?? '',
              description: form.description,
              location: loc,
            },
            results: res.data,
          },
        });
      } else {
        toast.error('Dữ liệu không hợp lệ từ server', { id: searchToast });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || 'Không thể kết nối đến server', { id: searchToast });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    form,
    errors,
    isSearching,
    geoStatus: geo.status,
    geoError: geo.error,
    setIncidentType,
    setDescription,
    setImages,
    setLocation,
    retryGps,
    handleSearch,
  };
}
