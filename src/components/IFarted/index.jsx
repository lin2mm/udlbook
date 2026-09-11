import { useState, useEffect } from "react";
import {
  IFartedContainer,
  IFartedWrapper,
  IFartedRow,
  Column1,
  Column2,
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  DemoBox,
  DemoTitle,
  FriendRow,
  FartButton,
  SmallText,
  Link,
} from "@/components/IFarted/IFartedElements";

const API_URL = import.meta.env.VITE_IFARTED_API_URL || "http://localhost:3000";

export default function IFartedSection() {
  const [friends, setFriends] = useState([
    { id: "1", username: "alex", displayName: "Alex", lastFart: "2m ago" },
    { id: "2", username: "sam", displayName: "Sam", lastFart: "1h ago" },
    { id: "3", username: "jordan", displayName: "Jordan", lastFart: "yesterday" },
  ]);
  const [realFriends, setRealFriends] = useState([]);
  const [sending, setSending] = useState(null);
  const [log, setLog] = useState([]);
  const [serverStatus, setServerStatus] = useState("checking");
  const [metrics, setMetrics] = useState(null);
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("ifarted_apiKey") || "");
  const [userId, setUserId] = useState(localStorage.getItem("ifarted_userId") || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then(() => {
        setServerStatus("online");
        fetch(`${API_URL}/metrics`)
          .then((r) => r.json())
          .then(setMetrics)
          .catch(() => {});
      })
      .catch(() => setServerStatus("offline (run bun src/index.ts)"));
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    fetch(`${API_URL}/v1/friends`, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then((r) => r.json())
      .then((data) => setRealFriends(data.friends || []))
      .catch(() => {});
  }, [apiKey]);

  const register = async () => {
    if (!username) return alert("Enter username");
    try {
      const res = await fetch(`${API_URL}/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName: username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApiKey(data.apiKey);
      setUserId(data.userId);
      localStorage.setItem("ifarted_apiKey", data.apiKey);
      localStorage.setItem("ifarted_userId", data.userId);
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] ✅ Registered @${data.user.username}`, ...prev].slice(0, 5));
    } catch (e) {
      alert(`Register failed: ${e.message}`);
    }
  };

  const search = async () => {
    if (!apiKey || !searchQuery) return;
    try {
      const res = await fetch(`${API_URL}/v1/users/search?username=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      alert(e.message);
    }
  };

  const addFriend = async (fid, via = "username") => {
    if (!apiKey) return alert("Register first");
    try {
      const res = await fetch(`${API_URL}/v1/friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ userId: fid, via }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] ✅ Added friend ${fid}`, ...prev].slice(0, 5));
      // Refresh friends
      const rf = await fetch(`${API_URL}/v1/friends`, { headers: { Authorization: `Bearer ${apiKey}` } }).then((r) => r.json());
      setRealFriends(rf.friends || []);
    } catch (e) {
      alert(e.message);
    }
  };

  const sendFart = async (friend) => {
    setSending(friend.id);
    const timestamp = new Date().toLocaleTimeString();
    setLog((prev) => [`[${timestamp}] 💨 Fart sent to @${friend.username} — "I farted."`, ...prev].slice(0, 5));

    // Try real API if server online and has apiKey
    if (apiKey) {
      try {
        const res = await fetch(`${API_URL}/v1/farts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ recipientId: friend.id, lat: 37.7749, lng: -122.4194 }),
        });
        const data = await res.json();
        if (res.ok) {
          setLog((prev) => [`[${timestamp}] ✅ Server: ${data.messageId} ${data.warning || ""}`, ...prev].slice(0, 5));
          // Refresh metrics
          fetch(`${API_URL}/metrics`).then((r) => r.json()).then(setMetrics).catch(() => {});
        } else {
          setLog((prev) => [`[${timestamp}] ❌ ${data.error}`, ...prev].slice(0, 5));
        }
      } catch (e) {
        setLog((prev) => [`[${timestamp}] (mock) Push would go via Expo Push API → APNs/FCM`, ...prev].slice(0, 5));
      }
    } else {
      setLog((prev) => [`[${timestamp}] (mock) Push would go via Expo Push API → APNs/FCM`, ...prev].slice(0, 5));
    }

    // Play sound if available
    try {
      const audio = new Audio("/fart.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    setTimeout(() => setSending(null), 800);
  };

  const displayFriends = realFriends.length > 0 ? realFriends : friends;

  return (
    <IFartedContainer id="ifarted">
      <IFartedWrapper>
        <IFartedRow>
          <Column1>
            <TextWrapper>
              <TopLine>Featured Project — iFarted</TopLine>
              <Heading>Send a friend exactly one thing: "I farted."</Heading>
              <Subtitle>
                Dead-simple cross-platform mobile app modeled on 2014 Yo! — context-based messaging.
                One fixed phrase, meaning from context (who, when, where). Optional location pin.
                No typing, no inbox, no feed — notification IS the message. Monetized from day one
                with AdMob + Remove Ads IAP ($1.99).
              </Subtitle>
              <Subtitle>
                <strong>Stack:</strong> Expo + TypeScript + Bun + Hono + SQLite + Expo Push API.
                <br />
                <strong>Identity:</strong> @username search · phone contacts opt-in · invite code/deep link.
                <br />
                <strong>Architecture:</strong> thin client → Bun relay → Expo Push → APNs/FCM.
                <br />
                <strong>Metrics:</strong> {metrics ? `${metrics.totalFarts} farts, ${metrics.totalUsers} users, ${metrics.fartsLastHour}/hour` : "loading..."}
              </Subtitle>
              <Subtitle>
                <Link href="https://github.com/lin2mm/udlbook/tree/ifarted/apps/mobile" target="_blank">
                  Mobile App (Expo)
                </Link>
                {" · "}
                <Link href="https://github.com/lin2mm/udlbook/tree/ifarted/apps/server" target="_blank">
                  Relay Server (Bun)
                </Link>
                {" · "}
                <Link href="https://github.com/lin2mm/udlbook/tree/ifarted/memory-bank" target="_blank">
                  Memory Bank
                </Link>
              </Subtitle>
              <SmallText>
                Imported from Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview workaround.
                Scaffold v3 complete, server live on :3000, 11 endpoints, integration test passes. Web demo below uses real API when server online.
              </SmallText>
              <div style={{ marginTop: 16, background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Web Demo — Register & Add Friends (real API)</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                  />
                  <button onClick={register} style={{ background: "#000", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>
                    Register
                  </button>
                </div>
                {apiKey && <SmallText>✅ Registered: {userId.slice(0, 8)}... apiKey {apiKey.slice(0, 8)}... (saved in localStorage)</SmallText>}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="search @username"
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                  />
                  <button onClick={search} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>
                    Search
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {searchResults.map((u) => (
                      <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                        <span>@{u.username}</span>
                        <button onClick={() => addFriend(u.id)} style={{ background: "#000", color: "#fff", border: "none", borderRadius: 12, padding: "2px 8px", cursor: "pointer", fontSize: 11 }}>
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TextWrapper>
          </Column1>
          <Column2>
            <DemoBox>
              <DemoTitle>💨 iFarted Demo — Tap to Fart</DemoTitle>
              <SmallText>Server: {serverStatus} · AdBanner gated · isAdFree flag · {displayFriends.length} friends</SmallText>
              <div style={{ marginTop: 16 }}>
                {displayFriends.map((f) => (
                  <FriendRow key={f.id}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{f.displayName || f.username}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>@{f.username} · {f.lastFart || f.lastFartAt || f.addedVia || "mock"}</div>
                    </div>
                    <FartButton disabled={sending === f.id} onClick={() => sendFart(f)}>
                      {sending === f.id ? "..." : "💨 Fart"}
                    </FartButton>
                  </FriendRow>
                ))}
              </div>
              <SmallText>
                Home = recipient list ordered by most-recently active (Yo-style). No inbox/history. One-tap fart back on detail + map pin if location attached.
              </SmallText>
              {log.length > 0 && (
                <div style={{ marginTop: 12, background: "#f8f8f8", padding: 8, borderRadius: 8, fontSize: 11, fontFamily: "monospace", maxHeight: 120, overflowY: "auto" }}>
                  {log.map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </div>
              )}
              <SmallText>
                Context-based messaging: "You understand by the context what is being said." — Or Arbel (Yo creator). Apple once rejected Yo for being "too simple" — this framing is our App Review explanation.
              </SmallText>
              <SmallText>
                Try: register → search → add friend → tap 💨 Fart → check server metrics + logs. Sound plays on tap (fart.mp3).
              </SmallText>
            </DemoBox>
          </Column2>
        </IFartedRow>
      </IFartedWrapper>
    </IFartedContainer>
  );
}
