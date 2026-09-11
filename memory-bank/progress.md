# Progress — iFarted

## Current Status: Scaffold complete, relay server live, mobile MVP screens done — ready for device testing
- **Bun installed** (1.4.2 via npm, due to TLS block on bun.sh)
- Relay server running on :3000, all endpoints tested (register, tokens, farts, search, contacts, invites, friends, block/unblock, phone-discovery)
- Mobile MVP: onboarding, home (real friends list + pull-to-refresh + push handling), search @username, contacts opt-in matching, invite code + deep link + share, fart-detail with map + fart back, settings with phone-discovery toggle + Remove Ads IAP placeholder + invite creation + privacy note
- AdBanner gated component, FartButton, EmptyState components
- Contracts package with shared types
- Integration test `apps/server/src/test.ts` passes ✅

## What Works
- **Git repo live** at `https://git.2re.top/2re/iFarted` (public/open, owner `2re`). Initial commit `8fec909` (`README.md`, `.gitignore`, `.clinerules/`, full `memory-bank/`). Local `main` tracks `origin/main`; push over SSH key (`torrey@nommesen.com`), no password.
- **Imported into udlbook arena** `arena/01a08e52-udlbook` on 2026-09-11 via Google Drive workaround (embeddedfolderview IDs). All memory-bank files present.
- **Arena scaffold**: `apps/mobile` (Expo TS + expo-router + Zustand + notifications + location + maps), `apps/server` (Bun+Hono+SQLite, 11 endpoints, rate limiting, Expo Push relay), `packages/contracts` (shared types)
- **Server live** at http://localhost:3000 (Bun=true), DB migrated (ifarted.db 60K), tested device-to-device logic (without real Expo push tokens, but Expo Push API relay code ready)
- Full requirements + architecture captured in Memory Bank (6 core files + `research/yo-app.md`).

## Decisions Made (all user-confirmed)
- Target platforms: iOS + Android.
- Core action: send another user an individual push notification containing **"I farted."** (fixed phrase, zero typing); optional per-message location.
- **Identity & discovery: all three** — unique @username + search · phone/contacts (opt-in) · invite code/deep link.
- **Backend: Bun** (Node-compatible) **+ Expo Push API**; SQLite storage; no Firebase Functions/Firestore. (Bun feasibility confirmed — plain HTTPS/JSON; install still pending on dev box.)
- **Product design: Yo! (2014) pattern** — researched (Wikipedia + CNET); adopted context-based messaging, text+audio notification, contact-list home with tap-to-send + one-tap fart back, **ephemeral (no inbox/history)**. See `memory-bank/research/yo-app.md`.
- Monetization: ads (AdMob) + **one-time non-consumable Remove Ads IAP**.
- Mobile stack: React Native + Expo + TypeScript; EAS Build for iOS from this Linux box.

## What's Left to Build (MVP roadmap)
1. ~~Repo setup: git init, README, `.gitignore`, commit memory-bank~~ ✅ **done** — initial commit pushed to `git.2re.top/2re/iFarted` (session 3).
2. ~~Scaffold monorepo: `apps/mobile` (Expo TS), `apps/server` (Bun + Hono + bun:sqlite), `packages/contracts` (shared types).~~ ✅ **done** in arena (2026-09-11)
3. ~~Install Bun; implement relay server per systemPatterns REST API (register/tokens/farts/search/contacts/invites/block + rate limiting).~~ ✅ **done** — Bun 1.4.2 via npm, 11 endpoints, rate limiting, integration test passes
4. ~~Client screens per productContext (onboarding incl. 3 add-friend paths, home list, fart detail + map, settings).~~ ✅ **done** — 7 screens, Zustand stores, AdBanner gated, FartButton, EmptyState, contacts lib, notifications lib
5. Device-to-device fart end-to-end: two dev builds, Expo Push API, custom sound, location payload. ← **NEXT** (needs real devices + EAS dev build + custom sound asset)
6. Ads (AdMob banner) + Remove Ads IAP + gating + restore. — placeholder done, needs real AdMob IDs + RevenueCat/expo-iap wiring
7. Permissions/privacy polish (purpose strings, privacy labels). — purpose strings in app.json done, needs privacy manifest + store labels
8. Alpha on real devices (both platforms).
9. Store assets + compliance review → TestFlight + Play internal testing.

## Remaining Minor Open Items
Audio asset · Remove Ads price/lib · ad placement confirmation · final branding · deploy target (see activeContext.md).

## Known Issues / Risks
- **iOS review:** Yo was initially rejected for being "too simple" → have the context-based messaging explanation ready; keep copy clean.
- **Harassment/spam:** Yo was hacked + spammed in 2014 → strict auth, no unauthenticated PII, rate limits + block (baked into API design).
- **No business model killed Yo** → monetization is in from day one (ads + IAP).
- iOS builds can't run on this Linux box → EAS cloud build (or a Mac) required.
- Android push requires a Firebase project for FCM client credentials even with Expo Push API (secret `google-services.json`, injected at build).

## Evolution Log
- **2026-09-09 (s3)** — Git repo initialized & pushed: `git init -b main`, `README.md` + `.gitignore` added, memory-bank + .clinerules committed (`8fec909`), remote `2re/iFarted` on git.2re.top (public) populated via SSH key. Memory-bank updated to match.
- **2026-09-09 (s1)** — Memory Bank initialized; requirements captured; stack recommendation (RN + Expo + TS) accepted.
- **2026-09-09 (s2)** — Yo! app researched (`memory-bank/research/yo-app.md`); Bun feasibility answered (yes); decisions locked: identity = all three mechanisms, backend = Bun + Expo Push API, product = Yo-style context-based messaging with ephemeral farts. Memory-bank core files updated.
- **2026-09-11 (import)** — Imported into lin2mm/udlbook arena branch via Drive workaround (embeddedfolderview IDs). Scaffold of monorepo started.
- **2026-09-11 (scaffold v1)** — Monorepo scaffold: contracts, server (Hono+Bun+SQLite), mobile (Expo TS + 4 screens). Server tested.
- **2026-09-11 (scaffold v2)** — Bun 1.4.2 installed via npm (bun.sh TLS blocked). Server enhanced with 11 endpoints (me, friends, add friend, phone-discovery toggle, unblock). Mobile enhanced: 7 screens (search, contacts, invite), Zustand friends store, notifications lib (channel + token + listeners), contacts lib, AdBanner gated, FartButton, EmptyState. Integration test passes. UDL website still builds.
