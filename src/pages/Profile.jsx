import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #050507; --surface: #08090d; --surface2: #0c0d12; --border: #111116; --border2: #181820; --accent: #c084fc; --accent2: #60d8fa; --accent3: #6ee7b7; --text: rgba(255,255,255,0.93); --mid: rgba(255,255,255,0.52); --dim: rgba(255,255,255,0.26); --red: #ff5f7e; }
  body { background: var(--bg); color: var(--text); font-family: 'Exo 2', sans-serif; margin: 0; }
  .app { display: flex; min-height: 100vh; }
  .main { margin-left: 68px; flex: 1; padding: 28px 32px; max-width: 860px; }
  .page-title { font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 24px; margin-bottom: 24px; }
  .profile-hero { background: var(--surface); border: 1px solid var(--border2); border-radius: 20px; padding: 32px; display: flex; align-items: center; gap: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
  .profile-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 50%, rgba(192,132,252,0.06) 0%, transparent 60%); pointer-events: none; }
  .profile-av { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #2d1060, #080318); border: 2px solid rgba(192,132,252,0.3); display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 28px; color: var(--accent); flex-shrink: 0; box-shadow: 0 0 28px rgba(192,132,252,0.15); }
  .profile-info { flex: 1; }
  .profile-name { font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.3px; margin-bottom: 6px; }
  .profile-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
  .profile-enum { font-family: 'Share Tech Mono', monospace; font-size: 13px; color: var(--accent); letter-spacing: 0.1em; }
  .profile-badge { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.14em; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(192,132,252,0.22); color: var(--accent); background: rgba(192,132,252,0.08); }
  .profile-country { font-size: 13px; color: var(--mid); }
  .profile-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .ptag { font-family: 'Share Tech Mono', monospace; font-size: 8px; letter-spacing: 0.1em; border: 1px solid rgba(110,231,183,0.2); border-radius: 20px; padding: 3px 10px; color: var(--accent3); background: rgba(110,231,183,0.05); }
  .edit-btn { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 1px; padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(192,132,252,0.22); background: rgba(192,132,252,0.07); color: var(--accent); cursor: pointer; transition: all 0.18s; white-space: nowrap; }
  .edit-btn:hover { background: rgba(192,132,252,0.14); }
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
  .stat { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; }
  .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--c); opacity: 0.7; }
  .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.18em; color: var(--dim); margin-bottom: 8px; }
  .stat-val { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 26px; color: var(--c); line-height: 1; margin-bottom: 3px; }
  .stat-sub { font-size: 11px; color: var(--dim); }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .card { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 24px; }
  .card-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .field { margin-bottom: 14px; }
  .field-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.2em; color: var(--dim); margin-bottom: 7px; }
  .field-val { font-size: 13px; color: var(--text); background: var(--surface2); border: 1px solid var(--border2); border-radius: 9px; padding: 10px 14px; }
  .field-input { width: 100%; font-size: 13px; color: var(--text); background: var(--surface2); border: 1px solid var(--border2); border-radius: 9px; padding: 10px 14px; outline: none; font-family: 'Exo 2', sans-serif; transition: border-color 0.2s; }
  .field-input:focus { border-color: rgba(192,132,252,0.35); }
  .save-btn { width: 100%; height: 44px; border-radius: 12px; border: none; background: linear-gradient(135deg, #c084fc, #9333ea); color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 1.5px; cursor: pointer; margin-top: 6px; transition: all 0.2s; }
  .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(192,132,252,0.3); }
  .badge-section { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .badge-display { display: flex; align-items: center; gap: 20px; }
  .badge-disc { width: 72px; height: 72px; border-radius: 50%; background: radial-gradient(circle at 35% 32%, #2d1060, #080318); border: 1px solid rgba(192,132,252,0.25); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; box-shadow: 0 0 24px rgba(192,132,252,0.12); animation: float 5s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .badge-info { flex: 1; }
  .badge-name { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 18px; margin-bottom: 4px; }
  .badge-desc { font-size: 12px; color: var(--mid); line-height: 1.6; margin-bottom: 10px; }
  .badge-perks { display: flex; gap: 6px; flex-wrap: wrap; }
  .perk { font-family: 'Share Tech Mono', monospace; font-size: 8px; letter-spacing: 0.1em; border: 1px solid rgba(192,132,252,0.18); border-radius: 20px; padding: 3px 10px; color: var(--accent); background: rgba(192,132,252,0.05); }
  .invite-bar { margin-top: 16px; padding: 14px 16px; background: rgba(192,132,252,0.04); border: 1px solid rgba(192,132,252,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: space-between; }
  .invite-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.1em; }
  .invite-val { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 18px; color: var(--accent); }
  .invite-btn { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 1px; padding: 7px 14px; border-radius: 9px; border: 1px solid rgba(192,132,252,0.22); background: rgba(192,132,252,0.08); color: var(--accent); cursor: pointer; }
  .activity-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .activity-row:last-child { border-bottom: none; }
  .a-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .a-text { font-size: 12px; color: var(--mid); flex: 1; }
  .a-time { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); }
`;

const STATS = [
  { label: "eNumber", val: "E-0001", sub: "Founder slot", c: "#c084fc" },
  { label: "Total Calls", val: "1,284", sub: "All time", c: "#60d8fa" },
  { label: "Contacts", val: "47", sub: "Verified", c: "#6ee7b7" },
  { label: "Member Since", val: "2024", sub: "Founding year", c: "#fcd34d" },
];

const ACTIVITY = [
  { text: "Called Amara Kone · E-0247", time: "2m ago", color: "#6ee7b7" },
  { text: "New contact added · Emeka Eze", time: "1h ago", color: "#c084fc" },
  { text: "Profile verified · KYC complete", time: "2d ago", color: "#60d8fa" },
  { text: "Invite sent · +233 XX XXX XXXX", time: "3d ago", color: "#fcd34d" },
  { text: "eNumber claimed · E-0001", time: "Jan 2024", color: "#c084fc" },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Taryl Ogle");
  const [country, setCountry] = useState("Zimbabwe 🇿🇼");
  const [bio, setBio] = useState("Building the future of African communications.");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Sidebar />
        <div className="main">
          <div className="page-title">My Profile</div>

          <div className="profile-hero">
            <div className="profile-av">TO</div>
            <div className="profile-info">
              <div className="profile-name">{name}</div>
              <div className="profile-meta">
                <span className="profile-enum">E-0001</span>
                <span className="profile-badge">FOUNDER · TIER I</span>
                <span className="profile-country">{country}</span>
              </div>
              <div className="profile-tags">
                <span className="ptag">Permanent ID</span>
                <span className="ptag">Verified</span>
                <span className="ptag">20 Invites</span>
                <span className="ptag">Priority Access</span>
              </div>
            </div>
            <button className="edit-btn" onClick={() => setEditing(!editing)}>
              {editing ? "CANCEL" : "EDIT PROFILE"}
            </button>
          </div>

          <div className="stats-row">
            {STATS.map((s, i) => (
              <div key={i} className="stat" style={{ "--c": s.c }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="badge-section">
            <div className="card-title">🏅 Badge & Identity</div>
            <div className="badge-display">
              <div className="badge-disc">🏅</div>
              <div className="badge-info">
                <div className="badge-name">Founder eNative</div>
                <div className="badge-desc">One of the first 1,000 eNative members. Permanent identity, priority support, and founding member privileges across the network.</div>
                <div className="badge-perks">
                  <span className="perk">Permanent eNumber</span>
                  <span className="perk">Priority Calls</span>
                  <span className="perk">API Access</span>
                  <span className="perk">20 Invites</span>
                </div>
              </div>
            </div>
            <div className="invite-bar">
              <div>
                <div className="invite-label">INVITES REMAINING</div>
                <div className="invite-val">7 of 20</div>
              </div>
              <button className="invite-btn">INVITE SOMEONE →</button>
            </div>
          </div>

          <div className="two-col">
            <div className="card">
              <div className="card-title">👤 Personal Info</div>
              {editing ? (
                <>
                  <div className="field">
                    <div className="field-label">FULL NAME</div>
                    <input className="field-input" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <div className="field-label">COUNTRY</div>
                    <input className="field-input" value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                  <div className="field">
                    <div className="field-label">BIO</div>
                    <input className="field-input" value={bio} onChange={e => setBio(e.target.value)} />
                  </div>
                  <button className="save-btn" onClick={() => setEditing(false)}>SAVE CHANGES</button>
                </>
              ) : (
                <>
                  <div className="field"><div className="field-label">FULL NAME</div><div className="field-val">{name}</div></div>
                  <div className="field"><div className="field-label">COUNTRY</div><div className="field-val">{country}</div></div>
                  <div className="field"><div className="field-label">EMAIL</div><div className="field-val">tarylmogle@gmail.com</div></div>
                  <div className="field"><div className="field-label">BIO</div><div className="field-val">{bio}</div></div>
                </>
              )}
            </div>
            <div className="card">
              <div className="card-title">📋 Recent Activity</div>
              {ACTIVITY.map((a, i) => (
                <div key={i} className="activity-row">
                  <div className="a-dot" style={{ background: a.color }} />
                  <div className="a-text">{a.text}</div>
                  <div className="a-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
