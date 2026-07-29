import { db } from '../db/database';
import type { Contact } from '../types/contact';

export class SyncEngine {
  private serverUrl: string;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  async pushChanges(): Promise<void> {
    const modified = await db.contacts
      .where('updatedAt')
      .above(await this.getLastSyncTime())
      .toArray();
    if (modified.length === 0) return;

    const res = await fetch(`${this.serverUrl}/sync/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts: modified }),
    });
    if (!res.ok) throw new Error(`Sync push failed: ${res.statusText}`);
  }

  async pullChanges(): Promise<void> {
    const lastSync = await this.getLastSyncTime();
    const res = await fetch(
      `${this.serverUrl}/sync/pull?since=${lastSync}`,
    );
    if (!res.ok) throw new Error(`Sync pull failed: ${res.statusText}`);
    const { contacts }: { contacts: Contact[] } = await res.json();

    await db.transaction('rw', db.contacts, async () => {
      for (const contact of contacts) {
        await db.contacts.put(contact);
      }
    });
  }

  async sync(): Promise<void> {
    await this.pushChanges();
    await this.pullChanges();
    await db.syncState.put({
      id: 'main',
      lastSyncedAt: Date.now(),
      lastSyncStatus: 'idle',
      serverUrl: this.serverUrl,
    });
  }

  startAutoSync(intervalMs = 60000): void {
    this.sync();
    this.syncInterval = setInterval(() => this.sync(), intervalMs);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async getLastSyncTime(): Promise<number> {
    const state = await db.syncState.get('main');
    return state?.lastSyncedAt ?? 0;
  }
}
