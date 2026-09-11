# iFarted — v0.13.0 Alpha (v13 Scaffold) Final v1.0 Alpha

> Send a friend exactly one thing: **"I farted."**

A dead-simple cross-platform mobile app: pick a person, optionally attach your location, and send them a push notification that says exactly one thing — **"I farted."** They can one-tap fart right back. No typing, no inbox, no feed.

Modeled on the 2014 **Yo!** app (context-based messaging) — "You understand by the context what is being said." — Or Arbel, Yo creator — with monetization in from day one.

## What it is
- **iOS + Android** — React Native + Expo + TypeScript, one codebase
- Fixed message **"I farted."** — meaning from context (who, when, where)
- Optional **location** per message → recipient sees map pin
- Custom notification sound **fart.caf** <30s (iOS) + **fart.mp3** (Android/web)
- 5 sound variants: classic (OG), short (400ms), long (2500ms), squeaky, wet — library ready, picker UI ready
- Notifications ephemeral by design (no history) — notification IS message

## Find & Add Friends (3 ways, <60s onboarding)
- Unique **@username** + search `GET /v1/users/search?username=`
- Opt-in **phone contacts** matching `POST /v1/contacts` — hashes SHA-256, E164, only hashes sent
- **Invite code + deep link** `POST /v1/invites` → `ifarted://invite/:code` + `https://ifarted.app/invite/:code` + `exp://` — parseInviteFromUrl, setupLinkingListener

## Architecture

| Piece | Stack | Status |
|---|---|---|
| `apps/mobile` | Expo (React Native + TypeScript) client, 7 screens, Zustand stores, notifications/contacts/ads/iap/libs, gated AdBanner, FartButton + v2 haptics+animation, EmptyState, ErrorBoundary, SoundPicker, linking, PrivacyInfo | MVP complete, needs 2 EAS dev builds real push E2E |
| `apps/server` | Bun + Hono + SQLite WAL relay → Expo Push API → APNs/FCM, 13 endpoints, auth Bearer apiKey 64 hex, rate limiting in-memory+persistent SQLite, metrics, admin, security headers, graceful shutdown, health timestamp+uptime, WebSocket optional, load test | Live :3000, 20 users 100 farts 100/hour 20 active, tests 7 pass + E2E + load 1136 RPS |
| `apps/web` | Vite React standalone web client 5174 + UDL site 5173 IFartedSection real API, PWA manifest, dark mode toggle, SoundPicker, AdminDashboard | Live 5173 + 5174, build 133 modules 313KB |
| `packages/contracts` | Shared API types | Complete |

### Push Flow
```
[Sender Mobile/Web] POST /v1/farts {recipientId, lat?, lng?, sound?} Bearer apiKey
    ↓
[Bun relay :3000] auth + rate limit 30/hour sender 100/hour recipient → insert message → recordFart() → POST https://exp.host/--/api/v2/push/send {to, title=senderName, body="I farted.", sound="fart.caf", data:{senderId, senderUsername, lat?, lng?, messageId}}
    ↓
[Expo Push Service] → [APNs / FCM]
    ↓
[Recipient] OS notification (title=senderName, body="I farted.", sound=fart.caf) → tap → fart-detail + map pin + fart back button
```
No inbox/history — notification IS message. Messages table kept only for rate limiting/abuse.

## Monetization (Day One)
- Free tier with ads (AdMob Banner, non-personalized npa=1, gated component)
- One-time **Remove Ads** IAP $1.99 non-consumable restorable (RevenueCat + expo-iap, entitlement ad_free, product remove_ads, Restore in settings)
- AdBanner gated by isAdFree, real BannerAd + fallback placeholder

## Status (2026-09-11 — scaffold v13, tag v0.13.0-alpha)

### Server Live :3000 (pid2781)
- Bun 1.4.2 + Hono + SQLite WAL, 13 endpoints: POST /v1/register GET /v1/me POST /v1/tokens POST /v1/farts GET /v1/users/search POST /v1/contacts POST /v1/invites GET /v1/friends ordered lastFartAt POST /v1/friends POST /v1/settings/phone-discovery POST /v1/block unblock + /metrics /v1/stats /admin counts+metrics+uptime+memory /admin/users last100 /admin/farts last100 /admin.html HTML dashboard cards tables raw JSON + security headers nosniff DENY XSS block Referrer strict HSTS prod CORS CORS_ORIGIN env + graceful SIGTERM/SIGINT + health timestamp+uptime stats version root docs link + startup logs health/metrics/admin/docs + lib/metrics.ts recordFart getMetrics hourly cleanup fartsLastHour activeUsersLastHour + lib/rate-limit-persistent.ts persistent SQLite + lib/websocket.ts WebSocket optional + lib/load-test.ts 10 users 5 farts each 50 farts 1136 RPS 100 farts 819 RPS + lib/sounds.ts 5 variants classic short long squeaky wet + lib/crypto.test.ts + rate-limit.test.ts bun:test 7 pass + src/test.ts integration + src/e2e-sim.ts 2 users mutual friends 3 farts SF/NYC + src/load-test.ts load test + SECURITY.md Yo lessons + e2e-sim + API_DOCS.md 13 endpoints auth Bearer+ADMIN_KEY data model SQL rate limiting push flow security testing deployment web demo + DEPLOYMENT.md Docker/Fly/Railway + README
- Metrics: 20 users 100 farts 100/hour 20 active after load tests
- Tests: unit 7 pass + E2E + load 1136 RPS + build

### Mobile MVP (7 screens)
- Screens: home real friends pull-to-refresh push handling location toggle AdBanner gated EmptyState onboarding 3 paths <60s search contacts invite fart-detail deadpan map pin fart back settings Remove Ads IAP Restore phone-discovery invite privacy sign out
- Stores: useAuth useFriends
- Libs: api.ts typed fetch Bearer, notifications.ts channel farts fart.mp3 vibration getExpoPushToken listeners, contacts.ts permission E164, ads.ts initAds TestIds BANNER non-personalized, iap.ts RevenueCat+expo-iap remove_ads $1.99 ad_free entitlement, linking.ts parseInviteFromUrl ifarted://invite/ https://ifarted.app/invite/ exp:// query code setupLinkingListener initial+event navigateToFartDetail, haptics.ts Expo Haptics wrapper light success error
- Components: AdBanner real BannerAd fallback, FartButton, EmptyState, ErrorBoundary catch retry 💥 Something farted wrong, FartButton.v2 haptics+animation scale 0.9→1 80ms+120ms, SoundPicker choose variant
- Config: app.json name iFarted slug ifarted scheme ifarted icon splash ios bundle com.ifarted.app NSLocation NSContacts UIBackgroundModes remote-notification googleMobileAdsAppId placeholder android package com.ifarted.app permissions ACCESS_FINE_LOCATION READ_CONTACTS googleMobileAdsAppId googleServicesFile secret plugins expo-router expo-notifications sounds expo-location google-mobile-ads maps extra.eas.projectId apiUrl; eas.json dev internal preview internal prod autoIncrement PrivacyInfo.xcprivacy no tracking location contacts file timestamp user defaults
- Sounds: lib/sounds.ts 5 variants classic fart.caf 1200ms OG brown noise+sine sweep deadpan short 400ms quick puff long 2500ms rumble squeaky 800ms cartoon wet 1500ms don't ask getRandomFartSound getFartSoundById getDefaultFartSound ready picker UI
- Docs: APP_REVIEW.md context-based Yo rejection flow ephemerality monetization anti-spam permissions, STORE_CHECKLIST.md branding audio App Store Play Console Expo EAS deploy privacy monetization testing legal, README

### Web (5173 UDL + 5174 standalone)
- UDL site 5173: IFartedSection real API register localStorage realFriends metrics log messageId build 133 modules 313KB
- Standalone 5174: Vite React full flow register localStorage search add fart lat/lng invite metrics log sound arch main.jsx index.css package.json vite.config.js index.html + PWA public/manifest.json standalone #fff7ed #000 icons 192/512 copied mobile icon.png + dark mode toggle 🌙/☀️ localStorage persist isDark bg #1a1a1a dark vs #fff7ed light card #2a2a2a vs #fff text #fff vs #000 sub #aaa vs #666 border adaptive arch pre bg adaptive footer v0.9.0 Alpha v10 + components/SoundPicker.jsx 5 variants classic short long squeaky wet file /fart.mp3 placeholder duration 400-2500ms desc Play audio preview volume 0.5 setTimeout duration Select border #000 vs #eee bg #fff7ed vs #fff selected check + components/AdminDashboard.jsx React admin dashboard ADMIN_KEY input localStorage persist load /admin+/admin/users+/admin/farts metrics cards 4 raw JSON recent users 20+farts 20 tables error handling

### Docs (v3→v13)
- README.md v3 + README_v4.md v13 this, DEPLOYMENT.md, SECURITY.md, ROADMAP.md, API_DOCS.md, APP_REVIEW.md, STORE_CHECKLIST.md, CONTRIBUTING.md, RELEASE_NOTES.md v0.9.0 Alpha + RELEASE_NOTES_v11.md v0.11.0 Alpha + RELEASE_NOTES_v13.md v0.13.0 Alpha + DEPLOYMENT_CHECKLIST_v1.md v1.0 Alpha→Beta→Store comprehensive + PRIVACY.md + TERMS.md + IMPORT_NOTES.md + mobile/server READMEs + memory-bank/ 6 core + research
- Import: Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview + fetch_page proxy bypassing TLS block, 8 markdown files

### Live Previews
- Server :3000 — /health ok timestamp+uptime, /metrics totalUsers20 totalFarts100 fartsLastHour100 activeUsersLastHour20, /admin.html dashboard, /admin counts+metrics+uptime+memory
- UDL :5173 — IFartedSection real API register localStorage realFriends metrics log
- Web :5174 — standalone Vite React full flow register/search/add/fart/invite/metrics/log+sound+arch dark mode toggle SoundPicker AdminDashboard
- Git: ifarted 96b95c7 v13 pushed, tag v0.13.0-alpha

## Quick Start

### UDL Website
```bash
npm install
npm run dev # :5173 Vite
npm run build # 133 modules, 313KB
```

### iFarted Server
```bash
cd apps/server
npm install -g bun # workaround bun.sh TLS block
bun install
ADMIN_KEY=test123 PORT=3000 bun src/index.ts # :3000
curl http://localhost:3000/health
curl http://localhost:3000/metrics
curl "http://localhost:3000/admin?key=test123"
# HTML dashboard
open http://localhost:3000/admin.html
# Tests
bun test # unit 7 pass
bun src/test.ts # integration
bun src/e2e-sim.ts # 2 users 3 farts
bun src/load-test.ts # 10 users 5 farts 50 farts 1136 RPS
```

### iFarted Web Client
```bash
cd apps/web
npm install
npm run dev -- --port 5174 --host 0.0.0.0 # :5174
# Dark mode toggle 🌙/☀️ top right
# Register → Search → Add friend → Tap 💨 Fart
# SoundPicker + AdminDashboard components
```

### iFarted Mobile
```bash
cd apps/mobile
npm install
npx expo start # or --dev-client for dev build
eas build --profile development --platform all # push testing needs dev build + Expo account + 2 devices
# Onboarding 3 paths <60s: search @username, contacts permission (hashes only), invite code + deep link
# Home: real friends pull-to-refresh, location toggle, AdBanner gated, FartButton v2 haptics+animation
# Fart-detail: deadpan + map pin + fart back
# Settings: Remove Ads IAP $1.99 Restore, phone-discovery, invite privacy sign out
```

## Branding / Audio (v3 closed, v11-v13 enhanced)
- Audio: generated placeholder fart.wav (brown noise + sine sweep down 200→40Hz, 1.2s, envelope) copied to .caf/.mp3 + android raw, <30s for iOS, 5 variants library ready (classic short long squeaky wet), TODO replace with pro sound
- Icons: generated placeholder icon.png/adaptive-icon.png/splash.png (minimalist black speech bubble 💨), TODO replace with pro 1024x1024
- Ads: AdMob wiring real BannerAd + fallback placeholder, non-personalized npa=1, single gated component AdBanner, TestIds now, need real ca-app-pub-...
- IAP: RevenueCat favored + expo-iap fallback, $1.99, entitlement ad_free, product remove_ads, Restore
- Privacy: PrivacyInfo.xcprivacy, purpose strings app.json, non-personalized ads no ATT, PRIVACY.md + TERMS.md templates ready host at ifarted.app/privacy + /terms
- Haptics: haptics.ts light on tap success on sent, FartButton.v2 animation scale 0.9→1

## Deployment (Alpha → Beta → Store)
See DEPLOYMENT_CHECKLIST_v1.md for comprehensive checklist Alpha→Beta→Store, DEPLOYMENT.md for Docker/Fly/Railway, STORE_CHECKLIST.md for branding audio App Store Play Console Expo EAS deploy privacy monetization testing legal, APP_REVIEW.md for context-based Yo rejection flow.

### Alpha (Current v13)
- [x] Server live :3000 13 endpoints tests 7 pass E2E load 1136 RPS
- [x] Web live 5173 + 5174 dark mode sound picker admin React build 313KB
- [x] Mobile MVP 7 screens stores libs components config app.json eas.json sounds haptics
- [x] Docs comprehensive + legal templates PRIVACY TERMS
- [ ] Deploy api.ifarted.app + ifarted.app + ifarted.app/invite/:code + legal host
- [ ] EAS dev builds real push E2E + AdMob real IDs + RevenueCat + Firebase + final audio + final icon

### Beta
- Server deployed api.ifarted.app HTTPS HSTS CORS https://ifarted.app, web deployed ifarted.app + invite deep link, mobile EAS dev 2 devices real push E2E location E2E contacts E2E, monetization real AdMob real IDs IAP $1.99 Remove Ads Restore non-personalized, branding final icon splash screenshots preview video, privacy PrivacyInfo.xcprivacy no tracking location contacts file timestamp user defaults Data Safety form, testing 10+ beta users crash-free ANR-free performance, legal Privacy Policy URL Terms URL contact email

### v1.0 Store Submission
- App Store Connect bundle com.ifarted.app display iFarted version 1.0.0 build EAS prod TestFlight internal+external App Review notes context-based Yo-style no inbox notification IS message ephemeral anti-spam permissions why screenshots description keywords support URL privacy URL age rating 12+ infrequent crude humor pricing free with IAP $1.99 Remove Ads export compliance no encryption
- Play Console package com.ifarted.app version 1.0.0 AAB EAS prod internal closed open Data Safety no data collected except username optional phone discovery location optional one-time contacts optional one-time no tracking screenshots phone 16:9 + 7" + 10" tablet feature graphic description content rating target audience pricing free with IAP ads contains ads
- EAS prod builds ios+android autoIncrement eas submit
- Post-launch monitoring metrics crashlytics feedback roadmap nice-to-have (sound picker custom sounds group farts etc)

## Import Note (2026-09-11)
This repo originally is [lin2mm/udlbook](https://github.com/lin2mm/udlbook) — Understanding Deep Learning book website (Vite + React). iFarted planning docs imported from Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview workaround due to TLS blocks on drive.google.com in sandbox.

Structure now:
- `src/` — UDL book website (original)
- `apps/mobile`, `apps/server`, `apps/web`, `packages/contracts` — iFarted scaffold v13 (new)
- `.clinerules/`, `memory-bank/` — Cline memory bank (imported)
- `README.md` v3 + `README_v4.md` v13 this — iFarted
- Docs: API_DOCS, CONTRIBUTING, SECURITY, DEPLOYMENT, ROADMAP, APP_REVIEW, STORE_CHECKLIST, IMPORT_NOTES, RELEASE_NOTES v0.9.0+v11+v13, DEPLOYMENT_CHECKLIST_v1, PRIVACY, TERMS

To run UDL: `npm install && npm run dev`
To scaffold iFarted: see memory-bank/*.md + docs above

## Original UDL Book Website
See `src/README.md` for UDL website instructions.

```shell
npm install
npm run dev # :5173
npm run build # 133 modules, 313KB
npm run preview
npm run format
npm run lint
```

## License / Contact
See original UDL book license + iFarted docs. GitHub ifarted, tag v0.13.0-alpha, Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX, Memory Bank 6 core + research.
