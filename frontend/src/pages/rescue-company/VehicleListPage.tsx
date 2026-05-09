import { useEffect, useState } from 'react';
import { Box, Typography, Card, Button, IconButton, Chip, CircularProgress } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { AppHeader } from '../../components/layout/AppHeader';
import { IVehicle } from '../../types/vehicle.types';
import { vehicleService } from '../../services/vehicle.service';

export default function VehicleListPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách xe', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      try {
        await vehicleService.deleteVehicle(id);
        setVehicles(vehicles.filter((v) => v._id !== id));
      } catch (error) {
        console.error('Lỗi khi xóa xe', error);
      }
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Danh sách xe cứu hộ" />

      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#1E3A5F' }}>
          Tổng số xe: {vehicles.length}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {vehicles.map((vehicle) => (
              <Card key={vehicle._id} sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ bgcolor: '#1E3A5F', color: 'white', p: 1, borderRadius: '50%', display: 'flex' }}>
                      <LocalShippingIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1E3A5F' }}>
                        {vehicle.vehicle_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.plate_number}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={vehicle.status === 'available' ? 'Hoạt động' : 'Bảo trì'}
                    size="small"
                    sx={{
                      bgcolor: vehicle.status === 'available' ? '#e8f5e9' : '#fff8e1',
                      color: vehicle.status === 'available' ? '#2e7d32' : '#f57f17',
                      fontWeight: 'bold',
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/company/vehicles/${vehicle._id}/edit`)}
                    sx={{
                      bgcolor: '#1E3A5F',
                      '&:hover': { bgcolor: '#152943' },
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDelete(vehicle._id)}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Xóa
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Bottom Fixed Button */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: 'background.default',
          borderTop: '1px solid #e0e0e0',
          zIndex: 10,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => navigate('/company/vehicles/new')}
          sx={{
            bgcolor: '#FF7A00',
            '&:hover': { bgcolor: '#E66A00' },
            color: 'white',
            py: 1.5,
            textTransform: 'none',
            borderRadius: 2,
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Thêm xe
        </Button>
      </Box>
    </MobileLayout>
  );
}
