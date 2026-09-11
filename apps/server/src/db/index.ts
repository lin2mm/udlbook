/**
 * SQLite wrapper that works with both Bun (bun:sqlite) and Node (better-sqlite3 fallback)
 * Requirement: server must be trivially runnable under plain Node too
 */

type BunSQLite = typeof import("bun:sqlite");

let db: any;

async function getBunDb() {
  try {
    // @ts-ignore - bun:sqlite only exists in Bun
    const { Database } = await import("bun:sqlite");
    const database = new Database("ifarted.db", { create: true });
    // Enable WAL for better concurrency
    database.exec("PRAGMA journal_mode = WAL;");
    return database;
  } catch {
    return null;
  }
}

async function getNodeDb() {
  try {
    const BetterSqlite3 = (await import("better-sqlite3")).default;
    const database = BetterSqlite3("ifarted.db");
    database.pragma("journal_mode = WAL");
    return database;
  } catch {
    return null;
  }
}

export async function getDb() {
  if (db) return db;

  db = await getBunDb();
  if (db) {
    console.log("[db] using bun:sqlite");
    return db;
  }

  db = await getNodeDb();
  if (db) {
    console.log("[db] using better-sqlite3 (Node fallback)");
    return db;
  }

  // In-memory fallback for environments without sqlite (e.g. tests)
  console.warn("[db] no sqlite driver found, using in-memory mock");
  const memory = new Map<string, any[]>();
  db = {
    exec: (sql: string) => {
      console.log("[mock db exec]", sql.slice(0, 100));
    },
    prepare: (sql: string) => ({
      run: (...args: any[]) => console.log("[mock run]", sql.slice(0, 80), args),
      get: (...args: any[]) => null,
      all: (...args: any[]) => [],
    }),
    query: (sql: string) => ({
      run: (...args: any[]) => console.log("[mock query run]", sql.slice(0, 80), args),
      get: (...args: any[]) => null,
      all: (...args: any[]) => [],
    }),
  };
  return db;
}

export async function initDb() {
  const database = await getDb();

  // Users
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE COLLATE NOCASE,
      display_name TEXT,
      phone_e164 TEXT,
      phone_discovery INTEGER DEFAULT 0,
      invite_code TEXT UNIQUE,
      api_key_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Push tokens
  database.exec(`
    CREATE TABLE IF NOT EXISTS push_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expo_push_token TEXT UNIQUE NOT NULL,
      platform TEXT NOT NULL,
      last_seen_at TEXT NOT NULL
    );
  `);

  // Relationships
  database.exec(`
    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      peer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL CHECK(status IN ('added','blocked','pending-invite')),
      added_via TEXT NOT NULL CHECK(added_via IN ('username','contacts','invite')),
      created_at TEXT NOT NULL,
      UNIQUE(owner_id, peer_id)
    );
  `);

  // Messages (ephemeral, kept only for rate limiting / abuse)
  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lat REAL,
      lng REAL,
      created_at TEXT NOT NULL
    );
  `);

  // Invites
  database.exec(`
    CREATE TABLE IF NOT EXISTS invites (
      code TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      accepted_by_user_id TEXT REFERENCES users(id)
    );
  `);

  console.log("[db] migrated");
}
