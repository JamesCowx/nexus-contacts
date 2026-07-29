import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Fade,
  Skeleton,
} from '@mui/material';
import { Star, StarBorder, Search, Add, PersonOff } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useContactStore } from '../store/contactStore';
import { filterContacts, formatDisplayName, getInitials, getGradient, groupContacts } from '../utils/helpers';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 6px rgba(139,92,246,0.3); }
  50% { box-shadow: 0 0 14px rgba(139,92,246,0.5); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const starBounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  50% { transform: scale(0.9); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const addFlash = keyframes`
  0% { background-color: rgba(139,92,246,0.12); }
  100% { background-color: transparent; }
`;

function SkeletonRow() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.75, py: 1.25 }}>
      <Skeleton variant="circular" width={38} height={38} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="rounded" width="60%" height={12} sx={{ bgcolor: 'rgba(255,255,255,0.04)', mb: 0.75, borderRadius: 1 }} />
        <Skeleton variant="rounded" width="35%" height={10} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }} />
      </Box>
    </Box>
  );
}

export function ContactList({ onAdd }: { onAdd: () => void }) {
  const { contacts, searchQuery, selectedContactId, setSearchQuery, selectContact, toggleStar, loading } =
    useContactStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState<Set<string>>(new Set());
  const [starAnimIds, setStarAnimIds] = useState<Set<string>>(new Set());
  const [addedId, setAddedId] = useState<string | null>(null);
  const prevCount = useRef(contacts.length);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => filterContacts(contacts, searchQuery),
    [contacts, searchQuery],
  );

  const grouped = useMemo(() => groupContacts(filtered), [filtered]);
  const sections = useMemo(
    () => [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [grouped],
  );

  useEffect(() => {
    if (contacts.length > prevCount.current && prevCount.current > 0) {
      const newId = contacts[0]?.id;
      if (newId) setAddedId(newId);
    }
    prevCount.current = contacts.length;
  }, [contacts]);

  useEffect(() => {
    if (addedId) {
      const t = setTimeout(() => setAddedId(null), 800);
      return () => clearTimeout(t);
    }
  }, [addedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleLetters(new Set(sections.map(([l]) => l)));
    }, 100);
    return () => clearTimeout(timer);
  }, [sections]);

  const handleStar = useCallback(async (contactId: string) => {
    setStarAnimIds((prev) => new Set(prev).add(contactId));
    setTimeout(() => setStarAnimIds((prev) => { const n = new Set(prev); n.delete(contactId); return n; }), 600);
    await toggleStar(contactId);
  }, [toggleStar]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box
        sx={{
          mx: 1.5,
          mt: 1.5,
          mb: 0.5,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: searchFocused
            ? '1.5px solid rgba(139,92,246,0.5)'
            : '1.5px solid rgba(255,255,255,0.04)',
          boxShadow: searchFocused ? '0 0 24px rgba(139,92,246,0.15)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        <Search sx={{ mx: 1.5, color: searchFocused ? 'primary.main' : 'text.secondary', fontSize: 20, transition: 'color 0.3s' }} />
        <InputBase
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          sx={{ flex: 1, py: 1.25, fontSize: '0.9rem', color: 'text.primary', '&::placeholder': { color: 'text.secondary', opacity: 0.5 } }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{ px: 2.5, py: 0.75, color: 'text.secondary', fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.05em' }}
      >
        {loading ? '' : `${filtered.length} contact${filtered.length !== 1 ? 's' : ''}`}
      </Typography>

      <Box ref={listRef} sx={{ flex: 1, overflow: 'auto', px: 1, pb: 10 }}>
        {loading && (
          <Box sx={{ pt: 1 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Fade in key={i} timeout={300 + i * 50}>
                <Box sx={{ animation: `${shimmer} 1.5s infinite linear` }}>
                  <SkeletonRow />
                </Box>
              </Fade>
            ))}
          </Box>
        )}

        {!loading && filtered.length === 0 && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 8, px: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(139,92,246,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <PersonOff sx={{ fontSize: 28, color: 'text.secondary', opacity: 0.4 }} />
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 500 }}>
                {searchQuery ? 'No contacts found' : 'No contacts yet'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', opacity: 0.5, mt: 0.5 }}>
                {searchQuery ? 'Try a different search' : 'Tap + to add your first contact'}
              </Typography>
            </Box>
          </Fade>
        )}

        {!loading && sections.map(([letter, sectionContacts]) => (
          <Box key={letter} sx={{ mb: 0.25 }}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                px: 1.5,
                py: 0.75,
                color: 'text.secondary',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                opacity: 0.4,
              }}
            >
              {letter}
            </Typography>

            {sectionContacts.map((contact, index) => (
              <Box
                key={contact.id}
                sx={{
                  borderRadius: 2.5,
                  animation: addedId === contact.id
                    ? `${addFlash} 0.8s ease-out`
                    : visibleLetters.has(letter)
                      ? `${slideUp} 0.35s ${index * 0.03}s both`
                      : 'none',
                }}
              >
                <ListItemButton
                  selected={selectedContactId === contact.id}
                  onClick={() => selectContact(contact.id)}
                  sx={{
                    borderRadius: 2.5,
                    mb: 0.25,
                    py: 1,
                    px: 1.25,
                    mx: 0.25,
                    position: 'relative',
                    overflow: 'visible',
                    transform: 'perspective(600px) translateZ(0)',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -2,
                      top: '50%',
                      width: 3,
                      height: selectedContactId === contact.id ? '60%' : 0,
                      borderRadius: 2,
                      background: 'linear-gradient(180deg, #8B5CF6, #EC4899)',
                      transform: 'translateY(-50%)',
                      transition: 'height 0.3s',
                    },
                    '&:hover::before': {
                      height: '60%',
                    },
                    '&:hover': {
                      transform: 'perspective(600px) translateZ(4px)',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(139,92,246,0.12)',
                      '&:hover': { backgroundColor: 'rgba(139,92,246,0.18)' },
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 46 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: -2,
                          borderRadius: '50%',
                          background: selectedContactId === contact.id
                            ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                            : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
                          opacity: 0.5,
                          animation: selectedContactId === contact.id ? `${glowPulse} 2s ease-in-out infinite` : 'none',
                        }}
                      />
                      <Avatar
                        src={contact.photo}
                        sx={{
                          width: 38,
                          height: 38,
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#fff',
                          background: contact.photo ? 'transparent' : getGradient(formatDisplayName(contact)),
                          border: '2px solid',
                          borderColor: selectedContactId === contact.id ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.04)',
                          transition: 'all 0.3s',
                        }}
                      >
                        {!contact.photo && getInitials(formatDisplayName(contact))}
                      </Avatar>
                    </Box>
                  </ListItemAvatar>

                  <ListItemText
                    primary={formatDisplayName(contact)}
                    primaryTypographyProps={{
                      fontWeight: selectedContactId === contact.id ? 600 : 500,
                      fontSize: '0.875rem',
                      noWrap: true,
                      sx: { color: selectedContactId === contact.id ? 'primary.light' : 'text.primary' },
                    }}
                    secondary={
                      contact.company || contact.phoneNumbers[0]?.number || contact.emails[0]?.address
                    }
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: '0.75rem',
                      sx: { opacity: 0.5 },
                    }}
                    sx={{ my: 0 }}
                  />

                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStar(contact.id);
                    }}
                    sx={{
                      opacity: contact.starred ? 1 : 0.15,
                      transition: 'all 0.3s',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Star
                      sx={{
                        fontSize: 18,
                        color: contact.starred ? '#FBBF24' : 'text.secondary',
                        filter: contact.starred ? 'drop-shadow(0 0 8px rgba(251,191,36,0.5))' : 'none',
                        animation: starAnimIds.has(contact.id) ? `${starBounce} 0.5s ease-out` : 'none',
                      }}
                    />
                  </IconButton>
                </ListItemButton>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          py: 2,
          background: 'linear-gradient(0deg, rgba(7,3,18,1) 60%, transparent)',
        }}
      >
        <MagnetFAB onAdd={onAdd} />
      </Box>
    </Box>
  );
}

function MagnetFAB({ onAdd }: { onAdd: () => void }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    setOffset({ x: dx, y: dy });
  };

  return (
    <Box
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setOffset({ x: 0, y: 0 }); setHovered(false); }}
      sx={{ position: 'relative' }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          border: '1.5px solid rgba(139,92,246,0.15)',
          animation: `${glowPulse} 2s ease-in-out infinite`,
        }}
      />
      <Box
        onClick={onAdd}
        sx={{
          width: 50, height: 50, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #8B5CF6, #EC4899)',
          backgroundSize: '200% 200%', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: hovered
            ? '0 6px 28px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.25)'
            : '0 4px 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: `translate(${offset.x}px, ${offset.y}px) scale(1.12) rotate(90deg)`,
          },
          '&:active': { transform: 'scale(0.92)' },
        }}
      >
        <Add sx={{ fontSize: 26 }} />
      </Box>
    </Box>
  );
}
