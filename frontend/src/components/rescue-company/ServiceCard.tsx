import { Box, Typography } from '@mui/material';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Service } from '@/types/service.type';
import { BuildRounded as WrenchIcon } from '@mui/icons-material';

interface ServiceCardProps {
  service: Service;
  onViewDetail: (serviceId: string) => void;
}

export const ServiceCard = ({ service, onViewDetail }: ServiceCardProps) => {
  return (
    <Card variant="default" padding="md">
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(26, 58, 92, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a3a5c',
          }}
        >
          <WrenchIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '15px',
              color: 'secondary.main',
              mb: 0.5,
            }}
          >
            {service.name}
          </Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'secondary.main',
            }}
          >
            Giá: {service.price.toLocaleString()}đ
          </Typography>
        </Box>
      </Box>
      <Button
        variant="secondary"
        size="md"
        fullWidth
        onClick={() => onViewDetail(service._id)}
        sx={{ mt: 1, fontWeight: 'bold' }}
      >
        Xem chi tiết
      </Button>
    </Card>
  );
};
