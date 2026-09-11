import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getDb, initDb } from "./db/index.ts";
import { generateApiKey, hashApiKey, generateId, generateInviteCode } from "./lib/crypto.ts";
import { rateLimitFart } from "./lib/rate-limit.ts";
import { sendExpoPush, buildFartPushMessage } from "./lib/expo-push.ts";
import { recordFart, getMetrics } from "./lib/metrics.ts";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// Health
app.get("/", (c) => c.json({ ok: true, service: "ifarted-relay", version: "0.1.0" }));
app.get("/health", (c) => c.json({ ok: true }));
app.get("/metrics", (c) => c.json(getMetrics()));
app.get("/v1/stats", (c) => c.json({ ...getMetrics(), uptime: process.uptime(), memory: process.memoryUsage() }));

// Simple auth middleware — extracts Bearer apiKey and resolves user
async function auth(c: any, next: any) {
  const header = c.req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "missing Bearer token" }, 401);
  }
  const apiKey = header.slice(7);
  const hash = await hashApiKey(apiKey);
  const db = await getDb();

  // Try bun:sqlite style (query) and better-sqlite3 style (prepare)
  let user: any = null;
  try {
    if (db.query) {
      user = db.query("SELECT * FROM users WHERE api_key_hash = ?").get(hash);
    } else {
      user = db.prepare("SELECT * FROM users WHERE api_key_hash = ?").get(hash);
    }
  } catch (e) {
    console.error("[auth] db error", e);
  }

  if (!user) return c.json({ error: "invalid api key" }, 401);
  c.set("user", user);
  c.set("apiKey", apiKey);
  await next();
}

// POST /v1/register — create user
app.post("/v1/register", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { username, phoneE164, inviteCode, displayName } = body;

  if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return c.json({ error: "invalid username, 3-20 alnum/_" }, 400);
  }

  const db = await getDb();
  const id = generateId();
  const apiKey = generateApiKey();
  const apiKeyHash = await hashApiKey(apiKey);
  const code = generateInviteCode();
  const now = new Date().toISOString();

  // Check username unique
  if (username) {
    let existing: any = null;
    try {
      if (db.query) existing = db.query("SELECT id FROM users WHERE username = ? COLLATE NOCASE").get(username);
      else existing = db.prepare("SELECT id FROM users WHERE username = ? COLLATE NOCASE").get(username);
    } catch {}
    if (existing) return c.json({ error: "username taken" }, 409);
  }

  try {
    if (db.query) {
      db.query(
        "INSERT INTO users (id, username, display_name, phone_e164, phone_discovery, invite_code, api_key_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(id, username || null, displayName || username || null, phoneE164 || null, 0, code, apiKeyHash, now, now);
    } else {
      db.prepare(
        "INSERT INTO users (id, username, display_name, phone_e164, phone_discovery, invite_code, api_key_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(id, username || null, displayName || username || null, phoneE164 || null, 0, code, apiKeyHash, now, now);
    }
  } catch (e: any) {
    console.error("[register] insert error", e);
    return c.json({ error: "db insert failed" }, 500);
  }

  // If inviteCode provided, create relationship both ways (pending)
  if (inviteCode) {
    try {
      let inviter: any = null;
      if (db.query) inviter = db.query("SELECT creator_id FROM invites WHERE code = ?").get(inviteCode) || db.query("SELECT id as creator_id FROM users WHERE invite_code = ?").get(inviteCode);
      else inviter = db.prepare("SELECT creator_id FROM invites WHERE code = ?").get(inviteCode) || db.prepare("SELECT id as creator_id FROM users WHERE invite_code = ?").get(inviteCode);

      if (inviter?.creator_id) {
        const relId1 = generateId();
        const relId2 = generateId();
        const insertRel = db.query
          ? db.query("INSERT OR IGNORE INTO relationships (id, owner_id, peer_id, status, added_via, created_at) VALUES (?, ?, ?, ?, ?, ?)")
          : db.prepare("INSERT OR IGNORE INTO relationships (id, owner_id, peer_id, status, added_via, created_at) VALUES (?, ?, ?, ?, ?, ?)");

        insertRel.run(relId1, id, inviter.creator_id, "added", "invite", now);
        insertRel.run(relId2, inviter.creator_id, id, "added", "invite", now);

        // mark invite accepted
        if (db.query) db.query("UPDATE invites SET accepted_by_user_id = ? WHERE code = ?").run(id, inviteCode);
        else db.prepare("UPDATE invites SET accepted_by_user_id = ? WHERE code = ?").run(id, inviteCode);
      }
    } catch (e) {
      console.warn("[register] invite link failed", e);
    }
  }

  return c.json({
    userId: id,
    apiKey,
    user: {
      id,
      username: username || null,
      displayName: displayName || username || null,
      phoneE164: phoneE164 || null,
      phoneDiscovery: false,
      inviteCode: code,
      createdAt: now,
      updatedAt: now,
    },
  });
});

// POST /v1/tokens — register push token
app.post("/v1/tokens", auth, async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const { expoPushToken, platform } = body;

  if (!expoPushToken || !expoPushToken.startsWith("ExponentPushToken[")) {
    return c.json({ error: "invalid expoPushToken" }, 400);
  }

  const db = await getDb();
  const now = new Date().toISOString();
  const id = generateId();

  try {
    if (db.query) {
      db.query("INSERT OR REPLACE INTO push_tokens (id, user_id, expo_push_token, platform, last_seen_at) VALUES (?, ?, ?, ?, ?)").run(
        id,
        user.id,
        expoPushToken,
        platform || "ios",
        now
      );
    } else {
      db.prepare("INSERT OR REPLACE INTO push_tokens (id, user_id, expo_push_token, platform, last_seen_at) VALUES (?, ?, ?, ?, ?)").run(
        id,
        user.id,
        expoPushToken,
        platform || "ios",
        now
      );
    }
  } catch (e) {
    console.error("[tokens] insert", e);
    return c.json({ error: "db error" }, 500);
  }

  return c.json({ ok: true });
});

// POST /v1/farts — send fart
app.post("/v1/farts", auth, async (c) => {
  const sender = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const { recipientId, lat, lng } = body;

  if (!recipientId) return c.json({ error: "recipientId required" }, 400);

  // Rate limit
  const rl = rateLimitFart(sender.id, recipientId);
  if (!rl.allowed) {
    return c.json({ error: "rate limited", retryAfterMs: rl.retryAfterMs }, 429);
  }

  const db = await getDb();

  // Check recipient exists and not blocked
  let recipient: any = null;
  let blocked: any = null;
  let recipientTokens: any[] = [];
  try {
    if (db.query) {
      recipient = db.query("SELECT id, username, display_name FROM users WHERE id = ?").get(recipientId);
      blocked = db.query("SELECT id FROM relationships WHERE owner_id = ? AND peer_id = ? AND status = 'blocked'").get(recipientId, sender.id);
      recipientTokens = db.query("SELECT expo_push_token FROM push_tokens WHERE user_id = ?").all(recipientId) as any[];
    } else {
      recipient = db.prepare("SELECT id, username, display_name FROM users WHERE id = ?").get(recipientId);
      blocked = db.prepare("SELECT id FROM relationships WHERE owner_id = ? AND peer_id = ? AND status = 'blocked'").get(recipientId, sender.id);
      recipientTokens = db.prepare("SELECT expo_push_token FROM push_tokens WHERE user_id = ?").all(recipientId) as any[];
    }
  } catch (e) {
    console.error("[farts] db lookup", e);
  }

  if (!recipient) return c.json({ error: "recipient not found" }, 404);
  if (blocked) return c.json({ error: "blocked by recipient" }, 403);

  const messageId = generateId();
  const now = new Date().toISOString();

  // Persist message stub (for rate limiting / abuse)
  try {
    if (db.query) {
      db.query("INSERT INTO messages (id, sender_id, recipient_id, lat, lng, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        messageId,
        sender.id,
        recipientId,
        lat || null,
        lng || null,
        now
      );
    } else {
      db.prepare("INSERT INTO messages (id, sender_id, recipient_id, lat, lng, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        messageId,
        sender.id,
        recipientId,
        lat || null,
        lng || null,
        now
      );
    }
  } catch (e) {
    console.warn("[farts] message insert failed", e);
  }

  // Record metrics
  recordFart(sender.id, recipientId);

  // Build push messages
  const pushes = recipientTokens.map((t: any) =>
    buildFartPushMessage({
      to: t.expo_push_token,
      senderName: sender.display_name || sender.username || "Someone",
      messageId,
      senderId: sender.id,
      lat,
      lng,
    })
  );

  if (pushes.length === 0) {
    // No push token — still consider delivered (user may not have opened app yet)
    console.log(`[farts] no push tokens for ${recipientId}, message ${messageId} queued`);
    return c.json({ ok: true, messageId, warning: "recipient has no push token" });
  }

  // Send via Expo Push API
  try {
    const receipts = await sendExpoPush(pushes);
    console.log(`[farts] ${sender.id} -> ${recipientId} ${messageId} receipts`, receipts);
  } catch (e) {
    console.error("[farts] expo push error", e);
    // Don't fail the request — message is persisted
  }

  return c.json({ ok: true, messageId });
});

// GET /v1/users/search?username=
app.get("/v1/users/search", auth, async (c) => {
  const username = c.req.query("username");
  if (!username || username.length < 2) return c.json({ error: "username query >=2 chars" }, 400);

  const db = await getDb();
  let results: any[] = [];
  try {
    if (db.query) {
      results = db.query("SELECT id, username, display_name FROM users WHERE username LIKE ? COLLATE NOCASE LIMIT 20").all(`${username}%`) as any[];
    } else {
      results = db.prepare("SELECT id, username, display_name FROM users WHERE username LIKE ? COLLATE NOCASE LIMIT 20").all(`${username}%`) as any[];
    }
  } catch (e) {
    console.error("[search] db error", e);
  }

  // Return only public fields (never phone)
  return c.json(
    results.map((r: any) => ({
      id: r.id,
      username: r.username,
      displayName: r.display_name,
    }))
  );
});

// POST /v1/contacts — phone matching (privacy safe)
app.post("/v1/contacts", auth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { phoneE164 } = body;
  if (!Array.isArray(phoneE164)) return c.json({ error: "phoneE164 array required" }, 400);

  // In production, hash all input numbers and compare against hashed stored numbers
  // For MVP, we do direct lookup but only for users who enabled discovery
  const db = await getDb();
  let matches: any[] = [];
  try {
    if (phoneE164.length === 0) return c.json({ matches: [] });

    // Build placeholders
    const placeholders = phoneE164.map(() => "?").join(",");
    if (db.query) {
      matches = db
        .query(`SELECT id, username, display_name FROM users WHERE phone_e164 IN (${placeholders}) AND phone_discovery = 1 LIMIT 100`)
        .all(...phoneE164) as any[];
    } else {
      matches = db
        .prepare(`SELECT id, username, display_name FROM users WHERE phone_e164 IN (${placeholders}) AND phone_discovery = 1 LIMIT 100`)
        .all(...phoneE164) as any[];
    }
  } catch (e) {
    console.error("[contacts] db error", e);
  }

  return c.json({
    matches: matches.map((r: any) => ({ id: r.id, username: r.username, displayName: r.display_name })),
  });
});

// POST /v1/invites — create invite
app.post("/v1/invites", auth, async (c) => {
  const user = c.get("user");
  const db = await getDb();
  const code = generateInviteCode();
  const now = new Date().toISOString();
  try {
    if (db.query) {
      db.query("INSERT INTO invites (code, creator_id, created_at) VALUES (?, ?, ?)").run(code, user.id, now);
    } else {
      db.prepare("INSERT INTO invites (code, creator_id, created_at) VALUES (?, ?, ?)").run(code, user.id, now);
    }
  } catch (e) {
    console.error("[invites] insert", e);
    return c.json({ error: "db error" }, 500);
  }

  const deepLink = `ifarted://invite/${code}`;
  const inviteLink = `https://ifarted.app/invite/${code}`;

  return c.json({ code, deepLink, inviteLink });
});

// GET /v1/me — current user profile
app.get("/v1/me", auth, async (c) => {
  const user = c.get("user");
  return c.json({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    phoneE164: user.phone_e164,
    phoneDiscovery: !!user.phone_discovery,
    inviteCode: user.invite_code,
    createdAt: user.created_at,
  });
});

// GET /v1/friends — list of added friends with latest fart time (Yo-style home ordering)
app.get("/v1/friends", auth, async (c) => {
  const user = c.get("user");
  const db = await getDb();
  let friends: any[] = [];
  try {
    const sql = `
      SELECT u.id, u.username, u.display_name as displayName, r.added_via as addedVia, r.created_at as addedAt,
             (SELECT created_at FROM messages WHERE (sender_id = u.id AND recipient_id = ? ) OR (sender_id = ? AND recipient_id = u.id) ORDER BY created_at DESC LIMIT 1) as lastFartAt
      FROM relationships r
      JOIN users u ON u.id = r.peer_id
      WHERE r.owner_id = ? AND r.status = 'added'
      ORDER BY lastFartAt DESC NULLS LAST, r.created_at DESC
      LIMIT 100
    `;
    if (db.query) {
      friends = db.query(sql).all(user.id, user.id, user.id) as any[];
    } else {
      friends = db.prepare(sql).all(user.id, user.id, user.id) as any[];
    }
  } catch (e) {
    console.error("[friends] db error", e);
  }
  return c.json({ friends });
});

// POST /v1/friends — add friend by userId (username search flow)
app.post("/v1/friends", auth, async (c) => {
  const owner = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const { userId, via } = body;
  if (!userId) return c.json({ error: "userId required" }, 400);

  const db = await getDb();
  // Check peer exists
  let peer: any = null;
  try {
    if (db.query) peer = db.query("SELECT id FROM users WHERE id = ?").get(userId);
    else peer = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  } catch {}
  if (!peer) return c.json({ error: "peer not found" }, 404);
  if (peer.id === owner.id) return c.json({ error: "can't add yourself" }, 400);

  const id = generateId();
  const now = new Date().toISOString();
  const addedVia = via && ["username", "contacts", "invite"].includes(via) ? via : "username";

  try {
    if (db.query) {
      db.query("INSERT OR IGNORE INTO relationships (id, owner_id, peer_id, status, added_via, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        owner.id,
        userId,
        "added",
        addedVia,
        now
      );
    } else {
      db.prepare("INSERT OR IGNORE INTO relationships (id, owner_id, peer_id, status, added_via, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        owner.id,
        userId,
        "added",
        addedVia,
        now
      );
    }
  } catch (e) {
    console.error("[friends add] db error", e);
    return c.json({ error: "db error" }, 500);
  }

  return c.json({ ok: true });
});

// POST /v1/settings/phone-discovery — toggle phone discovery
app.post("/v1/settings/phone-discovery", auth, async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const { enabled } = body;
  if (typeof enabled !== "boolean") return c.json({ error: "enabled boolean required" }, 400);

  const db = await getDb();
  try {
    if (db.query) {
      db.query("UPDATE users SET phone_discovery = ?, updated_at = ? WHERE id = ?").run(enabled ? 1 : 0, new Date().toISOString(), user.id);
    } else {
      db.prepare("UPDATE users SET phone_discovery = ?, updated_at = ? WHERE id = ?").run(enabled ? 1 : 0, new Date().toISOString(), user.id);
    }
  } catch (e) {
    console.error("[phone-discovery] db error", e);
    return c.json({ error: "db error" }, 500);
  }
  return c.json({ ok: true, phoneDiscovery: enabled });
});

// POST /v1/block
app.post("/v1/block", auth, async (c) => {
  const owner = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const { userId } = body;
  if (!userId) return c.json({ error: "userId required" }, 400);

  const db = await getDb();
  const id = generateId();
  const now = new Date().toISOString();
  try {
    if (db.query) {
      db.query("INSERT OR REPLACE INTO relationships (id, owner_id, peer_id, status, added_via, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        owner.id,
        userId,
        "blocked",
        "username",
        now
      );
    } else {
      db.prepare("INSERT OR REPLACE INTO relationships (id, owner_id, peer_id, status, added_via, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        owner.id,
        userId,
        "blocked",
        "username",
        now
      );
    }
  } catch (e) {
    console.error("[block] db error", e);
    return c.json({ error: "db error" }, 500);
  }

  return c.json({ ok: true });
});

// POST /v1/unblock — remove block
app.post("/v1/unblock", auth, async (c) => {
  const owner = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const { userId } = body;
  if (!userId) return c.json({ error: "userId required" }, 400);

  const db = await getDb();
  try {
    if (db.query) {
      db.query("DELETE FROM relationships WHERE owner_id = ? AND peer_id = ? AND status = 'blocked'").run(owner.id, userId);
    } else {
      db.prepare("DELETE FROM relationships WHERE owner_id = ? AND peer_id = ? AND status = 'blocked'").run(owner.id, userId);
    }
  } catch (e) {
    console.error("[unblock] db error", e);
    return c.json({ error: "db error" }, 500);
  }
  return c.json({ ok: true });
});

// Start server
const port = Number(process.env.PORT || 3000);

await initDb();

console.log(`[ifarted] relay starting on :${port} (Bun=${typeof Bun !== "undefined"})`);

export default {
  port,
  fetch: app.fetch,
};

// For Node compatibility, also allow direct listen if run via tsx
if (typeof Bun === "undefined") {
  // @ts-ignore
  const { serve } = await import("@hono/node-server").catch(() => ({ serve: null }));
  if (serve) {
    serve({ fetch: app.fetch, port });
    console.log(`[ifarted] listening on http://localhost:${port} via @hono/node-server`);
  } else {
    console.log("[ifarted] @hono/node-server not installed, export fetch only");
  }
}
