import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Checkbox, FormControlLabel, Button as MuiButton, IconButton, Stack } from '@mui/material';
import {
  CheckCircleRounded as CheckCircleIcon,
  CloseRounded as CloseIcon,
  ImageOutlined as ImageIcon,
  UploadFileRounded as UploadFileIcon,
} from '@mui/icons-material';
import { authService } from '../../services/auth.service';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { SERVICE_AREAS } from '../../constants/serviceAreas';
import { toast } from 'react-hot-toast';

interface CompanyRegisterFormData {
  company_name: string;
  director_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  service_area: string;
  license_file: File | null;
  terms_accepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const CompanyRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyRegisterFormData>({
    company_name: '',
    director_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    service_area: '',
    license_file: null,
    terms_accepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target as any;
    const checked = (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setFormData((prev) => ({
      ...prev,
      license_file: file,
    }));

    if (errors.license_file) {
      setErrors((prev) => ({
        ...prev,
        license_file: '',
      }));
    }
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
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

    if (!formData.service_area.trim()) {
      newErrors.service_area = 'Khu vực hoạt động là bắt buộc';
    }

    if (!formData.terms_accepted) {
      newErrors.terms_accepted = 'Bạn phải đồng ý với Điều khoản dịch vụ';
    }

    if (formData.license_file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(formData.license_file.type)) {
        newErrors.license_file = 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP';
      } else if (formData.license_file.size > 5 * 1024 * 1024) {
        newErrors.license_file = 'Ảnh không được vượt quá 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.registerCompany({
        company_name: formData.company_name.trim(),
        director_name: formData.director_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        service_area: formData.service_area.trim(),
        license_file: formData.license_file,
        terms_accepted: formData.terms_accepted,
      });

      if (response.status === 'success') {
        toast.success('Đăng ký tài khoản Công ty thành công! Vui lòng chờ xác minh.');
        setFormData({
          company_name: '',
          director_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          address: '',
          service_area: '',
          license_file: null,
          terms_accepted: false,
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      const apiData = error.response?.data;
      const errorMessage =
        (Array.isArray(apiData?.errors) && apiData.errors.length > 0 ? apiData.errors.join('\n') : undefined) ||
        apiData?.message ||
        'Đăng ký thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Thông tin công ty */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
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

            <Input
              label="Email công ty"
              name="email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </Box>
        </Box>

        {/* Địa chỉ công ty */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            Địa chỉ công ty
          </Typography>

          <Input
            label="Địa chỉ"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />
        </Box>

        {/* Khu vực hoạt động */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            Khu vực hoạt động
          </Typography>

          <Select
            id="service_area"
            label="Khu vực hoạt động"
            name="service_area"
            placeholder="Chọn khu vực hoạt động"
            options={SERVICE_AREAS}
            value={formData.service_area}
            onChange={handleChange}
            error={errors.service_area}
            required
          />
        </Box>

        {/* Mật khẩu */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            Mật khẩu
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </Box>
        </Box>

        {/* Giấy phép kinh doanh */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            Giấy phép kinh doanh
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
                  {formData.license_file ? formData.license_file.name : 'Ảnh giấy phép kinh doanh'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: errors.license_file ? 'error.main' : 'text.secondary', mt: 0.5 }}
                >
                  {errors.license_file ||
                    (formData.license_file
                      ? `Đã chọn 1 ảnh - ${formatFileSize(formData.license_file.size)}`
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
              {formData.license_file ? 'Đổi ảnh' : 'Chọn ảnh'}
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

        {/* Điều khoản */}
        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
          <FormControlLabel
            control={<Checkbox name="terms_accepted" checked={formData.terms_accepted} onChange={handleChange} />}
            label="Tôi xác nhận thông tin trên là chính xác và đồng ý với Điều khoản dịch vụ"
          />
          {errors.terms_accepted && (
            <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 1 }}>
              {errors.terms_accepted}
            </Typography>
          )}
        </Box>

        {/* Nút đăng ký */}
        <Button
          type="submit"
          disabled={isLoading}
          sx={{
            py: 1.5,
            bgcolor: 'secondary.main',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': { bgcolor: 'secondary.dark' },
            '&:disabled': { bgcolor: 'action.disabled' },
          }}
        >
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Đã có tài khoản?{' '}
            <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
              Đăng nhập
            </a>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default CompanyRegisterForm;
