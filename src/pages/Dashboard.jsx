import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #050507; --surface: #08090d; --surface2: #0c0d12; --border: #111116; --border2: #181820; --accent: #c084fc; --accent2: #60d8fa; --accent3: #6ee7b7; --text: rgba(255,255,255,0.93); --mid: rgba(255,255,255,0.52); --dim: rgba(255,255,255,0.26); --red: #ff5f7e; }
  body { background: var(--bg); color: var(--text); font-family: 'Exo 2', sans-serif; margin: 0; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 68px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 22px 0; gap: 4px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { margin-bottom: 24px; display: flex; align-items: center; justify-content: center; }
  .nav-btn { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; background: transparent; color: var(--dim); font-size: 17px; transition: all 0.18s; position: relative; }
  .nav-btn:hover { background: var(--surface2); color: var(--mid); }
  .nav-btn.active { background: rgba(192,132,252,0.1); color: var(--accent); }
  .nav-dot { position: absolute; top: 7px; right: 7px; width: 5px; height: 5px; border-radius: 50%; background: var(--red); border: 1.5px solid var(--surface); }
  .sidebar-bottom { margin-top: auto; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #1a0a30, #0d0520); border: 1.5px solid rgba(192,132,252,0.25); display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; color: var(--accent); cursor: pointer; }
  .main { margin-left: 68px; flex: 1; padding: 28px 30px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .greeting { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 20px; }
  .greeting em { font-style: normal; color: var(--accent); }
  .topbar-date { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.08em; margin-top: 3px; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .pill { font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.1em; border-radius: 20px; padding: 5px 13px; border: 1px solid; }
  .pill-purple { color: var(--accent); border-color: rgba(192,132,252,0.22); background: rgba(192,132,252,0.07); }
  .pill-green { color: var(--accent3); border-color: rgba(110,231,183,0.2); background: rgba(110,231,183,0.06); display: flex; align-items: center; gap: 6px; }
  .live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent3); animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .hero { display: grid; grid-template-columns: 1fr 320px; gap: 14px; margin-bottom: 14px; }
  .card { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; padding: 28px; position: relative; overflow: hidden; }
  .card-glow { position: absolute; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%); top: -100px; right: -60px; pointer-events: none; }
  .card-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.3em; color: var(--dim); text-transform: uppercase; margin-bottom: 18px; }
  .dial-row { display: flex; align-items: flex-end; gap: 14px; margin-bottom: 22px; }
  .dial-wrap { flex: 1; }
  .dial-sublabel { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.18em; color: var(--dim); text-transform: uppercase; margin-bottom: 8px; }
  .dial-input { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 9px; padding: 12px 15px; font-family: 'Share Tech Mono', monospace; font-size: 17px; letter-spacing: 0.06em; color: var(--text); outline: none; transition: border-color 0.2s; }
  .dial-input:focus { border-color: rgba(192,132,252,0.35); }
  .dial-input::placeholder { color: var(--dim); font-size: 13px; }
  .call-btn { width: 50px; height: 50px; border-radius: 50%; border: none; background: linear-gradient(135deg, #22c55e, #15803d); cursor: pointer; font-size: 19px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(34,197,94,0.28); transition: all 0.2s; flex-shrink: 0; }
  .call-btn:hover { transform: scale(1.08); }
  .waveform { display: flex; align-items: center; gap: 3px; height: 28px; }
  .wbar { width: 3px; border-radius: 2px; background: var(--border2); transition: height 0.12s ease; }
  .wbar.on { background: var(--accent); }
  .ai-status { margin-top: 12px; font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--accent3); letter-spacing: 0.1em; animation: blink 1.5s infinite; }
  .badge-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; padding: 26px; display: flex; flex-direction: column; align-items: center; position: relative; overflow: hidden; }
  .badge-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(192,132,252,0.07) 0%, transparent 55%); pointer-events: none; }
  .badge-tier { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.22em; color: var(--accent); opacity: 0.55; margin-bottom: 16px; align-self: flex-start; }
  .badge-disc { width: 82px; height: 82px; border-radius: 50%; background: radial-gradient(circle at 35% 32%, #2d1060, #080318); border: 1px solid rgba(192,132,252,0.22); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; box-shadow: 0 0 28px rgba(192,132,252,0.14); animation: float 5s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  .badge-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 3px; }
  .badge-sub { font-size: 11px; color: var(--dim); margin-bottom: 14px; }
  .badge-tags { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
  .btag { font-family: 'Share Tech Mono', monospace; font-size: 8px; letter-spacing: 0.1em; border: 1px solid rgba(192,132,252,0.18); border-radius: 20px; padding: 3px 9px; color: var(--accent); background: rgba(192,132,252,0.05); }
  .badge-invites { margin-top: auto; padding-top: 14px; font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--dim); letter-spacing: 0.1em; }
  .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 14px; }
  .stat { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; }
  .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--c); opacity: 0.7; }
  .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.18em; color: var(--dim); margin-bottom: 8px; }
  .stat-val { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 24px; color: var(--c); line-height: 1; margin-bottom: 3px; }
  .stat-sub { font-size: 11px; color: var(--dim); }
  .bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .panel { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 22px; }
  .panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .panel-title { font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 0.04em; }
  .panel-action { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.14em; color: var(--accent); cursor: pointer; opacity: 0.65; }
  .call-item { display: flex; align-items: center; gap: 11px; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .call-item:last-child { border-bottom: none; }
  .call-av { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; }
  .call-info { flex: 1; }
  .call-name { font-size: 13px; font-weight: 500; margin-bottom: 1px; }
  .call-enum { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.07em; }
  .call-meta { text-align: right; }
  .call-dur { font-size: 12px; color: var(--mid); }
  .call-time { font-size: 10px; color: var(--dim); margin-top: 1px; }
  .q-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .q-row:last-child { border-bottom: none; }
  .q-label { font-size: 12px; color: var(--mid); }
  .q-bar-wrap { flex: 1; margin: 0 14px; height: 3px; background: var(--border2); border-radius: 2px; overflow: hidden; }
  .q-bar { height: 100%; border-radius: 2px; background: var(--qc); }
  .q-val { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: var(--accent3); min-width: 38px; text-align: right; }
  .ai-banner { margin-top: 14px; padding: 9px 13px; background: rgba(110,231,183,0.05); border: 1px solid rgba(110,231,183,0.12); border-radius: 8px; font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--accent3); letter-spacing: 0.08em; line-height: 1.7; }
`;

function MarkE({ size = 32, color = "#c084fc" }) {
  const c = size / 2, r = size * 0.37, sw = size * 0.082;
  const toRad = d => d * Math.PI / 180;
  const x1 = c + r * Math.cos(toRad(-30)), y1 = c + r * Math.sin(toRad(-30));
  const x2 = c + r * Math.cos(toRad(210)), y2 = c + r * Math.sin(toRad(210));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ flexShrink: 0 }}>
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <line x1={c - r} y1={c} x2={c + r * 0.42} y2={c} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function WaveViz({ on }) {
  const [bars, setBars] = useState(Array(26).fill(4));
  useEffect(() => {
    if (!on) { setBars(Array(26).fill(4)); return; }
    const iv = setInterval(() => setBars(b => b.map(() => Math.floor(Math.random() * 22) + 4)), 110);
    return () => clearInterval(iv);
  }, [on]);
  return <div className="waveform">{bars.map((h, i) => <div key={i} className={`wbar${on ? " on" : ""}`} style={{ height: on ? h : 4 }} />)}</div>;
}

const NAV = [
  { icon: "⊞", label: "Dashboard", active: true },
  { icon: "📞", label: "Calls" },
  { icon: "👥", label: "Contacts" },
  { icon: "💬", label: "Messages", dot: true },
  { icon: "🏅", label: "Badge" },
  { icon: "⚙", label: "Settings" },
];

const CALLS = [
  { name: "Amara K.", en: "E-0247", time: "2m ago", dur: "4:32", color: "#c084fc", bg: "rgba(192,132,252,0.1)" },
  { name: "Chidi O.", en: "E-1089", time: "1h ago", dur: "12:07", color: "#60d8fa", bg: "rgba(96,216,250,0.1)" },
  { name: "Naledi M.", en: "E-0553", time: "3h ago", dur: "7:15", color: "#6ee7b7", bg: "rgba(110,231,183,0.1)" },
  { name: "Kwame A.", en: "E-2341", time: "Yesterday", dur: "—", color: "#fcd34d", bg: "rgba(252,211,77,0.1)" },
];

const STATS = [
  { label: "Total Calls", val: "1,284", sub: "All time", c: "#c084fc" },
  { label: "Mins This Week", val: "348", sub: "+12% vs last week", c: "#60d8fa" },
  { label: "Contacts", val: "47", sub: "Verified eNumbers", c: "#6ee7b7" },
  { label: "Call Quality", val: "98.6%", sub: "AI-optimised", c: "#fcd34d" },
];

const QUALITY = [
  { label: "Signal Clarity", val: "99%", pct: 99, c: "#6ee7b7" },
  { label: "Latency", val: "18ms", pct: 92, c: "#60d8fa" },
  { label: "AI Upscaling", val: "Active", pct: 100, c: "#c084fc" },
  { label: "Packet Loss", val: "0.1%", pct: 99, c: "#fcd34d" },
];

export default function Dashboard() {
  const [nav, setNav] = useState(0);
  const [dial, setDial] = useState("");
  const [calling, setCalling] = useState(false);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo"><MarkE size={34} color="#c084fc" /></div>
          {NAV.map((n, i) => (
            <button key={i} className={`nav-btn${nav === i ? " active" : ""}`} title={n.label} onClick={() => setNav(i)}>
              {n.icon}{n.dot && <span className="nav-dot" />}
            </button>
          ))}
          <div className="sidebar-bottom"><div className="avatar">TO</div></div>
        </div>
        <div className="main">
          <div className="topbar">
            <div>
              <div className="greeting">Good morning, <em>Taryl</em> 👋</div>
              <div className="topbar-date">Pan-African Network</div>
            </div>
            <div className="topbar-right">
              <div className="pill pill-green"><div className="live-dot" /> NETWORK LIVE</div>
              <div className="pill pill-purple">E-0001 · FOUNDER</div>
            </div>
          </div>
          <div className="hero">
            <div className="card">
              <div className="card-glow" />
              <div className="card-label">{calling ? "● CALL IN PROGRESS" : "MAKE A CALL"}</div>
              <div className="dial-row">
                <div className="dial-wrap">
                  <div className="dial-sublabel">Enter eNumber</div>
                  <input className="dial-input" placeholder="E-XXXX" value={dial} onChange={e => setDial(e.target.value.toUpperCase())} />
                </div>
                <button className="call-btn" onClick={() => dial && setCalling(!calling)}>{calling ? "⏹" : "📞"}</button>
              </div>
              <WaveViz on={calling} />
              {calling && <div className="ai-status">NVIDIA RIVA AI · ACTIVE · OPTIMISING QUALITY</div>}
            </div>
            <div className="badge-card">
              <div className="badge-tier">Tier I · Founder eNative</div>
              <div className="badge-disc"><MarkE size={38} color="#c084fc" /></div>
              <div className="badge-title">Founder eNative</div>
              <div className="badge-sub">Slot #1 of 1,000 · Permanent</div>
              <div className="badge-tags"><span className="btag">Permanent ID</span><span className="btag">20 Invites</span><span className="btag">Priority</span></div>
              <div className="badge-invites">7 invites remaining</div>
            </div>
          </div>
          <div className="stats">
            {STATS.map((s, i) => (
              <div key={i} className="stat" style={{ "--c": s.c }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="bottom">
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Recent Calls</div><div className="panel-action">VIEW ALL →</div></div>
              {CALLS.map((c, i) => (
                <div key={i} className="call-item">
                  <div className="call-av" style={{ background: c.bg, color: c.color }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="call-info"><div className="call-name">{c.name}</div><div className="call-enum">{c.en}</div></div>
                  <div className="call-meta"><div className="call-dur">{c.dur}</div><div className="call-time">{c.time}</div></div>
                </div>
              ))}
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Network Quality</div><div className="panel-action" style={{ color: "var(--accent3)" }}>LIVE ●</div></div>
              {QUALITY.map((q, i) => (
                <div key={i} className="q-row">
                  <div className="q-label">{q.label}</div>
                  <div className="q-bar-wrap"><div className="q-bar" style={{ width: `${q.pct}%`, "--qc": q.c }} /></div>
                  <div className="q-val">{q.val}</div>
                </div>
              ))}
              <div className="ai-banner">NVIDIA RIVA AI · ACTIVE<br/><span style={{ color: "var(--dim)" }}>Congestion compensation live across 54 African nations</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
