import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button as MuiButton, IconButton, Stack, CircularProgress } from '@mui/material';
import {
  CheckCircleRounded as CheckCircleIcon,
  CloseRounded as CloseIcon,
  ImageOutlined as ImageIcon,
  LocationOnRounded as LocationOnIcon,
  UploadFileRounded as UploadFileIcon,
  SaveOutlined as SaveIcon,
} from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { LocationPickerDialog } from '@/components/location/LocationPickerDialog';
import { companyService } from '@/services/company.service';
import { toast } from 'react-hot-toast';
import { RescueLocation } from '@/types/rescue.type';
import { NAVY } from '@/constants/colors';
import { formatFileSize, validateCompanyFormFields, useCompanyFormHandlers } from '@/utils/companyFormHelper';

interface CompanyProfileEditFormData {
  company_name: string;
  director_name: string;
  phone: string;
  address: string;
  company_location: RescueLocation | null;
  license_file: File | null;
  existing_license_url?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CompanyProfileEditPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyProfileEditFormData>({
    company_name: '',
    director_name: '',
    phone: '',
    address: '',
    company_location: null,
    license_file: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    handleConfirmCompanyLocation,
    handleLicenseFileChange,
    handleRemoveLicenseFile,
  } = useCompanyFormHandlers(setFormData, setErrors);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await companyService.getProfile();
      if (response.status === 'success') {
        const company = response.data;

        let addressStr = '';
        if (company.address) {
          if (typeof company.address === 'string') {
            addressStr = company.address;
          } else {
            addressStr = company.address.detail || '';
          }
        }

        let loc: RescueLocation | null = null;
        if (company.location?.coordinates) {
          loc = {
            lng: company.location.coordinates[0],
            lat: company.location.coordinates[1],
            address: addressStr,
          };
        }

        setFormData({
          company_name: company.company_name || '',
          director_name: company.director_name || '',
          phone: company.phone || '',
          address: addressStr,
          company_location: loc,
          license_file: null,
          existing_license_url: company.license_file_url || company.license_url,
        });
      }
    } catch (error) {
      console.error('Error fetching profile for edit:', error);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target as any;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = validateCompanyFormFields(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('company_name', formData.company_name.trim());
      formDataToSend.append('director_name', formData.director_name.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('address', formData.address.trim());

      if (formData.company_location) {
        formDataToSend.append('latitude', String(formData.company_location.lat));
        formDataToSend.append('longitude', String(formData.company_location.lng));
      }

      if (formData.license_file) {
        formDataToSend.append('license_file', formData.license_file);
      }

      const response = await companyService.updateProfile(formDataToSend);

      if (response.status === 'success') {
        toast.success('Cập nhật thông tin hồ sơ thành công! Vui lòng đợi quản trị viên duyệt lại.');
        navigate('/company/home', { replace: true });
        return;
      }
    } catch (error: any) {
      const apiData = error.response?.data;
      const errorMessage = apiData?.message || 'Cập nhật hồ sơ thất bại';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Chỉnh sửa hồ sơ" backFallback="/company/home" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Thông tin chung */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: NAVY }}>
                Thông tin công ty
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input
                  label="Tên công ty"
                  name="company_name"
                  type="text"
                  placeholder="Nhập tên công ty"
                  value={formData.company_name}
                  onChange={handleChange}
                  error={errors.company_name}
                />

                <Input
                  label="Họ và tên giám đốc"
                  name="director_name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.director_name}
                  onChange={handleChange}
                  error={errors.director_name}
                />

                <Input
                  label="Số điện thoại công ty"
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </Box>
            </Box>

            {/* Địa chỉ & Map */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: NAVY }}>
                Địa chỉ hoạt động
              </Typography>

              <Input
                label="Địa chỉ chi tiết"
                name="address"
                type="text"
                placeholder="Nhập địa chỉ của công ty"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: errors.company_location ? 'error.main' : 'divider',
                  borderRadius: 2,
                  bgcolor: formData.company_location ? 'rgba(255, 107, 0, 0.04)' : 'background.default',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOnIcon color={formData.company_location ? 'primary' : 'disabled'} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      {formData.company_location ? 'Đã xác định vị trí' : 'Chưa chọn tọa độ bản đồ'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: errors.company_location ? 'error.main' : 'text.secondary' }}
                    >
                      {errors.company_location ||
                        (formData.company_location
                          ? `${formData.company_location.lat.toFixed(6)}, ${formData.company_location.lng.toFixed(6)}`
                          : 'Chọn vị trí công ty trên bản đồ để định vị cứu hộ')}
                    </Typography>
                  </Box>
                </Stack>

                <MuiButton
                  variant="outlined"
                  fullWidth
                  startIcon={<LocationOnIcon />}
                  sx={{ mt: 2, borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                  onClick={() => setIsLocationPickerOpen(true)}
                >
                  {formData.company_location ? 'Thay đổi vị trí bản đồ' : 'Chọn vị trí trên bản đồ'}
                </MuiButton>
              </Box>
            </Box>

            {/* Giấy phép kinh doanh */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: NAVY }}>
                Giấy phép kinh doanh / Hồ sơ pháp lý
              </Typography>

              <Box
                sx={{
                  border: '1.5px dashed',
                  borderColor: errors.license_file ? 'error.main' : formData.license_file ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  bgcolor: formData.license_file ? 'rgba(255, 107, 0, 0.04)' : 'background.default',
                  p: 2,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: formData.license_file ? 'primary.main' : 'action.hover',
                      color: formData.license_file ? 'primary.contrastText' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {formData.license_file ? <CheckCircleIcon /> : <ImageIcon />}
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {formData.license_file
                        ? formData.license_file.name
                        : formData.existing_license_url
                          ? 'Đã đính kèm giấy phép kinh doanh'
                          : 'Ảnh giấy phép kinh doanh'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: errors.license_file ? 'error.main' : 'text.secondary', mt: 0.5 }}
                    >
                      {errors.license_file ||
                        (formData.license_file
                          ? `Tập tin mới chọn - ${formatFileSize(formData.license_file.size)}`
                          : formData.existing_license_url
                            ? 'Chọn ảnh mới để thay đổi tập tin hiện có'
                            : 'Chọn 1 ảnh JPG, PNG hoặc WEBP, tối đa 5MB')}
                    </Typography>
                  </Box>

                  {formData.license_file ? (
                    <IconButton aria-label="Bỏ ảnh đã chọn" onClick={handleRemoveLicenseFile} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                </Stack>

                <MuiButton
                  component="label"
                  variant="outlined"
                  color={errors.license_file ? 'error' : 'primary'}
                  fullWidth
                  startIcon={<UploadFileIcon />}
                  sx={{ mt: 2, borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                >
                  {formData.license_file || formData.existing_license_url
                    ? 'Thay đổi hồ sơ pháp lý'
                    : 'Tải lên hồ sơ pháp lý'}
                  <input
                    hidden
                    name="license_file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLicenseFileChange}
                  />
                </MuiButton>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="primary" fullWidth loading={isSaving} startIcon={<SaveIcon />}>
                Lưu thông tin hồ sơ
              </Button>
            </Box>
          </form>
        )}
      </Box>

      <LocationPickerDialog
        open={isLocationPickerOpen}
        value={formData.company_location}
        onClose={() => setIsLocationPickerOpen(false)}
        onConfirm={handleConfirmCompanyLocation}
      />
    </MobileLayout>
  );
}
