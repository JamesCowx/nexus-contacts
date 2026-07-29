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
  Chip,
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
  const [filter, setFilter] = useState<'all' | 'starred'>('all');
  const [countBump, setCountBump] = useState(false);
  const prevCount = useRef(contacts.length);
  const listRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const favorites = useMemo(
    () => contacts.filter(c => c.starred && !c.deletedAt),
    [contacts]
  );

  const filtered = useMemo(() => {
    const base = filter === 'starred' ? favorites : contacts;
    return filterContacts(base, searchQuery);
  }, [contacts, searchQuery, filter, favorites]);

  const grouped = useMemo(() => groupContacts(filtered), [filtered]);
  const sections = useMemo(
    () => [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [grouped],
  );

  useEffect(() => {
    if (contacts.length !== prevCount.current && prevCount.current > 0) {
      setCountBump(true);
      setTimeout(() => setCountBump(false), 400);
      if (contacts.length > prevCount.current) {
        const newId = contacts[0]?.id;
        if (newId) setAddedId(newId);
      }
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

  const scrollToLetter = (letter: string) => {
    const el = sectionRefs.current.get(letter);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const allLetters = useMemo(
    () => [...new Set(contacts.map(c => c.displayName.charAt(0).toUpperCase()))].sort(),
    [contacts]
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box
        sx={{
          mx: 1.5, mt: 1.5, mb: 0.5, px: 0.5,
          display: 'flex', alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Nexus
        </Typography>
        <Typography
          sx={{
            fontWeight: 300, fontSize: '1.1rem', color: 'text.secondary',
            ml: 0.75, letterSpacing: '-0.01em',
          }}
        >
          Contacts
        </Typography>
      </Box>
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, pt: 0.5 }}>
        <Chip
          label="All"
          size="small"
          variant={filter === 'all' ? 'filled' : 'outlined'}
          onClick={() => setFilter('all')}
          sx={{ fontWeight: 600, fontSize: '0.65rem', height: 24, borderRadius: 1.5 }}
        />
        {favorites.length > 0 && (
          <Chip
            label={`Starred ${favorites.length}`}
            size="small"
            icon={<Star sx={{ fontSize: 12, '&&': { color: '#FBBF24' } }} />}
            variant={filter === 'starred' ? 'filled' : 'outlined'}
            onClick={() => setFilter(filter === 'starred' ? 'all' : 'starred')}
            sx={{ fontWeight: 600, fontSize: '0.65rem', height: 24, borderRadius: 1.5 }}
          />
        )}
      </Box>

      {!loading && filter === 'all' && favorites.length > 0 && searchQuery.length === 0 && (
        <Fade in>
          <Box sx={{ px: 1.5, pt: 0.5, pb: 0.5 }}>
            <Box
              sx={{
                display: 'flex', gap: 1.5, overflowX: 'auto', pb: 0.5,
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {favorites.slice(0, 12).map((c) => (
                <Box
                  key={c.id}
                  onClick={() => selectContact(c.id)}
                  sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 0.5, cursor: 'pointer', minWidth: 56, flexShrink: 0,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute', inset: -1.5, borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1))',
                        opacity: 0.5,
                      }}
                    />
                    <Avatar
                      src={c.photo}
                      sx={{
                        width: 42, height: 42, fontSize: 14, fontWeight: 700, color: '#fff',
                        background: c.photo ? 'transparent' : getGradient(formatDisplayName(c)),
                        border: '1.5px solid rgba(251,191,36,0.2)',
                      }}
                    >
                      {!c.photo && getInitials(formatDisplayName(c))}
                    </Avatar>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem', fontWeight: 500, color: 'text.secondary',
                      maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', textAlign: 'center', opacity: 0.6,
                    }}
                  >
                    {formatDisplayName(c)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      )}

      <Box sx={{ px: 2.5, py: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary', fontWeight: 500, fontSize: '0.7rem',
            letterSpacing: '0.05em', transform: countBump ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {loading ? '' : `${filtered.length} contact${filtered.length !== 1 ? 's' : ''}`}
        </Typography>
      </Box>

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
          <Box
            key={letter}
            ref={(el: HTMLDivElement | null) => { if (el) sectionRefs.current.set(letter, el); }}
            sx={{ mb: 0.25 }}
          >
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

      {!loading && allLetters.length > 1 && (
        <Box
          sx={{
            position: 'absolute', right: 2, top: 100, bottom: 80,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 0, zIndex: 5, py: 1,
          }}
        >
          {allLetters.map((l) => (
            <Box
              key={l}
              onClick={() => scrollToLetter(l)}
              sx={{
                fontSize: '0.6rem', fontWeight: 700, color: 'text.secondary',
                py: 0.3, px: 0.6, cursor: 'pointer', borderRadius: 1,
                transition: 'all 0.15s', opacity: 0.3,
                '&:hover': { opacity: 1, color: 'primary.light', transform: 'scale(1.2)' },
              }}
            >
              {l}
            </Box>
          ))}
        </Box>
      )}

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
