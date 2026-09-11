import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_IFARTED_API_URL || 'http://localhost:3000';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('ifarted_adminKey') || '');
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [farts, setFarts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (adminKey) localStorage.setItem('ifarted_adminKey', adminKey);
  }, [adminKey]);

  const load = async () => {
    if (!adminKey) return setError('Enter ADMIN_KEY');
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin?key=${encodeURIComponent(adminKey)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setData(json);

      const uRes = await fetch(`${API_URL}/admin/users?key=${encodeURIComponent(adminKey)}`);
      const uJson = await uRes.json();
      if (uRes.ok) setUsers(uJson.users || []);

      const fRes = await fetch(`${API_URL}/admin/farts?key=${encodeURIComponent(adminKey)}`);
      const fJson = await fRes.json();
      if (fRes.ok) setFarts(fJson.farts || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (adminKey) load();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1>💨 iFarted — Admin Dashboard</h1>
      <p style={{ color: '#666' }}>Metrics + users + farts · Protected by ADMIN_KEY (query or x-admin-key header)</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          value={adminKey}
          onChange={e => setAdminKey(e.target.value)}
          placeholder="ADMIN_KEY (test123 for local)"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button onClick={load} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px' }}>Load</button>
      </div>

      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Total Users</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{data.counts?.users ?? data.totalUsers}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Total Farts</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{data.counts?.farts ?? data.totalFarts}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Farts / Hour</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{data.metrics?.fartsLastHour ?? data.fartsLastHour}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Active Users / Hour</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{data.metrics?.activeUsersLastHour ?? data.activeUsersLastHour}</div>
            </div>
          </div>

          <div style={{ marginTop: 20, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <h3>Raw JSON</h3>
            <pre style={{ fontSize: 11, background: '#f8f8f8', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
          </div>

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <h3>Recent Users (20)</h3>
              <div style={{ fontSize: 11, maxHeight: 400, overflowY: 'auto' }}>
                {users.slice(0,20).map(u => (
                  <div key={u.id} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <strong>@{u.username}</strong> — {u.id.slice(0,8)}... {u.display_name || ''} {u.created_at}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <h3>Recent Farts (20)</h3>
              <div style={{ fontSize: 11, maxHeight: 400, overflowY: 'auto' }}>
                {farts.slice(0,20).map(f => (
                  <div key={f.id} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                    {f.id.slice(0,8)}... {f.sender_id.slice(0,6)}→{f.recipient_id.slice(0,6)} {f.lat ? `${f.lat.toFixed(2)},${f.lng?.toFixed(2)}` : 'no loc'} {f.created_at}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
