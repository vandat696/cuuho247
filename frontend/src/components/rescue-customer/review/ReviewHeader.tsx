import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const ReviewHeader = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#001a4d', // theme.palette.primary.main could be used, but matching UI here
          mb: 2,
        }}
      >
        <StarIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#001a4d', mb: 1 }}>
        Đánh giá trải nghiệm
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi! Bạn cảm thấy thế nào về trải nghiệm này?
      </Typography>
    </Box>
  );
};
