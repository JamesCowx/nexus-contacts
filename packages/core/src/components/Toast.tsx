import { Box, Typography } from '@mui/material';
import { CheckCircle, Error, Info } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useToastStore } from '../store/toastStore';

const slideIn = keyframes`
  from { transform: translateY(20px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0) scale(1); opacity: 1; }
  to { transform: translateY(20px) scale(0.95); opacity: 0; }
`;

const icons = {
  success: <CheckCircle sx={{ fontSize: 18 }} />,
  error: <Error sx={{ fontSize: 18 }} />,
  info: <Info sx={{ fontSize: 18 }} />,
};

const colors = {
  success: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', icon: '#34D399' },
  error: { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.2)', icon: '#FB7185' },
  info: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', icon: '#A78BFA' },
};

export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const c = colors[t.type];
        return (
          <Box
            key={t.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1.25,
              borderRadius: 2.5,
              backdropFilter: 'blur(24px)',
              backgroundColor: c.bg,
              border: `1px solid ${c.border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: `${slideIn} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), ${slideOut} 0.3s 2.2s ease-in forwards`,
              pointerEvents: 'auto',
              minWidth: 220,
            }}
          >
            <Box sx={{ color: c.icon, display: 'flex' }}>{icons[t.type]}</Box>
            <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: 'text.primary' }}>
              {t.message}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
