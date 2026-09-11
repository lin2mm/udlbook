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

## Status
Design locked, zero code. Planning notes live in [`memory-bank/`](memory-bank/).

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
