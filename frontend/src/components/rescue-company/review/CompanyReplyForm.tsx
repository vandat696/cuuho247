import { Box, TextField, Button, Typography } from '@mui/material';

interface CompanyReplyFormProps {
  content: string;
  onContentChange: (newContent: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const CompanyReplyForm = ({
  content,
  onContentChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: CompanyReplyFormProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Phản hồi khách hàng
      </Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Nhập nội dung phản hồi..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            borderRadius: 2,
          },
        }}
        inputProps={{ maxLength: 500 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {content.length}/500
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting} size="small" sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={isSubmitting || !content.trim()}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Gửi phản hồi
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
