import { useEffect, useState, useCallback, useRef } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, useMediaQuery } from '@mui/material';
import { keyframes } from '@emotion/react';
import { theme } from '../theme';
import { ContactList } from './ContactList';
import { ContactDetail } from './ContactDetail';
import { ContactForm } from './ContactForm';
import { ToastContainer } from './Toast';
import { Particles } from './Particles';
import { useContactStore } from '../store/contactStore';

const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseRing = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.08; }
  50% { transform: scale(1.08); opacity: 0.15; }
`;

type View = 'list' | 'detail' | 'form';

export function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { loadContacts, selectedContactId, selectContact } = useContactStore();
  const [view, setView] = useState<View>('list');
  const [editId, setEditId] = useState<string | undefined>();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (selectedContactId && view === 'list') {
      setView('detail');
    }
  }, [selectedContactId, view]);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const showList = view === 'list' || isDesktop;
  const showDetail = view === 'detail' || (isDesktop && selectedContactId !== null);
  const showForm = view === 'form';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Particles />
      <Box
        ref={rootRef}
        onMouseMove={handleMouse}
        sx={{
          height: '100vh',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          animation: `${fadeIn} 0.4s`,
          '&::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            background: `
              radial-gradient(circle 600px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(139,92,246,0.04), transparent 60%),
              radial-gradient(ellipse 60% 40% at 0% 20%, rgba(139,92,246,0.03), transparent),
              radial-gradient(ellipse 60% 40% at 100% 80%, rgba(236,72,153,0.02), transparent)
            `,
            animation: `${bgShift} 12s ease-in-out infinite alternate`,
            backgroundSize: '200% 200%',
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'background 0.15s ease-out',
          },
          '&::after': {
            content: '""',
            position: 'fixed',
            inset: 0,
            opacity: 0.015,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        {isDesktop ? (
          <>
            <Box
              sx={{
                width: 360,
                minWidth: 360,
                height: '100vh',
                borderRight: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(18,12,36,0.5)',
              }}
            >
              <ContactList onAdd={() => { setView('form'); setEditId(undefined); }} />
            </Box>
            <Box sx={{ flex: 1, height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
              {showForm ? (
                <ContactForm
                  contactId={editId}
                  onBack={() => { setView(selectedContactId ? 'detail' : 'list'); }}
                />
              ) : selectedContactId ? (
                <ContactDetail
                  onBack={() => { selectContact(null); }}
                  onEdit={() => { setEditId(selectedContactId); setView('form'); }}
                />
              ) : (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3.5 }}>
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.08))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -12,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(139,92,246,0.06)',
                        animation: `${pulseRing} 3s ease-in-out infinite`,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: -24,
                        borderRadius: '50%',
                        border: '1px solid rgba(139,92,246,0.03)',
                        animation: `${pulseRing} 3s ease-in-out 0.5s infinite`,
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: 40, lineHeight: 1, filter: 'grayscale(0.3)' }}>📇</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: 'text.primary', mb: 0.75, letterSpacing: '-0.02em' }}>
                      No contact selected
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', opacity: 0.4, maxWidth: 220, mx: 'auto', lineHeight: 1.6 }}>
                      Choose a contact from the sidebar or create a new one
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                transform: showList ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: showList ? 'visible' : 'hidden',
              }}
            >
              <ContactList onAdd={() => { setView('form'); setEditId(undefined); }} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                transform: showDetail ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: showDetail ? 'visible' : 'hidden',
              }}
            >
              {selectedContactId && (
                <ContactDetail
                  onBack={() => { setView('list'); selectContact(null); }}
                  onEdit={() => { setEditId(selectedContactId); setView('form'); }}
                />
              )}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                transform: showForm ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: showForm ? 'visible' : 'hidden',
              }}
            >
              <ContactForm
                contactId={editId}
                onBack={() => { setView(selectedContactId ? 'detail' : 'list'); }}
              />
            </Box>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}
