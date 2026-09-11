import { useState } from 'react';

const SOUNDS = [
  { id: 'classic', name: 'Classic', file: '/fart.mp3', duration: 1200, desc: 'OG brown noise + sine sweep' },
  { id: 'short', name: 'Short', file: '/fart.mp3', duration: 400, desc: 'Quick puff' },
  { id: 'long', name: 'Long Rumble', file: '/fart.mp3', duration: 2500, desc: 'Extended emphasis' },
  { id: 'squeaky', name: 'Squeaky', file: '/fart.mp3', duration: 800, desc: 'Cartoonish' },
  { id: 'wet', name: 'Wet', file: '/fart.mp3', duration: 1500, desc: "Don't ask" },
];

export default function SoundPicker({ selected, onSelect }) {
  const [playing, setPlaying] = useState(null);

  const play = (s) => {
    setPlaying(s.id);
    try {
      const audio = new Audio(s.file);
      audio.volume = 0.5;
      audio.play().catch(()=>{});
      setTimeout(()=>setPlaying(null), s.duration);
    } catch {
      setPlaying(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h4 style={{ margin: 0 }}>🔊 Sound Picker (v11)</h4>
      <p style={{ fontSize: 11, color: '#666', margin: 0 }}>Choose your fart — classic is default, others for context emphasis</p>
      {SOUNDS.map(s => (
        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: `2px solid ${selected===s.id ? '#000' : '#eee'}`, borderRadius: 12, background: selected===s.id ? '#fff7ed' : '#fff' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name} {selected===s.id && '✅'}</div>
            <div style={{ fontSize: 11, color: '#666' }}>{s.desc} · {s.duration}ms</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={()=>play(s)} style={{ background: '#eee', border: 'none', borderRadius: 20, padding: '6px 12px', fontSize: 12 }}>{playing===s.id ? '...' : '▶️ Play'}</button>
            <button onClick={()=>onSelect(s.id)} style={{ background: selected===s.id ? '#000' : '#fff', color: selected===s.id ? '#fff' : '#000', border: '1px solid #000', borderRadius: 20, padding: '6px 12px', fontSize: 12 }}>Select</button>
          </div>
        </div>
      ))}
    </div>
  );
}
