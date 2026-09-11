# Roadmap — iFarted v1.0

## Current: v6 (2026-09-11)

- ✅ Import from Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview workaround
- ✅ Bun 1.4.2 via npm (bun.sh TLS blocked workaround)
- ✅ Server: 13 endpoints (register, me, tokens, farts, search, contacts, invites, friends list, add friend, phone-discovery toggle, block, unblock, metrics, stats, admin), rate limiting (in-memory + persistent SQLite), Expo Push relay, metrics, admin dashboard, E2E sim + integration test passing, live on :3000
- ✅ Mobile: 7 screens (home real friends + pull-to-refresh + push handling, onboarding, search @username, contacts opt-in hashed, invite code+deep link+share, fart-detail map+fart back, settings with phone-discovery toggle + Remove Ads IAP), 5 libs (notifications, contacts, ads, iap, api), 3 components (AdBanner gated, FartButton, EmptyState), 2 stores (auth, friends), sound assets generated (fart.wav/caf/mp3 1.2s <30s), icons generated (icon.png/adaptive/splash minimalist bubble 💨), PrivacyInfo.xcprivacy, App Review doc, Store Checklist
- ✅ Web: UDL website integration with IFartedSection demo (tap-to-fart + real API flow), standalone web client apps/web (Vite React, register/search/add friend/fart/invite/metrics/log), public/fart.mp3/wav for web demo, UDL build 133 modules 313KB passes
- ✅ Docs: README.md v3, DEPLOYMENT.md (Docker/Fly.io/Railway/EAS), SECURITY.md (Yo hack lessons), APP_REVIEW.md, STORE_CHECKLIST.md, IMPORT_NOTES.md, server README, mobile README, memory-bank 6 core files + research

## Next: v6 → v1.0 Alpha

### Must Have for Alpha (real devices)

- [ ] **2 EAS dev builds** — `eas build --profile development --platform all`, install on 2 physical iOS + Android devices
- [ ] **Real Expo push tokens** — `getExpoPushTokenAsync()` with real projectId, register via `POST /v1/tokens`, test push via `POST /v1/farts` → Expo Push API → APNs/FCM → OS notification → tap → fart-detail + map pin + fart back
- [ ] **Custom sound final asset** — replace placeholder fart.wav (brown noise + sine sweep) with pro designed short fart sound (<30s, on-brand not too loud/gross for review), convert to `fart.caf` (iOS, afconvert) + `fart.mp3` (Android), test background/killed app sound playback
- [ ] **Location E2E** — test per-message location toggle, permission flow, map pin, purpose strings
- [ ] **Contacts E2E** — test opt-in contacts permission, scanning, hashed matching, discovery toggle

### Must Have for Beta (TestFlight + Play Internal)

- [ ] **AdMob real IDs** — create AdMob account, apps, ad units (banner), replace placeholder `ca-app-pub-...` in `app.json` + `src/lib/ads.ts`, test banner load + AdBanner gated unmount when isAdFree
- [ ] **IAP real wiring** — create products `remove_ads` non-consumable $1.99 in App Store Connect + Play Console, create RevenueCat project + entitlement `ad_free` linked to product, add API keys to EAS secrets, test purchase + restore + isAdFree flag → AdBanner unmounts
- [ ] **Firebase for Android** — create Firebase project, enable FCM, download `google-services.json`, inject via `eas secret:create`, test Android push (Expo Go has limitations, needs dev build)
- [ ] **EAS Build prod** — `eas build --profile production --platform all`, `eas submit` to TestFlight + Play internal
- [ ] **Permissions/privacy polish** — privacy manifest `PrivacyInfo.xcprivacy` already done, need privacy nutrition labels in App Store Connect + data safety form in Play Console, Terms + Privacy Policy URLs (https://ifarted.app/privacy, /terms)

### Must Have for v1.0 Store Submission

- [ ] **Branding final** — pro icon (1024x1024 iOS, 512x512 Android, adaptive foreground), splash, screenshots (6.5" + 5.5" iOS, Android phone), preview video 15-30s, store copy tone pass dry/wry, final store name (working: iFarted) trademark check
- [ ] **Server deployment** — choose final target (cheap VPS Hetzner $5/mo / Fly.io / Railway), deploy with volume for `ifarted.db`, domain `api.ifarted.app` + `ifarted.app/invite/*` deep link domain + associated domains, HTTPS + backup cron + monitoring (Sentry)
- [ ] **App Review explanation** — already in `APP_REVIEW.md` (context-based messaging framing, Yo rejection history, flow, ephemerality, monetization, anti-spam, permissions justification), need test accounts `reviewer_apple` / `reviewer_google`
- [ ] **Legal** — Terms + Privacy Policy, no P2P push, user-initiated targeted push, Remove Ads store-billed, no tracking (non-personalized ads no ATT)
- [ ] **Alpha → Beta → Prod** — internal testing, external TestFlight, Play closed testing, store assets + compliance review, submit

### Nice to Have (Post v1.0)

- [ ] **Groups** — Yo v2 had groups (yo several friends with one tap) — post-MVP stretch
- [ ] **Photos** — Yo v2 had photos within 1 swipe + tap from home — post-MVP
- [ ] **Web push** — web client push notifications via FCM web
- [ ] **Analytics** — PostHog / Mixpanel for funnel (onboarding → add friend → send fart), but privacy-safe, no PII
- [ ] **Admin dashboard UI** — React admin for `/admin/*` with charts (farts/hour, active users, etc.)
- [ ] **Prometheus + Grafana** — metrics export
- [ ] **Backup + Restore** — SQLite backup to S3, point-in-time restore
- [ ] **Rate limit Redis** — for horizontal scaling
- [ ] **JWT rotation** — apiKey expiry + refresh
- [ ] **Phone verification via SMS** — optional 2FA

## Monetization (Yo died without it)

- Free: AdMob banner on home, non-personalized first, no ATT
- Paid: one-time non-consumable Remove Ads IAP $1.99, restorable, store-billed
- Single gated `<AdBanner />` via `isAdFree` Zustand flag, entitlement source of truth = store state
- Yo died 2016 for lack of revenue — monetization from day one

## Risks

- iOS review: Yo initially rejected for "too simple" → have context-based messaging explanation ready
- Harassment/spam: Yo hacked + spammed 2014 → auth, no PII leak, rate limits, block list, explicit recipient list
- Empty network kills app → first-run add-a-friend flow most important screen
- Ad placement must never block joke (banner only, no interstitial before sending)

## Timeline (suggestion)

- Week 1: Alpha — 2 dev builds + real push + sound + location + contacts E2E
- Week 2: Beta — AdMob real IDs + IAP real wiring + Firebase + EAS prod builds + TestFlight/Play internal
- Week 3: v1.0 — branding final + server deployment + App Review doc + legal + submit
- Week 4: Launch + monitoring + iteration

## Links

- Drive folder: https://drive.google.com/drive/folders/18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX
- Repo: https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook
- Memory Bank: `memory-bank/` (6 core files + research/yo-app.md)
- Mobile: `apps/mobile/` (Expo TS, 7 screens)
- Server: `apps/server/` (Bun + Hono + SQLite, 13 endpoints)
- Web Demo: `src/components/IFarted/` (UDL site) + `apps/web/` (standalone Vite)
- Docs: `README.md`, `DEPLOYMENT.md`, `SECURITY.md`, `ROADMAP.md`, `IMPORT_NOTES.md`, `apps/mobile/README.md`, `apps/mobile/APP_REVIEW.md`, `apps/mobile/STORE_CHECKLIST.md`, `apps/server/README.md`
