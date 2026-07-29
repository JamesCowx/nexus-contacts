import { useRef, useState, useCallback } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Typography,
  Fade,
  Zoom,
} from '@mui/material';
import {
  ArrowBack,
  Delete,
  Edit,
  Phone,
  Email,
  LocationOn,
  Cake,
  Notes,
  Star,
  StarBorder,
  Language,
  Message,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useContactStore } from '../store/contactStore';
import { useToastStore } from '../store/toastStore';
import { formatDisplayName, getInitials, getAvatarColor, getGradient } from '../utils/helpers';

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glowRing = keyframes`
  0%, 100% { opacity: 0.12; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.06); }
`;

const heroEnter = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const sectionEnter = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const arrowSlide = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-3px); }
`;

export function ContactDetail({ onBack, onEdit }: { onBack: () => void; onEdit: () => void }) {
  const { contacts, selectContact, toggleStar, deleteContact, selectedContactId } = useContactStore();
  const showToast = useToastStore((s) => s.show);
  const contact = contacts.find((c) => c.id === selectedContactId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollY(scrollRef.current.scrollTop);
  }, []);

  if (!contact) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 32, opacity: 0.3 }}>👤</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '1rem' }}>Select a contact</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', opacity: 0.4, mt: 0.25 }}>to view their details</Typography>
        </Box>
      </Box>
    );
  }

  const displayName = formatDisplayName(contact);
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName);
  const avatarGrad = getGradient(displayName);

  const handleDelete = async () => {
    await deleteContact(contact.id);
    showToast(`Deleted ${displayName}`, 'error');
    onBack();
  };

  return (
    <Fade in key={contact.id} timeout={250}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', px: 1.5, py: 0.75,
            backdropFilter: 'blur(20px)', backgroundColor: 'rgba(7,3,18,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.03)', position: 'relative', zIndex: 10,
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{ mr: 0.5, '&:hover .back-arrow': { animation: `${arrowSlide} 0.3s ease-out` } }}
          >
            <ArrowBack className="back-arrow" />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={() => toggleStar(contact.id)} size="small" sx={{ mr: 0.5 }}>
            {contact.starred
              ? <Star sx={{ color: '#FBBF24', filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.5))' }} />
              : <StarBorder />}
          </IconButton>
          <IconButton onClick={onEdit} size="small" sx={{ mr: 0.5 }}><Edit /></IconButton>
          <IconButton size="small" onClick={handleDelete}><Delete /></IconButton>
        </Box>

        <Box ref={scrollRef} onScroll={handleScroll} sx={{ flex: 1, overflow: 'auto' }}>
          <Box
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              py: 5, position: 'relative', overflow: 'hidden',
              transform: `translateY(${scrollY * -0.15}px)`,
              transition: 'transform 0.1s ease-out',
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 100% 60% at 50% 30%, ${avatarColor}15, transparent 70%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Zoom in style={{ transitionDelay: '0.1s' }}>
              <Box sx={{ position: 'relative', mb: 2.5 }}>
                <Box sx={{ position: 'absolute', inset: -8, borderRadius: '50%', background: avatarGrad, backgroundSize: '300% 300%', animation: `${gradientShift} 4s ease infinite`, opacity: 0.25 }} />
                <Box sx={{ position: 'absolute', inset: -18, borderRadius: '50%', border: `1.5px solid ${avatarColor}20`, animation: `${glowRing} 3s ease-in-out infinite` }} />
                <Box sx={{ position: 'absolute', inset: -30, borderRadius: '50%', border: `1px solid ${avatarColor}10`, animation: `${glowRing} 3s ease-in-out 0.5s infinite` }} />
                <Avatar
                  src={contact.photo}
                  sx={{
                    width: 100, height: 100, fontSize: 36, fontWeight: 700,
                    bgcolor: contact.photo ? 'transparent' : avatarColor,
                    border: '2.5px solid rgba(255,255,255,0.06)',
                    boxShadow: `0 8px 40px ${avatarColor}40`,
                    position: 'relative', transition: 'all 0.4s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: `0 12px 48px ${avatarColor}50` },
                  }}
                >
                  {!contact.photo && initials}
                </Avatar>
              </Box>
            </Zoom>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em',
                background: avatarGrad,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {displayName}
            </Typography>

            {(contact.company || contact.jobTitle) && (
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, opacity: 0.7 }}>
                {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
              </Typography>
            )}

            {contact.groups.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center', mb: 2.5 }}>
                {contact.groups.map((g) => (
                  <Chip key={g} label={g} size="small" sx={{ borderRadius: 1.5, background: 'rgba(139,92,246,0.12)', color: '#A78BFA', fontWeight: 600, fontSize: '0.65rem', border: '1px solid rgba(139,92,246,0.15)' }} />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              {contact.phoneNumbers.length > 0 && <ActionChip icon={<Phone />} label="Call" />}
              {contact.phoneNumbers.length > 0 && <ActionChip icon={<Message />} label="SMS" />}
              {contact.emails.length > 0 && <ActionChip icon={<Email />} label="Email" />}
            </Box>
          </Box>

          <Box sx={{ px: 2, pb: 4, mt: -0.5 }}>
            <SectionGroup delay={0.1}>
              {contact.phoneNumbers.length > 0 && (
                <TiltCard id="phone" avatarColor={avatarColor}>
                  <GlassSection title="Phone" icon={<Phone />}>
                    {contact.phoneNumbers.map((p, i) => (
                      <InfoRow key={p.id} label={p.label} value={p.number} delay={i * 0.05} avatarColor={avatarColor} />
                    ))}
                  </GlassSection>
                </TiltCard>
              )}
            </SectionGroup>

            <SectionGroup delay={0.15}>
              {contact.emails.length > 0 && (
                <TiltCard id="email" avatarColor={avatarColor}>
                  <GlassSection title="Email" icon={<Email />}>
                    {contact.emails.map((e, i) => (
                      <InfoRow key={e.id} label={e.label} value={e.address} delay={i * 0.05} avatarColor={avatarColor} />
                    ))}
                  </GlassSection>
                </TiltCard>
              )}
            </SectionGroup>

            <SectionGroup delay={0.2}>
              {contact.addresses.length > 0 && (
                <TiltCard id="address" avatarColor={avatarColor}>
                  <GlassSection title="Address" icon={<LocationOn />}>
                    {contact.addresses.map((a, i) => (
                      <InfoRow key={a.id} label={a.label} value={[a.street, a.city, a.state, a.zip].filter(Boolean).join(', ')} delay={i * 0.05} avatarColor={avatarColor} />
                    ))}
                  </GlassSection>
                </TiltCard>
              )}
            </SectionGroup>

            <SectionGroup delay={0.25}>
              {contact.socialProfiles.length > 0 && (
                <TiltCard id="social" avatarColor={avatarColor}>
                  <GlassSection title="Social" icon={<Language />}>
                    {contact.socialProfiles.map((s, i) => (
                      <InfoRow key={s.id} label={s.platform} value={s.username} delay={i * 0.05} avatarColor={avatarColor} />
                    ))}
                  </GlassSection>
                </TiltCard>
              )}
            </SectionGroup>

            <SectionGroup delay={0.3}>
              {(contact.birthday || contact.notes) && (
                <TiltCard id="other" avatarColor={avatarColor}>
                  <GlassSection title="Other">
                    {contact.birthday && <InfoRow icon={<Cake />} label="Birthday" value={contact.birthday} avatarColor={avatarColor} />}
                    {contact.notes && (
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 0.5, px: 0.5 }}>
                        <Notes sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3, opacity: 0.4 }} />
                        <Typography sx={{ fontSize: '0.825rem', whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'text.secondary', opacity: 0.7 }}>{contact.notes}</Typography>
                      </Box>
                    )}
                  </GlassSection>
                </TiltCard>
              )}
            </SectionGroup>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

function TiltCard({ id, avatarColor, children }: { id: string; avatarColor: string; children: React.ReactNode }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 4, y: y * -4 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <Box
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      sx={{
        perspective: '600px',
        transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.4s ease-out' : 'transform 0.08s ease-out',
      }}
    >
      {children}
    </Box>
  );
}

function SectionGroup({ delay, children }: { delay: number; children: React.ReactNode }) {
  return <Box sx={{ animation: `${sectionEnter} 0.5s ${delay}s both` }}>{children}</Box>;
}

function ActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)', '&:hover': { transform: 'translateY(-4px)', '& .action-icon': { boxShadow: '0 4px 20px rgba(139,92,246,0.3)', backgroundColor: 'rgba(139,92,246,0.18)' } } }}>
      <Box className="action-icon" sx={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid rgba(139,92,246,0.12)', transition: 'all 0.3s' }}>{icon}</Box>
      <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.6rem', letterSpacing: '0.03em', opacity: 0.5 }}>{label}</Typography>
    </Box>
  );
}

function GlassSection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box sx={{
      borderRadius: 3.5, p: 2.5, mb: 1.5, backdropFilter: 'blur(16px)',
      backgroundColor: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.03)',
      transition: 'all 0.3s',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(139,92,246,0.06)',
      },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
        {icon && (
          <Box sx={{
            width: 28, height: 28, borderRadius: 1.5, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(139,92,246,0.08)', color: 'primary.light',
            fontSize: 14, flexShrink: 0,
          }}>
            {icon}
          </Box>
        )}
        <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.12em', opacity: 0.55 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

const copyFlash = keyframes`
  0% { background-color: rgba(139,92,246,0.15); }
  100% { background-color: transparent; }
`;

const rowSlide = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
`;

function InfoRow({ icon, label, value, delay = 0, avatarColor }: { icon?: React.ReactNode; label: string; value: string; delay?: number; avatarColor?: string }) {
  const [flashed, setFlashed] = useState(false);

  const handleClick = () => {
    navigator.clipboard?.writeText(value);
    setFlashed(true);
    setTimeout(() => setFlashed(false), 500);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 2,
        py: 1.25, px: 1.5, mx: -1.5, cursor: 'pointer', borderRadius: 2.5,
        transition: 'all 0.2s',
        animation: `${rowSlide} 0.35s ${delay}s both`,
        animationFillMode: 'both',
        backgroundColor: flashed ? 'rgba(139,92,246,0.12)' : 'transparent',
        '&:hover': {
          backgroundColor: avatarColor ? `${avatarColor}08` : 'rgba(139,92,246,0.04)',
          '& .info-icon': { color: avatarColor || '#A78BFA', opacity: 0.7 },
        },
      }}
    >
      {icon ? (
        <Box className="info-icon" sx={{ color: 'text.secondary', display: 'flex', fontSize: 18, opacity: 0.2, transition: 'all 0.2s', minWidth: 22, justifyContent: 'center' }}>
          {icon}
        </Box>
      ) : (
        <Box sx={{ minWidth: 22 }} />
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.05em', opacity: 0.35, mb: 0.2 }}>
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: '0.88rem', wordBreak: 'break-word', color: 'text.primary', opacity: 0.9, lineHeight: 1.4 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
