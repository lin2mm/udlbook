# Project Brief — iFarted

## Working Title
**iFarted** (matches the working directory). Branding style follows **Yo!** (single word = the product). Final store name/icon/copy still TBD.

## One-Liner
A dead-simple cross-platform mobile app that lets a user send another user an **individual push notification** containing exactly the phrase **"I farted."** — optionally with the sender's current **location** attached. Modeled on the 2014 **Yo!** app (see `memory-bank/research/yo-app.md`).

## Platform Targets
- iOS (iPhone) — Apple App Store
- Android — Google Play Store

## Product Model (Yo! pattern — "context-based messaging")
- The user **never types anything**. The single fixed message is "I farted."; meaning comes from context (who sent it, when, and where).
- Recipient gets a push notification (text + custom audio sound) — the notification *is* the message. **No inbox/history/feed** (Yo-style ephemeral).
- Home = recipient list; **tap a person → they get the fart**. Recipient can **one-tap fart back**.

## Core Requirements (MVP)
1. **Identity & discovery — ALL THREE mechanisms (user decision):**
 a. Claim a unique *@username*; find others via **username search** + add.
 b. Optional **phone number** on profile → **contacts matching** (opt-in only, privacy-safe matching server-side).
 c. **Invite code + deep link** — sender generates one, friend opens it and is pre-connected.
2. **Compose & send** — choose a recipient from your list, optionally toggle "attach my location," send the fixed phrase "I farted."
3. **Delivery** — push notification to recipient: **title = sender's display name, body = "I farted."**, custom fart audio sound (mirrors Yo's text+audio alert). With location attached, tapping opens the app and shows a map pin of the sender.
4. **Ads** — AdMob ads (default: banner on home; placement/frequency TBD).
5. **Remove Ads IAP** — one-time **non-consumable** purchase that permanently removes ads, billed through StoreKit / Google Play Billing.

## Backend (user decision)
- **Lightweight server written in Bun** (Node-compatible runtime; "yes, Bun is possible") relaying through the **Expo Push API** (no Firebase Functions/Firestore, no raw APNs/FCM management server-side).
- SQLite storage (Bun's `bun:sqlite`). Must be trivially runnable under plain Node too.

## Non-Goals (MVP)
- Message history/inbox/feed (ephemeral by design)
- Group broadcasts, scheduled/recurring farts, reactions
- Free-text chat or any content beyond the fixed phrase
- Web/desktop clients
- Accounts heavier than needed for reliable recipient targeting + push tokens

## Monetization Model
- **Free tier:** ads.
- **Paid tier:** one-time Remove Ads IAP (non-consumable, permanent entitlement, restorable).
- Yo died in 2016 for lack of revenue — monetization is in from day one.

## Business/Policy Constraints to Respect
- **No P2P push.** Delivery always routes backend → **Expo Push Service** → **APNs** (iOS) / **FCM** (Android).
- Push must be **user-initiated and targeted** at a known recipient (anti-spam + store policy).
- Location requires per-platform runtime permissions, iOS purpose strings, and store privacy disclosures.
- Android still needs a **Firebase project** solely for FCM client credentials (`google-services.json`) even though the backend uses the Expo Push API.
- iOS builds require macOS/Xcode or **EAS cloud build** + Apple Developer Program ($99/yr); Android requires Google Play Console ($25 one-time).
- Remove Ads must be a genuine store-billed IAP — out-of-band payment for ad removal is grounds for rejection.
- Yo was hacked (2014) exposing phone numbers + enabling Yo-spam → our API is auth'd end-to-end, PII-protected, and rate-limited (see systemPatterns).
