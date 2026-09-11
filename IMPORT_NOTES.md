# Import Notes — Google Drive Folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX

## Source
https://drive.google.com/drive/folders/18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX

Contains:
- `clinerules/` (1 file: memory-bank.md)
- `memory-bank/` (6 core files + research/)
- `README.md` (iFarted one-liner)

## Problem
Sandbox blocks direct TLS to `drive.google.com` and `drive.usercontent.google.com` (SSL_ERROR_SYSCALL / EOF). `curl` and Python `requests` fail. `gdown` fails with same SSL error.

`fetch_page` tool (external proxy) *does* work for drive.google.com, but returns markdown stripped of IDs. However, the **embeddedfolderview** endpoint returns HTML with file IDs in anchor hrefs.

## Workaround Used
1. `fetch_page https://drive.google.com/embeddedfolderview?id=18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX#list`
   → Extracted:
   - clinerules folder id `1RJAOdwND1mtKdOvE7uYUpv8gKg8ZlxXI`
   - memory-bank folder id `1PYjyKM3vJ3ZMxTMD5SOwJBIlVPWNNvb3`
   - README.md file id `1L_m_3a1sUoq1B5Kb_YKyn_rOwaYCx3ac`

2. For each folder, fetch its embeddedfolderview to get file IDs:
   - clinerules → `memory-bank.md` = `1gefZ2Zvl0tvMPWlbA2S8oMvMeYc5_8nr`
   - memory-bank → 6 files + research folder `1zhqkBDtIFS0a_D_6BdofaI3RTejJ3zsi`
     - activeContext `1EKcMRURdoUtE-UOXa0UaakcNlTNVM3sd`
     - productContext `1494xv56MgFUVammqnbVZGi-OXfeDQE50`
     - progress `1MlbF_9X3gfcP-w2NNHLg8za7ZRWikisI`
     - projectbrief `1VpjNxGJiUDt9v_y8fDzy1yLt0FNuQWj2`
     - systemPatterns `1yYNrFp8KcV_DTt3CdIO59hzgn4j5uPTS`
     - techContext `1TbR95irM_dtNtaYUqWYhE8L1KfrJ_tel`
   - research → `yo-app.md` = `1zb4x_YpwMHp50vILbDg7KJHbS2v3G0gh`

3. For each file id, `fetch_page https://drive.google.com/file/d/<id>/view?usp=drive_web`
   → This redirects to `drive.usercontent.google.com/download?id=<id>&export=download` and `fetch_page` returns the file content (markdown).

All files saved to:
- `.clinerules/memory-bank.md`
- `memory-bank/*.md`
- `memory-bank/research/yo-app.md`
- `README.md` (merged with UDL note)

## What Was Scaffolded After Import
Per `activeContext.md` Next Steps #2:
- `packages/contracts/` — shared API types (User, Push, Farts, etc.)
- `apps/server/` — Bun + Hono relay, SQLite (bun:sqlite + better-sqlite3 fallback), rate limiting, Expo Push API
  - Endpoints: register, tokens, farts, search, contacts, invites, block
  - Auth via Bearer apiKey (hashed SHA-256 at rest)
  - No PII in public search, phone discovery opt-in only
- `apps/mobile/` — Expo + TS + expo-router
  - app/_layout.tsx — notification handler
  - app/index.tsx — Home (recipient list, tap-to-fart, location toggle, AdBanner)
  - app/onboarding.tsx — @username claim + phone + invite code
  - app/fart-detail.tsx — map pin + fart back
  - app/settings.tsx — Remove Ads IAP placeholder, invite creation, privacy note
  - src/lib/api.ts — typed fetch wrapper
  - src/store/useAuth.ts — zustand auth + ad-free flag
  - src/components/AdBanner.tsx — gated single ad component

## Remaining TODO (from activeContext)
- Install Bun (`curl -fsSL https://bun.sh/install | bash`)
- `bun src/db/migrate.ts` to init SQLite
- Add real sound assets `fart.caf` (<30s) + `fart.mp3`
- Wire AdMob + RevenueCat/expo-iap
- EAS Build for dev builds (push testing needs dev build, not Expo Go)
- Device-to-device end-to-end test

## Verification
- All memory-bank files present and match Drive content
- Server is Node-runnable (tsx fallback) + Bun-native
- Mobile follows Yo pattern: fixed phrase, no inbox, notification IS message, one-tap fart back, context-based messaging
- Monetization from day one (AdBanner + Remove Ads IAP)

Date: 2026-09-11
Branch: ifarted
