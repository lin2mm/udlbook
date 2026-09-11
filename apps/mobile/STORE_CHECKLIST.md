# Store Checklist — iFarted

## Branding (open decisions)
- [ ] Final store name: working `iFarted` — check trademark, App Store search, domain
- [ ] Icon: simple, not too gross, recognizable at small size (1024x1024 iOS, 512x512 Android)
- [ ] Screenshots: 6.5" and 5.5" iOS, phone + tablet Android, show home list + fart detail + map + settings
- [ ] Store copy: tone dry/wry, never gross. Explain context-based messaging.
- [ ] Preview video (optional): 15-30s, show tap-to-fart + notification + map pin + fart back
- [ ] In-app copy tone pass: dry/wry, consistent

## Audio Asset (open)
- [ ] Fart sound: <30s for iOS, on-brand not too loud/gross for reviewers
- [ ] Files: `fart.caf` (iOS, linear PCM or IMA4) + `fart.mp3` (Android)
- [ ] Place in `assets/sounds/` + `android/app/src/main/res/raw/` + iOS bundle
- [ ] Reference in `app.json` expo-notifications.sounds + payload `sound: "fart.caf"`
- [ ] Test on real devices — sound must play when app in background/killed

## App Store Connect (iOS)
- [ ] Apple Developer Program $99/yr — enroll
- [ ] App ID: `com.ifarted.app` — create
- [ ] APNs key — generate, upload to Expo credentials
- [ ] EAS credentials: `eas credentials` — configure
- [ ] App Store Connect record — create app
- [ ] Privacy nutrition labels:
  - Location: per-message opt-in, only to chosen recipient, not logged in analytics
  - Contacts: opt-in only, hashed, only discovery-enabled matches
  - No history, no feed, no tracking (non-personalized ads first → no ATT)
- [ ] Purpose strings: `NSLocationWhenInUseUsageDescription`, `NSContactsUsageDescription` — already in app.json
- [ ] IAP: `remove_ads` non-consumable, $1.99 suggestion, description, review screenshot
- [ ] AdMob: iOS App ID + ad unit ID — replace placeholder in app.json
- [ ] Build: `eas build --profile production --platform ios` → submit via `eas submit`
- [ ] App Review explanation: context-based messaging quote, Yo! pattern, pure comedic utility, no spam (rate limits + block), user-initiated targeted push

## Google Play Console (Android)
- [ ] Play Console $25 one-time — enroll
- [ ] App: `com.ifarted.app` — create
- [ ] Firebase project (free) — create, enable FCM, download `google-services.json` (secret, inject via EAS env, never commit)
- [ ] EAS credentials: Android keystore
- [ ] Data safety form:
  - Location: per-message opt-in, only to chosen recipient
  - Contacts: opt-in, hashed
  - No history
- [ ] IAP: `remove_ads` non-consumable, $1.99, managed product
- [ ] AdMob: Android App ID + ad unit ID
- [ ] Build: `eas build --profile production --platform android` → `eas submit`
- [ ] Content rating, target audience, etc.

## Expo / EAS
- [ ] Expo account — create
- [ ] Project ID in `app.json` extra.eas.projectId — replace `00000000-...`
- [ ] `eas.json` — already has development/preview/production
- [ ] Secrets: `IOS_GOOGLE_MAPS_API_KEY`, `ANDROID_GOOGLE_MAPS_API_KEY`, `google-services.json` via `eas secret:create` or `EAS env vars`
- [ ] Development builds for push testing: `eas build --profile development --platform all` → install on 2 devices

## Server Deployment (open decision)
- [ ] Choose: cheap VPS (Hetzner $5/mo) / Fly.io / Railway
- [ ] Fly.io example: `fly launch`, `fly secrets set PORT=3000`, `fly deploy`, volume for `ifarted.db`
- [ ] Domain: `api.ifarted.app` + `ifarted.app/invite/*` deep link domain (once branding set)
- [ ] HTTPS + backup cron for SQLite
- [ ] Monitoring: rate limit abuse, block, error logs
- [ ] Update mobile `extra.apiUrl` from `http://localhost:3000` to `https://api.ifarted.app`

## Permissions / Privacy Polish
- [ ] iOS privacy manifest (`PrivacyInfo.xcprivacy`) — location, contacts usage
- [ ] Android runtime permissions: location lazily via `expo-location` only when toggle on, contacts only when scanning
- [ ] Push permission rationale: plain language before request
- [ ] Settings: phone-discovery toggle (done), notification sound toggle (future), account (username, sign out), privacy note

## Monetization (open)
- [ ] Ad placement: banner on home (default) — confirm no interstitial before sending (blocks joke, review risk)
- [ ] Remove Ads price: $1.99 suggestion — research competitors
- [ ] Library: expo-iap vs RevenueCat — RevenueCat favored (entitlements + restore)
- [ ] Single gated `<AdBanner />` via `isAdFree` flag — done
- [ ] Test IAP in sandbox / internal testing

## Testing
- [ ] Real devices early: push, sound, maps, location device-dependent
- [ ] Two dev-build devices, Expo Push API, custom sound, location payload — end-to-end
- [ ] Empty network kills app → first-run add-a-friend flow most important screen
- [ ] Harassment vector: rate limits + block list (server), recipient list explicit (only people you added)
- [ ] Yo hack lessons: auth on every endpoint, never leak PII, unguessable tokens

## Legal / Policy
- [ ] Terms + Privacy Policy URL — needed for store listings
- [ ] No P2P push — always backend → Expo Push → APNs/FCM
- [ ] Push user-initiated and targeted at known recipient (anti-spam + store policy)
- [ ] Remove Ads must be store-billed IAP — out-of-band payment is rejection grounds
- [ ] Context-based messaging framing for App Review (Apple rejected Yo for "too simple")

## Alpha → Store
- [ ] Alpha on real devices both platforms
- [ ] TestFlight internal + external
- [ ] Play internal testing track
- [ ] Store assets + compliance review
- [ ] Submit
