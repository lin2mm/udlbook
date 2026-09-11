/**
 * Simple integration test for iFarted relay
 * Run: bun src/test.ts (server must be running on :3000 or set API_URL)
 */

const API_URL = process.env.API_URL || "http://localhost:3000";

async function api(path: string, opts: any = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`API ${path} ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }
  return json;
}

async function main() {
  console.log(`Testing against ${API_URL}`);

  // Register two users
  const user1 = await api("/v1/register", {
    method: "POST",
    body: JSON.stringify({ username: `test_${Date.now()}_1`, displayName: "Test One" }),
  });
  console.log("user1", user1.userId, user1.user.username);

  const user2 = await api("/v1/register", {
    method: "POST",
    body: JSON.stringify({ username: `test_${Date.now()}_2`, displayName: "Test Two" }),
  });
  console.log("user2", user2.userId, user2.user.username);

  // Search
  const search = await api(`/v1/users/search?username=${user2.user.username.slice(0, 4)}`, {
    headers: { Authorization: `Bearer ${user1.apiKey}` },
  });
  console.log("search", search);

  // Add friend
  await api("/v1/friends", {
    method: "POST",
    headers: { Authorization: `Bearer ${user1.apiKey}` },
    body: JSON.stringify({ userId: user2.userId, via: "username" }),
  });
  console.log("add friend ok");

  // Friends list
  const friends = await api("/v1/friends", {
    headers: { Authorization: `Bearer ${user1.apiKey}` },
  });
  console.log("friends", friends);

  // Register fake push token for user2
  await api("/v1/tokens", {
    method: "POST",
    headers: { Authorization: `Bearer ${user2.apiKey}` },
    body: JSON.stringify({ expoPushToken: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]", platform: "ios" }),
  });
  console.log("token registered");

  // Send fart
  const fart = await api("/v1/farts", {
    method: "POST",
    headers: { Authorization: `Bearer ${user1.apiKey}` },
    body: JSON.stringify({ recipientId: user2.userId, lat: 37.7749, lng: -122.4194 }),
  });
  console.log("fart sent", fart);

  // Create invite
  const invite = await api("/v1/invites", {
    method: "POST",
    headers: { Authorization: `Bearer ${user1.apiKey}` },
  });
  console.log("invite", invite);

  // Toggle phone discovery
  await api("/v1/settings/phone-discovery", {
    method: "POST",
    headers: { Authorization: `Bearer ${user1.apiKey}` },
    body: JSON.stringify({ enabled: true }),
  });
  console.log("phone discovery enabled");

  // Block
  await api("/v1/block", {
    method: "POST",
    headers: { Authorization: `Bearer ${user1.apiKey}` },
    body: JSON.stringify({ userId: user2.userId }),
  });
  console.log("block ok");

  // Unblock
  await api("/v1/unblock", {
    method: "POST",
    headers: { Authorization: `Bearer ${user1.apiKey}` },
    body: JSON.stringify({ userId: user2.userId }),
  });
  console.log("unblock ok");

  console.log("✅ All tests passed");
}

main().catch((e) => {
  console.error("❌ Test failed", e);
  process.exit(1);
});
