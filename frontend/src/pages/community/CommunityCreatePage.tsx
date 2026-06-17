import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoCameraOutlined as Camera } from '@mui/icons-material';
import { Box, Typography, Button as MuiButton, InputBase } from '@mui/material';
import { AppHeader } from '../../components/layout/AppHeader';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { communityService } from '../../services/community.service';
import { serviceService } from '../../services/service.service';
import { toast } from 'react-hot-toast';
import { ORANGE, CARD_RADIUS, BUTTON_RADIUS } from '../../constants/colors';

const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await serviceService.getCategories();
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung bài viết');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (selectedTag) {
        formData.append('tags', selectedTag);
      }
      if (image) {
        formData.append('images', image);
      }

      await communityService.createPost(formData);
      toast.success('Đăng bài thành công');
      navigate('/community', { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đăng bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Tạo bài viết" showBack onBack={() => navigate(-1)} />

      <Box sx={{ p: 2, flex: 1, bgcolor: '#f8fafc', overflowY: 'auto' }}>
        <Box
          sx={{
            bgcolor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e3a8a',
            p: 2,
            borderRadius: CARD_RADIUS,
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: 14 }}>
            <strong>Hướng dẫn:</strong> Chia sẻ trải nghiệm, câu hỏi hoặc mẹo hữu ích về xe và dịch vụ cứu hộ với cộng
            đồng.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#334155', mb: 1 }}>Tiêu đề bài viết</Typography>
            <InputBase
              fullWidth
              placeholder="Nhập tiêu đề..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                bgcolor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: BUTTON_RADIUS,
                px: 2,
                py: 1.5,
                fontSize: 15,
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#334155', mb: 1 }}>Nội dung</Typography>
            <Box
              component="textarea"
              placeholder="Chia sẻ suy nghĩ của bạn..."
              value={content}
              onChange={(e: any) => setContent(e.target.value)}
              sx={{
                width: '100%',
                bgcolor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: BUTTON_RADIUS,
                p: 2,
                fontSize: 15,
                fontFamily: 'inherit',
                minHeight: 150,
                resize: 'none',
                outline: 'none',
                '&:focus': { borderColor: ORANGE },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#334155', mb: 1 }}>Chủ đề (tùy chọn)</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Box
                  key={tag._id}
                  onClick={() => setSelectedTag(tag._id === selectedTag ? '' : tag._id)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '999px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedTag === tag._id ? ORANGE : '#e2e8f0',
                    bgcolor: selectedTag === tag._id ? 'rgba(255, 107, 0, 0.1)' : '#fff',
                    color: selectedTag === tag._id ? ORANGE : '#475569',
                  }}
                >
                  {tag.name}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#334155', mb: 1 }}>Hình ảnh (tùy chọn)</Typography>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: imagePreview ? ORANGE : '#cbd5e1',
                bgcolor: imagePreview ? 'rgba(255, 107, 0, 0.05)' : '#fff',
                borderRadius: CARD_RADIUS,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
              />
              {imagePreview ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: 400,
                    borderRadius: BUTTON_RADIUS,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f8fafc',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      '&:hover': { opacity: 1 },
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>Thay đổi ảnh</Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      mb: 1.5,
                    }}
                  >
                    <Camera sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: 14 }}>Tải lên hình ảnh</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: 12, mt: 0.5 }}>JPG, PNG (Tối đa 5MB)</Typography>
                </>
              )}
            </Box>
          </Box>

          <MuiButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || !title.trim() || !content.trim()}
            sx={{
              bgcolor: ORANGE,
              py: 1.5,
              borderRadius: BUTTON_RADIUS,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: 16,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#e66000', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: '#fdb482', color: '#fff' },
            }}
          >
            {isSubmitting ? 'Đang đăng...' : 'Đăng bài viết'}
          </MuiButton>
        </form>
      </Box>
    </MobileLayout>
  );
};

export default CommunityCreatePage;
