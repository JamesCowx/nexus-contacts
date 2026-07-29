import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.03em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, letterSpacing: '0.03em' },
    overline: { fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.65rem' },
    body1: { letterSpacing: '0.01em' },
    body2: { letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 14 },
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F472B6',
      light: '#F9A8D4',
      dark: '#EC4899',
    },
    background: {
      default: '#070312',
      paper: 'rgba(18, 12, 36, 0.85)',
    },
    divider: 'rgba(255,255,255,0.04)',
    text: {
      primary: '#F0EEFF',
      secondary: 'rgba(180, 175, 210, 0.7)',
    },
    error: { main: '#FB7185' },
    warning: { main: '#FBBF24' },
    success: { main: '#34D399' },
    action: {
      hover: 'rgba(139, 92, 246, 0.08)',
      selected: 'rgba(139, 92, 246, 0.15)',
      focus: 'rgba(139, 92, 246, 0.12)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          background: '#070312',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.06), transparent)',
        },
        '*::-webkit-scrollbar': { width: 4 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { background: 'rgba(139,92,246,0.3)', borderRadius: 2 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(18, 12, 36, 0.75)',
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '8px 18px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
          boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
            boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(139,92,246,0.3)',
          '&:hover': {
            borderColor: 'rgba(139,92,246,0.6)',
            backgroundColor: 'rgba(139,92,246,0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              boxShadow: '0 0 0 2px rgba(139,92,246,0.25)',
            },
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.06)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139,92,246,0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B5CF6',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        filled: {
          backgroundColor: 'rgba(139,92,246,0.15)',
          color: '#A78BFA',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(139,92,246,0.1)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.04)',
        },
      },
    },
  },
});
