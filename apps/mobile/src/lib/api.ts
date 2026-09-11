import Constants from "expo-constants";

const API_URL = (Constants.expoConfig?.extra as any)?.apiUrl || "http://localhost:3000";

type FetchOpts = {
  apiKey?: string;
  method?: string;
  body?: any;
};

async function apiFetch(path: string, opts: FetchOpts = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (opts.apiKey) headers["Authorization"] = `Bearer ${opts.apiKey}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} ${res.status}: ${text}`);
  }
  return res.json();
}

export const Api = {
  register: (body: { username?: string; phoneE164?: string; inviteCode?: string; displayName?: string }) =>
    apiFetch("/v1/register", { method: "POST", body }),

  me: (apiKey: string) => apiFetch("/v1/me", { apiKey }),

  registerToken: (apiKey: string, body: { expoPushToken: string; platform: "ios" | "android" }) =>
    apiFetch("/v1/tokens", { method: "POST", apiKey, body }),

  sendFart: (apiKey: string, body: { recipientId: string; lat?: number; lng?: number }) =>
    apiFetch("/v1/farts", { method: "POST", apiKey, body }),

  searchUsers: (apiKey: string, username: string) =>
    apiFetch(`/v1/users/search?username=${encodeURIComponent(username)}`, { apiKey }),

  contacts: (apiKey: string, phoneE164: string[]) =>
    apiFetch("/v1/contacts", { method: "POST", apiKey, body: { phoneE164 } }),

  createInvite: (apiKey: string) => apiFetch("/v1/invites", { method: "POST", apiKey }),

  block: (apiKey: string, userId: string) => apiFetch("/v1/block", { method: "POST", apiKey, body: { userId } }),

  unblock: (apiKey: string, userId: string) => apiFetch("/v1/unblock", { method: "POST", apiKey, body: { userId } }),

  friends: (apiKey: string) => apiFetch("/v1/friends", { apiKey }) as Promise<{ friends: any[] }>,

  addFriend: (apiKey: string, userId: string, via: "username" | "contacts" | "invite" = "username") =>
    apiFetch("/v1/friends", { method: "POST", apiKey, body: { userId, via } }),

  setPhoneDiscovery: (apiKey: string, enabled: boolean) =>
    apiFetch("/v1/settings/phone-discovery", { method: "POST", apiKey, body: { enabled } }),
};
