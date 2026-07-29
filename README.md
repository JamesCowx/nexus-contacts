# Nexus Contacts

A premium, cross-platform contacts management app with cloud sync. Built with Electron + React + TypeScript, featuring a stunning dark-mode-first UI with glassmorphism, 3D tilt effects, confetti celebrations, and more.

<p align="center">
  <strong><a href="https://jamescowx.github.io/nexus-contacts/">Live Demo</a></strong> &nbsp;·&nbsp;
  <strong><a href="https://github.com/JamesCowx/nexus-contacts/releases/latest">Download .exe</a></strong>
</p>
<p align="center">
  <strong>Desktop</strong> (Windows · macOS · Linux) &nbsp;·&nbsp;
  <strong>Web</strong> &nbsp;·&nbsp;
  <strong>Mobile</strong> (Android · iOS)
</p>

---

## Features

**Rich Contact Profiles**
- Full name, photo, multiple phone numbers, emails, addresses
- Social profiles, company, job title, birthday, notes
- Custom groups and starred/favorite contacts

**Visual Experience**
- Dark mode only — deep purple/indigo palette with Inter font
- Glassmorphism: `backdrop-filter: blur` on all cards
- Mouse-tracking spotlight glow effect
- Floating particle background (canvas-based)
- 3D perspective tilt on info cards (tracking mouse position)
- Magnetic floating action button (nudges toward cursor)
- Gradient avatars with animated glowing rings
- Hero scroll parallax on detail page
- Gradient text using contact's avatar theme
- Staggered entrance animations throughout

**Micro-Interactions**
- Star toggle with bounce animation
- Confetti burst when adding a contact
- Add-celebration flash pulse on new contacts
- Skeleton loading placeholders (8 shimmer rows)
- Toast notifications for save/delete (with spring animation)
- Animated back arrow (slides on hover)
- FAB spin on hover (90° rotation)

**Data**
- Local storage via IndexedDB (Dexie.js) — works offline
- Cloud sync via Express + SQLite server (optional)
- Timestamp-based conflict resolution (push/pull)

**Cross-Platform**
- Electron desktop (Windows `.exe`, macOS `.dmg`, Linux `.AppImage`/`.deb`)
- Vite web app (deploy anywhere)
- Capacitor mobile wrapper (Android/iOS)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Design System | Material UI v6 (custom theme) |
| State | Zustand |
| Database | Dexie.js (IndexedDB) |
| Desktop | Electron 32 |
| Web / Bundler | Vite 5 |
| Mobile | Capacitor 6 |
| Sync Server | Express + better-sqlite3 |
| Monorepo | pnpm workspaces |
| Animations | @emotion/react keyframes |

---

## Architecture

```
nexus-contacts/
├── packages/
│   ├── core/          # Shared: components, store, types, DB, sync engine
│   ├── web/           # Vite web app
│   ├── desktop/       # Electron desktop app (.exe/.dmg/.AppImage)
│   ├── mobile/        # Capacitor mobile app (Android/iOS)
│   └── server/        # Express + SQLite sync server
├── package.json
└── pnpm-workspace.yaml
```

All packages import from `@nexus/core` which contains the shared React UI
(material-themed components, Zustand contact store, Dexie database layer, and
sync engine). Each app wrapper is minimal — just a `main.tsx` mounting the `<App />`.

---

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **pnpm** >= 8 (`npm install -g pnpm`)

### Install
```bash
git clone https://github.com/YOUR_USER/polaris-contacts.git
cd polaris-contacts
pnpm install
pnpm approve-builds better-sqlite3 esbuild electron
```

### Run

| Command | Description |
|---|---|
| `pnpm web` | Start web dev server at `http://localhost:5173` |
| `pnpm desktop` | Launch Electron desktop app |
| `pnpm server` | Start sync server on port `3001` |
| `pnpm build` | Build all packages |

---

## Building

### Web
```bash
pnpm --filter @nexus/web build
# Output: packages/web/dist/
```

### Desktop

**Windows (.exe)**
```bash
pnpm --filter @nexus/desktop build
# Output: packages/desktop/release/Polaris Contacts Setup X.X.X.exe
```

**macOS (.dmg)**
```bash
pnpm --filter @nexus/desktop build
# Output: packages/desktop/release/Polaris Contacts-X.X.X.dmg
```

**Linux (.AppImage / .deb)**
```bash
pnpm --filter @nexus/desktop build
# Output: packages/desktop/release/Polaris Contacts-X.X.X.AppImage
```

### Mobile
```bash
pnpm --filter @nexus/mobile build    # Build web assets
pnpm --filter @nexus/mobile sync     # Sync with Capacitor
pnpm --filter @nexus/mobile open:android  # Open in Android Studio
pnpm --filter @nexus/mobile open:ios      # Open in Xcode
```

---

## Sync Server

The sync server stores contacts in a local SQLite database and provides
push/pull endpoints with timestamp-based conflict resolution.

```bash
pnpm server
# Running on http://localhost:3001
```

Configure the server URL in `packages/core/src/sync/syncEngine.ts` to enable
cloud sync. The sync engine auto-syncs every 60 seconds when started.

---

## License

MIT
