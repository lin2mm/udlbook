# System Patterns — iFarted

## Target Architecture (user decisions locked: Bun backend + Expo Push API)

```
[Sender phone — iOS/Android, Expo/RN]
 │ POST /v1/farts { recipientId, lat?, lng? } (Bearer apiKey)
 ▼
[Bun relay server] (TypeScript, Hono or plain fetch handlers, bun:sqlite)
 │ auth + rate limit → insert message → call Expo Push API:
 │ POST https://exp.host/--/api/v2/push/send
 │ { to: <ExpoPushToken>, title: senderName,
 │ body: "I farted.", sound: "fart.caf|mp3", data: {...} }
 ▼
[Expo Push Service] → [APNs / FCM]
 ▼
[Recipient phone] → OS notification → tap → in-app fart view (map pin if coords)
```

Guiding rules:
- **No P2P push; no raw APNs/FCM on the server.** Bun talks only to the Expo Push API; Expo's service handles APNs/FCM. (Android still needs a Firebase project for the *client's* FCM token.)
- Thin client, thin backend: client sends a tiny intent; backend validates, persists a stub, and relays; there is no inbox to serve.
- Server must run identically under Bun or Node (keep bun-specific APIs optional so Node is a trivial fallback).

## REST API (draft)
| Endpoint | Purpose |
|---|---|
| `POST /v1/register` | Create user. Body: `{ username?, phoneE164?, inviteCode? }` → returns `{ userId, apiKey }`. Username claim is unique/case-insensitive; inviteCode pre-links. |
| `POST /v1/tokens` | Register/refresh device push token `{ expoPushToken, platform }` (Bearer). |
| `POST /v1/farts` | Send. Body: `{ recipientId, lat?, lng? }`. Server: check relationship+block list → rate limit → persist → Expo Push. Returns `{ ok, messageId }`. |
| `GET /v1/users/search?username=` | Public lookup by username (returns only id/username/displayName — never phone). |
| `POST /v1/contacts` | Body: `{ phoneE164: string[] }` → returns which of *my contacts* are users who enabled phone discovery. Contact numbers hashed/normalized server-side; not stored raw. |
| `POST /v1/invites` | Create invite code for my username; client renders as code + deep link (exp:// / https link). |
| `POST /v1/block` | Body `{ userId }` → stop receiving/sending. |

## Mobile Client Patterns
- **Navigation:** expo-router; flows = auth/onboarding, home(recipients), fart-detail(maps), settings.
- **State:** React Context or Zustand. No Redux at MVP.
- **Home data:** recipient list = contacts + people who sent you a fart (latest first, Yo-style), not a server inbox.
- **Screens:** Onboarding (username/phone/invite) → Home (list + big send + location toggle + ad banner) → Send toast → Fart detail (+ map pin, one-tap **fart back**) → Settings (Remove Ads + Restore, sound toggle, phone-discovery toggle, account).
- **Permissions:** notifications at first run with purpose text; location lazily via `expo-location` only when "attach location" tapped (iOS When-In-Use).
- **Ads abstraction:** single gated `<AdBanner />` routed through one `isAdFree` flag.
- **Deep links:** invite links and notification taps both resolve into navigation (messageId or username pre-link).
- **Push payload (data):** `{ type:"fart", messageId, senderId, senderName, lat?, lng?, sentAt }` — notification body is "I farted.", title is sender name, custom sound file.

## Data Model (SQLite)
- `users`: id, username (unique ci), display_name?, phone_e164?, phone_discovery (bool), invite_code (unique), api_key_hash, created_at, updated_at.
- `push_tokens`: id, user_id, expo_push_token (unique), platform, last_seen_at.
- `relationships`: id, owner_id, peer_id, status (added/blocked/pending-invite), added_via (username|contacts|invite), created_at.
- `messages`: id, sender_id, recipient_id, lat?, lng?, created_at — retained only for rate limiting/abuse/receipts; **never rendered as history**.
- `invites`: code, creator_id, created_at, accepted_by_user_id?.

## Monetization Architecture
- Product: non-consumable **`remove_ads`** in App Store Connect + Play Console.
- Entitlement source of truth = store state (expo-iap or RevenueCat — library TBD; RevenueCat favored for cross-platform entitlement mgmt + restore).
- Launch + purchase + restore resolve `isAdFree` → ad components unmount and stop loading.
- AdMob: **non-personalized** ads initially → no ATT complexity.

## Security & Privacy (direct responses to the 2014 Yo hack)
- Every endpoint requires Bearer `apiKey` (random 256-bit, hashed at rest). No unauthenticated PII access.
- Username search returns only non-PII profile fields. Contacts matching uses **hash-normalized** numbers and only reveals matches to users who enabled discovery.
- Server-side rate limits per sender (e.g., N farts/hour) + per-recipient cap + block list → stops fart-spam/spoofing.
- Location: per-message opt-in, only to the chosen recipient; not logged in analytics.
- Expo push tokens are the only "FCM/APNs" secret-ish material on the server; no server keys ship in the app.
- No API keys/tokens in client source; issued per-install at register.
- Invite deep links carry a random unguessable code, not phone numbers.
