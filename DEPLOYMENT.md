# Deployment Guide — iFarted + UDL Book

## UDL Book Website (original)

```bash
npm install
npm run build
npm run deploy # gh-pages
```

Lives at https://udlbook.github.io/udlbook

## iFarted Relay Server (Bun + Hono + SQLite)

### Local

```bash
cd apps/server
npm install -g bun
bun install
bun src/db/migrate.ts
bun src/index.ts # :3000
# test
bun src/test.ts
```

### Docker

```bash
cd apps/server
docker build -t ifarted-server .
docker run -p 3000:3000 -v $(pwd)/data:/app/data ifarted-server
```

### Fly.io

```bash
cd apps/server
fly launch # create app ifarted-relay
fly volumes create ifarted_data --size 1 --region iad
fly secrets set PORT=3000
fly deploy
# Set custom domain
fly certs add api.ifarted.app
```

Update mobile `extra.apiUrl` to `https://api.ifarted.app`.

### Railway / Render

- Connect repo, set root `apps/server`
- Build: `bun install && bun src/db/migrate.ts`
- Start: `bun src/index.ts`
- Add volume for `ifarted.db`
- Env: `PORT=3000`

## iFarted Mobile (Expo)

### Prereqs

- Expo account (free)
- Apple Developer $99/yr, Google Play $25 one-time
- Firebase project for Android FCM (`google-services.json` secret)
- AdMob account for ad units
- RevenueCat account for IAP (or use expo-iap)

### Config

Edit `apps/mobile/app.json`:

- `expo.name`, `slug`, `scheme`
- `ios.bundleIdentifier`, `android.package`
- `extra.eas.projectId` — from `eas init`
- `extra.apiUrl` — `https://api.ifarted.app` prod, `http://localhost:3000` dev
- `ios.config.googleMobileAdsAppId`, `android.config.googleMobileAdsAppId` — replace placeholder
- `android.googleServicesFile` — `./google-services.json` (secret, inject via EAS)

### Secrets via EAS

```bash
cd apps/mobile
eas secret:create --scope project --name IOS_GOOGLE_MAPS_API_KEY --value ...
eas secret:create --scope project --name ANDROID_GOOGLE_MAPS_API_KEY --value ...
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --value "$(cat google-services.json | base64)"
```

### Dev Builds (required for push testing)

Expo Go has Android push limitations, so use dev builds:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform all
# Install on 2 physical devices
npx expo start --dev-client
```

### Preview / Production

```bash
eas build --profile preview --platform all # internal testing
eas build --profile production --platform all # store
eas submit --platform ios
eas submit --platform android
```

### Sound Assets

- iOS: `fart.caf` <30s, linear PCM or IMA4, bundled via `app.json` `expo-notifications.sounds`
- Android: `fart.mp3` in `android/app/src/main/res/raw/`, channel `farts`
- Current placeholder: generated via Python (brown noise + sine sweep down), copied as .caf/.mp3
- For prod, replace with professionally designed short fart sound — on-brand, not too loud/gross for review

### AdMob + IAP

- AdMob: create app + ad units (banner) for iOS + Android, replace IDs in `app.json` and `src/lib/ads.ts`
- IAP: create product `remove_ads` non-consumable $1.99 in App Store Connect + Play Console
- RevenueCat: create project, add iOS + Android apps, create entitlement `ad_free` linked to product `remove_ads`, add API keys to EAS secrets `EXPO_PUBLIC_RC_IOS_KEY`, `EXPO_PUBLIC_RC_ANDROID_KEY`
- Single gated `<AdBanner />` via `isAdFree` Zustand flag

### Permissions / Privacy

- iOS purpose strings already in app.json: `NSLocationWhenInUseUsageDescription`, `NSContactsUsageDescription`, `UIBackgroundModes: remote-notification`
- Android permissions: `ACCESS_FINE_LOCATION`, `READ_CONTACTS`
- Privacy manifest `PrivacyInfo.xcprivacy` — location, contacts, phone number all app functionality, no tracking
- Store privacy labels: explain per-message location opt-in, contacts opt-in hashed, no history
- Terms + Privacy Policy URL required for store listings

## Web Demo (UDL site integration)

New section `src/components/IFarted/` added to UDL book website (`src/pages/index.jsx`):

- Demo box with mock friends + tap-to-fart + log + sound playback
- Tries real API at `http://localhost:3000` if server running
- Link to mobile/server/memory-bank on GitHub
- Navbar + Sidebar updated with iFarted link

Build: `npm run build` still passes (133 modules, 309KB JS).

## CI

`.github/workflows/ifarted.yml`:

- Server: Bun install + migrate + integration test
- Mobile: typecheck
- UDL website: build

## Monitoring / Abuse

- Rate limits: 30/hour per sender, 20/hour per recipient per sender (in-memory MVP, use Redis in prod)
- Block list: `POST /v1/block`
- Logs: Hono logger, console for push receipts
- Future: add admin dashboard `GET /v1/admin/stats` (auth), Sentry, etc.

## Branding Open Decisions

- Final store name (working: iFarted) — check trademark
- Icon: generated placeholder `assets/icon.png` (minimalist black speech bubble 💨), replace with professional
- Screenshots: 6.5" and 5.5" iOS, Android phone
- Store copy: dry/wry tone, context-based messaging framing for App Review
- Deep link domain: `ifarted.app` once branding locked
