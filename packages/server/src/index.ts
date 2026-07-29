import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const db = new Database('contacts.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL DEFAULT '',
    lastName TEXT NOT NULL DEFAULT '',
    displayName TEXT NOT NULL DEFAULT '',
    photo TEXT DEFAULT '',
    company TEXT DEFAULT '',
    jobTitle TEXT DEFAULT '',
    birthday TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    starred INTEGER NOT NULL DEFAULT 0,
    groups TEXT DEFAULT '[]',
    phoneNumbers TEXT DEFAULT '[]',
    emails TEXT DEFAULT '[]',
    addresses TEXT DEFAULT '[]',
    socialProfiles TEXT DEFAULT '[]',
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    deletedAt INTEGER DEFAULT 0
  )
`);

app.post('/sync/push', (req, res) => {
  const { contacts } = req.body;
  if (!Array.isArray(contacts)) {
    return res.status(400).json({ error: 'contacts array required' });
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO contacts
    (id, firstName, lastName, displayName, photo, company, jobTitle, birthday, notes, starred, groups, phoneNumbers, emails, addresses, socialProfiles, createdAt, updatedAt, deletedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const c of contacts) {
      stmt.run(
        c.id, c.firstName, c.lastName, c.displayName, c.photo ?? '',
        c.company ?? '', c.jobTitle ?? '', c.birthday ?? '', c.notes ?? '',
        c.starred ? 1 : 0, JSON.stringify(c.groups ?? []),
        JSON.stringify(c.phoneNumbers ?? []), JSON.stringify(c.emails ?? []),
        JSON.stringify(c.addresses ?? []), JSON.stringify(c.socialProfiles ?? []),
        c.createdAt, c.updatedAt, c.deletedAt ?? 0,
      );
    }
  });
  tx();

  res.json({ ok: true, count: contacts.length });
});

app.get('/sync/pull', (req, res) => {
  const since = parseInt(req.query.since as string) || 0;
  const rows = db.prepare('SELECT * FROM contacts WHERE updatedAt > ?').all(since) as any[];

  const contacts = rows.map((r) => ({
    ...r,
    starred: !!r.starred,
    groups: JSON.parse(r.groups || '[]'),
    phoneNumbers: JSON.parse(r.phoneNumbers || '[]'),
    emails: JSON.parse(r.emails || '[]'),
    addresses: JSON.parse(r.addresses || '[]'),
    socialProfiles: JSON.parse(r.socialProfiles || '[]'),
  }));

  res.json({ contacts });
});

const PORT = parseInt(process.env.PORT || '3001');
app.listen(PORT, () => {
  console.log(`Sync server running on http://localhost:${PORT}`);
});
