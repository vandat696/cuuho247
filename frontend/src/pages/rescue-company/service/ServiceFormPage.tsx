import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, MenuItem, Select, FormControl, Button, CircularProgress } from '@mui/material';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { useServiceForm } from '@/hooks/useServiceForm';
import { useServiceDetail } from '@/hooks/useServiceDetail';

export default function ServiceFormPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const isEditing = !!serviceId;
  // Load existing service if editing
  const { service, loading: serviceLoading } = useServiceDetail(isEditing ? serviceId : undefined);

  // Initialize form hook
  const { formData, errors, isLoading, categories, categoriesLoading, handleChange, handleSubmit, handleCancel } =
    useServiceForm(isEditing ? service || undefined : undefined);

  if (isEditing && serviceLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const sortedCategories = [...categories].sort((a, b) => {
    const isOtherA = a.name.includes('Sự cố khác');
    const isOtherB = b.name.includes('Sự cố khác');

    if (isOtherA && !isOtherB) return 1;
    if (!isOtherA && isOtherB) return -1;
    return 0;
  });

  return (
    <MobileLayout>
      <AppHeader title={isEditing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'} backFallback="/company/services" />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        {/* Category Select */}
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Loại dịch vụ <span style={{ color: 'red' }}>*</span>
          </Typography>
          {categoriesLoading ? (
            <CircularProgress size={24} />
          ) : (
            <FormControl fullWidth size="small" error={!!errors.category_id}>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Chọn loại dịch vụ
                </MenuItem>
                {sortedCategories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.category_id}
                </Typography>
              )}
            </FormControl>
          )}
        </Box>

        {/* Name Input */}
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Tên dịch vụ <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            size="small"
            name="name"
            placeholder="Nhập tên dịch vụ"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Box>

        {/* Price Input */}
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Giá dịch vụ (VNĐ) <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            size="small"
            name="price"
            type="number"
            // If value is 0, show empty string so user can type cleanly
            value={formData.price === 0 ? '' : formData.price}
            onChange={(e) => {
              const val = e.target.value;
              handleChange('price', val === '' ? 0 : Number(val));
            }}
            error={!!errors.price}
            helperText={errors.price}
          />
        </Box>

        {/* Description */}
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Mô tả dịch vụ
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            name="description"
            placeholder="Nhập mô tả chi tiết"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading || categoriesLoading}
            sx={{
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: '#152943' },
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Lưu thay đổi
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleCancel}
            disabled={isLoading}
            sx={{
              borderColor: 'secondary.main',
              color: 'secondary.main',
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </MobileLayout>
  );
}
