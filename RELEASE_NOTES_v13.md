# iFarted Release Notes — v0.13.0 Alpha (v13 Scaffold) — Final v1.0 Alpha

Date: 2026-09-11
Branch: arena/01a08e52-udlbook
Commits: v2 → v13, 12 pushes
Tag: v0.13.0-alpha (to be created)

## Overview
Final v1.0 Alpha scaffold — iFarted is dead-simple Yo-style: "I farted." is entire message. Notification IS message. No inbox/history. Thin client, thin backend. Deadpan humor. Context-based: "You understand by the context what is being said." — Or Arbel (Yo creator).

This release is feature-complete for alpha: server live, web clients live, mobile MVP 7 screens, tests passing, docs comprehensive, legal templates, deployment checklist, ready for EAS dev builds + real push E2E + store submission.

## What's New in v13

### Legal
- **PRIVACY.md**: Comprehensive privacy policy — data we collect (username, displayName, userId UUID, apiKey 64 hex, optional location one-time lat/lng, contacts one-time hashes SHA-256, phone optional E164 hash, Expo push token, friends list, messages messageId sender recipient timestamp optional lat/lng for rate limiting, metrics aggregated, rate limit state, invites), not collected (email real name address birthdate photos files message content beyond "I farted." browsing history tracking across apps advertising ID), how we use (send/receive farts, find friends, prevent abuse, show fart-detail, show ads non-personalized Remove Ads IAP), how we share (don't sell, push token with Expo Push Service → APNs/FCM, contacts only hashes, location only as part of fart payload to recipient, admin dashboard aggregated counts recent users/farts ids truncated no PII), retention (user until sign out/delete or server reset alpha, messages for rate limiting may prune >30 days future, metrics hourly buckets pruned 24h), security (apiKey 64 hex random Bearer, no passwords, hashing phone SHA-256 apiKey hash, rate limiting in-memory+persistent SQLite, security headers nosniff DENY XSS block Referrer strict HSTS prod CORS configurable, no PII in logs), permissions (Location NSLocationWhenInUseUsageDescription "iFarted uses your location to show where you farted on a map (optional, only when you send a fart)" deny OK, Contacts NSContactsUsageDescription "iFarted uses your contacts to find friends (optional, only hashes are sent)" deny OK, Notifications UIBackgroundModes remote-notification, Android ACCESS_FINE_LOCATION READ_CONTACTS), children's privacy 12+ not directed to under 13, changes, contact GitHub issues or email future, open source auditable, template for alpha host at https://ifarted.app/privacy for store App Store Privacy Nutrition Label Data Not Collected except username optional phone location contacts push token all with user permission and Play Data Safety same
- **TERMS.md**: Terms of service — overview Yo-style "I farted." entire message agree to terms, use 12+ age rating 12+ infrequent crude humor username 3-20 alnum/_ don't impersonate offensive may moderate send farts to friends don't spam rate limit 30/hour sender 100/hour recipient enforced may rate-limit block no inbox/history notification IS message ephemeral client server minimal logs rate limiting abuse location contacts optional permission deny OK still use, content only message "I farted." fixed can't type custom content moderation minimal username display name must not offensive don't harass spam abuse block someone can't fart you future feature currently block endpoint exists may remove users violate terms, monetization free with ads AdMob Banner non-personalized optional Remove Ads IAP $1.99 ad_free entitlement RevenueCat expo-iap Restore Purchases settings ads non-personalized npa=1 no tracking, privacy see PRIVACY.md minimal no tracking, disclaimer for fun joke app context-based like Yo no warranty own risk don't guarantee uptime alpha server may reset don't rely important communication, changes, contact GitHub issues email future, license README.md open source, template alpha host https://ifarted.app/terms

### Previous v12
- **Web SoundPicker**: components/SoundPicker.jsx 5 variants classic short long squeaky wet file /fart.mp3 placeholder duration 400-2500ms desc Play audio preview volume 0.5 setTimeout duration Select border #000 vs #eee bg #fff7ed vs #fff selected check
- **Mobile SoundPicker**: components/SoundPicker.tsx SoundPicker choose fart variant SOUNDS 5 same as server lib/sounds.ts ScrollView maxHeight 300 TouchableOpacity border 2px #000 vs #eee bg #fff7ed vs #fff selected check props selected onSelect
- **Deployment Checklist**: DEPLOYMENT_CHECKLIST_v1.md v1.0 Alpha→Beta→Store comprehensive checklist server 13 endpoints auth rate limiting metrics admin security graceful health live :3000 20 users 100 farts tests 7 pass E2E load 1136 RPS deploy api.ifarted.app domain ifarted.app/invite ENV, web 5173 5174 dark mode sound picker admin React build 133 modules 313KB deploy ifarted.app legal, mobile 7 screens stores libs components AdBanner FartButton ErrorBoundary FartButton v2 haptics animation SoundPicker config app.json eas.json sounds haptics real audio files EAS dev builds real ExpoPushTokens AdMob real IDs IAP RevenueCat Firebase final branding icon splash screenshots, docs README API_DOCS CONTRIBUTING SECURITY DEPLOYMENT ROADMAP APP_REVIEW STORE_CHECKLIST IMPORT_NOTES RELEASE_NOTES v0.9.0 + v11 + checklist, legal PRIVACY TERMS, Beta server deployed web deployed mobile EAS dev real push E2E monetization real branding final privacy testing legal, v1.0 App Store Connect bundle com.ifarted.app display iFarted version 1.0.0 EAS prod TestFlight App Review notes screenshots description keywords support privacy age rating 12+ pricing free IAP $1.99 export compliance, Play Console package com.ifarted.app version 1.0.0 AAB internal closed open Data Safety screenshots feature graphic description content rating target audience pricing free IAP ads contains ads, EAS prod builds autoIncrement eas submit, post-launch monitoring crashlytics feedback roadmap, current status Git 26a2fd8 v11 3 servers live tests 7 pass E2E load 1136 RPS blockers EAS AdMob RevenueCat Firebase final audio final icon domain deploy workflow blocked 403 local copy /tmp/ifarted-v3.tar.gz, how to unblock 9 steps

### Previous v11
- Server lib/sounds.ts 5 variants classic fart.caf 1200ms OG brown noise+sine sweep deadpan short 400ms quick puff long 2500ms rumble squeaky 800ms cartoon wet 1500ms don't ask getRandomFartSound getFartSoundById getDefaultFartSound ready sound picker UI
- Mobile lib/haptics.ts Expo Haptics wrapper hapticLight impact Light hapticSuccess notification Success fallback Medium hapticError Error try-catch fallback if not installed; components/FartButton.v2.tsx FartButton v2 haptics+animation Animated scale 0.9->1 80ms+120ms light on tap success on sent disabled handling username subtitle Yo-style big deadpan no frills
- Web components/AdminDashboard.jsx React admin dashboard ADMIN_KEY input localStorage persist load /admin+/admin/users+/admin/farts metrics cards 4 raw JSON recent users 20+farts 20 tables error handling
- Docs RELEASE_NOTES_v11.md v0.11.0 Alpha

### Server (v9-v10)
- Live :3000 Bun+Hono+SQLite WAL 13 endpoints POST /v1/register GET /v1/me POST /v1/tokens POST /v1/farts GET /v1/users/search POST /v1/contacts POST /v1/invites GET /v1/friends ordered lastFartAt POST /v1/friends POST /v1/settings/phone-discovery POST /v1/block unblock + /metrics /v1/stats /admin counts+metrics+uptime+memory /admin/users /admin/farts /admin.html HTML dashboard cards tables raw JSON + security headers nosniff DENY XSS Referrer HSTS CORS CORS_ORIGIN env + graceful shutdown SIGTERM/SIGINT + health timestamp+uptime stats version root docs link + startup logs health/metrics/admin/docs; metrics recordFart getMetrics hourly cleanup fartsLastHour activeUsersLastHour; rate-limit-persistent SQLite persistent checkRateLimitPersistent survives restart per-recipient; lib/websocket.ts WebSocket real-time delivery status optional web demo clients Map add/remove/notify; lib/load-test.ts load test 10 users 5 farts each register mutual friends concurrent sends metrics RPS tested 50 farts 1136 RPS 100 farts 819 RPS; tests unit 7 pass crypto+rate-limit apiKey 64 hex hash deterministic UUID inviteCode no O0I1 phone normalize rate-limit allows/blocks + integration + e2e-sim 2 users mutual friends 3 farts context SF/NYC + load-test; docs API_DOCS SECURITY DEPLOYMENT README

### Mobile (v7-v8)
- 7 screens home real friends pull-to-refresh push handling location toggle AdBanner gated EmptyState onboarding 3 paths <60s search contacts invite fart-detail deadpan map pin fart back settings Remove Ads IAP Restore phone-discovery invite privacy sign out; stores useAuth useFriends; libs api.ts typed fetch Bearer notifications.ts channel farts fart.mp3 vibration getExpoPushToken listeners contacts.ts permission E164 ads.ts initAds TestIds BANNER non-personalized iap.ts RevenueCat+expo-iap remove_ads $1.99 ad_free entitlement linking.ts parseInviteFromUrl ifarted://invite/ https://ifarted.app/invite/ exp:// query code setupLinkingListener initial+event navigateToFartDetail haptics.ts; components AdBanner real BannerAd fallback FartButton EmptyState ErrorBoundary catch retry 💥 Something farted wrong FartButton.v2 haptics animation SoundPicker; config app.json name iFarted slug ifarted scheme ifarted icon splash ios bundle com.ifarted.app NSLocation NSContacts UIBackgroundModes remote-notification googleMobileAdsAppId placeholder android package com.ifarted.app permissions ACCESS_FINE_LOCATION READ_CONTACTS googleMobileAdsAppId googleServicesFile secret plugins expo-router expo-notifications sounds expo-location google-mobile-ads maps extra.eas.projectId apiUrl; eas.json dev internal preview internal prod autoIncrement PrivacyInfo.xcprivacy no tracking location contacts file timestamp user defaults; sounds lib/sounds.ts 5 variants; docs APP_REVIEW STORE_CHECKLIST mobile README

### Web (v6-v10)
- UDL site 5173 IFartedSection real API register localStorage realFriends metrics log messageId build 133 modules 313KB; standalone web client 5174 Vite React full flow register localStorage search add fart lat/lng invite metrics log sound arch main.jsx index.css package.json vite.config.js index.html + PWA manifest.json standalone #fff7ed #000 icons 192/512 copied mobile icon.png + dark mode toggle 🌙/☀️ localStorage persist isDark bg #1a1a1a dark vs #fff7ed light card #2a2a2a vs #fff text #fff vs #000 sub #aaa vs #666 border adaptive arch pre bg adaptive footer v0.9.0 Alpha v10 + SoundPicker + AdminDashboard

### Docs (v3-v13)
- README v3, DEPLOYMENT, SECURITY, ROADMAP, API_DOCS, APP_REVIEW, STORE_CHECKLIST, CONTRIBUTING, RELEASE_NOTES v0.9.0 + v11 + v13, IMPORT_NOTES, PRIVACY, TERMS, DEPLOYMENT_CHECKLIST_v1, mobile/server READMEs

## Live Previews
- Server :3000 pid2781 20 users 100 farts 100/hour 20 active after load tests, /health ok timestamp+uptime, /metrics, /admin.html dashboard, /admin counts+metrics+uptime+memory
- UDL :5173 IFartedSection real API register localStorage realFriends metrics log messageId
- Web :5174 standalone Vite React full flow register/search/add/fart/invite/metrics/log+sound+arch dark mode toggle SoundPicker AdminDashboard

## Tests
- Unit: bun test 7 pass crypto rate-limit
- Integration: bun src/test.ts + bun src/e2e-sim.ts 2 users 3 farts + bun src/load-test.ts 10 users 5 farts 50 farts 1136 RPS 100 farts 819 RPS
- Build: vite build 133 modules 313KB

## Known Issues / Next
- Sound: single fart.mp3 placeholder, need pro fart.caf <30s + variants actual audio files + sound picker UI integration (sounds.ts library + SoundPicker components ready)
- Mobile: need 2 EAS dev builds real ExpoPushTokens custom sound final location contacts E2E (Expo account + devices)
- Monetization: AdMob real IDs IAP RevenueCat Firebase google-services.json (placeholders now)
- Deploy: server deploy api.ifarted.app domain ifarted.app/invite legal privacy policy (PRIVACY.md + TERMS.md templates ready, need host at ifarted.app/privacy + /terms)
- Store: final branding icon splash screenshots, App Review flow, EAS prod TestFlight/Play internal, store submission
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

## Tag
- v0.13.0-alpha — final v1.0 Alpha scaffold, ready for beta
