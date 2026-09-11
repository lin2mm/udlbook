# Active Context — iFarted

*Last updated: 2026-09-09 (session 3) — imported 2026-09-11 into udlbook arena branch*

## Current State
- **Greenfield — zero app code**, but the project is now a **git repo with a live public remote** (see Recent Changes). Workspace: `.clinerules/`, `memory-bank/` (6 core files + `research/yo-app.md`), `README.md`, `.gitignore`.
- **Stack (locked):** React Native + Expo + TypeScript (accepted earlier).
- **This session's decisions (locked by user):**
 1. **Identity & discovery = all three:** unique @username + search · phone/contacts (opt-in) · invite code/deep link.
 2. **Backend = lightweight Bun + Expo Push API** (user asked "is Bun possible?" → **yes**, answered + recorded in techContext; Bun not yet installed on this box).
 3. **Product design = Yo! pattern** (user: "research how they handled it and do that") → see `memory-bank/research/yo-app.md`. Key adoptions: fixed phrase w/ zero typing, notification text+audio, contact-list home with tap-to-send + one-tap fart back, **ephemeral (no inbox/history)**, context-based messaging framing (also our App Review explanation), username addressing.

## Recent Changes (this session)
- 2026-09-09 (session 3): **Repo initialized & pushed.** Server repo `2re/iFarted` already existed (public/open, created 2026-09-09 13:03Z). Local: `git init -b main`, added `README.md` + `.gitignore`, committed everything, initial commit `8fec909`. Pushed via **SSH key** (`torrey@nommesen.com`, registered on instance) — no password needed. Remote `origin` = `https://git.2re.top/2re/iFarted.git` with repo-local `url."ssh://git@git.2re.top:22222/".insteadOf https://git.2re.top/` so pushes transparently use SSH. Local `main` tracks `origin/main`.
- 2026-09-09 (session 2): Researched Yo! (Wikipedia + CNET via Wayback). Created `memory-bank/research/yo-app.md`. Answered the Bun feasibility question (yes). Locked identity (all 3), backend (Bun + Expo Push API), product model (Yo-style) and rewrote the memory-bank core files to match.
- 2026-09-11: **Imported into udlbook arena branch** via Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX. Files extracted using embeddedfolderview workaround due to network blocks on drive.google.com TLS.

## Remaining Open Decisions (small, non-blocking)
1. **Audio asset:** the fart notification sound file (must be <30s for iOS; on-brand, not too loud/gross for reviewers).
2. **Remove Ads:** price point (~$1.99 suggestion) + library (expo-iap vs RevenueCat).
3. **Ad placement:** default = AdMob banner on home; decide whether an interstitial after send is worth the UX/review cost.
4. **Branding:** final store name (working: iFarted), icon, screenshots, store copy, in-app copy tone pass.
5. Server deployment target (cheap VPS/fly.io/Railway) + invite deep-link domain once branding is set.

## Next Steps
1. ~~Repo setup (git init, README, .gitignore, initial commit pushed to git.2re.top/2re/iFarted)~~ ✅ **done** (session 3).
2. Scaffold monorepo: `apps/mobile` (Expo TS) + `apps/server` (Bun + Hono + SQLite) + `packages/contracts` (shared API types).
3. Install Bun on this box; stand up the relay server with the REST API from systemPatterns.
4. Prove device-to-device fart end-to-end (two dev-build devices, Expo Push API, custom sound).
5. Implement client screens per productContext (onboarding incl. 3 add-friend paths, home, fart detail + map, settings).
6. Wire ads + Remove Ads IAP + gating + restore.
7. Permissions/privacy polish (purpose strings, privacy labels).
8. Alpha → store submissions (EAS + TestFlight/Play internal).

## Important Patterns / Preferences to Preserve
- Tiny, single-purpose product — **resist feature creep**; the Yo research (research/yo-app.md) is the reference for "does this serve the fart notification?".
- Ads first, Remove Ads IAP second; single gated ad component.
- Expo managed workflow + config plugins; `app.json` as source of truth.
- Server code stays Bun **and** Node-runnable.
- One TS codebase for both stores; platform differences only where push/permissions/sound demand it.
