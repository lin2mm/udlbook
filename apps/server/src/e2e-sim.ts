/**
 * E2E Simulation: two users sending farts back and forth
 * Simulates Yo-style context-based messaging
 * Run: bun src/e2e-sim.ts
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

async function register(username: string) {
  const user = await api("/v1/register", {
    method: "POST",
    body: JSON.stringify({ username, displayName: username }),
  });
  console.log(`✅ Registered @${username} — id=${user.userId.slice(0, 8)}...`);
  return user;
}

async function addFriend(apiKey: string, peerId: string) {
  await api("/v1/friends", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ userId: peerId, via: "username" }),
  });
}

async function sendFart(apiKey: string, recipientId: string, senderName: string, lat?: number, lng?: number) {
  const fart = await api("/v1/farts", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ recipientId, lat, lng }),
  });
  console.log(`💨 ${senderName} farted → ${recipientId.slice(0, 8)}... — ${fart.messageId.slice(0, 8)}... ${fart.warning || ""}`);
  return fart;
}

async function main() {
  console.log(`🚀 iFarted E2E Simulation against ${API_URL}`);
  console.log(`Context-based messaging: "You understand by the context what is being said." — Or Arbel (Yo creator)\n`);

  // Register two users
  const alice = await register(`alice_${Date.now()}`);
  const bob = await register(`bob_${Date.now()}`);

  // Register fake push tokens (so push would work if real Expo tokens)
  await api("/v1/tokens", {
    method: "POST",
    headers: { Authorization: `Bearer ${alice.apiKey}` },
    body: JSON.stringify({ expoPushToken: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]", platform: "ios" }),
  });
  await api("/v1/tokens", {
    method: "POST",
    headers: { Authorization: `Bearer ${bob.apiKey}` },
    body: JSON.stringify({ expoPushToken: "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]", platform: "android" }),
  });
  console.log(`📱 Push tokens registered (fake, would be real ExpoPushToken in prod)\n`);

  // Add each other as friends
  await addFriend(alice.apiKey, bob.userId);
  await addFriend(bob.apiKey, alice.userId);
  console.log(`👥 @${alice.user.username} and @${bob.user.username} are now friends (mutual)\n`);

  // Simulate conversation: context-based messaging
  // One phrase, meaning from context (who, when, where)
  console.log(`💬 Simulating context-based conversation:`);
  console.log(`   One phrase: "I farted." — meaning from context (who, when, where)\n`);

  await sendFart(alice.apiKey, bob.userId, `@${alice.user.username}`, 37.7749, -122.4194);
  console.log(`   → Bob sees: "${alice.user.username} farted." with map pin at SF — taps to open, sees map, one-tap fart back\n`);
  await new Promise((r) => setTimeout(r, 500));

  await sendFart(bob.apiKey, alice.userId, `@${bob.user.username}`);
  console.log(`   → Alice sees: "${bob.user.username} farted." (no location) — deadpan "whoever farted" screen + fart back\n`);
  await new Promise((r) => setTimeout(r, 500));

  await sendFart(alice.apiKey, bob.userId, `@${alice.user.username}`, 40.7128, -74.006);
  console.log(`   → Bob sees: "${alice.user.username} farted." at NYC — context: "I'm in NYC now"\n`);
  await new Promise((r) => setTimeout(r, 500));

  // Metrics
  const metrics = await api("/metrics");
  console.log(`\n📊 Metrics:`, metrics);

  const friendsAlice = await api("/v1/friends", { headers: { Authorization: `Bearer ${alice.apiKey}` } });
  console.log(`\n👥 Alice's friends (ordered by last fart, Yo-style):`, friendsAlice.friends.map((f: any) => `@${f.username} lastFart=${f.lastFartAt}`));

  console.log(`\n✅ E2E Simulation complete — device-to-device logic works!`);
  console.log(`   For real device test: 2 EAS dev builds + real ExpoPushTokens + custom sound fart.caf (<30s) + location payload`);
  console.log(`   Then: notification title=senderName, body="I farted.", sound=fart.caf, data={type:"fart", messageId, senderId, lat?, lng?}`);
}

main().catch((e) => {
  console.error("❌ E2E failed", e);
  process.exit(1);
});
