import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import RvHookupIcon from '@mui/icons-material/RvHookup';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../../../components/layout/MobileLayout';
import { AppHeader } from '../../../components/layout/AppHeader';
import { IVehicle } from '../../../types/vehicle.types';
import { vehicleService } from '../../../services/vehicle.service';

export default function VehicleListPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Xe may cuu ho':
        return <TwoWheelerIcon />;
      case 'Xe keo o to':
        return <RvHookupIcon />;
      case 'Xe ban tai':
        return <AirportShuttleIcon />;
      case 'Xe tai cau':
        return <LocalShippingIcon />;
      default:
        return <LocalShippingIcon />;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await vehicleService.deleteVehicle(deleteId);
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== deleteId));
    } catch (error) {
      console.error('Error deleting vehicle', error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Danh sach xe cuu ho" backFallback="/company/home" />

      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'secondary.main' }}>
          Tong so xe: {vehicles.length}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {vehicles.map((vehicle) => (
              <Card key={vehicle._id} sx={{ p: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 1, borderRadius: '50%', display: 'flex' }}>
                      {getVehicleIcon(vehicle.vehicle_type)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'secondary.main' }}>
                        {vehicle.vehicle_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.plate_number}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={vehicle.status === 'available' ? 'San sang' : 'Bao tri'}
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
                      bgcolor: 'secondary.main',
                      '&:hover': { bgcolor: '#152943' },
                      textTransform: 'none',
                    }}
                  >
                    Sua
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDeleteClick(vehicle._id)}
                    sx={{ textTransform: 'none' }}
                  >
                    Xoa
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

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
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Them xe
        </Button>
      </Box>

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1, m: 2, width: '100%', maxWidth: '320px' },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'secondary.main', pb: 1 }}>
          Xac nhan xoa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center' }}>Ban co chac chan muon xoa xe nay?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: 1, px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteId(null)}
            variant="outlined"
            fullWidth
            sx={{ color: 'secondary.main', borderColor: 'secondary.main', textTransform: 'none', py: 1 }}
          >
            Huy
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            fullWidth
            sx={{ textTransform: 'none', py: 1 }}
            autoFocus
          >
            Xoa
          </Button>
        </DialogActions>
      </Dialog>
    </MobileLayout>
  );
}
