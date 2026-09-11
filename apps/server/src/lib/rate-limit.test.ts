/**
 * Unit tests for rate limiting — in-memory version
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { checkRateLimit } from "./rate-limit.ts";

describe("rate-limit", () => {
  it("allows under limit", () => {
    const key = `test-${Date.now()}-1`;
    const limit = { max: 5, windowMs: 60 * 1000 };
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(key, limit);
      expect(res.allowed).toBe(true);
    }
  });

  it("blocks over limit", () => {
    const key = `test-${Date.now()}-2`;
    const limit = { max: 2, windowMs: 60 * 1000 };
    expect(checkRateLimit(key, limit).allowed).toBe(true);
    expect(checkRateLimit(key, limit).allowed).toBe(true);
    const blocked = checkRateLimit(key, limit);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
});
