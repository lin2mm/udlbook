# Tech Context — iFarted

## Stack (decisions locked by user)
| Concern | Choice | Notes |
|---|---|---|
| Mobile framework | **React Native via Expo (managed workflow), TypeScript** | One codebase → iOS + Android |
| Build/sign/submit | **EAS Build** (cloud) | Linux box → iOS builds via EAS cloud (or a Mac) |
| Push (client) | `expo-notifications` | Acquires **ExpoPushToken**; needs `projectId` in app.json |
| Push (server) | **Bun** calling the **Expo Push API** (`exp.host/--/api/v2/push/send`) | **YES, Bun is possible** — Expo's push API is plain HTTPS+JSON; Bun's runtime handles it with built-in `fetch`. No Firebase Functions/Firestore. |
| Backend framework | Bun + **Hono** (or plain fetch handlers) | Runtime-agnostic TS so plain Node is a trivial fallback |
| Storage | **bun:sqlite** (SQLite) | Single file DB; zero external services |
| Location | `expo-location` | Permission-gated, per-message opt-in |
| Maps | `react-native-maps` / `expo-maps` | Pin sender location on recipient device |
| Ads | AdMob via `react-native-google-mobile-ads` (+ Expo config plugin) | Non-personalized ads first |
| IAP | `expo-iap` **or** RevenueCat `react-native-purchases` | RevenueCat favored (entitlements + restore); final TBD |
| Navigation | expo-router | File-based |

## Bun question — answer recorded 2026-09-09
**Yes, Bun is possible and adopted.** The Expo Push API is a plain HTTPS REST endpoint; Bun (a Node-compatible JS/TS runtime) can call it with built-in `fetch` and run the whole relay with zero native-module risk. Bun also ships `bun:sqlite` for storage and starts fast. **Caveats:** Bun is *not installed on this box yet* (install via `curl -fsSL https://bun.sh/install | bash` → `~/.bun/bin/bun`); keep the server code Node-runnable so falling back to `node` is trivial; avoid bun-only APIs except optional `bun:sqlite` (swap to `better-sqlite3` if we need Node-only). Node v22 is the fallback runtime.

## Development Environment (current box)
- OS: Linux. Node v22.22.1, npm 9.2.0, OpenJDK 25.0.4, Python 3.14.4, git 2.53.0. **Bun not yet installed.** No Flutter (not needed).
- Android SDK availability **TBD** — needed for local Android builds/emulator; EAS can cloud-build if absent.
- Workspace: `/opt/system/apps/VSCode-iFarted-app/VSCode.AppImage.home/iFarted` (only `.clinerules/`, `memory-bank/` so far).
- Arena import: `/home/user/udlbook` — now contains both UDL book website and iFarted scaffold.

## Accounts & Services Required (dev → release)
- Apple Developer Program ($99/yr): signing, APNs key, App Store.
- Google Play Console ($25 one-time): signing, Play Billing, releases.
- Expo account (free): EAS builds; push `projectId`.
- **Firebase project (free)** — needed for **Android FCM client credentials** (`google-services.json` + FCM sender id), even though the backend uses Expo's Push API (expo-notifications registers an Android FCM token with the app's Firebase project).
- Google AdMob (free, approval): ad units for iOS + Android.
- App Store Connect + Play Console IAP entries: `remove_ads` non-consumable.

## Push mechanics (specifics that bite later)
- Client: `expo-notifications` → `getExpoPushTokenAsync()` → `ExpoPushToken[...]`, send to `POST /v1/tokens`.
- Server: `POST https://exp.host/--/api/v2/push/send` with `{ to, title, body, sound, data }`; batch ≤100 tokens; optionally poll `push/getReceipts` for delivery status.
- Custom notification sound: iOS bundles a <30s audio file referenced in the payload `sound`; Android defines a notification channel with the sound. (Yo's signature was text **+ audio alert** — we mirror with a short fart sound.)
- Android FCM credentials (`google-services.json`) are a **secret** → injected at EAS build time, never committed.

## Technical Constraints & Gotchas
- **Cannot build/submit iOS from this Linux machine** → EAS Build cloud or a Mac is mandatory.
- Privacy/permissions: iOS `NSLocationWhenInUseUsageDescription` via app.json/plugin; Android location runtime permissions; push permission rationale; store privacy "nutrition labels".
- Remove Ads must be store-billed IAP; entitlement restorable across reinstall/device.
- Expo config plugins over ejecting; `app.json` is the source of truth.
- No API keys/PII in client source; phone numbers hashed for contact matching.

## Tooling Patterns / Conventions
- TypeScript strict; small feature folders; monorepo layout suggestion: `apps/mobile` (Expo) + `apps/server` (Bun) + shared `packages/contracts` (API types).
- `eas build` for internal + store builds; **development builds** for push testing (Expo Go has Android push limitations).
- Secrets via EAS env vars / `.env` (git-ignored).
- Test on real devices early — push, sound, maps, location are device-dependent.
