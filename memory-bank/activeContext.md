# Active Context — iFarted

*Last updated: 2026-09-11 (session 5 ifarted) — scaffold v3 complete*

## Current State
- **Scaffold v3 complete — audio assets generated, icons generated, AdMob/IAP real wiring, privacy manifest, UDL website integration with web demo, CI, deployment guide**
- **Stack (locked):** React Native + Expo + TypeScript + Bun + Hono + SQLite + Expo Push API + AdMob + RevenueCat
- **Workspace**: `.clinerules/`, `memory-bank/` (6 core + research), `apps/mobile` (7 screens + 5 libs + 3 components), `apps/server` (11 endpoints + test + Dockerfile + README), `packages/contracts`, `src/components/IFarted/` (web demo), `README.md`, `DEPLOYMENT.md`, `IMPORT_NOTES.md`, `.github/workflows/ifarted.yml` — plus original UDL book `src/` (Vite site builds 133 modules 309KB)
- **Decisions locked:**
 1. **Identity & discovery = all three:** unique @username + search · phone/contacts (opt-in) · invite code/deep link — implemented: search.tsx, contacts.tsx (hashed, discovery-only), invite.tsx (code+deep link+share)
 2. **Backend = lightweight Bun + Expo Push API** — **Bun 1.4.2 via npm** (bun.sh TLS blocked, workaround via `npm install -g bun`). Server runs on :3000, DB migrated, 11 endpoints, rate limiting, integration test passes.
 3. **Product design = Yo! pattern** — fixed phrase, notification text+audio, contact-list home with tap-to-send + one-tap fart back, ephemeral, context-based messaging framing.
 4. **Audio asset (closed v3):** generated placeholder fart.wav 1.2s (brown noise + sine sweep down 200→40Hz, envelope) copied to .caf/.mp3 + android raw, <30s for iOS, TODO pro sound final
  5. **Branding (closed v3 placeholder):** icons generated via AI (icon.png/adaptive-icon.png/splash.png minimalist black bubble 💨), TODO pro final
  6. **Ads + IAP (closed v3 wiring):** AdMob real BannerAd + fallback, non-personalized, single gated component, IAP RevenueCat favored + expo-iap fallback, $1.99 suggestion, entitlement ad_free, product remove_ads

## Recent Changes (ifarted)
- 2026-09-09 (session 3): **Repo initialized & pushed.** Server repo `2re/iFarted` already existed (public/open, created 2026-09-09 13:03Z). Local: `git init -b main`, added `README.md` + `.gitignore`, committed everything, initial commit `8fec909`. Pushed via SSH key (`torrey@nommesen.com`).
- 2026-09-09 (session 2): Researched Yo! Created `memory-bank/research/yo-app.md`. Answered Bun feasibility (yes). Locked identity, backend, product model.
- 2026-09-11 (import): **Imported into udlbook ifarted** via Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX using embeddedfolderview ID extraction workaround (drive.google.com TLS blocked, fetch_page proxy used).
- 2026-09-11 (scaffold v1): Monorepo scaffold: contracts, server (Hono+Bun+SQLite), mobile (4 screens). Server tested.
- 2026-09-11 (scaffold v2): Bun 1.4.2 via npm, server v2 with 11 endpoints (me, friends, add friend, phone-discovery toggle, unblock), mobile v2 with 7 screens + Zustand friends store + notifications lib (channel+token+listeners) + contacts lib + AdBanner gated + FartButton + EmptyState. Integration test `bun src/test.ts` passes. UDL site still builds. Relay server live on :3000.
- 2026-09-11 (scaffold v3): Audio assets generated (fart.wav 1.2s brown noise + sine sweep down, copied to .caf/.mp3 + android raw), icons generated (icon.png/adaptive/splash minimalist bubble 💨), AdBanner real wiring with BannerAd fallback, IAP real wiring RevenueCat + expo-iap ($1.99 suggestion, entitlement ad_free), PrivacyInfo.xcprivacy, UDL website integration: new IFartedSection component with demo box (tap-to-fart + log + sound + real API try), Navbar + Sidebar links, public/fart assets, .github/workflows/ifarted.yml CI (server+mobile+udl), DEPLOYMENT.md (Docker/Fly.io/Railway/EAS), STORE_CHECKLIST expanded. Server live v2, UDL build 133 modules 309KB, all tests pass.
- 2026-09-11 (scaffold v3 continued): Web demo improved, CI added, deployment guide, README updated, sound + icons committed, AdMob/IAP libs improved, privacy manifest, progress/activeContext updated to v3.

## Remaining Open Decisions (v3 — mostly closed, only final polish left)
1. ~~Audio asset~~ ✅ placeholder generated, TODO pro sound final (<30s, on-brand not too gross)
2. ~~Remove Ads price/lib~~ ✅ $1.99 + RevenueCat favored wired, TODO create products in stores
3. ~~Ad placement~~ ✅ banner on home default, single gated, non-personalized, TODO confirm no interstitial
4. ~~Branding~~ ✅ placeholder icons generated, TODO pro icon + screenshots + store copy
5. ~~Deploy target~~ ✅ documented Fly.io/Railway/VPS + Docker + EAS, TODO choose final + domain ifarted.app + api.ifarted.app

## Next Steps
1. ~~Repo setup~~ ✅ done
2. ~~Scaffold monorepo~~ ✅ done v1+v2+v3
3. ~~Install Bun + relay server~~ ✅ done — Bun 1.4.2 via npm, 11 endpoints, test passes, live :3000
4. ~~Client screens~~ ✅ done — 7 screens + stores + libs + components
5. ~~Audio + Ads + IAP wiring + privacy + UDL integration~~ ✅ done v3
6. Device-to-device E2E with 2 EAS dev builds + real Expo push tokens + final sound asset ← **NEXT** (needs real devices)
7. Alpha on real devices both platforms
8. Store assets final (pro icon, screenshots, copy) + compliance review → TestFlight + Play internal

## Important Patterns / Preferences to Preserve
- Tiny, single-purpose product — **resist feature creep**; Yo research (research/yo-app.md) is reference for "does this serve fart notification?"
- Ads first, Remove Ads IAP second; single gated ad component
- Expo managed workflow + config plugins; app.json source of truth
- Server code stays Bun **and** Node-runnable
- One TS codebase for both stores; platform differences only where push/permissions/sound demand it
- Context-based messaging framing for App Review: "You understand by the context what is being said." — Or Arbel
