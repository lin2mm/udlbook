/**
 * Persistent rate limiting using SQLite — production ready vs in-memory MVP
 * Prevents Yo-style spam even after server restart
 */

import { getDb } from "../db/index.ts";

interface RateLimitConfig {
  max: number;
  windowMs: number;
}

const LIMITS = {
  sendPerHour: { max: 30, windowMs: 60 * 60 * 1000 },
  perRecipientPerHour: { max: 20, windowMs: 60 * 60 * 1000 },
};

export async function checkRateLimitPersistent(
  key: string,
  limit: RateLimitConfig
): Promise<{ allowed: boolean; retryAfterMs?: number; count?: number }> {
  const db = await getDb();
  const now = Date.now();
  const windowStart = new Date(now - limit.windowMs).toISOString();

  try {
    // Count messages in window
    let count = 0;
    if (db.query) {
      const row = db.query("SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND created_at > ?").get(key, windowStart) as any;
      count = row?.count || 0;
    } else {
      const row = db.prepare("SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND created_at > ?").get(key, windowStart) as any;
      count = row?.count || 0;
    }

    if (count >= limit.max) {
      // Find oldest in window to calculate retryAfter
      let oldest: any = null;
      if (db.query) {
        oldest = db.query("SELECT created_at FROM messages WHERE sender_id = ? AND created_at > ? ORDER BY created_at ASC LIMIT 1").get(key, windowStart) as any;
      } else {
        oldest = db.prepare("SELECT created_at FROM messages WHERE sender_id = ? AND created_at > ? ORDER BY created_at ASC LIMIT 1").get(key, windowStart) as any;
      }
      if (oldest) {
        const oldestTime = new Date(oldest.created_at).getTime();
        const retryAfterMs = oldestTime + limit.windowMs - now;
        return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs), count };
      }
      return { allowed: false, retryAfterMs: limit.windowMs, count };
    }

    return { allowed: true, count };
  } catch (e) {
    console.error("[rate-limit-persistent] db error", e);
    // Fail open for MVP, but log
    return { allowed: true, count: 0 };
  }
}

export async function checkRateLimitFartPersistent(senderId: string, recipientId: string) {
  // Check global per sender
  const globalCheck = await checkRateLimitPersistent(senderId, LIMITS.sendPerHour);
  if (!globalCheck.allowed) return globalCheck;

  // Check per recipient — need custom query for sender+recipient
  const db = await getDb();
  const now = Date.now();
  const windowStart = new Date(now - LIMITS.perRecipientPerHour.windowMs).toISOString();

  try {
    let count = 0;
    if (db.query) {
      const row = db.query("SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND recipient_id = ? AND created_at > ?").get(senderId, recipientId, windowStart) as any;
      count = row?.count || 0;
    } else {
      const row = db.prepare("SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND recipient_id = ? AND created_at > ?").get(senderId, recipientId, windowStart) as any;
      count = row?.count || 0;
    }

    if (count >= LIMITS.perRecipientPerHour.max) {
      let oldest: any = null;
      if (db.query) {
        oldest = db.query("SELECT created_at FROM messages WHERE sender_id = ? AND recipient_id = ? AND created_at > ? ORDER BY created_at ASC LIMIT 1").get(senderId, recipientId, windowStart) as any;
      } else {
        oldest = db.prepare("SELECT created_at FROM messages WHERE sender_id = ? AND recipient_id = ? AND created_at > ? ORDER BY created_at ASC LIMIT 1").get(senderId, recipientId, windowStart) as any;
      }
      if (oldest) {
        const oldestTime = new Date(oldest.created_at).getTime();
        const retryAfterMs = oldestTime + LIMITS.perRecipientPerHour.windowMs - now;
        return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs), count };
      }
      return { allowed: false, retryAfterMs: LIMITS.perRecipientPerHour.windowMs, count };
    }

    return { allowed: true, count };
  } catch (e) {
    console.error("[rate-limit-persistent] per-recipient db error", e);
    return { allowed: true, count: 0 };
  }
}
