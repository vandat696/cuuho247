import { Typography, Rating, Paper } from '@mui/material';

interface OverallRatingCardProps {
  companyName: string;
  rating: number;
  onRatingChange: (newValue: number | null) => void;
  disabled?: boolean;
}

export const OverallRatingCard = ({ companyName, rating, onRatingChange, disabled }: OverallRatingCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        textAlign: 'center',
        bgcolor: '#f8fafc',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
        {companyName}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
        Bạn hài lòng như thế nào với dịch vụ?
      </Typography>
      <Rating
        name="overall-rating"
        value={rating}
        onChange={(_, newValue) => onRatingChange(newValue)}
        size="large"
        disabled={disabled}
        sx={{
          fontSize: '3rem',
          color: '#f59e0b',
        }}
      />
    </Paper>
  );
};
