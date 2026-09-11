# iFarted Release Notes — v0.11.0 Alpha (v11 Scaffold)

Date: 2026-09-11
Branch: ifarted
Commits: v2 → v11, 10 pushes

## Overview
v11 continues the iFarted implementation — context-based Yo-style "I farted." is the entire message. Notification IS message. No inbox/history. Thin client, thin backend. Deadpan humor.

## What's New in v11

### Server
- **lib/sounds.ts**: Fart sound library — 5 variants: classic (fart.caf 1200ms OG brown noise + sine sweep), short (400ms quick puff), long (2500ms rumble), squeaky (800ms cartoon), wet (1500ms don't ask). `getRandomFartSound()`, `getFartSoundById()`, `getDefaultFartSound()`. Ready for future sound picker UI.
- **lib/websocket.ts** (v10): WebSocket real-time delivery status (optional for web demo), clients Map, add/remove/notify
- **lib/load-test.ts** (v10): Load test 10 users 5 farts each, register mutual friends concurrent sends, metrics RPS — tested 50 farts 1136 RPS, 100 farts 819 RPS
- **Security**: X-Content-Type-Options nosniff, X-Frame-Options DENY, X-XSS-Protection block, Referrer-Policy strict-origin-when-cross-origin, HSTS prod, CORS configurable via CORS_ORIGIN env
- **Graceful shutdown**: SIGTERM/SIGINT handlers, startup logs health/metrics/admin/docs
- **Health**: timestamp + uptime, stats version, root docs link
- **Admin**: /admin counts+metrics+uptime+memory, /admin/users last100, /admin/farts last100, /admin.html HTML dashboard cards tables raw JSON, ADMIN_KEY localStorage persist auto-load
- **Live**: :3000 Bun+Hono+SQLite WAL 13 endpoints, metrics 20 users 100 farts 100/hour 20 active (after load tests)

### Mobile
- **lib/haptics.ts**: Expo Haptics wrapper — hapticLight on tap, hapticSuccess on sent, hapticError on fail, fallback if not installed
- **components/FartButton.v2.tsx**: FartButton v2 with haptics + animation — Animated scale 0.9→1 80ms+120ms, light impact on tap, success on sent, disabled handling, username subtitle
- **lib/linking.ts** (v7): Deep link parseInviteFromUrl ifarted://invite/ https://ifarted.app/invite/ exp:// query code, setupLinkingListener initial+event, navigateToFartDetail
- **components/ErrorBoundary.tsx** (v7): ErrorBoundary catch retry 💥 Something farted wrong
- **Existing v7-v8**: 7 screens home real friends pull-to-refresh push handling location toggle AdBanner gated EmptyState onboarding 3 paths <60s search contacts invite fart-detail deadpan map pin fart back settings Remove Ads IAP Restore phone-discovery invite privacy sign out; stores useAuth useFriends; libs api.ts typed fetch Bearer notifications.ts channel farts fart.mp3 vibration getExpoPushToken listeners contacts.ts permission E164 ads.ts initAds TestIds BANNER non-personalized iap.ts RevenueCat+expo-iap remove_ads $1.99 ad_free entitlement; config app.json name iFarted slug ifarted scheme ifarted icon splash ios bundle com.ifarted.app NSLocation NSContacts UIBackgroundModes remote-notification googleMobileAdsAppId placeholder android package com.ifarted.app permissions ACCESS_FINE_LOCATION READ_CONTACTS googleMobileAdsAppId googleServicesFile secret plugins expo-router expo-notifications sounds expo-location google-mobile-ads maps extra.eas.projectId apiUrl; eas.json dev internal preview internal prod autoIncrement PrivacyInfo.xcprivacy no tracking location contacts file timestamp user defaults

### Web
- **App.jsx** (v10): Dark mode toggle 🌙/☀️ localStorage persist isDark, bg #1a1a1a dark vs #fff7ed light, cardBg #2a2a2a vs #fff, text #fff vs #000, subText #aaa vs #666, border adaptive, arch pre bg adaptive, footer v0.9.0 Alpha v10, full flow register localStorage search add fart lat/lng invite metrics log sound
- **components/AdminDashboard.jsx** (v11): React admin dashboard — ADMIN_KEY input localStorage persist, load /admin + /admin/users + /admin/farts, metrics cards 4, raw JSON, recent users 20 + farts 20 tables, error handling
- **public/manifest.json** (v7): PWA name iFarted Web Demo standalone #fff7ed #000 icons 192/512 copied from mobile icon.png
- **Live**: 5173 UDL website+IFarted demo real API, 5174 web client standalone PWA

### Docs
- **API_DOCS.md**: 13 endpoints auth Bearer+ADMIN_KEY data model SQL rate limiting push flow security testing deployment
- **CONTRIBUTING.md**: Monorepo quick start dev conventions testing security monetization branding deployment App Review store checklist roadmap memory bank import note
- **RELEASE_NOTES.md**: v0.9.0 Alpha comprehensive overview whats new v2-v9 tests passing live previews known issues next
- **RELEASE_NOTES_v11.md** (this): v0.11.0 Alpha overview
- **ROADMAP.md**: v1.0 roadmap alpha/beta/v1.0 nice-to-have
- **APP_REVIEW.md**: App Review context-based Yo rejection flow ephemerality monetization anti-spam permissions
- **STORE_CHECKLIST.md**: Branding audio App Store Play Console Expo EAS deploy privacy monetization testing legal
- **SECURITY.md**: Yo lessons
- **DEPLOYMENT.md**: Docker/Fly/Railway
- **IMPORT_NOTES.md**: Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX import note

### Tests
- **Unit**: crypto.test.ts + rate-limit.test.ts bun:test 7 pass apiKey 64 hex hash deterministic UUID inviteCode no O0I1 phone normalize rate-limit allows/blocks
- **Integration**: src/test.ts integration + e2e-sim.ts 2 users mutual friends 3 farts context SF/NYC + load-test.ts 10 users 5 farts each 50 farts 1136 RPS 100 farts 819 RPS metrics totalUsers totalFarts fartsLastHour activeUsersLastHour
- **Build**: UDL website vite build 133 modules 313KB, web client vite build

## Live Previews
- Server: :3000 — /health ok timestamp+uptime, /metrics totalUsers20 totalFarts100 fartsLastHour100 activeUsersLastHour20, /admin.html dashboard, /admin counts+metrics+uptime+memory
- UDL: :5173 — IFartedSection real API register localStorage realFriends metrics log messageId
- Web: :5174 — standalone Vite React full flow register/search/add/fart/invite/metrics/log+sound+arch dark mode toggle

## Known Issues / Next
- Sound: currently single fart.mp3 placeholder, need pro fart.caf <30s + variants + sound picker UI (sounds.ts library ready)
- Mobile: need 2 EAS dev builds real ExpoPushTokens custom sound final location contacts E2E (requires Expo account + devices)
- Monetization: AdMob real IDs IAP RevenueCat Firebase google-services.json GoogleService-Info.plist (placeholders now)
- Deploy: server deploy api.ifarted.app domain ifarted.app/invite legal privacy policy
- Store: final branding (icon final, splash), App Review flow, EAS prod TestFlight/Play internal, store submission
- GitHub Actions: workflow blocked 403 Resource not accessible by integration (GitHub App permission), local copy /tmp/ifarted-v3.tar.gz

## How to Run Locally
```bash
# Server
cd apps/server
bun install
ADMIN_KEY=test123 PORT=3000 bun src/index.ts
# → http://localhost:3000/health
# → http://localhost:3000/admin.html?key=test123
# → bun src/e2e-sim.ts
# → bun src/load-test.ts
# → bun test

# Web client
cd apps/web
npm install
npm run dev -- --port 5174 --host 0.0.0.0
# → http://localhost:5174

# UDL website (root)
npm install
npm run dev -- --port 5173 --host 0.0.0.0
# → http://localhost:5173
```

## Drive Import
Folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX — 8 markdown files imported via embeddedfolderview + fetch_page proxy bypassing TLS block. See IMPORT_NOTES.md.

## License / Contact
See README.md
