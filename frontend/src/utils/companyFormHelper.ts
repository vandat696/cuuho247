import { useState } from 'react';
import { RescueLocation } from '../types/rescue.type';

export interface BaseCompanyFormData {
  company_name: string;
  director_name: string;
  phone: string;
  address: string;
  company_location: RescueLocation | null;
  license_file: File | null;
}

export const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export function validateCompanyFormFields(formData: BaseCompanyFormData) {
  const newErrors: Record<string, string> = {};

  if (!formData.company_name.trim()) {
    newErrors.company_name = 'Tên công ty là bắt buộc';
  } else if (formData.company_name.trim().length < 2) {
    newErrors.company_name = 'Tên công ty phải có ít nhất 2 ký tự';
  }

  if (!formData.director_name.trim()) {
    newErrors.director_name = 'Họ và tên giám đốc là bắt buộc';
  } else if (formData.director_name.trim().length < 2) {
    newErrors.director_name = 'Họ và tên phải có ít nhất 2 ký tự';
  }

  if (!formData.phone.trim()) {
    newErrors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
    newErrors.phone = 'Số điện thoại không hợp lệ (phải từ 10-11 số)';
  }

  if (!formData.address.trim()) {
    newErrors.address = 'Địa chỉ là bắt buộc';
  } else if (formData.address.trim().length < 5) {
    newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
  }

  if (
    !formData.company_location ||
    typeof formData.company_location.lat !== 'number' ||
    typeof formData.company_location.lng !== 'number' ||
    formData.company_location.lat === 0 ||
    formData.company_location.lng === 0
  ) {
    newErrors.company_location = 'Vui lòng chọn vị trí công ty trên bản đồ';
  }

  if (formData.license_file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(formData.license_file.type)) {
      newErrors.license_file = 'Chỉ hỗ trợ ảnh (JPG, PNG, WEBP) hoặc tệp PDF';
    } else if (formData.license_file.size > 5 * 1024 * 1024) {
      newErrors.license_file = 'Ảnh không được vượt quá 5MB';
    }
  }

  return newErrors;
}

export function useCompanyFormHandlers<T extends BaseCompanyFormData>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) {
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const handleCompanyLocationChange = (location: RescueLocation | null) => {
    setFormData((prev) => ({
      ...prev,
      company_location: location,
      ...(location?.address ? { address: location.address } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      company_location: '',
      ...(location?.address ? { address: '' } : {}),
    }));
  };

  const handleConfirmCompanyLocation = (location: RescueLocation) => {
    handleCompanyLocationChange(location);
    setIsLocationPickerOpen(false);
  };

  const handleLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setFormData((prev) => ({
      ...prev,
      license_file: file,
    }));

    setErrors((prev) => ({
      ...prev,
      license_file: '',
    }));
  };

  const handleRemoveLicenseFile = () => {
    setFormData((prev) => ({
      ...prev,
      license_file: null,
    }));
    setErrors((prev) => ({
      ...prev,
      license_file: '',
    }));
  };

  return {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    handleCompanyLocationChange,
    handleConfirmCompanyLocation,
    handleLicenseFileChange,
    handleRemoveLicenseFile,
  };
}
