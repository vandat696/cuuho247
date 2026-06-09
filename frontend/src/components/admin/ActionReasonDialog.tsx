import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box } from '@mui/material';
import { Button } from '@/components/common/Button';
import { NAVY } from '@/constants/colors';

interface ActionReasonDialogProps {
  open: boolean;
  title: string;
  placeholder: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ActionReasonDialog = ({
  open,
  title,
  placeholder,
  loading,
  onClose,
  onConfirm,
}: ActionReasonDialogProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do/yêu cầu cụ thể.');
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 1.5,
        },
      }}
    >
      <DialogTitle sx={{ p: 2, pb: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{title}</Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2, py: 1 }}>
        <TextField
          autoFocus
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          placeholder={placeholder}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          error={Boolean(error)}
          helperText={error}
          variant="outlined"
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 1.5 }}>
          <Button variant="outline" fullWidth onClick={onClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button variant="secondary" fullWidth onClick={handleConfirm} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Xác nhận'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
