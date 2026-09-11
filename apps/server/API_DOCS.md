# API Docs — iFarted Relay Server

Base URL: `http://localhost:3000` dev, `https://api.ifarted.app` prod

## Auth

- `POST /v1/register` — no auth, creates user, returns `apiKey`
- All other `/v1/*` — `Authorization: Bearer <apiKey>` required
- `GET /`, `/health`, `/metrics`, `/v1/stats` — no auth
- `/admin/*`, `/admin.html` — `x-admin-key` header or `?key=` query, protected by `ADMIN_KEY` env var

## Endpoints

### Health & Metrics

- `GET /` → `{ok, service, version}`
- `GET /health` → `{ok}`
- `GET /metrics` → `{totalUsers, totalFarts, totalInvites, fartsLastHour, activeUsersLastHour}` (in-memory 24h)
- `GET /v1/stats` → metrics + `uptime`, `memory`
- `GET /admin?key=ADMIN_KEY` → `{db:{users,tokens,relationships,messages,invites}, metrics, uptime, memory}`
- `GET /admin/users?key=ADMIN_KEY` → `{users: [{id, username, display_name, phone_discovery, invite_code, created_at}]}` (last 100, no PII)
- `GET /admin/farts?key=ADMIN_KEY` → `{farts: [{id, sender_id, recipient_id, lat, lng, created_at}]}` (last 100)
- `GET /admin.html?key=ADMIN_KEY` — HTML dashboard (metrics cards + users table + farts table + raw JSON)

### Users

- `POST /v1/register`
  - Body: `{username?: string (3-20 alnum/_), phoneE164?: string, inviteCode?: string, displayName?: string}`
  - Username unique case-insensitive, 409 if taken
  - If `inviteCode` provided, creates mutual relationship both ways (owner→peer and peer→owner) with `added_via=invite`, marks invite accepted
  - Returns: `{userId, apiKey, user:{id, username, displayName, phoneE164, phoneDiscovery, inviteCode, createdAt, updatedAt}}`
  - apiKey 256-bit random hex 64 chars, hashed SHA-256 at rest

- `GET /v1/me` (Bearer)
  - Returns own profile: `{id, username, displayName, phoneE164, phoneDiscovery, inviteCode, createdAt}`

### Push Tokens

- `POST /v1/tokens` (Bearer)
  - Body: `{expoPushToken: "ExponentPushToken[...]", platform: "ios"|"android"}`
  - Validates prefix `ExponentPushToken[`
  - Returns: `{ok}`

### Farts (Core)

- `POST /v1/farts` (Bearer)
  - Body: `{recipientId: UserId, lat?: number, lng?: number}`
  - Rate limit: 30/hour per sender, 20/hour per recipient per sender (in-memory + persistent SQLite version available)
  - Checks recipient exists (404) and not blocked by recipient (403)
  - Persists stub in `messages` for rate limiting/abuse (id, sender_id, recipient_id, lat?, lng?, created_at)
  - Records metrics via `recordFart()`
  - Builds `ExpoPushMessage {to, title=sender.display_name||username, body="I farted.", sound="fart.caf", data:{type:"fart", messageId, senderId, senderName, lat?, lng?, sentAt}, channelId="farts"}`
  - Sends via `POST https://exp.host/--/api/v2/push/send` batch ≤100, logs receipts
  - If no push tokens, returns `{ok, messageId, warning: "recipient has no push token"}` (still considered delivered, user may not have opened app yet)
  - Returns: `{ok, messageId}`

### Friends & Discovery (All Three Mechanisms)

- `GET /v1/users/search?username=` (Bearer)
  - Query: `username` ≥2 chars, prefix search case-insensitive, limit 20
  - Returns only public: `[{id, username, displayName}]` — never phone, never invite code

- `POST /v1/contacts` (Bearer)
  - Body: `{phoneE164: string[]}` — normalized E.164 numbers
  - Returns only matches who enabled discovery: `{matches: [{id, username, displayName}]}` — privacy-safe, hashed server-side in prod, not stored raw

- `POST /v1/invites` (Bearer)
  - Creates invite code random unguessable (A-Z, 2-9, no O/0/I/1, 8 chars)
  - Returns: `{code, deepLink: "ifarted://invite/<code>", inviteLink: "https://ifarted.app/invite/<code>"}`

- `GET /v1/friends` (Bearer)
  - List of added friends with latest fart time for Yo-style home ordering: `{friends: [{id, username, displayName, addedVia, addedAt, lastFartAt}]}`
  - Ordered by lastFartAt DESC NULLS LAST, created_at DESC, limit 100

- `POST /v1/friends` (Bearer)
  - Body: `{userId, via?: "username"|"contacts"|"invite"}` — add friend by userId
  - Checks peer exists (404), can't add yourself (400)
  - Inserts OR IGNORE into relationships with status added
  - Returns: `{ok}`

### Settings & Block

- `POST /v1/settings/phone-discovery` (Bearer)
  - Body: `{enabled: boolean}` — toggle phone discovery
  - Updates `users.phone_discovery`, `updated_at`
  - Returns: `{ok, phoneDiscovery}`

- `POST /v1/block` (Bearer)
  - Body: `{userId}` — block user, stops receiving/sending
  - Inserts OR REPLACE into relationships status blocked
  - Returns: `{ok}`

- `POST /v1/unblock` (Bearer)
  - Body: `{userId}` — remove block
  - Deletes from relationships where status blocked
  - Returns: `{ok}`

## Data Model (SQLite)

```sql
users: id PK, username UNIQUE COLLATE NOCASE, display_name, phone_e164, phone_discovery BOOL, invite_code UNIQUE, api_key_hash, created_at, updated_at
push_tokens: id PK, user_id FK, expo_push_token UNIQUE, platform, last_seen_at
relationships: id PK, owner_id FK, peer_id FK, status (added/blocked/pending-invite), added_via (username/contacts/invite), created_at, UNIQUE(owner_id, peer_id)
messages: id PK, sender_id FK, recipient_id FK, lat REAL, lng REAL, created_at — retained only for rate limiting/abuse, never rendered as history
invites: code PK, creator_id FK, created_at, accepted_by_user_id FK?
```

## Rate Limiting

- In-memory MVP `rate-limit.ts`: Map buckets, 30/hour per sender, 20/hour per recipient per sender, cleanup every 5 min
- Persistent `rate-limit-persistent.ts`: SQLite counts messages in window, survives restart, calculates retryAfterMs from oldest in window
- Global per IP: 100 req/min (in-memory, TODO: Redis)

## Push Flow

```
[Sender phone — iOS/Android, Expo/RN]
 │ POST /v1/farts {recipientId, lat?, lng?} (Bearer apiKey)
 ▼
[Bun relay] (Hono, bun:sqlite, WAL)
 │ auth + rate limit → insert message → recordFart() → call Expo Push API:
 │ POST https://exp.host/--/api/v2/push/send
 │ {to, title=senderName, body="I farted.", sound="fart.caf", data:{type:"fart", messageId, senderId, senderName, lat?, lng?, sentAt}}
 ▼
[Expo Push Service] → [APNs / FCM]
 ▼
[Recipient phone] → OS notification (title=senderName, body="I farted.", sound=fart.caf) → tap → in-app fart view (map pin if coords) + one-tap fart back
```

No inbox/history — notification IS message. `messages` kept only for rate limiting/abuse.

## Security (Yo hack lessons)

- Every endpoint (except register/health/metrics/stats) requires Bearer apiKey, 256-bit random, SHA-256 hashed at rest
- Username search returns only non-PII
- Contacts matching hashed/normalized, only discovery-enabled
- Invite codes unguessable, not phone
- No API keys in client source
- Rate limits + block list → stops spam/spoofing
- No P2P push, no raw APNs/FCM on server
- Secrets via EAS env vars / .env git-ignored

## Testing

```bash
cd apps/server
bun install
bun src/db/migrate.ts
bun src/index.ts # :3000
# In another terminal:
bun src/test.ts # integration test
bun src/e2e-sim.ts # E2E simulation 2 users mutual friends 3 farts context
bun test # unit tests crypto + rate-limit
curl http://localhost:3000/health
curl http://localhost:3000/metrics
ADMIN_KEY=test123 bun src/index.ts &
curl http://localhost:3000/admin?key=test123
curl http://localhost:3000/admin.html?key=test123
```

## Deployment

See `DEPLOYMENT.md` for Docker/Fly.io/Railway/EAS + secrets + domain.

## Web Demo

- UDL site `src/components/IFarted/` — demo box with real API flow
- Standalone web client `apps/web/` — Vite React, port 5174, full flow register/search/add friend/fart/invite/metrics/log + sound
- Both try `http://localhost:3000` dev, `https://api.ifarted.app` prod via `VITE_IFARTED_API_URL`
