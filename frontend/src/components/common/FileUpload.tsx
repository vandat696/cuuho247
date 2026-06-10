import { useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Button } from './Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface FileUploadProps {
  label?: string;
  error?: string;
  hint?: string;
  accept?: string;
  maxSize?: number;
  onFileSelect?: (file: File | null) => void;
  loading?: boolean;
  disabled?: boolean;
  name?: string;
}

export const FileUpload = ({
  label,
  error,
  hint,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5 * 1024 * 1024,
  onFileSelect,
  loading = false,
  disabled = false,
  name,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    if (file.size > maxSize) {
      console.error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
          {label}
        </Typography>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || loading}
        name={name}
        style={{ display: 'none' }}
      />

      {!selectedFile ? (
        <Box
          onClick={handleClick}
          sx={{
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            bgcolor: error ? 'error.light' : 'action.hover',
            '&:hover': !disabled && !loading ? { borderColor: 'primary.main', bgcolor: 'action.selected' } : {},
            opacity: disabled || loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={32} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Đang tải lên...
              </Typography>
            </Box>
          ) : (
            <Box>
              <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                Kéo và thả tệp tại đây hoặc nhấp để chọn
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Hỗ trợ: PDF, JPG, PNG (Tối đa {maxSize / 1024 / 1024}MB)
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'success.main',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'success.light',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ color: 'success.main' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          </Box>
          <Button size="sm" variant="ghost" onClick={handleRemove} startIcon={<CancelIcon />}>
            Xóa
          </Button>
        </Box>
      )}

      {hint && !error && (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {hint}
        </Typography>
      )}

      {error && (
        <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

FileUpload.displayName = 'FileUpload';
