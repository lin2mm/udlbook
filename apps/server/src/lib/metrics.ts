/**
 * Simple metrics for iFarted relay — in-memory for MVP, use Prometheus in prod
 */

interface Metrics {
  totalUsers: number;
  totalFarts: number;
  totalInvites: number;
  fartsLastHour: number;
  activeUsersLastHour: number;
}

const metrics = {
  farts: [] as { timestamp: number; senderId: string; recipientId: string }[],
  users: new Set<string>(),
};

export function recordFart(senderId: string, recipientId: string) {
  metrics.farts.push({ timestamp: Date.now(), senderId, recipientId });
  metrics.users.add(senderId);
  metrics.users.add(recipientId);
  // Keep only last 24h
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  metrics.farts = metrics.farts.filter((f) => f.timestamp > cutoff);
}

export function getMetrics(): Metrics {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const lastHour = metrics.farts.filter((f) => f.timestamp > oneHourAgo);
  const activeUsers = new Set([...lastHour.map((f) => f.senderId), ...lastHour.map((f) => f.recipientId)]);

  return {
    totalUsers: metrics.users.size,
    totalFarts: metrics.farts.length,
    totalInvites: 0, // TODO: track invites
    fartsLastHour: lastHour.length,
    activeUsersLastHour: activeUsers.size,
  };
}

// Cleanup every hour
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  metrics.farts = metrics.farts.filter((f) => f.timestamp > cutoff);
}, 60 * 60 * 1000);
