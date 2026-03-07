import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #050507; --surface: #08090d; --surface2: #0c0d12; --border: #111116; --border2: #181820; --accent: #c084fc; --accent2: #60d8fa; --accent3: #6ee7b7; --text: rgba(255,255,255,0.93); --mid: rgba(255,255,255,0.52); --dim: rgba(255,255,255,0.26); --red: #ff5f7e; }
  body { background: var(--bg); color: var(--text); font-family: 'Exo 2', sans-serif; margin: 0; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 68px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 22px 0; gap: 4px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #c084fc, #60d8fa); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 16px; color: #fff; }
  .nav-btn { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; background: transparent; color: var(--dim); font-size: 17px; transition: all 0.18s; }
  .nav-btn:hover { background: var(--surface2); color: var(--mid); }
  .nav-btn.active { background: rgba(192,132,252,0.1); color: var(--accent); }
  .sidebar-bottom { margin-top: auto; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #1a0a30, #0d0520); border: 1.5px solid rgba(192,132,252,0.25); display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; color: var(--accent); }
  .main { margin-left: 68px; flex: 1; display: flex; flex-direction: column; max-width: 480px; margin-right: auto; padding: 28px 20px; }
  .tabs { display: flex; gap: 4px; margin-bottom: 28px; background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 4px; }
  .tab { flex: 1; padding: 10px 0; border-radius: 10px; border: none; background: transparent; color: var(--dim); font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .tab.on { background: rgba(192,132,252,0.12); color: var(--accent); }
  .dial-display { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 22px; margin-bottom: 20px; text-align: center; min-height: 76px; display: flex; flex-direction: column; justify-content: center; }
  .dial-number { font-family: 'Share Tech Mono', monospace; font-size: 26px; letter-spacing: 0.1em; color: var(--text); min-height: 32px; }
  .dial-sublabel { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--dim); letter-spacing: 0.15em; margin-top: 5px; }
  .keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
  .key { height: 62px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border2); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; gap: 2px; }
  .key:active { transform: scale(0.93); background: rgba(192,132,252,0.15); }
  .key-num { font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 700; color: var(--text); }
  .key-alpha { font-family: 'Share Tech Mono', monospace; font-size: 8px; letter-spacing: 0.12em; color: var(--dim); }
  .key-special { background: transparent; border-color: transparent; }
  .call-btn { width: 100%; height: 58px; border-radius: 16px; border: none; background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 20px rgba(34,197,94,0.3); transition: all 0.2s; margin-bottom: 10px; }
  .call-btn:active { transform: scale(0.97); }
  .end-btn { width: 100%; height: 48px; border-radius: 14px; border: 1px solid rgba(255,95,126,0.2); background: rgba(255,95,126,0.06); color: var(--red); font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
  .incall { text-align: center; padding: 16px 0 24px; }
  .incall-av { width: 80px; height: 80px; border-radius: 50%; background: rgba(192,132,252,0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 14px; animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 6px rgba(192,132,252,0.08)} 50%{box-shadow:0 0 0 14px rgba(192,132,252,0.04)} }
  .incall-num { font-family: 'Share Tech Mono', monospace; font-size: 20px; color: var(--text); margin-bottom: 6px; }
  .incall-timer { font-family: 'Share Tech Mono', monospace; font-size: 36px; color: var(--accent3); margin-bottom: 8px; }
  .incall-ai { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--accent); letter-spacing: 0.2em; opacity: 0.7; animation: blink 1.5s infinite; margin-bottom: 20px; }
  @keyframes blink { 0%,100%{opacity:0.7} 50%{opacity:0.2} }
  .wave { display: flex; align-items: center; justify-content: center; gap: 3px; height: 32px; margin-bottom: 24px; }
  .wbar { width: 4px; border-radius: 2px; background: var(--accent); }
  .recent-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; margin-bottom: 8px; background: var(--surface); border: 1px solid transparent; cursor: pointer; transition: all 0.15s; }
  .recent-item:active { border-color: var(--border2); background: var(--surface2); }
  .r-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .r-info { flex: 1; }
  .r-type { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .r-time { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.06em; }
  .r-dur { font-family: 'Share Tech Mono', monospace; font-size: 12px; color: var(--mid); }
  .r-call { width: 36px; height: 36px; border-radius: 10px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; flex-shrink: 0; }
  .contact-item { display: flex; align-items: center; gap: 13px; padding: 12px 16px; border-radius: 14px; margin-bottom: 8px; background: var(--surface); cursor: pointer; transition: all 0.15s; }
  .contact-item:active { background: var(--surface2); }
  .c-av { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; flex-shrink: 0; position: relative; }
  .c-dot { position: absolute; bottom: 1px; right: 1px; width: 9px; height: 9px; border-radius: 50%; background: var(--accent3); border: 2px solid var(--surface); }
  .c-info { flex: 1; }
  .c-name { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .c-enum { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.06em; }
  .c-call { width: 36px; height: 36px; border-radius: 10px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; flex-shrink: 0; }
  .search-wrap { position: relative; margin-bottom: 16px; }
  .search-input { width: 100%; background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; padding: 11px 14px 11px 38px; font-family: 'Exo 2', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: rgba(192,132,252,0.3); }
  .search-input::placeholder { color: var(--dim); }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--dim); }
  .section-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.25em; color: var(--dim); margin-bottom: 12px; text-transform: uppercase; }
`;

const NAV = [
  { icon: "⊞", path: "/" },
  { icon: "📞", path: "/dialler" },
  { icon: "👥", path: "/contacts" },
  { icon: "💬", path: "#" },
  { icon: "🏅", path: "#" },
  { icon: "⚙", path: "#" },
];

const KEYS = [
  ["1",""],["2","ABC"],["3","DEF"],
  ["4","GHI"],["5","JKL"],["6","MNO"],
  ["7","PQRS"],["8","TUV"],["9","WXYZ"],
  ["*",""],["0","+"],["#",""],
];

const RECENTS = [
  { type: "Outgoing", num: "E-0247", name: "Amara Kone",     time: "Today, 2:14 PM",    dur: "4:32",  icon: "↗", color: "#6ee7b7", bg: "rgba(110,231,183,0.1)" },
  { type: "Incoming", num: "E-1089", name: "Chidi Okafor",   time: "Today, 10:48 AM",   dur: "12:07", icon: "↙", color: "#60d8fa", bg: "rgba(96,216,250,0.1)"  },
  { type: "Missed",   num: "E-2341", name: "Kwame Asante",   time: "Yesterday, 6:20 PM",dur: "—",     icon: "✕", color: "#ff5f7e", bg: "rgba(255,95,126,0.1)"  },
  { type: "Outgoing", num: "E-0553", name: "Naledi Mokoena", time: "Monday, 9:05 AM",   dur: "28:14", icon: "↗", color: "#6ee7b7", bg: "rgba(110,231,183,0.1)" },
  { type: "Incoming", num: "E-0871", name: "Fatima Diallo",  time: "Sunday, 4:33 PM",   dur: "7:50",  icon: "↙", color: "#60d8fa", bg: "rgba(96,216,250,0.1)"  },
  { type: "Missed",   num: "E-1432", name: "Emeka Eze",      time: "Saturday, 1:10 PM", dur: "—",     icon: "✕", color: "#ff5f7e", bg: "rgba(255,95,126,0.1)"  },
];

const CONTACTS = [
  { name: "Amara Kone",     en: "E-0247", color: "#c084fc", bg: "rgba(192,132,252,0.12)", online: true  },
  { name: "Chidi Okafor",   en: "E-1089", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", online: true  },
  { name: "Emeka Eze",      en: "E-1432", color: "#60d8fa", bg: "rgba(96,216,250,0.12)",  online: true  },
  { name: "Fatima Diallo",  en: "E-0871", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", online: false },
  { name: "Kwame Asante",   en: "E-2341", color: "#fcd34d", bg: "rgba(252,211,77,0.12)",  online: true  },
  { name: "Naledi Mokoena", en: "E-0553", color: "#c084fc", bg: "rgba(192,132,252,0.12)", online: false },
];

export default function Dialler() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("keypad");
  const [dialVal, setDialVal] = useState("");
  const [calling, setCalling] = useState(false);
  const [callingName, setCallingName] = useState("");
  const [timer, setTimer] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!calling) { setTimer(0); return; }
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [calling]);

  const pressKey = (k) => {
    if (k === "⌫") { setDialVal(v => v.slice(0, -1)); return; }
    setDialVal(v => (v + k).slice(0, 12));
  };

  const startCall = (num, name = "") => {
    setDialVal(num);
    setCallingName(name);
    setCalling(true);
    setTab("keypad");
  };

  const m = String(Math.floor(timer / 60)).padStart(2, "0");
  const s = String(timer % 60).padStart(2, "0");

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.en.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">en</div>
          {NAV.map((n, i) => (
            <button key={i}
              className={`nav-btn${n.path === "/dialler" ? " active" : ""}`}
              onClick={() => n.path !== "#" && navigate(n.path)}>
              {n.icon}
            </button>
          ))}
          <div className="sidebar-bottom"><div className="avatar">TO</div></div>
        </div>

        <div className="main">
          <div className="tabs">
            <button className={`tab${tab === "keypad" ? " on" : ""}`} onClick={() => setTab("keypad")}>⌨️ Keypad</button>
            <button className={`tab${tab === "recents" ? " on" : ""}`} onClick={() => setTab("recents")}>🕐 Recents</button>
            <button className={`tab${tab === "contacts" ? " on" : ""}`} onClick={() => setTab("contacts")}>👥 Contacts</button>
          </div>

          {tab === "keypad" && (
            <>
              {calling ? (
                <div className="incall">
                  <div className="incall-av">📞</div>
                  <div className="incall-num">{callingName || dialVal}</div>
                  <div className="incall-timer">{m}:{s}</div>
                  <div className="incall-ai">● NVIDIA RIVA · AI ACTIVE</div>
                  <div className="wave">
                    {Array(20).fill(0).map((_, i) => (
                      <div key={i} className="wbar" style={{
                        height: Math.floor(Math.random() * 24) + 8,
                        animation: `waveAnim 0.8s ${(i*0.06).toFixed(2)}s ease-in-out infinite alternate`
                      }} />
                    ))}
                    <style>{`@keyframes waveAnim{from{transform:scaleY(0.3);opacity:0.5}to{transform:scaleY(1);opacity:1}}`}</style>
                  </div>
                  <button className="end-btn" onClick={() => setCalling(false)}>✕ &nbsp; END CALL</button>
                </div>
              ) : (
                <>
                  <div className="dial-display">
                    <div className="dial-number">{dialVal || ""}</div>
                    <div className="dial-sublabel">{dialVal ? "eNumber ready" : "Enter an eNumber to call"}</div>
                  </div>
                  <div className="keypad">
                    {KEYS.map(([num, alpha], i) => (
                      <div key={i} className="key" onClick={() => pressKey(num)}>
                        <span className="key-num">{num}</span>
                        {alpha && <span className="key-alpha">{alpha}</span>}
                      </div>
                    ))}
                    <div className="key key-special" />
                    <div className="key key-special" onClick={() => pressKey("⌫")}>
                      <span style={{ color: "var(--mid)", fontSize: 22 }}>⌫</span>
                    </div>
                  </div>
                  <button className="call-btn" onClick={() => dialVal && startCall(dialVal)}>📞 &nbsp; CALL</button>
                </>
              )}
            </>
          )}

          {tab === "recents" && (
            <>
              <div className="section-label">Recent Calls</div>
              {RECENTS.map((r, i) => (
                <div key={i} className="recent-item">
                  <div className="r-icon" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
                  <div className="r-info">
                    <div className="r-type" style={{ color: r.color }}>{r.type} · {r.name}</div>
                    <div className="r-time">{r.num} · {r.time}</div>
                  </div>
                  <div className="r-dur">{r.dur}</div>
                  <div className="r-call" onClick={() => startCall(r.num, r.name)}>📞</div>
                </div>
              ))}
            </>
          )}

          {tab === "contacts" && (
            <>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Search contacts..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="section-label">{filteredContacts.length} Contacts</div>
              {filteredContacts.map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="c-av" style={{ background: c.bg, color: c.color }}>
                    {c.name.split(" ").map(n => n[0]).join("")}
                    {c.online && <div className="c-dot" />}
                  </div>
                  <div className="c-info">
                    <div className="c-name">{c.name}</div>
                    <div className="c-enum">{c.en}</div>
                  </div>
                  <div className="c-call" onClick={() => startCall(c.en, c.name)}>📞</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
