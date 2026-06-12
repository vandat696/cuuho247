import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  ErrorOutlineRounded as ErrorIcon,
  RefreshRounded as RefreshIcon,
  HomeRounded as HomeIcon,
} from '@mui/icons-material';
import { NAVY, ORANGE, CARD_RADIUS, BUTTON_RADIUS } from '@/constants/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in react component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#f8fafc',
            px: 3,
            py: 6,
            textAlign: 'center',
            fontFamily: 'var(--font)',
          }}
        >
          {/* Main Error Card with subtle glassmorphism / shadow */}
          <Box
            sx={{
              maxWidth: 420,
              width: '100%',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: CARD_RADIUS,
              boxShadow: '0 8px 30px rgba(27, 58, 93, 0.08)',
              border: '1px solid rgba(27, 58, 93, 0.05)',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Warning Glow Icon */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 107, 0, 0.1)',
                color: ORANGE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 4px 20px rgba(255, 107, 0, 0.15)',
              }}
            >
              <ErrorIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* Error Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: NAVY,
                mb: 1.5,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
              }}
            >
              Đã xảy ra sự cố ngoài ý muốn
            </Typography>

            {/* Error Subtitle */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 3.5,
                lineHeight: 1.6,
                px: 1,
              }}
            >
              Ứng dụng gặp lỗi khi hiển thị giao diện. Vui lòng tải lại trang hoặc quay về trang chủ để tiếp tục sử
              dụng.
            </Typography>

            {/* Hidden technical details for dev troubleshooting */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  width: '100%',
                  bgcolor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  p: 1.5,
                  mb: 3.5,
                  textAlign: 'left',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#991b1b',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {this.state.error.stack || this.state.error.message}
                </Typography>
              </Box>
            )}

            {/* Action Buttons Stack */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              <Button
                variant="contained"
                onClick={this.handleReload}
                startIcon={<RefreshIcon />}
                sx={{
                  bgcolor: NAVY,
                  color: '#fff',
                  py: 1.5,
                  borderRadius: BUTTON_RADIUS,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#142b47',
                    boxShadow: 'none',
                  },
                }}
                fullWidth
              >
                Tải lại trang
              </Button>

              <Button
                variant="outlined"
                onClick={this.handleGoHome}
                startIcon={<HomeIcon />}
                sx={{
                  color: NAVY,
                  borderColor: 'rgba(27, 58, 93, 0.2)',
                  py: 1.5,
                  borderRadius: BUTTON_RADIUS,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  '&:hover': {
                    borderColor: NAVY,
                    bgcolor: 'rgba(27, 58, 93, 0.04)',
                  },
                }}
                fullWidth
              >
                Quay về trang chủ
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
