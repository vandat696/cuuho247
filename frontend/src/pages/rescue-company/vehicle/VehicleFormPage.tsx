import { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Select, FormControl, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileLayout } from '../../../components/layout/MobileLayout';
import { AppHeader } from '../../../components/layout/AppHeader';
import { vehicleService } from '../../../services/vehicle.service';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [plateError, setPlateError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validatePlate = (plate: string) => {
    const regex = /^[0-9]{2}[A-Z][0-9A-Z]?-[0-9]{4,5}$/i;
    if (!plate) return 'Biển số xe không được để trống';
    if (!regex.test(plate)) return 'Định dạng biển số không hợp lệ (VD: 30A-12345)';
    return '';
  };

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
    if (name === 'plate_number' && plateError) {
      setPlateError('');
    }
  };

  const handleSave = async () => {
    const error = validatePlate(formData.plate_number);
    if (error) {
      setPlateError(error);
      return;
    }

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
      setErrorMessage('Có lỗi xảy ra khi lưu. Có thể biển số đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (isEdit && id) {
      try {
        setLoading(true);
        await vehicleService.deleteVehicle(id);
        navigate('/company/vehicles');
      } catch (error) {
        console.error('Lỗi khi xóa xe', error);
        setLoading(false);
      } finally {
        setOpenConfirm(false);
      }
    }
  };

  return (
    <MobileLayout>
      <AppHeader title={isEdit ? 'Chỉnh sửa xe cứu hộ' : 'Thêm xe cứu hộ'} backFallback="/company/vehicles" />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Loại xe cứu hộ <span style={{ color: 'red' }}>*</span>
          </Typography>
          <FormControl fullWidth size="small">
            <Select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} displayEmpty>
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
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Biển số xe
          </Typography>
          <TextField
            fullWidth
            size="small"
            name="plate_number"
            placeholder="Ví dụ: 30A-12345"
            value={formData.plate_number}
            onChange={handleChange}
            error={!!plateError}
            helperText={plateError}
          />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'secondary.main', mb: 1 }}>
            Trạng thái
          </Typography>
          <FormControl fullWidth size="small">
            <Select name="status" value={formData.status} onChange={handleChange}>
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

          {isEdit && (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleDeleteClick}
              disabled={loading}
              sx={{
                borderColor: 'secondary.main',
                color: 'secondary.main',
                py: 1.5,
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Xóa xe
            </Button>
          )}
        </Box>
      </Box>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa xe cứu hộ này?"
        loading={loading}
      />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </MobileLayout>
  );
}
