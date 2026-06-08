import { useState, useEffect } from 'react';
import { Service } from '../types/service.type';
import { serviceService } from '../services/service.service';
import toast from 'react-hot-toast';

export const useServiceList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceService.getServices();
      if (response?.status === 'success') {
        setServices(response.data || []);
      } else {
        setError(response?.message || 'Lỗi khi lấy danh sách dịch vụ');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [refetch]);

  return {
    services,
    loading,
    error,
    refetch: () => setRefetch(!refetch),
  };
};
