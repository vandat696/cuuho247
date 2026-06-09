import { Box, TextField, Button, Typography } from '@mui/material';

interface ReviewInputFormProps {
  content: string;
  onContentChange: (newContent: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const ReviewInputForm = ({
  content,
  onContentChange,
  onSubmit,
  onCancel,
  isSubmitting,
  disabled,
}: ReviewInputFormProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
          {disabled ? 'Nhận xét của bạn' : 'Nhận xét của bạn (tùy chọn)'}
        </Typography>
        {disabled ? (
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', minHeight: '80px' }}>
            <Typography variant="body2" color={content ? 'text.primary' : 'text.secondary'}>
              {content || 'Không có nhận xét'}
            </Typography>
          </Box>
        ) : (
          <>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Hãy chia sẻ thêm về trải nghiệm của bạn..."
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2,
                },
              }}
              inputProps={{ maxLength: 1000 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
              {content.length}/1000
            </Typography>
          </>
        )}
      </Box>

      {!disabled && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting} sx={{ flex: 1, borderRadius: 2 }}>
            Bỏ qua
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={isSubmitting}
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Gửi đánh giá
          </Button>
        </Box>
      )}
    </Box>
  );
};
