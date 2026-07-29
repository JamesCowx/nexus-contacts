import Dexie, { type EntityTable } from 'dexie';
import type { Contact, SyncState, ContactGroup } from '../types/contact';

export class ContactsDatabase extends Dexie {
  contacts!: EntityTable<Contact, 'id'>;
  groups!: EntityTable<ContactGroup, 'id'>;
  syncState!: EntityTable<SyncState, 'id'>;

  constructor() {
    super('ContactsDB');
    this.version(1).stores({
      contacts: 'id, firstName, lastName, displayName, company, starred, updatedAt, deletedAt',
      groups: 'id, name',
      syncState: 'id',
    });
  }
}

export const db = new ContactsDatabase();
