/**
 * WebSocket support for iFarted — real-time fart delivery status (optional, for web demo)
 * For MVP, push is via Expo Push API, but WebSocket can provide instant feedback in web client
 */

import { Hono } from "hono";

const wsApp = new Hono();

interface Client {
  userId: string;
  ws: any;
}

const clients = new Map<string, Set<Client>>();

export function addClient(userId: string, ws: any) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId)!.add({ userId, ws });
  console.log(`[ws] client added for ${userId}, total ${clients.get(userId)!.size}`);
}

export function removeClient(userId: string, ws: any) {
  const set = clients.get(userId);
  if (set) {
    for (const client of set) {
      if (client.ws === ws) {
        set.delete(client);
        console.log(`[ws] client removed for ${userId}, remaining ${set.size}`);
        break;
      }
    }
    if (set.size === 0) {
      clients.delete(userId);
    }
  }
}

export function notifyFart(recipientId: string, payload: any) {
  const set = clients.get(recipientId);
  if (set) {
    for (const client of set) {
      try {
        client.ws.send(JSON.stringify({ type: "fart", payload }));
      } catch (e) {
        console.warn(`[ws] send failed for ${recipientId}`, e);
      }
    }
  }
}

wsApp.get("/", (c) => {
  const userId = c.req.query("userId");
  if (!userId) {
    return c.json({ error: "userId query required" }, 400);
  }

  // For Bun, upgrade to WebSocket
  // @ts-ignore - Bun specific
  if (typeof Bun !== "undefined" && c.req.header("upgrade") === "websocket") {
    // @ts-ignore
    const { response, socket } = Bun.Transpiler ? { response: null, socket: null } : { response: null, socket: null };
    // Simplified: use Hono's websocket helper if available, otherwise fallback
    return c.json({ error: "WebSocket upgrade not implemented in this Hono version, use ws library" }, 501);
  }

  return c.json({ ok: true, message: "WebSocket endpoint — connect with userId query, then receive fart notifications in real-time (optional, for web demo)" });
});

export default wsApp;
