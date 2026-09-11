# Release Notes — iFarted v0.9.0 (Alpha)

## Overview

iFarted is a dead-simple cross-platform mobile app: pick a person, optionally attach your location, and send them a push notification that says exactly one thing — **"I farted."** They can one-tap fart right back. No typing, no inbox, no feed. Modeled on 2014 **Yo!** app (context-based messaging) with monetization from day one.

## What's New in v0.9.0 Alpha

### Import & Scaffold (v2-v3)

- ✅ Imported planning docs from Google Drive folder `18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX` via embeddedfolderview workaround (drive.google.com TLS blocked, fetch_page proxy used)
- ✅ Monorepo scaffold: `apps/mobile` (Expo TS + expo-router + Zustand + notifications + location + maps), `apps/server` (Bun + Hono + SQLite + Expo Push API), `packages/contracts` (shared types), `apps/web` (Vite React web demo)
- ✅ Bun 1.4.2 installed via npm (bun.sh TLS blocked workaround)
- ✅ Audio assets generated: `fart.wav` 1.2s (brown noise + sine sweep down 200→40Hz, envelope) copied to `.caf/.mp3` + `android/app/src/main/res/raw/fart.mp3`, <30s for iOS
- ✅ Icons generated: `icon.png`, `adaptive-icon.png`, `splash.png` (minimalist black bubble 💨) via AI image generation

### Server (v3-v5, v8-v9)

- ✅ 13 endpoints: `POST /v1/register`, `GET /v1/me`, `POST /v1/tokens`, `POST /v1/farts`, `GET /v1/users/search`, `POST /v1/contacts`, `POST /v1/invites`, `GET /v1/friends` (Yo-style ordered by last fart), `POST /v1/friends`, `POST /v1/settings/phone-discovery`, `POST /v1/block`, `POST /v1/unblock`, `GET /metrics`, `GET /v1/stats`, `/admin/*`
- ✅ Auth: Bearer apiKey 256-bit random hex 64 chars, SHA-256 hashed at rest, no JWT, no session
- ✅ Rate limiting: in-memory MVP (30/hour per sender, 20/hour per recipient) + persistent SQLite version `rate-limit-persistent.ts` (survives restart)
- ✅ Push: Bun relay → Expo Push API → APNs/FCM, batch ≤100, custom sound `fart.caf`, channel `farts`, receipts logging
- ✅ Data model: SQLite WAL, users (unique username ci), push_tokens (unique token), relationships (unique owner+peer, status added/blocked/pending-invite, via username/contacts/invite), messages (id, sender, recipient, lat?, lng?, created_at — only for rate limiting/abuse), invites (code PK unguessable, creator, accepted_by)
- ✅ Security: Yo hack lessons (June 2014) — no unauthenticated PII, search only public fields, contacts hashed + discovery-only, invite unguessable, no API keys in client source, block list, no P2P push
- ✅ Metrics: `lib/metrics.ts` (farts/users tracking, fartsLastHour, activeUsersLastHour, 24h cleanup), endpoints `/metrics`, `/v1/stats`
- ✅ Admin: `admin.ts` + `admin.html` dashboard (protected by ADMIN_KEY env, metrics cards, users table, farts table, raw JSON, key input + localStorage persist)
- ✅ Security headers: X-Content-Type-Options nosniff, X-Frame-Options DENY, X-XSS-Protection, Referrer-Policy, HSTS for prod, CORS configurable via CORS_ORIGIN env
- ✅ Graceful shutdown: SIGTERM/SIGINT handlers
- ✅ Tests: `test.ts` integration (register, search, friends, tokens, farts, invites, phone-discovery, block/unblock), `e2e-sim.ts` E2E (2 users mutual friends 3 farts context SF/NYC/no location), `crypto.test.ts` + `rate-limit.test.ts` unit (7 pass)
- ✅ Docs: `README.md`, `API_DOCS.md`, `SECURITY.md`, `DEPLOYMENT.md`, Dockerfile, .env.example
- ✅ Live on :3000, tested via curl + bun test

### Mobile (v3-v7)

- ✅ 7 screens: home (real friends list + pull-to-refresh + push handling + location toggle + AdBanner gated + EmptyState), onboarding (<60s @username + phone opt-in + invite code + notification permission), search @username (public, no PII), contacts (opt-in, hashed, discovery-only), invite (code+deep link+share + redeem), fart-detail (deadpan + map pin + fart back), settings (Remove Ads IAP + Restore + phone-discovery toggle + invite creation + privacy note + sign out)
- ✅ Stores: `useAuth` Zustand (userId, apiKey, username, isAdFree), `useFriends` Zustand (friends list ordered by last fart)
- ✅ Libs: `api.ts` (typed fetch wrapper with Bearer), `notifications.ts` (ensureNotificationChannel Android farts channel with fart.mp3 + vibration, getExpoPushToken, addNotificationListeners for received + response → navigate to fart-detail), `contacts.ts` (requestContactsPermission, getPhoneNumbers normalized E.164 deduplicated), `ads.ts` (initAds, getBannerAdUnitId TestIds.BANNER dev + placeholder prod, non-personalized), `iap.ts` (RevenueCat favored + expo-iap fallback, product remove_ads $1.99 suggestion, entitlement ad_free, init/purchase/restore with listeners), `linking.ts` (parseInviteFromUrl for ifarted://invite/CODE + https://ifarted.app/invite/CODE + exp://, setupLinkingListener initial + event, navigateToFartDetail)
- ✅ Components: `AdBanner.tsx` (real BannerAd with TestIds + fallback placeholder, non-personalized, single gated via isAdFree), `FartButton.tsx` (small/large, loading, FartBackButton), `EmptyState.tsx` (no friends + 3 add-friend paths + context-based messaging note), `ErrorBoundary.tsx` (catches render errors, 💥 Something farted wrong + retry)
- ✅ Config: `app.json` (name iFarted, slug ifarted, scheme ifarted, icon, splash, ios.bundleIdentifier com.ifarted.app + NSLocationWhenInUseUsageDescription + NSContactsUsageDescription + UIBackgroundModes remote-notification + googleMobileAdsAppId placeholder, android.package com.ifarted.app + permissions ACCESS_FINE_LOCATION + READ_CONTACTS + googleMobileAdsAppId + googleServicesFile secret, plugins expo-router + expo-notifications sounds + expo-location + react-native-google-mobile-ads + react-native-maps, extra.eas.projectId placeholder + apiUrl)
- ✅ `eas.json` (development internal + preview internal + production autoIncrement), `PrivacyInfo.xcprivacy` (no tracking, location/contacts/phone app functionality, file timestamp + user defaults reasons), `APP_REVIEW.md` (context-based messaging framing, Yo rejection history, flow, ephemerality, monetization, anti-spam, permissions justification, technical details, adoption table, test accounts), `STORE_CHECKLIST.md` (branding, audio, App Store Connect, Play Console, Expo/EAS, deployment, privacy, monetization, testing, legal), `README.md` (stack, quick start, screens, push mechanics, deep links, ads+IAP, permissions, config, branding TODO, EAS build, testing, context-based messaging, monetization)

### Web (v6-v9)

- ✅ UDL website integration: `src/components/IFarted/` (IFartedElements.jsx styled-components + index.jsx demo box with real API flow), added to `src/pages/index.jsx`, Navbar + Sidebar iFarted links, `public/fart.mp3/wav` for web demo sound, UDL build 133 modules 313KB passes
- ✅ Standalone web client `apps/web/` (Vite React, port 5174): `package.json`, `vite.config.js`, `index.html`, `src/App.jsx` (full flow register with localStorage, search @username, add friend, send fart with lat/lng, create invite + share, metrics, log, sound, architecture diagram, ad banner placeholder), `src/main.jsx`, `index.css`, `public/manifest.json` PWA (name iFarted Web Demo, standalone, background #fff7ed, theme #000, icons 192/512), `public/icon-192.png`, `icon-512.png` copied from mobile icon
- ✅ Web demo enhanced v4-v5: real API flow with auth + lat/lng + messageId + warning + metrics refresh, log with timestamp, sound playback, localStorage apiKey/userId persist, search results + add friend, invite create + link, metrics display

### Docs & CI

- ✅ `README.md` v3 (status scaffold v3 complete, quick start UDL/server/mobile/web demo, branding/audio closed placeholder)
- ✅ `DEPLOYMENT.md` (UDL site gh-pages, server local/Docker/Fly.io/Railway/Render + volume + domain + HTTPS + backup + monitoring, mobile prereqs + config + secrets via EAS + dev builds + preview/prod + sound assets + AdMob+IAP + permissions + EAS build + secrets, web demo UDL integration, CI, monitoring/abuse, branding open decisions)
- ✅ `SECURITY.md` (Yo hack lessons, auth, PII protection, rate limiting in-memory + persistent, push security, location privacy, contacts privacy, invite security, DB constraints, admin protected, CORS/headers, secrets .gitignore, future hardening)
- ✅ `ROADMAP.md` v1.0 roadmap (current v6, next alpha/beta/v1.0, nice-to-have post v1.0, monetization, risks, timeline, links)
- ✅ `CONTRIBUTING.md` (UDL + iFarted monorepo structure, quick start, dev conventions tiny single-purpose + ads first + Expo managed + Bun+Node runnable + one codebase + TS strict + no PII leaks + ephemeral, testing, security, monetization, branding/audio, deployment, App Review, store checklist, roadmap, memory bank, import note, license, contact)
- ✅ `IMPORT_NOTES.md` (source Drive folder, problem TLS blocked, workaround embeddedfolderview IDs, files saved, scaffold after import, remaining TODO, verification)
- ✅ `.github/workflows/ifarted.yml` kept locally but not pushed due to GitHub App lacking workflows permission (403) — needs manual push with workflows permission
- ✅ `RELEASE_NOTES.md` (this file) — overview, what's new, etc.

### Memory Bank (6 core files + research)

- ✅ `projectbrief.md`, `productContext.md`, `activeContext.md` (v5 scaffold v3 complete), `systemPatterns.md`, `techContext.md` (Bun installed via npm workaround), `progress.md` (v5-v6 scaffold complete, relay live, mobile MVP done, audio+ads+IAP+privacy+UDL integration done, next device-to-device), `research/yo-app.md` (Yo! 2014 research)

### Tests Passing

- ✅ `bun src/test.ts` — register, search, friends, tokens, farts, invites, phone-discovery, block/unblock
- ✅ `bun src/e2e-sim.ts` — 2 users, mutual friends, 3 farts context SF/NYC/no location, metrics, Yo-style ordered friends
- ✅ `bun test` — crypto + rate-limit unit 7 pass
- ✅ `vite build` UDL site — 133 modules, 313KB JS (was 309KB)
- ✅ `curl /health`, `/metrics`, `/admin?key=test123`, `/admin.html?key=test123`

### Live Previews

- `3000` — Relay server (Bun+Hono+SQLite, 13 endpoints, metrics, admin, E2E sim)
- `5173` — UDL website + iFarted demo section (real API flow)
- `5174` — Standalone web client (Vite React, full flow, PWA)

## Known Issues / Risks

- iOS review: Yo initially rejected for "too simple" → have context-based messaging explanation ready (APP_REVIEW.md)
- Harassment/spam: Yo hacked + spammed 2014 → auth, no PII leak, rate limits, block list, explicit recipient list (SECURITY.md)
- No business model killed Yo → monetization from day one (ads + IAP)
- iOS builds can't run on Linux → EAS cloud build or Mac required
- Android push requires Firebase project for FCM client credentials even with Expo Push API (secret google-services.json injected at build)
- Audio asset placeholder: generated via Python (brown noise + sine sweep down), TODO pro sound final (<30s, on-brand not too loud/gross)
- Icons placeholder: generated via AI (minimalist black bubble 💨), TODO pro final
- AdMob/IAP placeholder IDs: need real IDs from AdMob + App Store Connect + Play Console + RevenueCat

## Next for v1.0

### Alpha (real devices)

- 2 EAS dev builds + real Expo push tokens + custom sound final + location + contacts E2E

### Beta (TestFlight + Play Internal)

- AdMob real IDs + IAP real wiring + Firebase + EAS prod builds

### v1.0 Store Submission

- Branding final + server deployment (Fly.io/Railway/VPS) + domain api.ifarted.app + ifarted.app/invite/* + App Review doc + legal + submit

## Links

- Drive folder: https://drive.google.com/drive/folders/18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX
- Repo: https://github.com/lin2mm/udlbook/tree/ifarted
- Memory Bank: memory-bank/ (6 core files + research/yo-app.md)
- Mobile: apps/mobile/ (Expo TS, 7 screens)
- Server: apps/server/ (Bun + Hono + SQLite, 13 endpoints)
- Web Demo: src/components/IFarted/ (UDL site) + apps/web/ (standalone Vite)
- Docs: README.md, DEPLOYMENT.md, SECURITY.md, ROADMAP.md, IMPORT_NOTES.md, CONTRIBUTING.md, RELEASE_NOTES.md, apps/mobile/README.md, APP_REVIEW.md, STORE_CHECKLIST.md, apps/server/README.md, API_DOCS.md
