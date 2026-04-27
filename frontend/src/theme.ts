import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b00',
      light: '#fff3e0',
      dark: '#e05a00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e3a5f',
      light: '#ebf4ff',
      dark: '#162d4a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e3a5f',
      secondary: '#4a5568',
      disabled: '#a0aec0',
    },
    success: {
      main: '#16a34a',
      light: '#dcfce7',
    },
    error: {
      main: '#dc2626',
      light: '#fee2e2',
    },
    warning: {
      main: '#d97706',
      light: '#fef3c7',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 14,
    h1: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1e3a5f',
    },
    h2: {
      fontSize: '22px',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#1e3a5f',
    },
    h3: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e3a5f',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#1e3a5f',
    },
    body1: {
      fontSize: '16px',
      color: '#4a5568',
    },
    body2: {
      fontSize: '14px',
      color: '#4a5568',
    },
    caption: {
      fontSize: '12px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          ...(ownerState.size === 'small' && {
            height: '36px',
            padding: '0 16px',
            fontSize: '14px',
          }),
          ...(ownerState.size === 'medium' && {
            height: '48px',
            padding: '0 24px',
            fontSize: '16px',
          }),
          ...(ownerState.size === 'large' && {
            height: '56px',
            padding: '0 32px',
            fontSize: '18px',
          }),
        }),
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: '#fff3e0',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '56px',
          display: 'flex',
          justifyContent: 'center',
          boxShadow: 'none',
          backgroundColor: '#1e3a5f',
          color: '#ffffff',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px !important',
          padding: '0 16px !important',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html {
          -webkit-text-size-adjust: 100%;
          scroll-behavior: smooth;
        }
        body {
          background-color: #f5f7fa;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `,
    },
  },
});
