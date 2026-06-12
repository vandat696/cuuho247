import { useState, useEffect } from 'react';
import { Service } from '../types/service.type';
import { serviceService } from '../services/service.service';

export const useServiceDetail = (serviceId: string | undefined) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(!!serviceId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await serviceService.getServiceById(serviceId);
        if (response?.status === 'success') {
          setService(response.data || null);
        } else {
          setError(response?.message || 'Lỗi khi lấy thông tin dịch vụ');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return {
    service,
    loading,
    error,
  };
};
