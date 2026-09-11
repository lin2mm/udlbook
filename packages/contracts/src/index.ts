/**
 * Shared API contracts for iFarted
 * Server: Bun + Hono, SQLite
 * Client: Expo + TS
 * No inbox/history — ephemeral notifications
 */

export type UserId = string;
export type ApiKey = string; // Bearer token, 256-bit random, hashed at rest
export type ExpoPushToken = `ExponentPushToken[${string}]`;

export interface User {
  id: UserId;
  username: string; // unique, case-insensitive
  displayName?: string;
  phoneE164?: string; // optional, hashed for matching
  phoneDiscovery: boolean;
  inviteCode: string; // unique, unguessable
  createdAt: string; // ISO
  updatedAt: string;
}

export interface PublicUser {
  id: UserId;
  username: string;
  displayName?: string;
}

// Auth
export interface RegisterRequest {
  username?: string;
  phoneE164?: string;
  inviteCode?: string; // if joining via invite
  displayName?: string;
}

export interface RegisterResponse {
  userId: UserId;
  apiKey: ApiKey;
  user: User;
}

// Push tokens
export interface TokenRegisterRequest {
  expoPushToken: ExpoPushToken;
  platform: "ios" | "android";
}

export interface TokenRegisterResponse {
  ok: true;
}

// Farts
export interface SendFartRequest {
  recipientId: UserId;
  lat?: number;
  lng?: number;
}

export interface SendFartResponse {
  ok: true;
  messageId: string;
}

export interface FartPayload {
  type: "fart";
  messageId: string;
  senderId: UserId;
  senderName: string;
  lat?: number;
  lng?: number;
  sentAt: string; // ISO
}

// Search
export interface SearchUsersQuery {
  username: string; // prefix search
}

export type SearchUsersResponse = PublicUser[];

// Contacts matching — privacy safe, hashed server-side
export interface ContactsRequest {
  phoneE164: string[]; // normalized E.164
}

export interface ContactsResponse {
  matches: PublicUser[]; // only users who enabled discovery
}

// Invites
export interface CreateInviteRequest {
  // no body, uses auth
}

export interface CreateInviteResponse {
  code: string;
  deepLink: string; // e.g. exp:// or https://ifarted.app/invite/<code>
  inviteLink: string;
}

// Block
export interface BlockRequest {
  userId: UserId;
}

export interface BlockResponse {
  ok: true;
}

// Rate limit / errors
export interface ApiError {
  error: string;
  code?: string;
  retryAfterMs?: number;
}

// Expo Push API relay (server → Expo)
export interface ExpoPushMessage {
  to: ExpoPushToken;
  title: string; // sender display name
  body: "I farted."; // fixed
  sound?: string; // e.g. "fart.caf" / "fart.mp3" / default
  data: FartPayload;
  // optional:
  badge?: number;
  channelId?: string; // Android
}

export interface ExpoPushReceipt {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: unknown;
}
