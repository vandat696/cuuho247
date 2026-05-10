import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

interface ImageUploaderProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxCount?: number;
}

const MAX_SIZE_MB = 10;

export function ImageUploader({ images, onChange, maxCount = 5 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoneClick = () => {
    if (images.length < maxCount) {
      fileInputRef.current?.click();
    }
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue;
      valid.push(file);
    }

    const combined = [...images, ...valid].slice(0, maxCount);
    onChange(combined);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const hasImages = images.length > 0;

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
        Hình ảnh sự cố{' '}
        <Typography component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>
          (tùy chọn)
        </Typography>
      </Typography>

      {!hasImages ? (
        /* Large Full-Width Zone when empty */
        <Box
          onClick={handleZoneClick}
          sx={{
            border: '1.5px dashed #cbd5e0',
            borderRadius: '12px',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: '#fafafa',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'rgba(255, 107, 0, 0.02)',
            },
          }}
        >
          <Box sx={{ color: '#a0aec0', mb: 2 }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Chụp hoặc tải lên hình ảnh
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            JPG, PNG (Tối đa {MAX_SIZE_MB}MB)
          </Typography>
        </Box>
      ) : (
        /* Grid Layout when has images */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1.5,
          }}
        >
          {images.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <Box
                key={idx}
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                <img src={url} alt={`Ảnh ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    width: 24,
                    height: 24,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </IconButton>
              </Box>
            );
          })}

          {/* Square Add Tile in Grid */}
          {images.length < maxCount && (
            <Box
              onClick={handleZoneClick}
              sx={{
                border: '1.5px dashed #cbd5e0',
                borderRadius: '12px',
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: '#fafafa',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(255, 107, 0, 0.02)',
                },
              }}
            >
              <Box sx={{ color: '#a0aec0', mb: 0.5 }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: 'text.primary', fontSize: 10, textAlign: 'center', px: 0.5 }}
              >
                Thêm ảnh
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => addFiles(e.target.files)}
      />
    </Box>
  );
}
