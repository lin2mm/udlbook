/**
 * Expo Push API relay — Bun calls Expo, Expo calls APNs/FCM
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */

import type { ExpoPushMessage, ExpoPushReceipt } from "@ifarted/contracts/src/index.ts";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const MAX_BATCH = 100;

export async function sendExpoPush(messages: ExpoPushMessage[]): Promise<ExpoPushReceipt[]> {
  if (messages.length === 0) return [];

  const receipts: ExpoPushReceipt[] = [];

  for (let i = 0; i < messages.length; i += MAX_BATCH) {
    const batch = messages.slice(i, i + MAX_BATCH);

    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[expo-push] failed", res.status, text);
      // Push partial errors as receipts
      for (let j = 0; j < batch.length; j++) {
        receipts.push({
          status: "error",
          message: `HTTP ${res.status}: ${text.slice(0, 200)}`,
        });
      }
      continue;
    }

    const json = (await res.json()) as { data: ExpoPushReceipt[] } | { errors: any[] };
    if ("data" in json && Array.isArray(json.data)) {
      receipts.push(...json.data);
    } else if ("errors" in json) {
      console.error("[expo-push] errors", json.errors);
      for (let j = 0; j < batch.length; j++) {
        receipts.push({ status: "error", message: JSON.stringify(json.errors).slice(0, 500) });
      }
    }
  }

  return receipts;
}

export function buildFartPushMessage(opts: {
  to: `ExponentPushToken[${string}]`;
  senderName: string;
  messageId: string;
  senderId: string;
  lat?: number;
  lng?: number;
}): ExpoPushMessage {
  const { to, senderName, messageId, senderId, lat, lng } = opts;
  return {
    to,
    title: senderName,
    body: "I farted.",
    sound: "fart.caf", // iOS <30s, Android channel sound
    data: {
      type: "fart",
      messageId,
      senderId,
      senderName,
      lat,
      lng,
      sentAt: new Date().toISOString(),
    },
    channelId: "farts", // Android notification channel
  };
}
