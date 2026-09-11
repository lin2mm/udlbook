/**
 * Unit tests for crypto lib — run with bun test
 */

import { describe, it, expect } from "bun:test";
import { generateApiKey, hashApiKey, generateId, generateInviteCode, normalizePhoneE164 } from "./crypto.ts";

describe("crypto", () => {
  it("generateApiKey — 64 hex chars, 256-bit", () => {
    const key = generateApiKey();
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("hashApiKey — deterministic SHA-256", async () => {
    const key = "testkey123";
    const hash1 = await hashApiKey(key);
    const hash2 = await hashApiKey(key);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generateId — UUID v4", () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("generateInviteCode — 8 chars, no O/0/I/1, unguessable", () => {
    const code = generateInviteCode();
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/);
    // Ensure no confusing chars
    expect(code).not.toMatch(/[O0I1]/);
  });

  it("normalizePhoneE164 — keep + and digits", () => {
    expect(normalizePhoneE164("(415) 555-2671")).toBe("4155552671");
    expect(normalizePhoneE164("+1 (415) 555-2671")).toBe("+14155552671");
    expect(normalizePhoneE164("+44 20 7123 4567")).toBe("+442071234567");
  });
});
