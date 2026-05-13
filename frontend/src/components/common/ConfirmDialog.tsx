import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, p: 1, m: 2, width: '100%', maxWidth: '320px' },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'secondary.main', pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center' }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', gap: 1, px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ color: 'secondary.main', borderColor: 'secondary.main', textTransform: 'none', py: 1 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ textTransform: 'none', py: 1 }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
}
