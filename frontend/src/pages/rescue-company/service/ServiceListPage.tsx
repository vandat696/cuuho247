import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Button } from '@/components/common/Button';
import { ServiceCard } from '@/components/company/ServiceCard';
import { useServiceList } from '@/hooks/useServiceList';
import { AddRounded as AddIcon } from '@mui/icons-material';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function ServiceListPage() {
  const navigate = useNavigate();
  const { services, loading } = useServiceList();

  const handleAddService = () => {
    navigate('/company/services/new');
  };

  const handleViewDetail = (serviceId: string) => {
    navigate(`/company/services/${serviceId}`);
  };

  if (loading) {
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

  return (
    <MobileLayout>
      <AppHeader title="Danh mục dịch vụ" backFallback="/company/home" />

      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}>
        {/* Add Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddService}
            startIcon={<AddIcon sx={{ fontSize: 20 }} />}
          >
            Thêm dịch vụ mới
          </Button>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2, fontSize: '1.1rem' }}>
          Dịch vụ hiện có ({services.length})
        </Typography>

        {services.length === 0 ? (
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'grey.400',
            }}
          >
            <Typography sx={{ color: 'text.secondary' }}>Chưa có dịch vụ nào được tạo</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} onViewDetail={handleViewDetail} />
            ))}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
