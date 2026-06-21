import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';

interface ImagePreviewDialogProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export function ImagePreviewDialog({ open, imageUrl, onClose }: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#000' }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
