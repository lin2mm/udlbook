# Active Context — iFarted

*Last updated: 2026-09-11 (session 4 arena) — scaffold v2 complete*

## Current State
- **Scaffold v2 complete — relay server live, mobile MVP screens done, integration test passes**
- **Stack (locked):** React Native + Expo + TypeScript + Bun + Hono + SQLite + Expo Push API
- **Workspace**: `.clinerules/`, `memory-bank/` (6 core + research), `apps/mobile` (7 screens), `apps/server` (11 endpoints), `packages/contracts`, `README.md`, `.gitignore` — plus original UDL book `src/` (Vite site still builds)
- **Decisions locked:**
 1. **Identity & discovery = all three:** unique @username + search · phone/contacts (opt-in) · invite code/deep link — implemented: search.tsx, contacts.tsx (hashed, discovery-only), invite.tsx (code+deep link+share)
 2. **Backend = lightweight Bun + Expo Push API** — **Bun 1.4.2 installed via npm** (bun.sh TLS blocked, workaround via `npm install -g bun`). Server runs on :3000, DB migrated, 11 endpoints, rate limiting, integration test passes.
 3. **Product design = Yo! pattern** — fixed phrase, notification text+audio, contact-list home with tap-to-send + one-tap fart back, ephemeral, context-based messaging framing.

## Recent Changes (this session - arena)
- 2026-09-09 (session 3): **Repo initialized & pushed.** Server repo `2re/iFarted` already existed (public/open, created 2026-09-09 13:03Z). Local: `git init -b main`, added `README.md` + `.gitignore`, committed everything, initial commit `8fec909`. Pushed via **SSH key** (`torrey@nommesen.com`).
- 2026-09-09 (session 2): Researched Yo! Created `memory-bank/research/yo-app.md`. Answered Bun feasibility (yes). Locked identity, backend, product model.
- 2026-09-11 (import): **Imported into udlbook arena** via Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX using embeddedfolderview ID extraction workaround (drive.google.com TLS blocked, fetch_page proxy used).
- 2026-09-11 (scaffold v1): Monorepo scaffold: contracts, server (Hono+Bun+SQLite), mobile (4 screens). Server tested.
- 2026-09-11 (scaffold v2 - now): Bun 1.4.2 via npm, server v2 with 11 endpoints (me, friends, add friend, phone-discovery toggle, unblock), mobile v2 with 7 screens + Zustand friends store + notifications lib (channel+token+listeners) + contacts lib + AdBanner gated + FartButton + EmptyState. Integration test `bun src/test.ts` passes. UDL site still builds. Relay server live on :3000 (process ifarted-relay-server-v2).

## Remaining Open Decisions (small, non-blocking)
1. **Audio asset:** the fart notification sound file (must be <30s for iOS; on-brand, not too loud/gross for reviewers).
2. **Remove Ads:** price point (~$1.99 suggestion) + library (expo-iap vs RevenueCat).
3. **Ad placement:** default = AdMob banner on home; decide whether an interstitial after send is worth the UX/review cost.
4. **Branding:** final store name (working: iFarted), icon, screenshots, store copy, in-app copy tone pass.
5. Server deployment target (cheap VPS/fly.io/Railway) + invite deep-link domain once branding is set.

## Next Steps
1. ~~Repo setup (git init, README, .gitignore, initial commit pushed to git.2re.top/2re/iFarted)~~ ✅ **done** (session 3).
2. ~~Scaffold monorepo: `apps/mobile` (Expo TS) + `apps/server` (Bun + Hono + SQLite) + `packages/contracts` (shared API types).~~ ✅ **done** (arena v1+v2)
3. ~~Install Bun on this box; stand up the relay server with the REST API from systemPatterns.~~ ✅ **done** — Bun 1.4.2 via npm, server live, 11 endpoints, test passes
4. ~~Implement client screens per productContext (onboarding incl. 3 add-friend paths, home list, fart detail + map, settings).~~ ✅ **done** — 7 screens + stores + libs
5. Prove device-to-device fart end-to-end (two dev-build devices, Expo Push API, custom sound). ← **NEXT** (needs real devices + EAS dev build + custom sound asset)
6. Wire ads + Remove Ads IAP + gating + restore. — placeholder done, needs real AdMob IDs + RevenueCat/expo-iap wiring
7. Permissions/privacy polish (purpose strings, privacy labels).
8. Alpha → store submissions (EAS + TestFlight/Play internal).

## Important Patterns / Preferences to Preserve
- Tiny, single-purpose product — **resist feature creep**; the Yo research (research/yo-app.md) is the reference for "does this serve the fart notification?".
- Ads first, Remove Ads IAP second; single gated ad component.
- Expo managed workflow + config plugins; `app.json` as source of truth.
- Server code stays Bun **and** Node-runnable.
- One TS codebase for both stores; platform differences only where push/permissions/sound demand it.
