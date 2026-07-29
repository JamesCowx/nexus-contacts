import { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Chip,
  Zoom,
  Fade,
} from '@mui/material';
import { Add, Delete, ArrowBack, Save } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { useContactStore } from '../store/contactStore';
import { useToastStore } from '../store/toastStore';
import { triggerConfetti } from './Confetti';
import type { ContactInput, PhoneNumber, Email, Address, SocialProfile } from '../types/contact';

interface Props {
  contactId?: string;
  onBack: () => void;
}

const emptyPhone = (): PhoneNumber => ({ id: uuid(), label: 'Mobile', number: '' });
const emptyEmail = (): Email => ({ id: uuid(), label: 'Home', address: '' });
const emptyAddress = (): Address => ({ id: uuid(), label: 'Home', street: '', city: '', state: '', zip: '', country: '' });
const emptySocial = (): SocialProfile => ({ id: uuid(), platform: 'Twitter', username: '', url: '' });

export function ContactForm({ contactId, onBack }: Props) {
  const { contacts, addContact, updateContact } = useContactStore();
  const showToast = useToastStore((s) => s.show);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const existing = contacts.find((c) => c.id === contactId);

  const [firstName, setFirstName] = useState(existing?.firstName ?? '');
  const [lastName, setLastName] = useState(existing?.lastName ?? '');
  const [displayName, setDisplayName] = useState(existing?.displayName ?? '');
  const [company, setCompany] = useState(existing?.company ?? '');
  const [jobTitle, setJobTitle] = useState(existing?.jobTitle ?? '');
  const [birthday, setBirthday] = useState(existing?.birthday ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [photo, setPhoto] = useState(existing?.photo ?? '');
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(existing?.phoneNumbers ?? [emptyPhone()]);
  const [emails, setEmails] = useState<Email[]>(existing?.emails ?? [emptyEmail()]);
  const [addresses, setAddresses] = useState<Address[]>(existing?.addresses ?? []);
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>(existing?.socialProfiles ?? []);
  const [groups, setGroups] = useState<string[]>(existing?.groups ?? []);
  const [newGroup, setNewGroup] = useState('');

  const isEditing = !!contactId;

  const handleSubmit = async () => {
    const input: ContactInput = {
      firstName, lastName,
      displayName: displayName || [firstName, lastName].filter(Boolean).join(' ') || 'Unknown',
      company, jobTitle, photo, birthday, notes,
      phoneNumbers, emails, addresses, socialProfiles, groups,
      starred: existing?.starred ?? false,
    };
    if (isEditing) {
      await updateContact(contactId!, input);
      showToast(`Updated ${input.displayName}`, 'success');
    } else {
      await addContact(input);
      if (confettiRef.current) {
        triggerConfetti(confettiRef.current, window.innerWidth / 2, window.innerHeight / 2);
      }
      showToast(`Added ${input.displayName}`, 'success');
    }
    onBack();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.75,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(7,3,18,0.6)',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '1.05rem' }}>
          {isEditing ? 'Edit Contact' : 'New Contact'}
        </Typography>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="small"
          startIcon={<Save />}
          sx={{ borderRadius: 2, px: 2.5, py: 0.75, fontSize: '0.8rem' }}
        >
          Save
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
        <Fade in>
          <Box>
            <GlassSection title="Name & Photo">
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Field label="First" value={firstName} onChange={setFirstName} />
                <Field label="Last" value={lastName} onChange={setLastName} />
              </Box>
              <Field label="Display Name" value={displayName} onChange={setDisplayName} />
              <Field label="Photo URL" value={photo} onChange={setPhoto} placeholder="https://example.com/photo.jpg" />
            </GlassSection>

            <GlassSection title="Organization">
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Field label="Company" value={company} onChange={setCompany} />
                <Field label="Job Title" value={jobTitle} onChange={setJobTitle} />
              </Box>
            </GlassSection>

            <GlassSection title="Phone Numbers">
              {phoneNumbers.map((p, i) => (
                <Zoom in key={p.id}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Field label="Label" value={p.label} onChange={(v) => { const n = [...phoneNumbers]; n[i] = { ...p, label: v }; setPhoneNumbers(n); }} slim />
                    <Field label="Number" value={p.number} onChange={(v) => { const n = [...phoneNumbers]; n[i] = { ...p, number: v }; setPhoneNumbers(n); }} />
                    <IconButton size="small" onClick={() => setPhoneNumbers(phoneNumbers.filter((_, j) => j !== i))} sx={{ alignSelf: 'center', color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Zoom>
              ))}
              <AddButton label="Add Phone" onClick={() => setPhoneNumbers([...phoneNumbers, emptyPhone()])} />
            </GlassSection>

            <GlassSection title="Email">
              {emails.map((e, i) => (
                <Zoom in key={e.id}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Field label="Label" value={e.label} onChange={(v) => { const n = [...emails]; n[i] = { ...e, label: v }; setEmails(n); }} slim />
                    <Field label="Email" value={e.address} onChange={(v) => { const n = [...emails]; n[i] = { ...e, address: v }; setEmails(n); }} />
                    <IconButton size="small" onClick={() => setEmails(emails.filter((_, j) => j !== i))} sx={{ alignSelf: 'center', color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Zoom>
              ))}
              <AddButton label="Add Email" onClick={() => setEmails([...emails, emptyEmail()])} />
            </GlassSection>

            <GlassSection title="Address">
              {addresses.map((a, i) => (
                <Zoom in key={a.id}>
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Field label="Label" value={a.label} onChange={(v) => { const n = [...addresses]; n[i] = { ...a, label: v }; setAddresses(n); }} slim />
                      <Field label="Street" value={a.street} onChange={(v) => { const n = [...addresses]; n[i] = { ...a, street: v }; setAddresses(n); }} />
                      <IconButton size="small" onClick={() => setAddresses(addresses.filter((_, j) => j !== i))} sx={{ alignSelf: 'center', color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Field label="City" value={a.city} onChange={(v) => { const n = [...addresses]; n[i] = { ...a, city: v }; setAddresses(n); }} />
                      <Field label="State" value={a.state} onChange={(v) => { const n = [...addresses]; n[i] = { ...a, state: v }; setAddresses(n); }} slim />
                      <Field label="ZIP" value={a.zip} onChange={(v) => { const n = [...addresses]; n[i] = { ...a, zip: v }; setAddresses(n); }} slim />
                    </Box>
                  </Box>
                </Zoom>
              ))}
              <AddButton label="Add Address" onClick={() => setAddresses([...addresses, emptyAddress()])} />
            </GlassSection>

            <GlassSection title="Social Profiles">
              {socialProfiles.map((s, i) => (
                <Zoom in key={s.id}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Field label="Platform" value={s.platform} onChange={(v) => { const n = [...socialProfiles]; n[i] = { ...s, platform: v }; setSocialProfiles(n); }} slim />
                    <Field label="Username" value={s.username} onChange={(v) => { const n = [...socialProfiles]; n[i] = { ...s, username: v }; setSocialProfiles(n); }} />
                    <IconButton size="small" onClick={() => setSocialProfiles(socialProfiles.filter((_, j) => j !== i))} sx={{ alignSelf: 'center', color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Zoom>
              ))}
              <AddButton label="Add Social" onClick={() => setSocialProfiles([...socialProfiles, emptySocial()])} />
            </GlassSection>

            <GlassSection title="Details">
              <Field label="Birthday" type="date" value={birthday} onChange={setBirthday} shrink />
              <Field label="Notes" value={notes} onChange={setNotes} multiline rows={3} />
            </GlassSection>

            <GlassSection title="Groups">
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="New Group"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  size="small"
                  fullWidth
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newGroup.trim()) {
                      if (!groups.includes(newGroup.trim())) setGroups([...groups, newGroup.trim()]);
                      setNewGroup('');
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    if (newGroup.trim() && !groups.includes(newGroup.trim())) {
                      setGroups([...groups, newGroup.trim()]);
                      setNewGroup('');
                    }
                  }}
                  sx={{ borderRadius: 2, minWidth: 60, fontSize: '0.75rem' }}
                >
                  Add
                </Button>
              </Box>
              {groups.length > 0 && (
                <Fade in>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.5 }}>
                    {groups.map((g) => (
                      <Chip
                        key={g}
                        label={g}
                        size="small"
                        onDelete={() => setGroups(groups.filter((x) => x !== g))}
                        sx={{ borderRadius: 1.5, fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                </Fade>
              )}
            </GlassSection>
          </Box>
        </Fade>
        <Box sx={{ height: 40 }} />
      </Box>
      <canvas ref={confettiRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
    </Box>
  );
}

function Field({
  label, value, onChange, placeholder, multiline, rows, slim, type, shrink,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  multiline?: boolean; rows?: number; slim?: boolean; type?: string; shrink?: boolean;
}) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      size="small"
      fullWidth
      InputLabelProps={shrink ? { shrink: true } : undefined}
      sx={{
        '& .MuiOutlinedInput-root': { borderRadius: 2 },
        flex: slim ? '0 0 100px' : 1,
        minWidth: slim ? 80 : 0,
      }}
    />
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      size="small"
      startIcon={<Add sx={{ fontSize: 16 }} />}
      onClick={onClick}
      sx={{
        mt: 0.5,
        color: 'primary.light',
        fontWeight: 600,
        fontSize: '0.75rem',
        opacity: 0.6,
        transition: 'opacity 0.2s',
        '&:hover': { opacity: 1, backgroundColor: 'transparent' },
      }}
    >
      {label}
    </Button>
  );
}

function GlassSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        borderRadius: 3.5,
        p: 2,
        mb: 1.5,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.03)',
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(139,92,246,0.08)',
          transform: 'perspective(600px) translateZ(2px)',
        },
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: 'primary.light', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.12em', mb: 1.5, display: 'block', opacity: 0.6 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {children}
      </Box>
    </Box>
  );
}
