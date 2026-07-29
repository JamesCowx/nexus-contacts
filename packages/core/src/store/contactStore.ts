import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { db } from '../db/database';
import type { Contact, ContactInput } from '../types/contact';

interface ContactStore {
  contacts: Contact[];
  groups: string[];
  loading: boolean;
  searchQuery: string;
  selectedContactId: string | null;

  loadContacts: () => Promise<void>;
  addContact: (input: ContactInput) => Promise<Contact>;
  updateContact: (id: string, input: Partial<ContactInput>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  selectContact: (id: string | null) => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  groups: [],
  loading: false,
  searchQuery: '',
  selectedContactId: null,

  loadContacts: async () => {
    set({ loading: true });
    const contacts = await db.contacts
      .where('deletedAt')
      .equals(0)
      .or('deletedAt')
      .below(1)
      .sortBy('displayName');
    const groups = [
      ...new Set(
        (await db.contacts.toArray()).flatMap((c) => c.groups),
      ),
    ].sort();
    set({ contacts, groups, loading: false });
  },

  addContact: async (input) => {
    const now = Date.now();
    const contact: Contact = {
      ...input,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    };
    await db.contacts.add(contact);
    await get().loadContacts();
    return contact;
  },

  updateContact: async (id, input) => {
    await db.contacts.update(id, { ...input, updatedAt: Date.now() });
    await get().loadContacts();
  },

  deleteContact: async (id) => {
    await db.contacts.update(id, { deletedAt: Date.now() });
    await get().loadContacts();
  },

  toggleStar: async (id) => {
    const contact = await db.contacts.get(id);
    if (contact) {
      await db.contacts.update(id, {
        starred: !contact.starred,
        updatedAt: Date.now(),
      });
      await get().loadContacts();
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  selectContact: (id) => set({ selectedContactId: id }),
}));
