import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #050507; --surface: #08090d; --surface2: #0c0d12; --border: #111116; --border2: #181820; --accent: #c084fc; --accent2: #60d8fa; --accent3: #6ee7b7; --text: rgba(255,255,255,0.93); --mid: rgba(255,255,255,0.52); --dim: rgba(255,255,255,0.26); --red: #ff5f7e; }
  body { background: var(--bg); color: var(--text); font-family: 'Exo 2', sans-serif; margin: 0; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 68px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 22px 0; gap: 4px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #c084fc, #60d8fa); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 16px; color: #fff; }
  .nav-btn { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; background: transparent; color: var(--dim); font-size: 17px; transition: all 0.18s; position: relative; }
  .nav-btn:hover { background: var(--surface2); color: var(--mid); }
  .nav-btn.active { background: rgba(192,132,252,0.1); color: var(--accent); }
  .nav-dot { position: absolute; top: 7px; right: 7px; width: 5px; height: 5px; border-radius: 50%; background: var(--red); border: 1.5px solid var(--surface); }
  .sidebar-bottom { margin-top: auto; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #1a0a30, #0d0520); border: 1.5px solid rgba(192,132,252,0.25); display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; color: var(--accent); cursor: pointer; }
  .main { margin-left: 68px; flex: 1; display: flex; height: 100vh; overflow: hidden; }
  .contacts-panel { width: 340px; border-right: 1px solid var(--border); display: flex; flex-direction: column; background: var(--surface); flex-shrink: 0; }
  .cp-header { padding: 28px 24px 20px; border-bottom: 1px solid var(--border); }
  .cp-title { font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 16px; }
  .search-wrap { position: relative; }
  .search-input { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 10px 14px 10px 38px; font-family: 'Exo 2', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: rgba(192,132,252,0.3); }
  .search-input::placeholder { color: var(--dim); }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--dim); font-size: 14px; }
  .filter-row { display: flex; gap: 6px; padding: 14px 24px; border-bottom: 1px solid var(--border); }
  .filter-btn { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.14em; padding: 5px 12px; border-radius: 20px; cursor: pointer; border: 1px solid var(--border2); background: transparent; color: var(--dim); transition: all 0.18s; }
  .filter-btn.on { color: var(--accent); border-color: rgba(192,132,252,0.25); background: rgba(192,132,252,0.07); }
  .contacts-list { flex: 1; overflow-y: auto; padding: 8px 0; }
  .group-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.25em; color: var(--dim); padding: 12px 24px 6px; text-transform: uppercase; }
  .contact-row { display: flex; align-items: center; gap: 13px; padding: 11px 24px; cursor: pointer; transition: background 0.15s; position: relative; }
  .contact-row:hover { background: rgba(255,255,255,0.03); }
  .contact-row.active { background: rgba(192,132,252,0.07); }
  .contact-row.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--accent); border-radius: 0 2px 2px 0; }
  .c-av { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px; position: relative; }
  .c-online { position: absolute; bottom: 1px; right: 1px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent3); border: 1.5px solid var(--surface); }
  .c-info { flex: 1; min-width: 0; }
  .c-name { font-size: 13px; font-weight: 600; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .c-enum { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.06em; }
  .c-badge { font-family: 'Share Tech Mono', monospace; font-size: 8px; letter-spacing: 0.1em; padding: 2px 7px; border-radius: 20px; border: 1px solid; flex-shrink: 0; }
  .detail-panel { flex: 1; display: flex; flex-direction: column; border-right: 1px solid var(--border); overflow: hidden; }
  .dp-header { padding: 28px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 20px; background: var(--surface); }
  .dp-av { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 22px; flex-shrink: 0; position: relative; box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px var(--border2); }
  .dp-online { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--accent3); border: 2px solid var(--surface); }
  .dp-name { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.3px; margin-bottom: 4px; }
  .dp-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .dp-enum { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: 0.08em; }
  .dp-tier { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.12em; padding: 3px 9px; border-radius: 20px; border: 1px solid rgba(192,132,252,0.2); color: var(--accent); background: rgba(192,132,252,0.07); }
  .dp-status { font-size: 11px; color: var(--accent3); display: flex; align-items: center; gap: 5px; font-family: 'Share Tech Mono', monospace; letter-spacing: 0.08em; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent3); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .dp-actions { margin-left: auto; display: flex; gap: 10px; }
  .action-btn { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; border: 1px solid var(--border2); background: var(--surface2); transition: all 0.18s; }
  .action-btn:hover { border-color: rgba(192,132,252,0.3); background: rgba(192,132,252,0.07); }
  .action-btn.call { background: linear-gradient(135deg, #22c55e, #15803d); border-color: transparent; box-shadow: 0 3px 14px rgba(34,197,94,0.25); }
  .dp-history { flex: 1; overflow-y: auto; padding: 20px 32px; }
  .history-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.25em; color: var(--dim); margin-bottom: 14px; text-transform: uppercase; }
  .history-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 12px; margin-bottom: 6px; border: 1px solid transparent; transition: all 0.15s; cursor: pointer; background: var(--surface); }
  .history-item:hover { border-color: var(--border2); background: var(--surface2); }
  .h-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .h-info { flex: 1; }
  .h-type { font-size: 12px; font-weight: 500; margin-bottom: 2px; }
  .h-time { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.06em; }
  .h-dur { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: var(--mid); }
  .dialler-panel { width: 300px; background: var(--surface); flex-shrink: 0; display: flex; flex-direction: column; padding: 28px 24px; }
  .dial-title { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.28em; color: var(--dim); margin-bottom: 20px; text-transform: uppercase; }
  .dial-display { background: var(--surface2); border: 1px solid var(--border2); border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; min-height: 62px; display: flex; flex-direction: column; justify-content: center; }
  .dial-number { font-family: 'Share Tech Mono', monospace; font-size: 22px; letter-spacing: 0.08em; color: var(--text); min-height: 28px; }
  .dial-sublabel { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--dim); letter-spacing: 0.12em; margin-top: 4px; }
  .keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
  .key { height: 56px; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border2); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; gap: 1px; font-family: 'Rajdhani', sans-serif; }
  .key:hover { background: rgba(192,132,252,0.08); border-color: rgba(192,132,252,0.2); }
  .key:active { transform: scale(0.95); }
  .key-num { font-size: 20px; font-weight: 700; line-height: 1; color: var(--text); }
  .key-alpha { font-family: 'Share Tech Mono', monospace; font-size: 8px; letter-spacing: 0.12em; color: var(--dim); }
  .key-special { background: transparent; border-color: transparent; }
  .dial-call-btn { width: 100%; height: 54px; border-radius: 14px; border: none; background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 1.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 20px rgba(34,197,94,0.25); transition: all 0.2s; margin-bottom: 12px; }
  .dial-call-btn:hover { transform: translateY(-1px); box-shadow: 0 7px 28px rgba(34,197,94,0.38); }
  .dial-end-btn { width: 100%; height: 44px; border-radius: 12px; border: 1px solid rgba(255,95,126,0.2); background: rgba(255,95,126,0.06); color: var(--red); font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
  .incall-panel { display: flex; flex-direction: column; align-items: center; padding: 16px 0; margin-bottom: 16px; }
  .incall-av { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 26px; margin-bottom: 12px; animation: ring-pulse 2s ease-in-out infinite; }
  @keyframes ring-pulse { 0%,100%{box-shadow:0 0 0 6px rgba(192,132,252,0.08),0 0 0 12px rgba(192,132,252,0.04)} 50%{box-shadow:0 0 0 10px rgba(192,132,252,0.12),0 0 0 20px rgba(192,132,252,0.05)} }
  .incall-name { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 18px; margin-bottom: 4px; }
  .incall-timer { font-family: 'Share Tech Mono', monospace; font-size: 22px; color: var(--accent3); letter-spacing: 0.1em; margin-bottom: 8px; }
  .incall-status { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--accent); letter-spacing: 0.2em; opacity: 0.7; animation: blink 1.5s infinite; }
  .waveform { display: flex; align-items: center; gap: 2.5px; height: 24px; margin: 14px 0; }
  .wbar { width: 3px; border-radius: 2px; background: var(--accent); }
`;

const CONTACTS = [
  { name: "Amara Kone",     en: "E-0247", country: "🇨🇮", tier: "Founder",  color: "#c084fc", bg: "rgba(192,132,252,0.12)", online: true,  badge: "purple" },
  { name: "Chidi Okafor",   en: "E-1089", country: "🇳🇬", tier: "Verified", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", online: true,  badge: "green" },
  { name: "Naledi Mokoena", en: "E-0553", country: "🇿🇦", tier: "Founder",  color: "#c084fc", bg: "rgba(192,132,252,0.12)", online: false, badge: "purple" },
  { name: "Kwame Asante",   en: "E-2341", country: "🇬🇭", tier: "Community",color: "#fcd34d", bg: "rgba(252,211,77,0.12)",  online: true,  badge: "gold" },
  { name: "Fatima Diallo",  en: "E-0871", country: "🇸🇳", tier: "Verified", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", online: false, badge: "green" },
  { name: "Emeka Eze",      en: "E-1432", country: "🇳🇬", tier: "Business", color: "#60d8fa", bg: "rgba(96,216,250,0.12)",  online: true,  badge: "blue" },
];

const BADGE_COLORS = {
  purple: { color: "#c084fc", border: "rgba(192,132,252,0.2)", bg: "rgba(192,132,252,0.07)" },
  green:  { color: "#6ee7b7", border: "rgba(110,231,183,0.2)", bg: "rgba(110,231,183,0.07)" },
  blue:   { color: "#60d8fa", border: "rgba(96,216,250,0.2)",  bg: "rgba(96,216,250,0.07)"  },
  gold:   { color: "#fcd34d", border: "rgba(252,211,77,0.2)",  bg: "rgba(252,211,77,0.07)"  },
};

const HISTORY = [
  { type: "Outgoing", dur: "12:07", time: "Today, 2:14 PM",    icon: "↗", color: "#6ee7b7", bg: "rgba(110,231,183,0.08)" },
  { type: "Incoming", dur: "4:32",  time: "Today, 10:48 AM",   icon: "↙", color: "#60d8fa", bg: "rgba(96,216,250,0.08)" },
  { type: "Missed",   dur: "—",     time: "Yesterday, 6:20 PM", icon: "✕", color: "#ff5f7e", bg: "rgba(255,95,126,0.08)" },
  { type: "Outgoing", dur: "28:14", time: "Monday, 9:05 AM",   icon: "↗", color: "#6ee7b7", bg: "rgba(110,231,183,0.08)" },
];

const NAV = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "📞", label: "Calls" },
  { icon: "👥", label: "Contacts", active: true },
  { icon: "💬", label: "Messages", dot: true },
  { icon: "🏅", label: "Badge" },
  { icon: "⚙", label: "Settings" },
];

const KEYS = [
  ["1",""],["2","ABC"],["3","DEF"],
  ["4","GHI"],["5","JKL"],["6","MNO"],
  ["7","PQRS"],["8","TUV"],["9","WXYZ"],
  ["*",""],["0","+"],["#",""],
];

export default function Contacts() {
  const [activeNav, setActiveNav] = useState(2);
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dialVal, setDialVal] = useState("");
  const [calling, setCalling] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!calling) { setTimer(0); return; }
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [calling]);

  const contact = CONTACTS[selected];
  const bc = BADGE_COLORS[contact.badge];
  const filtered = CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.en.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" ? true : filter === "Online" ? c.online : c.tier === filter;
    return matchSearch && matchFilter;
  });

  const pressKey = (k) => {
    if (k === "⌫") { setDialVal(v => v.slice(0, -1)); return; }
    setDialVal(v => (v + k).slice(0, 12));
  };

  const m = String(Math.floor(timer / 60)).padStart(2, "0");
  const s = String(timer % 60).padStart(2, "0");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">en</div>
          {NAV.map((n, i) => (
            <button key={i} className={`nav-btn${activeNav === i ? " active" : ""}`} title={n.label} onClick={() => setActiveNav(i)}>
              {n.icon}{n.dot && <span className="nav-dot" />}
            </button>
          ))}
          <div className="sidebar-bottom"><div className="avatar">TO</div></div>
        </div>
        <div className="main">
          <div className="contacts-panel">
            <div className="cp-header">
              <div className="cp-title">Contacts</div>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Search by name or eNumber..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="filter-row">
              {["All", "Online", "Founder", "Business"].map(f => (
                <button key={f} className={`filter-btn${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="contacts-list">
              <div className="group-label">{filtered.length} Contacts</div>
              {filtered.map((c, i) => {
                const bc2 = BADGE_COLORS[c.badge];
                const idx = CONTACTS.indexOf(c);
                return (
                  <div key={i} className={`contact-row${selected === idx ? " active" : ""}`} onClick={() => setSelected(idx)}>
                    <div className="c-av" style={{ background: c.bg, color: c.color }}>
                      {c.name.split(" ").map(n => n[0]).join("")}
                      {c.online && <div className="c-online" />}
                    </div>
                    <div className="c-info">
                      <div className="c-name">{c.country} {c.name}</div>
                      <div className="c-enum">{c.en}</div>
                    </div>
                    <div className="c-badge" style={{ color: bc2.color, borderColor: bc2.border, background: bc2.bg }}>{c.tier}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="detail-panel">
            <div className="dp-header">
              <div className="dp-av" style={{ background: contact.bg, color: contact.color }}>
                {contact.name.split(" ").map(n => n[0]).join("")}
                {contact.online && <div className="dp-online" />}
              </div>
              <div>
                <div className="dp-name">{contact.name}</div>
                <div className="dp-meta">
                  <span className="dp-enum">{contact.en}</span>
                  <span className="dp-tier" style={{ color: bc.color, borderColor: bc.border, background: bc.bg }}>{contact.tier}</span>
                  {contact.online && <span className="dp-status"><span className="status-dot" /> Online</span>}
                </div>
              </div>
              <div className="dp-actions">
                <div className="action-btn">💬</div>
                <div className="action-btn">🎥</div>
                <div className="action-btn call" onClick={() => { setDialVal(contact.en); setCalling(true); }}>📞</div>
              </div>
            </div>
            <div className="dp-history">
              <div className="history-label">Call History</div>
              {HISTORY.map((h, i) => (
                <div key={i} className="history-item">
                  <div className="h-icon" style={{ background: h.bg, color: h.color }}>{h.icon}</div>
                  <div className="h-info"><div className="h-type" style={{ color: h.color }}>{h.type}</div><div className="h-time">{h.time}</div></div>
                  <div className="h-dur">{h.dur}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dialler-panel">
            <div className="dial-title">Dialler</div>
            {calling ? (
              <div className="incall-panel">
                <div className="incall-av" style={{ background: contact.bg, color: contact.color }}>
                  {contact.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="incall-name">{contact.name}</div>
                <div className="incall-timer">{m}:{s}</div>
                <div className="incall-status">● NVIDIA RIVA · AI ACTIVE</div>
                <div className="waveform">
                  {Array(18).fill(0).map((_, i) => (
                    <div key={i} className="wbar" style={{ height: Math.floor(Math.random() * 18) + 6, animation: `waveAnim 0.8s ${(i * 0.06).toFixed(2)}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
                <style>{`@keyframes waveAnim { from{transform:scaleY(0.3);opacity:0.5} to{transform:scaleY(1);opacity:1} }`}</style>
              </div>
            ) : (
              <div className="dial-display">
                <div className="dial-number">{dialVal}</div>
                <div className="dial-sublabel">{dialVal ? "eNumber" : "Enter eNumber to call"}</div>
              </div>
            )}
            {!calling && (
              <div className="keypad">
                {KEYS.map(([num, alpha], i) => (
                  <div key={i} className="key" onClick={() => pressKey(num)}>
                    <span className="key-num">{num}</span>
                    {alpha && <span className="key-alpha">{alpha}</span>}
                  </div>
                ))}
                <div className="key key-special" />
                <div className="key key-special" onClick={() => pressKey("⌫")}><span style={{ color: "var(--mid)", fontSize: 18 }}>⌫</span></div>
              </div>
            )}
            {calling ? (
              <button className="dial-end-btn" onClick={() => setCalling(false)}>✕ &nbsp; END CALL</button>
            ) : (
              <button className="dial-call-btn" onClick={() => dialVal && setCalling(true)}>📞 &nbsp; CALL</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
