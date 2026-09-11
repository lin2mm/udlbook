# iFarted

> Send a friend exactly one thing: **"I farted."**

A dead-simple cross-platform mobile app: pick a person, optionally attach your
location, and send them a push notification that says exactly one thing —
**"I farted."** They can one-tap fart right back. No typing, no inbox, no feed.

Modeled on the 2014 **Yo!** app (context-based messaging) — with monetization in
from day one.

## What it is
- **iOS + Android** — React Native + Expo + TypeScript, one codebase
- The fixed message is *"I farted."* — meaning comes from context (who, when, where)
- Optional **location** attached per message → recipient sees a map pin
- Custom notification sound; notifications are ephemeral by design (no history)

## Find & add friends (all three ways)
- Unique *@username* + search
- Opt-in **phone contacts** matching
- **Invite code + deep link**

## Architecture
| Piece | Stack |
|---|---|
| `apps/mobile` | Expo (React Native + TypeScript) client |
| `apps/server` | Lightweight **Bun** relay → **Expo Push API** → APNs/FCM; SQLite storage (Node-runnable) |
| `packages/contracts` | Shared API types |

## Monetization
- Free tier with ads (AdMob)
- One-time **Remove Ads** IAP (non-consumable, restorable)

## Status (2026-09-11 — scaffold v3)
- **Scaffold v3 complete**: relay server live on :3000 (Bun 1.4.2, 11 endpoints, integration test passes), mobile MVP 7 screens + Zustand stores + notifications/contacts/ads/iap libs + gated AdBanner + FartButton + EmptyState, contracts shared types, sound assets generated (fart.wav/caf/mp3), icons generated, UDL website integration with iFarted demo section + web demo (tap-to-fart), CI workflow, deployment guide, store checklist, privacy manifest
- Planning notes live in [`memory-bank/`](memory-bank/).
- **Next**: device-to-device E2E with 2 EAS dev builds + real Expo push tokens + custom sound final asset + AdMob/IAP real IDs + store submission

### Quick Start

**UDL Website:**
```bash
npm install
npm run dev # Vite
npm run build # 133 modules, 309KB
```

**iFarted Server:**
```bash
cd apps/server
npm install -g bun # workaround for bun.sh TLS block
bun install
bun src/db/migrate.ts
bun src/index.ts # :3000
bun src/test.ts # integration test
```

**iFarted Mobile:**
```bash
cd apps/mobile
npm install
npx expo start # or --dev-client for dev build
eas build --profile development --platform all # push testing needs dev build
```

**Web Demo:** UDL site now has iFarted section at `#ifarted` with mock tap-to-fart + real API try + sound.

See `DEPLOYMENT.md` for full deploy, `apps/mobile/README.md` for mobile, `apps/server/README.md` for server, `apps/mobile/STORE_CHECKLIST.md` for store.

### Branding / Audio (closed in v3)
- Audio: generated placeholder fart.wav (brown noise + sine sweep down 200→40Hz, 1.2s, envelope) copied to .caf/.mp3 + android raw, <30s for iOS, TODO replace with pro sound
- Icons: generated placeholder icon.png/adaptive-icon.png/splash.png (minimalist black speech bubble 💨), TODO replace with pro
- Ads: AdMob wiring with real BannerAd + fallback placeholder, non-personalized, single gated component
- IAP: RevenueCat favored + expo-iap fallback, $1.99 suggestion, entitlement ad_free, product remove_ads
- Privacy: PrivacyInfo.xcprivacy, purpose strings in app.json, non-personalized ads no ATT

---

## Import Note (2026-09-11)

This repository originally is [lin2mm/udlbook](https://github.com/lin2mm/udlbook) — Understanding Deep Learning book website (Vite + React). The iFarted planning docs were imported from Google Drive folder `18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX` via embeddedfolderview workaround due to TLS blocks on drive.google.com in this sandbox.

Structure now:
- `src/` — UDL book website (original)
- `apps/mobile`, `apps/server`, `packages/contracts` — iFarted scaffold (new)
- `.clinerules/`, `memory-bank/` — Cline memory bank (imported)
- `README.md` — this file (iFarted)

To run UDL website: `npm install && npm run dev`
To scaffold iFarted: see memory-bank/*.md

## Original UDL Book Website

See `src/README.md` for UDL website instructions.

```shell
# Install dependencies
npm install

# Run the website in development mode
npm run dev

# Build the website
npm run build

# Preview the built website
npm run preview

# Format the code
npm run format

# Lint the code
npm run lint
```
