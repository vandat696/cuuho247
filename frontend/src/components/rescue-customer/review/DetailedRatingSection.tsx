import { Box, Typography, Rating, Divider } from '@mui/material';
import { DetailedRatings } from '../../../services/review.service';

interface DetailedRatingSectionProps {
  ratings: DetailedRatings;
  onRatingChange: (field: keyof DetailedRatings, newValue: number | null) => void;
  disabled?: boolean;
}

export const DetailedRatingSection = ({ ratings, onRatingChange, disabled }: DetailedRatingSectionProps) => {
  const criteria = [
    { key: 'response_time', label: 'Thời gian phản hồi' },
    { key: 'service_quality', label: 'Chất lượng dịch vụ' },
    { key: 'staff_attitude', label: 'Thái độ nhân viên' },
    { key: 'pricing', label: 'Giá cả hợp lý' },
  ] as const;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
        Đánh giá chi tiết (tùy chọn)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {criteria.map((item, index) => (
          <Box key={item.key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Rating
                name={item.key}
                value={ratings[item.key] || 0}
                onChange={(_, newValue) => onRatingChange(item.key, newValue)}
                size="medium"
                disabled={disabled}
                sx={{ color: '#f59e0b' }}
              />
            </Box>
            {index < criteria.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
