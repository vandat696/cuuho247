import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Avatar, Badge } from '@mui/material';
import { CameraAlt, PersonOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { userService } from '@/services/user.service';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

export default function CustomerEditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: localStorage.getItem('accountName') || '',
    phone: localStorage.getItem('accountPhone') || '',
    email: localStorage.getItem('accountEmail') || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setFormData({
          name: response.data.full_name || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
        });
        setAvatarPreview(response.data.avatar_url || null);
        localStorage.setItem('accountName', response.data.full_name || '');
        localStorage.setItem('accountPhone', response.data.phone || '');
        localStorage.setItem('accountEmail', response.data.email || '');
        localStorage.setItem('accountAvatar', response.data.avatar_url || '');
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        ...(avatarFile ? { avatar: avatarFile } : {}),
      });
      localStorage.setItem('accountName', formData.name);
      localStorage.setItem('accountPhone', formData.phone);
      localStorage.setItem('accountEmail', formData.email);
      localStorage.setItem('accountAvatar', res.data.avatar_url || '');
      toast.success('Cập nhật hồ sơ thành công');
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Chỉnh sửa hồ sơ" backFallback="/customer/profile" />

      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', pb: 4 }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Avatar Edit */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 4 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      boxShadow: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <CameraAlt sx={{ fontSize: 20 }} />
                  </Box>
                }
              >
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{ width: 120, height: 120, bgcolor: 'secondary.main', fontSize: '4rem' }}
                >
                  {!avatarPreview && <PersonOutlineOutlined sx={{ fontSize: '4rem' }} />}
                </Avatar>
                <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} accept="image/*" />
              </Badge>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                Thay đổi ảnh đại diện
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Họ và tên
                </Typography>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Số điện thoại
                </Typography>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Email
                </Typography>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  required
                />
              </Box>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button type="submit" variant="secondary" size="lg" fullWidth loading={loading}>
                  Lưu thay đổi
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => navigate(-1)}
                  sx={{ color: 'secondary.main', borderColor: 'secondary.main' }}
                >
                  Hủy
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </MobileLayout>
  );
}
