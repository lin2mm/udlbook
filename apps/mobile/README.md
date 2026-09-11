# iFarted Mobile — Expo + TypeScript

Dead-simple Yo-style app: **"I farted."** is the entire message. No typing, no inbox, notification IS message.

## Stack (locked)
- React Native via Expo managed workflow + TypeScript
- expo-router (file-based nav)
- expo-notifications (ExpoPushToken → server → Expo Push API → APNs/FCM)
- expo-location (per-message opt-in)
- react-native-maps (map pin)
- react-native-google-mobile-ads (AdMob banner, non-personalized)
- react-native-purchases / expo-iap (Remove Ads IAP, non-consumable)
- Zustand (state, no Redux)
- @ifarted/contracts (shared types)

## Quick Start

```bash
cd apps/mobile
npm install
npx expo start
# Then:
# - iOS: press i (needs Mac or EAS Build)
# - Android: press a (needs emulator or device)
# - Web: press w (limited push)
```

**Push testing requires development build, not Expo Go** (Expo Go has Android push limitations):

```bash
eas build --profile development --platform all
# Install dev build on device, then:
npx expo start --dev-client
```

## Screens (per productContext)

1. **Onboarding (<60s)**
   - Claim @username (unique, case-insensitive)
   - Optional phone → opt-in contacts matching
   - Invite code / deep link entry
   - Request notification permission with plain language

2. **Home** (`app/index.tsx`)
   - Recipient list ordered by most-recently active (Yo-style, from relationships + latest fart)
   - Big tap-to-fart action per person
   - Location toggle (per-message opt-in)
   - AdBanner (gated by isAdFree)
   - Empty state nudges 3 add-friend paths

3. **Search @username** (`app/search.tsx`)
   - Public lookup, no PII leak

4. **Contacts** (`app/contacts.tsx`)
   - Opt-in, hashed server-side, only discovery-enabled matches

5. **Invite** (`app/invite.tsx`)
   - Create code + deep link `ifarted://invite/<code>` + https link
   - Share via Share API
   - Redeem flow

6. **Fart Detail** (`app/fart-detail.tsx`)
   - Deadpan "X farted." + map pin if location attached
   - One-tap fart back
   - Context-based messaging note

7. **Settings** (`app/settings.tsx`)
   - Remove Ads IAP ($1.99 suggestion) + Restore
   - Notification sound toggle (future)
   - Phone discovery toggle (real API)
   - Invite creation
   - Privacy note
   - Sign out

## Push Mechanics

- Client: `expo-notifications` → `getExpoPushTokenAsync()` → `ExponentPushToken[...]`
- Server: `POST https://exp.host/--/api/v2/push/send` with `{to, title=senderName, body="I farted.", sound="fart.caf", data:{type:"fart", messageId, senderId, lat?, lng?, sentAt}}`
- Custom sound: iOS bundles <30s `fart.caf` referenced in payload, Android defines channel `farts` with `fart.mp3`
- Android FCM credentials: `google-services.json` secret, injected at EAS build time, never committed
- Notification handler: `shouldShowAlert=true, shouldPlaySound=true` — notification IS message

## Deep Links

- `ifarted://invite/<code>` — Expo linking
- `https://ifarted.app/invite/<code>` — web fallback, associated domains
- Notification taps → `fart-detail` with params

## Ads + IAP

- **Free**: AdMob banner on home (non-personalized first, no ATT)
- **Paid**: one-time non-consumable `remove_ads` — StoreKit / Play Billing
- Single gated `<AdBanner />` routed through `isAdFree` flag (Zustand)
- Entitlement source of truth = store state (RevenueCat favored for cross-platform restore)
- AdMob App IDs in `app.json` (replace placeholder `ca-app-pub-...`)

## Permissions / Privacy

- iOS `NSLocationWhenInUseUsageDescription` via app.json
- Android `ACCESS_FINE_LOCATION`, `READ_CONTACTS`
- Push permission rationale plain language
- Store privacy nutrition labels: location per-message, contacts opt-in, no history
- No message history/inbox/feed — ephemeral by design

## Config

`app.json` is source of truth:
- `scheme: ifarted`
- `ios.bundleIdentifier: com.ifarted.app`
- `android.package: com.ifarted.app`
- `extra.eas.projectId` — Expo project ID for push
- `extra.apiUrl` — relay server URL (default `https://api.ifarted.app`, local `http://localhost:3000`)

Secrets via EAS env vars / `.env` (git-ignored):
- `IOS_GOOGLE_MAPS_API_KEY`
- `ANDROID_GOOGLE_MAPS_API_KEY`
- `google-services.json`

## Branding TODO (from activeContext)

- Audio asset: fart sound <30s, on-brand not too gross for review
- Remove Ads price/library: $1.99 suggestion, expo-iap vs RevenueCat
- Ad placement: banner default, interstitial after send? (UX/review cost)
- Final store name (working: iFarted), icon, screenshots, store copy, tone pass
- Server deployment target + invite deep-link domain once branding set

## EAS Build

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform all
eas build --profile preview --platform all
eas submit --platform ios
eas submit --platform android
```

iOS builds require Apple Developer Program ($99/yr), cannot build from Linux without EAS cloud.

## Testing on Real Devices Early

Push, sound, maps, location are device-dependent — test early.

## Context-Based Messaging (App Review explanation)

> "We like to call it context-based messaging. You understand by the context what is being said." — Or Arbel (Yo creator)

One phrase, meaning from context (who, when, where). Apple once rejected Yo for being "too simple" — have this explanation ready.

## Monetization (Yo died for lack of revenue)

Ads + IAP from day one. No business model killed Yo in 2016.
