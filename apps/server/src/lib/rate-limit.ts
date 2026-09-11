/**
 * Simple in-memory rate limiter — production would use Redis or SQLite counters
 * Prevents Yo-style spam (2014 hack)
 */

type Key = string;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<Key, Bucket>();

const LIMITS = {
  // Per sender: 30 farts per hour
  sendPerHour: { max: 30, windowMs: 60 * 60 * 1000 },
  // Per recipient: max 20 farts per hour from same sender (anti-harassment)
  perRecipientPerHour: { max: 20, windowMs: 60 * 60 * 1000 },
  // Global: 100 requests per minute per IP
  globalPerMinute: { max: 100, windowMs: 60 * 1000 },
};

export function checkRateLimit(key: Key, limit: { max: number; windowMs: number }): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { allowed: true };
  }

  if (bucket.count < limit.max) {
    bucket.count++;
    return { allowed: true };
  }

  return { allowed: false, retryAfterMs: bucket.resetAt - now };
}

export function rateLimitFart(senderId: string, recipientId: string) {
  const globalKey = `send:${senderId}`;
  const perRecipientKey = `send:${senderId}:${recipientId}`;

  const globalCheck = checkRateLimit(globalKey, LIMITS.sendPerHour);
  if (!globalCheck.allowed) return globalCheck;

  const recipientCheck = checkRateLimit(perRecipientKey, LIMITS.perRecipientPerHour);
  return recipientCheck;
}

// Cleanup old buckets every 5 min
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now > v.resetAt) buckets.delete(k);
  }
}, 5 * 60 * 1000);
