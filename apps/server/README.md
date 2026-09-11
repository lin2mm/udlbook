# iFarted Relay Server

Lightweight **Bun** + **Hono** relay → **Expo Push API** → APNs/FCM. SQLite storage. Node-runnable.

## Why Bun?
- Expo Push API is plain HTTPS+JSON — Bun's built-in `fetch` handles it
- `bun:sqlite` is fast, zero external services
- Starts fast, low memory — cheap VPS friendly
- **Yes, Bun is possible** (locked decision, see techContext)

## Quick Start

```bash
# Install Bun (if network allows, else via npm)
npm install -g bun
# or curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Migrate DB
bun src/db/migrate.ts

# Dev (watch)
bun --watch src/index.ts

# Node fallback (no Bun)
npm install --save-dev tsx @hono/node-server
node --loader tsx src/index.ts
```

Server runs on `:3000`.

## API

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/` | GET | no | health |
| `/health` | GET | no | health |
| `/v1/register` | POST | no | Create user `{username?, phoneE164?, inviteCode?, displayName?}` → `{userId, apiKey}` |
| `/v1/me` | GET | Bearer | Current user |
| `/v1/tokens` | POST | Bearer | Register Expo push token |
| `/v1/farts` | POST | Bearer | Send fart `{recipientId, lat?, lng?}` |
| `/v1/users/search?username=` | GET | Bearer | Public lookup (no PII) |
| `/v1/contacts` | POST | Bearer | Phone matching (only discovery-enabled users) |
| `/v1/invites` | POST | Bearer | Create invite code |
| `/v1/friends` | GET | Bearer | List friends (ordered by last fart) |
| `/v1/friends` | POST | Bearer | Add friend `{userId, via}` |
| `/v1/settings/phone-discovery` | POST | Bearer | Toggle `{enabled: bool}` |
| `/v1/block` | POST | Bearer | Block user |
| `/v1/unblock` | POST | Bearer | Unblock |

### Auth
Every endpoint (except register/health) requires `Authorization: Bearer <apiKey>`. apiKey is 256-bit random, SHA-256 hashed at rest.

### Rate Limits (anti Yo-spam)
- Per sender: 30/hour
- Per recipient per sender: 20/hour
- In-memory for MVP, use Redis in prod

### Push Flow
```
Client POST /v1/farts → server validates + rate limit + persist stub → build ExpoPushMessage {to, title=senderName, body="I farted.", sound="fart.caf", data={type:"fart", messageId, senderId, ...}} → POST https://exp.host/--/api/v2/push/send → Expo → APNs/FCM → recipient OS notification → tap → fart-detail + map + fart back
```

No inbox/history — notification IS message. `messages` table kept only for rate limiting/abuse.

## Data Model (SQLite)

- `users`: id, username (unique ci), display_name, phone_e164, phone_discovery bool, invite_code unique, api_key_hash, created_at, updated_at
- `push_tokens`: id, user_id, expo_push_token unique, platform, last_seen_at
- `relationships`: id, owner_id, peer_id, status (added/blocked/pending-invite), added_via, created_at, unique(owner_id, peer_id)
- `messages`: id, sender_id, recipient_id, lat?, lng?, created_at
- `invites`: code PK, creator_id, created_at, accepted_by_user_id?

## Security (Yo hack lessons)
- No unauthenticated PII
- Username search returns only id/username/displayName
- Contacts matching hashed/normalized, only discovery-enabled
- Invite codes unguessable (A-Z, 2-9, no O/0/I/1)
- No API keys in client source

## Deployment

Cheap VPS / Fly.io / Railway:

```bash
# Fly.io example
fly launch
fly secrets set PORT=3000
fly deploy

# Or Docker
docker build -t ifarted-server .
docker run -p 3000:3000 -v ./data:/app/data ifarted-server
```

For production, add:
- Persistent volume for `ifarted.db`
- Backup cron
- Monitoring for abuse
- `better-sqlite3` if you want Node-only (swap in db/index.ts)

## Testing

```bash
# Manual
curl -X POST http://localhost:3000/v1/register -H "Content-Type: application/json" -d '{"username":"alice"}'
# Use returned apiKey for other calls
```

## Bun vs Node
Server code keeps bun-specific APIs optional (`bun:sqlite` try/catch). Node fallback uses `better-sqlite3` if installed, else in-memory mock. So `node --loader tsx src/index.ts` works trivially.
