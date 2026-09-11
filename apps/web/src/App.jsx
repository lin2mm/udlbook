import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_IFARTED_API_URL || 'http://localhost:3000';

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('ifarted_apiKey') || '');
  const [userId, setUserId] = useState(localStorage.getItem('ifarted_userId') || '');
  const [username, setUsername] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [log, setLog] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const [sending, setSending] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(() => {
        setServerStatus('online');
        fetch(`${API_URL}/metrics`).then(r => r.json()).then(setMetrics).catch(()=>{});
      })
      .catch(() => setServerStatus('offline'));
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    fetch(`${API_URL}/v1/friends`, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then(r => r.json())
      .then(d => setFriends(d.friends || []))
      .catch(()=>{});
  }, [apiKey]);

  const addLog = (msg) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));

  const register = async () => {
    if (!username) return alert('Enter username');
    try {
      const res = await fetch(`${API_URL}/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName: username, inviteCode: inviteCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApiKey(data.apiKey);
      setUserId(data.userId);
      localStorage.setItem('ifarted_apiKey', data.apiKey);
      localStorage.setItem('ifarted_userId', data.userId);
      addLog(`✅ Registered @${data.user.username} — id ${data.userId.slice(0,8)}...`);
    } catch (e) {
      alert(e.message);
    }
  };

  const search = async () => {
    if (!apiKey || !searchQuery) return;
    const res = await fetch(`${API_URL}/v1/users/search?username=${encodeURIComponent(searchQuery)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    if (res.ok) setSearchResults(data);
    else alert(data.error);
  };

  const addFriend = async (fid) => {
    if (!apiKey) return alert('Register first');
    const res = await fetch(`${API_URL}/v1/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ userId: fid, via: 'username' }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    addLog(`✅ Added friend ${fid.slice(0,8)}...`);
    const rf = await fetch(`${API_URL}/v1/friends`, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r=>r.json());
    setFriends(rf.friends || []);
  };

  const sendFart = async (friend) => {
    setSending(friend.id);
    addLog(`💨 Fart sent to @${friend.username} — "I farted."`);
    if (apiKey) {
      try {
        const res = await fetch(`${API_URL}/v1/farts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ recipientId: friend.id, lat: 37.7749, lng: -122.4194 }),
        });
        const data = await res.json();
        if (res.ok) {
          addLog(`✅ Server: ${data.messageId.slice(0,8)}... ${data.warning || ''}`);
          fetch(`${API_URL}/metrics`).then(r=>r.json()).then(setMetrics).catch(()=>{});
        } else {
          addLog(`❌ ${data.error}`);
        }
      } catch {
        addLog(`(mock) Push via Expo Push API → APNs/FCM`);
      }
    }
    try {
      const audio = new Audio('/fart.mp3');
      audio.volume = 0.5;
      audio.play().catch(()=>{});
    } catch {}
    setTimeout(()=>setSending(null), 800);
  };

  const createInvite = async () => {
    if (!apiKey) return alert('Register first');
    const res = await fetch(`${API_URL}/v1/invites`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    if (res.ok) {
      setInviteCode(data.code);
      setInviteLink(data.inviteLink);
      addLog(`✅ Invite created: ${data.code} — ${data.inviteLink}`);
    } else alert(data.error);
  };

  const mockFriends = [
    { id: '1', username: 'alex', displayName: 'Alex', addedVia: 'mock', lastFartAt: null },
    { id: '2', username: 'sam', displayName: 'Sam', addedVia: 'mock', lastFartAt: null },
  ];

  const displayFriends = friends.length > 0 ? friends : mockFriends;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>💨 iFarted — Web Demo</h1>
      <p style={{ color: '#666' }}>Dead-simple Yo-style: "I farted." is the entire message. No typing, no inbox, notification IS message. Server: {serverStatus} {metrics && `· ${metrics.totalFarts} farts, ${metrics.totalUsers} users, ${metrics.fartsLastHour}/hour`}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <div style={{ background: '#fff', border: '2px solid #000', borderRadius: 16, padding: 16, boxShadow: '4px 4px 0 #000' }}>
          <h3>Register</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />
            <button onClick={register} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px' }}>Register</button>
          </div>
          {apiKey && <p style={{ fontSize: 11, color: '#666', marginTop: 8 }}>✅ {userId.slice(0,8)}... {apiKey.slice(0,8)}... (localStorage)</p>}

          <h3 style={{ marginTop: 16 }}>Search @username</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="alex" style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />
            <button onClick={search} style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '8px 12px' }}>Search</button>
          </div>
          {searchResults.map(u => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
              <span>@{u.username}</span>
              <button onClick={()=>addFriend(u.id)} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 12, padding: '2px 8px', fontSize: 11 }}>Add</button>
            </div>
          ))}

          <h3 style={{ marginTop: 16 }}>Invite Code</h3>
          <button onClick={createInvite} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', width: '100%' }}>Create Invite</button>
          {inviteCode && <p style={{ fontSize: 12, marginTop: 8 }}><strong>{inviteCode}</strong> — {inviteLink}</p>}

          <h3 style={{ marginTop: 16 }}>Log</h3>
          <div style={{ background: '#f8f8f8', padding: 8, borderRadius: 8, fontSize: 11, fontFamily: 'monospace', maxHeight: 200, overflowY: 'auto' }}>
            {log.map((l,i)=><div key={i}>{l}</div>)}
            {log.length===0 && <div style={{ color: '#999' }}>No logs yet. Register → search → add friend → tap 💨 Fart</div>}
          </div>
        </div>

        <div style={{ background: '#fff', border: '2px solid #000', borderRadius: 16, padding: 16, boxShadow: '4px 4px 0 #000' }}>
          <h3>Home — Tap to Fart</h3>
          <p style={{ fontSize: 12, color: '#666' }}>Recipient list ordered by most-recently active (Yo-style). No inbox/history. {displayFriends.length} friends</p>
          <div style={{ marginTop: 12 }}>
            {displayFriends.map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{f.displayName || f.username}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>@{f.username} · {f.addedVia} {f.lastFartAt ? `· last ${new Date(f.lastFartAt).toLocaleTimeString()}` : ''}</div>
                </div>
                <button disabled={sending===f.id} onClick={()=>sendFart(f)} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 700 }}>
                  {sending===f.id ? '...' : '💨 Fart'}
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#666', marginTop: 12 }}>Context-based messaging: "You understand by the context what is being said." — Or Arbel (Yo creator). One phrase, meaning from context.</p>
          <div style={{ height: 50, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, borderTop: '1px solid #eee' }}>
            <span style={{ fontSize: 11, color: '#999' }}>AdMob Banner — Remove Ads in Settings ($1.99) · Non-personalized</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #eee' }}>
        <h4>Architecture</h4>
        <pre style={{ fontSize: 11, overflowX: 'auto' }}>{`[Sender — Web/Mobile] POST /v1/farts {recipientId, lat?, lng?} (Bearer apiKey)
    ↓
[Bun relay] auth + rate limit → insert message → POST https://exp.host/--/api/v2/push/send {to, title=senderName, body="I farted.", sound="fart.caf", data:{...}}
    ↓
[Expo Push Service] → [APNs / FCM]
    ↓
[Recipient] OS notification → tap → fart-detail + map pin + fart back`}</pre>
        <p style={{ fontSize: 12, color: '#666' }}>No inbox/history — notification IS message. Messages table kept only for rate limiting/abuse. Thin client, thin backend.</p>
      </div>
    </div>
  );
}
