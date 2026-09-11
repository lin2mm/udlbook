/**
 * Deep link handling — invite codes + notification taps
 * Scheme: ifarted://
 * Web: https://ifarted.app/invite/<code>
 */

import * as Linking from "expo-linking";
import { router } from "expo-router";

export const prefix = Linking.createURL("/");

export function parseInviteFromUrl(url: string): string | null {
  // ifarted://invite/<code>
  // https://ifarted.app/invite/<code>
  // exp://.../--/invite/<code>
  try {
    const parsed = Linking.parse(url);
    // parsed.path could be "invite/<code>" or "--/invite/<code>"
    const path = parsed.path || "";
    const match = path.match(/invite\/([A-Z0-9]{8})/);
    if (match) return match[1];

    // Also check query params
    if (parsed.queryParams?.code) {
      return parsed.queryParams.code as string;
    }

    // Check full URL for invite code pattern
    const fullMatch = url.match(/invite\/([A-Z0-9]{8})/);
    if (fullMatch) return fullMatch[1];
  } catch (e) {
    console.warn("[linking] parse failed", e);
  }
  return null;
}

export function setupLinkingListener(onInvite: (code: string) => void) {
  // Handle initial URL (app opened via link)
  Linking.getInitialURL().then((url) => {
    if (url) {
      const code = parseInviteFromUrl(url);
      if (code) {
        console.log("[linking] initial invite code", code);
        onInvite(code);
      }
    }
  });

  // Handle subsequent links (app already open)
  const subscription = Linking.addEventListener("url", ({ url }) => {
    const code = parseInviteFromUrl(url);
    if (code) {
      console.log("[linking] event invite code", code);
      onInvite(code);
    }
  });

  return () => subscription.remove();
}

export function navigateToFartDetail(params: { senderName: string; senderId: string; lat?: number; lng?: number; messageId: string }) {
  router.push({
    pathname: "/fart-detail",
    params: {
      senderName: params.senderName,
      senderId: params.senderId,
      lat: params.lat?.toString(),
      lng: params.lng?.toString(),
      messageId: params.messageId,
    },
  });
}
