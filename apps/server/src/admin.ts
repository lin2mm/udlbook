/**
 * Simple admin dashboard for iFarted — metrics, users, farts, invites
 * Mount at /admin (protected by ADMIN_KEY env var)
 */

import { Hono } from "hono";
import { getDb } from "./db/index.ts";
import { getMetrics } from "./lib/metrics.ts";

const admin = new Hono();

function adminAuth(c: any, next: any) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return c.json({ error: "ADMIN_KEY not set" }, 500);
  }
  const key = c.req.header("x-admin-key") || c.req.query("key");
  if (key !== adminKey) {
    return c.json({ error: "unauthorized" }, 401);
  }
  return next();
}

admin.use("*", adminAuth);

admin.get("/", async (c) => {
  const db = await getDb();
  let users = 0,
    tokens = 0,
    relationships = 0,
    messages = 0,
    invites = 0;

  try {
    if (db.query) {
      users = (db.query("SELECT COUNT(*) as count FROM users").get() as any).count;
      tokens = (db.query("SELECT COUNT(*) as count FROM push_tokens").get() as any).count;
      relationships = (db.query("SELECT COUNT(*) as count FROM relationships").get() as any).count;
      messages = (db.query("SELECT COUNT(*) as count FROM messages").get() as any).count;
      invites = (db.query("SELECT COUNT(*) as count FROM invites").get() as any).count;
    } else {
      users = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;
      tokens = (db.prepare("SELECT COUNT(*) as count FROM push_tokens").get() as any).count;
      relationships = (db.prepare("SELECT COUNT(*) as count FROM relationships").get() as any).count;
      messages = (db.prepare("SELECT COUNT(*) as count FROM messages").get() as any).count;
      invites = (db.prepare("SELECT COUNT(*) as count FROM invites").get() as any).count;
    }
  } catch (e) {
    console.error("[admin] count error", e);
  }

  const metrics = getMetrics();

  return c.json({
    db: { users, tokens, relationships, messages, invites },
    metrics,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

admin.get("/users", async (c) => {
  const db = await getDb();
  let users: any[] = [];
  try {
    if (db.query) {
      users = db.query("SELECT id, username, display_name, phone_discovery, invite_code, created_at FROM users ORDER BY created_at DESC LIMIT 100").all() as any[];
    } else {
      users = db.prepare("SELECT id, username, display_name, phone_discovery, invite_code, created_at FROM users ORDER BY created_at DESC LIMIT 100").all() as any[];
    }
  } catch (e) {
    console.error("[admin] users error", e);
  }
  return c.json({ users });
});

admin.get("/farts", async (c) => {
  const db = await getDb();
  let farts: any[] = [];
  try {
    if (db.query) {
      farts = db.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 100").all() as any[];
    } else {
      farts = db.prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT 100").all() as any[];
    }
  } catch (e) {
    console.error("[admin] farts error", e);
  }
  return c.json({ farts });
});

export default admin;
