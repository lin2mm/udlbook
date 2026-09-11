# Security — iFarted

## Yo Hack Lessons (June 2014)

- **What happened**: Isaiah Turner found anyone could retrieve any user's phone number and spam/spoof Yos via unauthenticated endpoints
- **Impact**: Phone numbers leaked, spam, spoofing

## Our Mitigations

### Auth

- Every endpoint (except `/v1/register`, `/health`, `/metrics`, `/`) requires `Authorization: Bearer <apiKey>`
- `apiKey` is 256-bit random (32 bytes hex), generated via `crypto.getRandomValues`, hashed SHA-256 at rest (`api_key_hash`)
- No JWT, no session — simple Bearer, unguessable
- No API keys/tokens in client source — issued per-install at register

### PII Protection

- `GET /v1/users/search` returns only `id`, `username`, `displayName` — never phone, never invite code, never api key hash
- `POST /v1/contacts` — phone numbers normalized + hashed server-side, only reveals matches to users who enabled `phone_discovery=1`, not stored raw (MVP does direct lookup but only discovery-enabled, prod should hash)
- Invite codes: random unguessable (A-Z, 2-9, no O/0/I/1, 8 chars, 32^8 combinations), not phone numbers, not sequential
- `GET /v1/me` returns own phone only, not others
- `GET /v1/friends` returns only friends you added, with public fields

### Rate Limiting (Anti-Spam)

- In-memory MVP: 30 farts/hour per sender, 20/hour per recipient per sender
- Persistent version `rate-limit-persistent.ts` uses SQLite `messages` table — survives restart, counts real messages in window
- Global per IP: 100 req/min (in-memory, TODO: use Redis)
- Block list: `POST /v1/block` → `relationships` status `blocked`, checked on send (recipient blocked sender)
- Unblock: `POST /v1/unblock`

### Push Security

- No P2P push — always backend → Expo Push Service → APNs/FCM
- Expo push tokens are only "FCM/APNs" secret-ish material on server — no server keys ship in app
- Server validates recipient exists and not blocked before push
- Expo Push API is public but requires valid ExpoPushToken — tokens are per-device, unguessable, registered via auth
- Custom sound file `fart.caf` <30s, bundled, not user-controlled (no injection)

### Location Privacy

- Per-message opt-in, explicit toggle
- Only to chosen recipient, not broadcast
- Not logged in analytics (MVP logs lat/lng in messages table for abuse only, prod should not log or should encrypt)
- iOS purpose string: "Attach your current location to a fart so your friend can see where you farted."
- Android runtime permission lazily only when toggle on

### Contacts Privacy

- Opt-in only, permission request with purpose
- `expo-contacts` → normalized E.164-like numbers, deduplicated
- Server: `POST /v1/contacts` body `{phoneE164: string[]}` → returns only matches who enabled discovery
- Numbers hashed server-side (SHA-256) in prod, not stored raw (MVP direct lookup but only discovery-enabled, TODO: hash)
- Privacy note in Settings + contacts screen + store privacy labels

### Invite Security

- Code: random unguessable, not phone, not username, not sequential
- Deep link: `ifarted://invite/<code>` + https `https://ifarted.app/invite/<code>`
- No PII in link
- Server: `invites` table `code PK, creator_id, created_at, accepted_by_user_id?`
- On register with `inviteCode`, creates mutual relationship both ways (owner→peer and peer→owner) with `added_via=invite`, marks invite accepted
- No open redirect, no phone in URL

### Database

- SQLite with WAL mode for concurrency
- `users.username` unique case-insensitive (`COLLATE NOCASE`)
- `relationships` unique(owner_id, peer_id)
- `push_tokens.expo_push_token` unique
- `invites.code` unique PK
- No raw SQL injection — using prepared statements (`query` for bun:sqlite, `prepare` for better-sqlite3)

### Admin

- `ADMIN_KEY` env var required for `/admin/*`
- Check via `x-admin-key` header or `?key=` query
- No admin UI without key, no default key
- Endpoints: `/admin` (counts + metrics + uptime + memory), `/admin/users` (id, username, display_name, phone_discovery, invite_code, created_at — no PII), `/admin/farts` (last 100 messages)

### CORS / Headers

- Hono `cors()` middleware — allow all for MVP, restrict to app domains in prod
- `logger()` middleware
- TODO: add `helmet` equivalent, HSTS, rate limit by IP, etc.

### Secrets

- `google-services.json` (Android FCM) — secret, injected at EAS build time via `eas secret:create`, never committed, `.gitignore`
- `GoogleService-Info.plist` (iOS) — same
- `*.jks`, `*.p8`, `*.p12`, `*.key`, `*.mobileprovision` — secrets, `.gitignore`
- `.env` — secrets, `.gitignore`
- `ifarted.db`, `*.db-shm`, `*.db-wal` — DB files, `.gitignore`

### Future Hardening

- [ ] Use `better-sqlite3` or `bun:sqlite` with strict mode, not string concatenation for IN clause (currently uses placeholders, safe)
- [ ] Hash phone numbers for contacts matching (SHA-256) instead of direct lookup
- [ ] Encrypt lat/lng at rest or don't store
- [ ] Add JWT with expiry for apiKey rotation
- [ ] Add 2FA for phone verification via SMS (optional)
- [ ] Add abuse monitoring + alerting (Sentry)
- [ ] Add Prometheus metrics + Grafana
- [ ] Add WAF / Cloudflare in front of API
- [ ] Add backup encryption for SQLite
- [ ] Add audit log for admin actions
