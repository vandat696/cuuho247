import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Service, ServiceFormData, ServiceFormErrors, ServiceCategory } from '../types/service.types';
import { serviceService } from '../services/service.service';
import toast from 'react-hot-toast';

export const useServiceForm = (initialService?: Service) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState<ServiceFormData>({
    category_id: initialService?.category_id || '',
    name: initialService?.name || '',
    price: initialService?.price || 0,
    description: initialService?.description || '',
    is_active: initialService?.is_active ?? true,
  });
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Prefill data when initialService is loaded
  useEffect(() => {
    if (initialService) {
      setFormData({
        category_id: initialService.category_id || '',
        name: initialService.name || '',
        price: initialService.price || 0,
        description: initialService.description || '',
        is_active: initialService.is_active ?? true,
      });
    }
  }, [initialService]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serviceService.getCategories();
        if (response?.status === 'success') {
          setCategories(response.data || []);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi khi lấy danh mục dịch vụ';
        toast.error(errorMsg);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ServiceFormErrors = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Vui lòng chọn danh mục dịch vụ';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên dịch vụ';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Tên dịch vụ phải dài ít nhất 3 ký tự';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Tên dịch vụ không được quá 100 ký tự';
    }

    if (formData.price < 0) {
      newErrors.price = 'Giá không được âm';
    } else if (formData.price === 0) {
      newErrors.price = 'Vui lòng nhập giá dịch vụ';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Mô tả không được quá 500 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ServiceFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (initialService) {
        // Update existing service
        const response = await serviceService.updateService(initialService._id, formData);
        if (response?.status === 'success') {
          toast.success('Cập nhật dịch vụ thành công!');
          navigate('/company/services');
        } else {
          toast.error(response?.message || 'Cập nhật dịch vụ thất bại');
        }
      } else {
        // Create new service
        const response = await serviceService.createService(formData);
        if (response?.status === 'success') {
          toast.success('Tạo dịch vụ thành công!');
          navigate('/company/services');
        } else {
          toast.error(response?.message || 'Tạo dịch vụ thất bại');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/company/services');
  };

  return {
    formData,
    errors,
    isLoading,
    categories,
    categoriesLoading,
    handleChange,
    handleSubmit,
    handleCancel,
    isEditing: !!initialService,
  };
};
