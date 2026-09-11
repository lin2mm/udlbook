# iFarted Deployment Checklist — v1.0 Alpha → Beta → Store

Date: 2026-09-11
Branch: ifarted

## Alpha (Current — v11)

### Server
- [x] Bun + Hono + SQLite WAL, 13 endpoints
- [x] Auth Bearer apiKey, rate limiting in-memory + persistent SQLite
- [x] Metrics recordFart hourly cleanup fartsLastHour activeUsersLastHour
- [x] Admin /admin counts+metrics+uptime+memory + /admin/users + /admin/farts + /admin.html HTML dashboard
- [x] Security headers nosniff DENY XSS block Referrer strict HSTS prod, CORS configurable CORS_ORIGIN env
- [x] Graceful shutdown SIGTERM/SIGINT, startup logs health/metrics/admin/docs
- [x] Health timestamp+uptime, stats version, root docs link
- [x] Tests: unit 7 pass crypto+rate-limit, integration, e2e-sim 2 users 3 farts, load-test 50 farts 1136 RPS 100 farts 819 RPS
- [x] Live :3000 pid2781 20 users 100 farts 100/hour 20 active
- [ ] Deploy to api.ifarted.app (Fly/Railway/Render) — DEPLOYMENT.md has Docker + Fly + Railway instructions
- [ ] Domain ifarted.app/invite/:code → deep link handling
- [ ] ENV: ADMIN_KEY strong, CORS_ORIGIN=https://ifarted.app, DATABASE_URL prod, EXPO_ACCESS_TOKEN

### Web
- [x] UDL site 5173 IFartedSection real API register localStorage realFriends metrics log
- [x] Standalone web client 5174 Vite React full flow register/search/add/fart/invite/metrics/log+sound+arch + PWA manifest standalone #fff7ed #000 icons 192/512
- [x] Dark mode toggle 🌙/☀️ localStorage persist isDark bg #1a1a1a vs #fff7ed card #2a2a2a vs #fff
- [x] Sound picker component (v12) 5 variants classic short long squeaky wet
- [x] Admin React dashboard component (v11) ADMIN_KEY persist metrics cards raw JSON users/farts tables
- [x] Build 133 modules 313KB vite build pass
- [ ] Deploy web client to ifarted.app (Vercel/Netlify/Cloudflare Pages)
- [ ] Final legal: Privacy Policy, Terms, contact

### Mobile
- [x] 7 screens home real friends pull-to-refresh push handling location toggle AdBanner gated EmptyState onboarding 3 paths <60s search contacts invite fart-detail deadpan map pin fart back settings Remove Ads IAP Restore phone-discovery invite privacy sign out
- [x] Stores useAuth useFriends
- [x] Libs api.ts typed fetch Bearer notifications.ts channel farts fart.mp3 vibration getExpoPushToken listeners contacts.ts permission E164 ads.ts initAds TestIds BANNER non-personalized iap.ts RevenueCat+expo-iap remove_ads $1.99 ad_free entitlement linking.ts parseInviteFromUrl setupLinkingListener
- [x] Components AdBanner real BannerAd fallback FartButton EmptyState ErrorBoundary catch retry + FartButton v2 haptics+animation + SoundPicker
- [x] Config app.json name iFarted slug ifarted scheme ifarted icon splash ios bundle com.ifarted.app NSLocation NSContacts UIBackgroundModes remote-notification googleMobileAdsAppId placeholder android package com.ifarted.app permissions ACCESS_FINE_LOCATION READ_CONTACTS googleMobileAdsAppId googleServicesFile secret plugins expo-router expo-notifications sounds expo-location google-mobile-ads maps extra.eas.projectId apiUrl
- [x] eas.json dev internal preview internal prod autoIncrement PrivacyInfo.xcprivacy no tracking location contacts file timestamp user defaults
- [x] Sounds: lib/sounds.ts 5 variants classic short long squeaky wet + haptics.ts light success error + FartButton.v2 animation
- [ ] Real audio files: fart.caf <30s pro, fart_short.caf, fart_long.caf, fart_squeaky.caf, fart_wet.caf — currently placeholder fart.mp3
- [ ] 2 EAS dev builds real ExpoPushTokens custom sound final location contacts E2E (requires Expo account + 2 devices)
- [ ] AdMob real IDs: ca-app-pub-... Banner + Interstitial (currently TestIds)
- [ ] IAP RevenueCat: apiKey, products remove_ads $1.99 ad_free entitlement (currently placeholder)
- [ ] Firebase: google-services.json + GoogleService-Info.plist (currently placeholder)
- [ ] Final branding: icon.png final pro (currently minimal black bubble 💨), splash, store screenshots 6.5" + 5.5" + iPad + Android

### Docs
- [x] README.md v3 monorepo structure quick start
- [x] API_DOCS.md 13 endpoints auth data model rate limiting push flow security testing deployment web demo
- [x] CONTRIBUTING.md dev conventions testing security monetization branding deployment App Review checklist roadmap memory bank import note
- [x] SECURITY.md Yo lessons
- [x] DEPLOYMENT.md Docker/Fly/Railway
- [x] ROADMAP.md alpha/beta/v1.0 nice-to-have
- [x] APP_REVIEW.md context-based Yo rejection flow ephemerality monetization anti-spam permissions
- [x] STORE_CHECKLIST.md branding audio App Store Play Console Expo EAS deploy privacy monetization testing legal
- [x] IMPORT_NOTES.md Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX import note
- [x] RELEASE_NOTES.md v0.9.0 Alpha + RELEASE_NOTES_v11.md v0.11.0 Alpha + this DEPLOYMENT_CHECKLIST_v1.md
- [ ] Final legal docs: PRIVACY.md, TERMS.md

## Beta
- [ ] Server deployed api.ifarted.app with real domain, HTTPS, HSTS, CORS https://ifarted.app
- [ ] Web deployed ifarted.app + ifarted.app/invite/:code deep link
- [ ] Mobile EAS dev builds on 2 devices, real push E2E tested, location E2E, contacts E2E
- [ ] Monetization real: AdMob real IDs tested, IAP $1.99 Remove Ads tested Restore, non-personalized ads
- [ ] Branding final: icon, splash, screenshots, preview video
- [ ] Privacy: PrivacyInfo.xcprivacy no tracking, location/contacts file timestamp user defaults, Data Safety form
- [ ] Testing: 10+ beta users, crash-free, ANR-free, performance
- [ ] Legal: Privacy Policy URL, Terms URL, contact email

## v1.0 Store Submission
- [ ] App Store Connect: bundle com.ifarted.app, display name iFarted, version 1.0.0, build via EAS prod, TestFlight internal + external, App Review notes (context-based, Yo-style, no inbox, notification IS message, ephemeral, anti-spam, permissions why), screenshots, description, keywords, support URL, privacy URL, age rating 12+ infrequent crude humor, pricing free with IAP $1.99 Remove Ads, export compliance no encryption
- [ ] Play Console: package com.ifarted.app, version 1.0.0, AAB via EAS prod, internal track + closed + open, Data Safety (no data collected except username optional phone discovery, location optional one-time, contacts optional one-time, no tracking), screenshots phone 16:9 + 7" + 10" tablet, feature graphic, description, content rating, target audience, pricing free with IAP, ads contains ads
- [ ] EAS prod builds: ios + android, autoIncrement, submit via eas submit
- [ ] Post-launch: monitoring metrics, crashlytics, user feedback, roadmap nice-to-have (sound picker, custom sounds, group farts?, etc.)

## Current Status (v11)
- Git: ifarted 26a2fd8 v11 pushed, 3 servers live :3000 :5173 :5174, tests 7 pass + E2E + load 1136 RPS
- Blockers: EAS dev builds (Expo account + devices), AdMob real IDs (AdMob account), RevenueCat (RevenueCat account), Firebase (Firebase project), final audio (pro sound designer or generated), final icon (designer), domain deploy (Fly/Railway/Vercel)
- Workflow: GitHub Actions blocked 403 Resource not accessible by integration (GitHub App permission) — local copy /tmp/ifarted-v3.tar.gz, need to manually add .github/workflows/ifarted.yml with push perms

## How to Unblock
1. Expo account: npx expo login, eas build --profile development --platform all
2. AdMob: create app iOS + Android, get ca-app-pub-..., update app.json googleMobileAdsAppId + ads.ts AdMob IDs
3. RevenueCat: create project, products remove_ads $1.99, entitlements ad_free, get apiKey, update iap.ts
4. Firebase: create project ifarted, add iOS bundle + Android package, download google-services.json + GoogleService-Info.plist, place in mobile root
5. Audio: hire sound designer or generate via Web Audio API + export caf <30s + mp3, place in assets/sounds/
6. Icon: hire designer or generate via AI, 1024x1024, place in assets/images/icon.png + adaptive-icon + splash
7. Domain: buy ifarted.app, deploy server Fly.io + web Vercel, set CORS_ORIGIN https://ifarted.app, set up ifarted.app/invite/:code → exp:// or https://
8. Legal: write PRIVACY.md + TERMS.md, host at ifarted.app/privacy + /terms
9. Store: follow STORE_CHECKLIST.md + APP_REVIEW.md, submit
