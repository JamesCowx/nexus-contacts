import type { Contact } from '../types/contact';

export const avatarColors = [
  '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
  '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4',
  '#D946EF', '#22C55E', '#EAB308', '#6366F1', '#84CC16',
];

export const avatarGradients = [
  'linear-gradient(135deg, #7C3AED, #A78BFA)',
  'linear-gradient(135deg, #EC4899, #F472B6)',
  'linear-gradient(135deg, #F59E0B, #FBBF24)',
  'linear-gradient(135deg, #10B981, #34D399)',
  'linear-gradient(135deg, #3B82F6, #60A5FA)',
  'linear-gradient(135deg, #EF4444, #F87171)',
  'linear-gradient(135deg, #8B5CF6, #C084FC)',
  'linear-gradient(135deg, #14B8A6, #2DD4BF)',
  'linear-gradient(135deg, #F97316, #FB923C)',
  'linear-gradient(135deg, #06B6D4, #22D3EE)',
  'linear-gradient(135deg, #D946EF, #E879F9)',
  'linear-gradient(135deg, #22C55E, #4ADE80)',
  'linear-gradient(135deg, #EAB308, #FACC15)',
  'linear-gradient(135deg, #6366F1, #818CF8)',
  'linear-gradient(135deg, #84CC16, #A3E635)',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export function formatDisplayName(contact: Pick<Contact, 'firstName' | 'lastName' | 'displayName'>): string {
  if (contact.displayName) return contact.displayName;
  const full = [contact.firstName, contact.lastName].filter(Boolean).join(' ');
  return full || 'Unknown';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function filterContacts(contacts: Contact[], query: string): Contact[] {
  if (!query.trim()) return contacts;
  const q = query.toLowerCase();
  return contacts.filter(
    (c) =>
      c.displayName.toLowerCase().includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.phoneNumbers.some((p) => p.number.includes(q)) ||
      c.emails.some((e) => e.address.toLowerCase().includes(q)),
  );
}

export function groupContacts(contacts: Contact[]): Map<string, Contact[]> {
  const groups = new Map<string, Contact[]>();
  for (const c of contacts) {
    const letter = c.displayName.charAt(0).toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(c);
  }
  return groups;
}
