export interface PhoneNumber {
  id: string;
  label: string;
  number: string;
}

export interface Email {
  id: string;
  label: string;
  address: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface SocialProfile {
  id: string;
  platform: string;
  username: string;
  url: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  color?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  photo?: string;
  company?: string;
  jobTitle?: string;
  phoneNumbers: PhoneNumber[];
  emails: Email[];
  addresses: Address[];
  socialProfiles: SocialProfile[];
  birthday?: string;
  notes?: string;
  groups: string[];
  starred: boolean;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface SyncState {
  id: string;
  lastSyncedAt: number;
  lastSyncStatus: 'idle' | 'syncing' | 'error';
  lastError?: string;
  serverUrl: string;
}
