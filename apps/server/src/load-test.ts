/**
 * Load test for iFarted relay — simulates many users sending farts
 * Run: bun src/load-test.ts
 * Env: API_URL, CONCURRENT_USERS, FARTS_PER_USER
 */

const API_URL = process.env.API_URL || "http://localhost:3000";
const CONCURRENT_USERS = Number(process.env.CONCURRENT_USERS || 10);
const FARTS_PER_USER = Number(process.env.FARTS_PER_USER || 5);

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
    throw new Error(`API ${path} ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return json;
}

async function registerUser(username: string) {
  return api("/v1/register", {
    method: "POST",
    body: JSON.stringify({ username, displayName: username }),
  });
}

async function sendFart(apiKey: string, recipientId: string) {
  return api("/v1/farts", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ recipientId }),
  });
}

async function main() {
  console.log(`🔥 Load test against ${API_URL} — ${CONCURRENT_USERS} users, ${FARTS_PER_USER} farts each`);

  // Register users
  const users = [];
  const base = Date.now().toString().slice(-6);
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    const username = `lt${base}${i}`.slice(0, 20);
    const user = await registerUser(username);
    users.push(user);
    // Add friends to each other (first user is friends with all)
    if (i > 0) {
      await api("/v1/friends", {
        method: "POST",
        headers: { Authorization: `Bearer ${users[0].apiKey}` },
        body: JSON.stringify({ userId: user.userId, via: "username" }),
      });
      await api("/v1/friends", {
        method: "POST",
        headers: { Authorization: `Bearer ${user.apiKey}` },
        body: JSON.stringify({ userId: users[0].userId, via: "username" }),
      });
    }
  }
  console.log(`✅ Registered ${users.length} users, first user friends with all`);

  // Send farts concurrently
  const start = Date.now();
  let success = 0;
  let rateLimited = 0;
  let errors = 0;

  const promises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    for (let j = 0; j < FARTS_PER_USER; j++) {
      const sender = users[i];
      const recipient = users[(i + 1) % users.length];
      promises.push(
        sendFart(sender.apiKey, recipient.userId)
          .then(() => success++)
          .catch((e) => {
            if (e.message.includes("429") || e.message.includes("rate limited")) {
              rateLimited++;
            } else {
              errors++;
              console.warn(`Fart failed: ${e.message.slice(0, 100)}`);
            }
          })
      );
    }
  }

  await Promise.all(promises);
  const elapsed = (Date.now() - start) / 1000;

  console.log(`\n📊 Load test results:`);
  console.log(`   Total attempts: ${CONCURRENT_USERS * FARTS_PER_USER}`);
  console.log(`   Success: ${success}`);
  console.log(`   Rate limited: ${rateLimited} (expected if over 30/hour per sender)`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Elapsed: ${elapsed.toFixed(2)}s`);
  console.log(`   RPS: ${(success / elapsed).toFixed(2)}`);

  const metrics = await api("/metrics");
  console.log(`\n📈 Metrics after load:`, metrics);

  console.log(`\n✅ Load test complete`);
}

main().catch((e) => {
  console.error("❌ Load test failed", e);
  process.exit(1);
});
