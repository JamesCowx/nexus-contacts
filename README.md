<div align="center">
  <img src="https://raw.githubusercontent.com/JamesCowx/nexus-contacts/master/docs/icon.svg" width="96" alt="" />

  <h1>Nexus Contacts</h1>

  <p><em>The last contacts app you'll ever need. Built for humans who care about design.</em></p>

  <p>
    <a href="https://github.com/JamesCowx/nexus-contacts/releases/latest"><img src="https://img.shields.io/github/v/release/JamesCowx/nexus-contacts?style=for-the-badge&color=8B5CF6&labelColor=1a1230" alt="Release" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-EC4899?style=for-the-badge&labelColor=1a1230" alt="License" /></a>
    <a href="https://github.com/JamesCowx/nexus-contacts/stargazers"><img src="https://img.shields.io/github/stars/JamesCowx/nexus-contacts?style=for-the-badge&color=FBBF24&labelColor=1a1230" alt="Stars" /></a>
  </p>

  <p>
    <a href="https://jamescowx.github.io/nexus-contacts/"><img src="https://img.shields.io/badge/🌐-Live_Demo-A78BFA?style=flat-square&labelColor=1a1230" alt="Demo" /></a>
    &nbsp;
    <a href="https://github.com/JamesCowx/nexus-contacts/releases/latest"><img src="https://img.shields.io/badge/⬇-Download_.exe-34D399?style=flat-square&labelColor=1a1230" alt="Download" /></a>
  </p>
</div>

<br />

> **Nexus** /ˈnek.səs/ — *noun*. A central or focal point. A connection or series of connections linking two or more things.

---

## Why Nexus Contacts?

Most contacts apps look like they were designed by someone who hates you. Nexus is different. Every pixel, every animation, every interaction has been crafted to make managing your connections feel effortless and beautiful.

<br />

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <strong>🌑 Dark-Mode-First</strong><br />
        <sub>Deep purple palette. Glassmorphism.<br />Particle backgrounds. Noise texturing.</sub>
      </td>
      <td align="center" width="33%">
        <strong>✨ Micro-Interactions</strong><br />
        <sub>Confetti on add. Star bounce.<br />Magnetic FAB. 3D tilted cards.</sub>
      </td>
      <td align="center" width="33%">
        <strong>🖥️ Truly Cross-Platform</strong><br />
        <sub>Windows .exe · macOS .dmg ·<br />Linux .AppImage · Web · Mobile</sub>
      </td>
    </tr>
  </table>
</div>

<br />

---

## ✨ Features

<details open>
<summary><strong>🎨 Visual Design</strong></summary>
<br />

| Feature | Description |
|---|---|
| **Glassmorphism UI** | Every card uses `backdrop-filter: blur(16px)` with semi-transparent backgrounds and subtle borders |
| **Particle Background** | 35+ floating canvas particles drift slowly across the screen — subtle, atmospheric, never distracting |
| **Mouse Spotlight** | A 600px radial gradient follows your cursor, creating a soft "lit" effect across the interface |
| **Noise Texture** | SVG fractal noise overlay at `0.015` opacity adds tactile depth to every surface |
| **Gradient Avatars** | 15 hand-picked gradient backgrounds for contact avatars, determined by name hash |
| **Animated Hero** | Each contact's detail page features a pulsating avatar ring in their unique accent color |
| **Gradient Text** | Contact names rendered with `background-clip: text` using the avatar's gradient — every name is unique |
| **3D Card Tilt** | Info cards track mouse position with `perspective(600px)` for a responsive 3D rotation effect |
| **Scroll Parallax** | Hero section moves at `0.15×` scroll speed while content scrolls normally |
</details>

<details open>
<summary><strong>🎯 Interactions</strong></summary>
<br />

| Feature | Description |
|---|---|
| **Confetti Burst** | 60 colorful particles explode from screen center when you save a new contact |
| **Star Bounce** | Favorite icon does a playful `scale(1.4 → 0.9 → 1.1 → 1)` bounce on click |
| **Magnetic FAB** | The floating + button nudges toward your cursor within a `0.3×` offset range |
| **Add Celebration** | Newly created contacts flash with a purple highlight pulse in the list |
| **Skeleton Loading** | 8 shimmering rows appear while IndexedDB loads — no jarring blank states |
| **Toast Notifications** | Spring-animated toasts slide in from the bottom for save, update, and delete actions |
| **Alphabet Quick-Scroll** | Tap any letter on the right edge to instantly scroll to that section |
| **Slide Navigation** | Mobile views animate with `cubic-bezier(0.4, 0, 0.2, 1)` slide transitions |
| **Back Arrow Slide** | The back arrow slides `translateX(-3px)` on hover |
</details>

<details>
<summary><strong>📇 Contact Profiles</strong></summary>
<br />

Every contact can store:
- **Name** — First, last, display name, photo URL
- **Phone Numbers** — Multiple numbers with custom labels (Mobile, Work, Home...)
- **Email Addresses** — Multiple with labels
- **Addresses** — Street, city, state, ZIP, country per address
- **Social Profiles** — Platform + username + URL for each
- **Organization** — Company name and job title
- **Personal** — Birthday, freeform notes, custom groups
- **Starred** — Favorite contacts with golden drop-shadow
</details>

<details>
<summary><strong>💾 Data & Sync</strong></summary>
<br />

- **Local-First** — All data stored in IndexedDB via Dexie.js. Zero network required. Your data is yours.
- **Cloud Sync** (optional) — Express + SQLite sync server with push/pull endpoints and timestamp-based conflict resolution. Auto-sync every 60 seconds.
- **Soft Delete** — Deleted contacts are marked with a timestamp rather than removed, making recovery possible.
</details>

---

## 🧱 Architecture

```
nexus-contacts/
│
├── packages/
│   ├── core/              ← Shared React UI (components, store, types, DB, sync)
│   ├── web/               ← Vite web app (localhost:5173)
│   ├── desktop/           ← Electron shell → .exe / .dmg / .AppImage
│   ├── mobile/            ← Capacitor shell → Android / iOS
│   └── server/            ← Express + SQLite sync backend (port 3001)
│
├── docs/                  ← GitHub Pages landing site
├── pnpm-workspace.yaml    ← Monorepo configuration
└── package.json           ← Root scripts
```

```
                  ┌──────────────────────────┐
                  │      @nexus/core          │
                  │  (React + Zustand + MUI)  │
                  └────┬──────┬──────┬────────┘
                       │      │      │
       ┌───────────────┼──────┼──────┼───────────────┐
       ▼               ▼      ▼      ▼               ▼
  ┌─────────┐    ┌──────────┐  ┌────────┐    ┌──────────┐
  │   Web   │    │ Desktop  │  │ Mobile │    │  Server  │
  │  (Vite) │    │(Electron)│  │(Cap.)  │    │ (Express)│
  └─────────┘    └──────────┘  └────────┘    └──────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>= 18`
- **pnpm** `>= 8` — [install instructions](https://pnpm.io/installation)

### One-liner

```bash
git clone https://github.com/JamesCowx/nexus-contacts.git && cd nexus-contacts && pnpm install && pnpm approve-builds better-sqlite3 esbuild electron && pnpm web
```

Then open `http://localhost:5173` in your browser.

### Manual Setup

```bash
# 1. Clone
git clone https://github.com/JamesCowx/nexus-contacts.git
cd nexus-contacts

# 2. Install dependencies
pnpm install

# 3. Approve native module builds (one-time)
pnpm approve-builds better-sqlite3 esbuild electron

# 4. Start the web app
pnpm web
```

---

## 🎮 Commands

| Command | What it does |
|---|---|
| `pnpm web` | Start web dev server at `http://localhost:5173` |
| `pnpm desktop` | Launch the Electron desktop app |
| `pnpm server` | Start sync server on port `3001` |
| `pnpm build` | Build all packages for production |
| `pnpm lint` | Run TypeScript type-checking on all packages |

### Per-Package Commands

```bash
# Web
pnpm --filter @nexus/web dev        # Dev server
pnpm --filter @nexus/web build      # Production build → packages/web/dist/

# Desktop
pnpm --filter @nexus/desktop dev    # Dev with hot reload
pnpm --filter @nexus/desktop build  # Build .exe / .dmg / .AppImage

# Mobile
pnpm --filter @nexus/mobile build   # Build web assets
pnpm --filter @nexus/mobile sync    # Sync with Capacitor
pnpm --filter @nexus/mobile open:android  # Open in Android Studio
pnpm --filter @nexus/mobile open:ios      # Open in Xcode
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Choice | Why |
|---|---|---|
| **UI Framework** | <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&labelColor=1a1230" /> | Most popular, huge ecosystem |
| **Language** | <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&labelColor=1a1230" /> | Type safety, autocomplete |
| **Design** | <img src="https://img.shields.io/badge/MUI-6-007FFF?style=flat-square&logo=mui&labelColor=1a1230" /> | Material Design, customizable |
| **State** | Zustand 4 | Tiny, fast, no boilerplate |
| **Database** | Dexie.js 4 | IndexedDB wrapper, promises |
| **Desktop** | <img src="https://img.shields.io/badge/Electron-32-47848F?style=flat-square&logo=electron&labelColor=1a1230" /> | Cross-platform desktop apps |
| **Bundler** | <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&labelColor=1a1230" /> | Instant HMR, fast builds |
| **Mobile** | Capacitor 6 | Native Android/iOS wrappers |
| **Server** | Express + SQLite | Lightweight sync backend |
| **Monorepo** | pnpm workspaces | Fast, disk-efficient |
| **Animations** | @emotion/react | CSS-in-JS keyframes |

</div>

---

## 📦 Releases

| Platform | Status | Download |
|---|---|---|
| **Windows** | ✅ `v1.0.0` | [Nexus Contacts Setup 1.0.0.exe](https://github.com/JamesCowx/nexus-contacts/releases/download/v1.0.0/Nexus.Contacts.Setup.1.0.0.exe) (82 MB) |
| **macOS** | 🔜 Coming soon | Build from source: `pnpm --filter @nexus/desktop build` |
| **Linux** | 🔜 Coming soon | Build from source: `pnpm --filter @nexus/desktop build` |
| **Web** | ✅ Live | [jamescowx.github.io/nexus-contacts](https://jamescowx.github.io/nexus-contacts/) |

---

## 🎯 Design Philosophy

> **"Boring contacts app" is a choice. We chose otherwise.**

Nexus Contacts follows three principles:

1. **Be beautiful by default.** No theme configuration needed. It looks stunning out of the box.
2. **Every interaction matters.** From the way a star bounces when clicked to the confetti that celebrates a new contact — nothing is an afterthought.
3. **Data belongs to you.** Local-first storage. No accounts. No telemetry. The sync server is optional and self-hosted.

---

## 📄 License

MIT © [JamesCowx](https://github.com/JamesCowx)

---

<div align="center">
  <br />
  <p>
    <sub>Built with ☕️ and TypeScript in the early hours of the morning.</sub>
  </p>
  <p>
    <a href="https://github.com/JamesCowx/nexus-contacts/stargazers">⭐ Star this repo</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/JamesCowx/nexus-contacts/issues">🐛 Report a bug</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/JamesCowx/nexus-contacts/releases/latest">⬇ Download</a>
  </p>
</div>
