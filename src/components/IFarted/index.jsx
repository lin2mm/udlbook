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

const API_URL = "http://localhost:3000";

export default function IFartedSection() {
  const [friends, setFriends] = useState([
    { id: "1", username: "alex", displayName: "Alex", lastFart: "2m ago" },
    { id: "2", username: "sam", displayName: "Sam", lastFart: "1h ago" },
    { id: "3", username: "jordan", displayName: "Jordan", lastFart: "yesterday" },
  ]);
  const [sending, setSending] = useState(null);
  const [log, setLog] = useState([]);
  const [serverStatus, setServerStatus] = useState("checking");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then(() => setServerStatus("online"))
      .catch(() => setServerStatus("offline (run bun src/index.ts)"));
  }, []);

  const sendFart = async (friend) => {
    setSending(friend.id);
    const timestamp = new Date().toLocaleTimeString();
    setLog((prev) => [`[${timestamp}] 💨 Fart sent to @${friend.username} — "I farted."`, ...prev].slice(0, 5));

    // Try real API if server online
    try {
      const res = await fetch(`${API_URL}/v1/farts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: friend.id, lat: 37.7749, lng: -122.4194 }),
      });
      if (res.ok) {
        const data = await res.json();
        setLog((prev) => [`[${timestamp}] ✅ Server: ${data.messageId}`, ...prev].slice(0, 5));
      }
    } catch {
      // Fallback to mock when server offline or no auth
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
              </Subtitle>
              <Subtitle>
                <Link href="https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook/apps/mobile" target="_blank">
                  Mobile App (Expo)
                </Link>
                {" · "}
                <Link href="https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook/apps/server" target="_blank">
                  Relay Server (Bun)
                </Link>
                {" · "}
                <Link href="https://github.com/lin2mm/udlbook/tree/arena/01a08e52-udlbook/memory-bank" target="_blank">
                  Memory Bank
                </Link>
              </Subtitle>
              <SmallText>
                Imported from Google Drive folder 18r18wIm0ftoZ1Pq-l2g2MddqCf17sxsX via embeddedfolderview workaround.
                Design locked, scaffold v2 complete, server live on :3000, 11 endpoints, integration test passes.
              </SmallText>
            </TextWrapper>
          </Column1>
          <Column2>
            <DemoBox>
              <DemoTitle>💨 iFarted Demo — Tap to Fart</DemoTitle>
              <SmallText>Server: {serverStatus} · AdBanner gated · isAdFree flag</SmallText>
              <div style={{ marginTop: 16 }}>
                {friends.map((f) => (
                  <FriendRow key={f.id}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{f.displayName}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>@{f.username} · {f.lastFart}</div>
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
                <div style={{ marginTop: 12, background: "#f8f8f8", padding: 8, borderRadius: 8, fontSize: 11, fontFamily: "monospace" }}>
                  {log.map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </div>
              )}
              <SmallText>
                Context-based messaging: "You understand by the context what is being said." — Or Arbel (Yo creator). Apple once rejected Yo for being "too simple" — this framing is our App Review explanation.
              </SmallText>
            </DemoBox>
          </Column2>
        </IFartedRow>
      </IFartedWrapper>
    </IFartedContainer>
  );
}
