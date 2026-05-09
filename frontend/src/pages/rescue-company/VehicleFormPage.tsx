import { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Select, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { AppHeader } from '../../components/layout/AppHeader';
import { vehicleService } from '../../services/vehicle.service';

const VEHICLE_TYPES = ['Xe bán tải', 'Xe kéo ô tô', 'Xe máy cứu hộ', 'Xe tải cẩu'];

export default function VehicleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<{
    vehicle_type: string;
    plate_number: string;
    status: 'available' | 'unavailable';
  }>({
    vehicle_type: '',
    plate_number: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchVehicle(id);
    }
  }, [id, isEdit]);

  const fetchVehicle = async (vehicleId: string) => {
    try {
      const data = await vehicleService.getVehicle(vehicleId);
      setFormData({
        vehicle_type: data.vehicle_type,
        plate_number: data.plate_number,
        status: data.status,
      });
    } catch (error) {
      console.error('Lỗi khi tải thông tin xe', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isEdit && id) {
        await vehicleService.updateVehicle(id, formData);
      } else {
        await vehicleService.createVehicle(formData);
      }
      navigate('/company/vehicles');
    } catch (error) {
      console.error('Lỗi khi lưu xe', error);
      alert('Có lỗi xảy ra khi lưu. Có thể biển số đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isEdit && id && window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      try {
        setLoading(true);
        await vehicleService.deleteVehicle(id);
        navigate('/company/vehicles');
      } catch (error) {
        console.error('Lỗi khi xóa xe', error);
        setLoading(false);
      }
    }
  };

  return (
    <MobileLayout>
      <AppHeader title={isEdit ? 'Chỉnh sửa xe cứu hộ' : 'Thêm xe cứu hộ'} />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: '#1E3A5F', mb: 1 }}>
            Loại xe cứu hộ <span style={{ color: 'red' }}>*</span>
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="" disabled>
                Chọn loại xe
              </MenuItem>
              {VEHICLE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: '#1E3A5F', mb: 1 }}>
            Biển số xe
          </Typography>
          <TextField
            fullWidth
            size="small"
            name="plate_number"
            placeholder="Ví dụ: 30A-12345"
            value={formData.plate_number}
            onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: '#1E3A5F', mb: 1 }}>
            Trạng thái
          </Typography>
          <FormControl fullWidth size="small">
            <Select name="status" value={formData.status} onChange={handleChange} sx={{ borderRadius: 2 }}>
              <MenuItem value="available">Hoạt động</MenuItem>
              <MenuItem value="unavailable">Bảo trì</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
            disabled={loading || !formData.vehicle_type || !formData.plate_number}
            sx={{
              bgcolor: '#1E3A5F',
              '&:hover': { bgcolor: '#152943' },
              py: 1.5,
              textTransform: 'none',
              borderRadius: 2,
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Lưu thay đổi
          </Button>

          {isEdit && (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleDelete}
              disabled={loading}
              sx={{
                borderColor: '#1E3A5F',
                color: '#1E3A5F',
                py: 1.5,
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Xóa xe
            </Button>
          )}
        </Box>
      </Box>
    </MobileLayout>
  );
}
