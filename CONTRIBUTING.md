# Contributing — iFarted + UDL Book

## For UDL Book Website (original)

See `src/README.md`.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
```

## For iFarted (new)

### Prereqs

- Node 20+, Bun 1.4.2+, Expo CLI, EAS CLI
- iOS: Mac or EAS cloud build, Apple Developer $99/yr
- Android: Android Studio or EAS cloud build, Google Play $25 one-time, Firebase project for FCM

### Monorepo Structure

```
apps/mobile/ — Expo + TS + expo-router, 7 screens, Zustand, notifications, location, maps, AdMob, IAP
apps/server/ — Bun + Hono + SQLite, 13 endpoints, rate limiting, Expo Push relay, metrics, admin, E2E sim
apps/web/ — Vite React web demo, standalone, PWA, full flow register/search/add friend/fart/invite
packages/contracts/ — shared API types
memory-bank/ — 6 core files + research/yo-app.md (Cline memory bank)
.clinerules/ — Cline rules
src/components/IFarted/ — UDL website integration with web demo
```

### Quick Start

**Server:**

```bash
cd apps/server
npm install -g bun # workaround for bun.sh TLS block in some envs
bun install
bun src/db/migrate.ts
bun src/index.ts # :3000
# test
bun src/test.ts
bun src/e2e-sim.ts
bun test # unit tests
```

**Mobile:**

```bash
cd apps/mobile
npm install
npx expo start # Expo Go (limited push)
# For push testing, needs dev build:
eas build --profile development --platform all
npx expo start --dev-client
```

**Web Demo (standalone):**

```bash
cd apps/web
npm install
npm run dev # :5174
```

**UDL Website (with iFarted section):**

```bash
npm install
npm run dev # :5173/udlbook -> scroll to iFarted
npm run build
```

### Development Conventions

- **Tiny, single-purpose product** — resist feature creep, Yo research `research/yo-app.md` is reference for "does this serve the fart notification?"
- **Ads first, Remove Ads IAP second** — single gated `<AdBanner />` via `isAdFree` flag
- **Expo managed workflow + config plugins** — `app.json` source of truth, no eject
- **Server code stays Bun and Node-runnable** — keep bun-specific APIs optional (`bun:sqlite` try/catch), fallback to `better-sqlite3` or in-memory mock, so `node --loader tsx src/index.ts` works
- **One TS codebase for both stores** — platform differences only where push/permissions/sound demand it
- **TypeScript strict** — small feature folders
- **No PII leaks** — username search only public fields, contacts hashed, invite codes unguessable, no API keys in client source
- **Ephemeral by design** — no inbox/history/feed, notification IS message, messages table only for rate limiting/abuse

### Testing

- Server: `bun src/test.ts` (integration), `bun src/e2e-sim.ts` (E2E 2 users), `bun test` (unit crypto + rate-limit)
- Mobile: `npx tsc --noEmit` typecheck, real device testing early (push, sound, maps, location device-dependent)
- Web: `npm run build` for both UDL site and standalone web client
- UDL site: `npm run build` 133 modules

### Security

See `apps/server/SECURITY.md` for Yo hack lessons and mitigations.

- Every endpoint (except register/health/metrics) requires Bearer apiKey
- Rate limits + block list
- No P2P push
- Secrets via EAS env vars / .env git-ignored

### Monetization

- Free: AdMob banner on home, non-personalized first, no ATT
- Paid: one-time non-consumable Remove Ads IAP $1.99, restorable, store-billed
- Single gated `<AdBanner />` via `isAdFree` flag, entitlement source of truth = store state (RevenueCat favored)

### Branding / Audio

- Audio: placeholder `fart.wav` 1.2s (brown noise + sine sweep down 200→40Hz, envelope) copied to .caf/.mp3 + android raw, <30s for iOS, TODO pro sound final
- Icons: placeholder `icon.png`/`adaptive-icon.png`/`splash.png` (minimalist black bubble 💨), TODO pro final
- Ad placement: banner on home default, no interstitial before sending (blocks joke, review risk)
- Final store name: working iFarted, check trademark

### Deployment

See `DEPLOYMENT.md` for Docker/Fly.io/Railway/EAS + secrets + domain.

### App Review

See `apps/mobile/APP_REVIEW.md` for context-based messaging framing (Apple rejected Yo for "too simple").

### Store Checklist

See `apps/mobile/STORE_CHECKLIST.md` for branding, audio, App Store Connect, Play Console, Expo/EAS, deployment, privacy, monetization, testing, legal.

### Roadmap

See `ROADMAP.md` for v6 → v1.0 timeline.

### Memory Bank

Cline's memory bank is in `memory-bank/` (6 core files + research). After every memory reset, read ALL files. Update when discovering new patterns, after significant changes, when user requests "update memory bank" (must review ALL files), when context needs clarification.

### Import Note

This repo originally is [lin2mm/udlbook](https://github.com/lin2mm/udlbook) — UDL book website (Vite + React). iFarted planning docs imported from Google Drive folder `18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX` via embeddedfolderview workaround due to TLS blocks on drive.google.com.

Structure now: `src/` UDL site + `apps/mobile`, `apps/server`, `packages/contracts`, `apps/web` iFarted + `.clinerules/`, `memory-bank/` + `README.md` iFarted + `DEPLOYMENT.md`, `SECURITY.md`, `ROADMAP.md`, etc.

### License

- UDL book: see LICENSE (MIT)
- iFarted: TODO add license

### Contact

- For UDL book: Simon Prince
- For iFarted: see memory-bank
