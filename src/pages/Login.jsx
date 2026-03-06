import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #050507; --surface: #08090d; --border2: #1c1c24;
    --accent: #c084fc; --accent2: #60d8fa; --accent3: #6ee7b7;
    --text: rgba(255,255,255,0.93); --mid: rgba(255,255,255,0.52);
    --dim: rgba(255,255,255,0.26); --error: #ff5f7e;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Exo 2', sans-serif; min-height: 100vh; overflow: hidden; }
  canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .layout { position: relative; z-index: 10; min-height: 100vh; display: grid; grid-template-columns: 1fr 460px; }
  .brand { display: flex; flex-direction: column; justify-content: center; padding: 72px 64px; position: relative; }
  .brand::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent 0%, rgba(192,132,252,0.15) 35%, rgba(192,132,252,0.15) 65%, transparent 100%); }
  .brand-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 52px; }
  .brand-wordmark { font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.3px; }
  .brand-headline { font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: clamp(38px, 3.8vw, 58px); line-height: 1.08; letter-spacing: -0.5px; margin-bottom: 22px; }
  .brand-headline em { font-style: normal; background: linear-gradient(135deg, #c084fc, #60d8fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .brand-body { font-size: 14px; color: var(--mid); line-height: 1.75; max-width: 380px; margin-bottom: 44px; }
  .brand-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 52px; }
  .tag { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.16em; border-radius: 20px; padding: 5px 14px; border: 1px solid; }
  .tag-purple { color: var(--accent); border-color: rgba(192,132,252,0.22); background: rgba(192,132,252,0.06); }
  .tag-cyan { color: var(--accent2); border-color: rgba(96,216,250,0.22); background: rgba(96,216,250,0.06); }
  .tag-green { color: var(--accent3); border-color: rgba(110,231,183,0.22); background: rgba(110,231,183,0.06); }
  .nations-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.28em; color: var(--dim); margin-bottom: 12px; }
  .flags { display: flex; gap: 10px; font-size: 21px; }
  .auth { display: flex; align-items: center; justify-content: center; padding: 48px 56px; background: rgba(8,9,13,0.75); backdrop-filter: blur(28px); }
  .auth-inner { width: 100%; max-width: 348px; }
  .auth-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .auth-wordmark { font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 22px; }
  .auth-heading { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 30px; letter-spacing: -0.3px; margin-bottom: 6px; }
  .auth-sub { font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.18em; color: var(--dim); margin-bottom: 34px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.24em; color: var(--dim); text-transform: uppercase; margin-bottom: 9px; }
  .field input { width: 100%; background: rgba(255,255,255,0.028); border: 1px solid var(--border2); border-radius: 9px; padding: 13px 16px; color: var(--text); font-family: 'Exo 2', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .field input:focus { border-color: rgba(192,132,252,0.45); box-shadow: 0 0 0 3px rgba(192,132,252,0.07); }
  .field input::placeholder { color: var(--dim); }
  .field input.err { border-color: rgba(255,95,126,0.5); }
  .err-msg { font-size: 11px; color: var(--error); margin-top: 6px; }
  .forgot { display: block; text-align: right; font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); cursor: pointer; margin: -8px 0 26px; transition: color 0.2s; }
  .forgot:hover { color: var(--accent2); }
  .submit-btn { width: 100%; padding: 14px 0; border: none; border-radius: 9px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; background: linear-gradient(135deg, #c084fc 0%, #9333ea 100%); color: #fff; box-shadow: 0 4px 28px rgba(192,132,252,0.28); transition: all 0.2s; }
  .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 36px rgba(192,132,252,0.4); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: spin 0.65s linear infinite; vertical-align: middle; margin-right: 9px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 0.2em; color: var(--dim); }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border2); }
  .toggle { text-align: center; font-size: 12px; color: var(--dim); }
  .toggle span { color: var(--accent2); cursor: pointer; font-weight: 500; }
  .success { text-align: center; padding: 12px 0; }
  .success-ring { width: 64px; height: 64px; border-radius: 50%; border: 1.5px solid var(--accent3); background: rgba(110,231,183,0.07); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; font-size: 28px; }
  .success-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 24px; margin-bottom: 8px; }
  .success-sub { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--dim); letter-spacing: 0.12em; line-height: 1.7; }
`;

function MarkE({ size = 40, color = "#c084fc" }) {
  const c = size / 2, r = size * 0.37, sw = size * 0.082;
  const toRad = d => (d * Math.PI) / 180;
  const x1 = c + r * Math.cos(toRad(-30)), y1 = c + r * Math.sin(toRad(-30));
  const x2 = c + r * Math.cos(toRad(210)), y2 = c + r * Math.sin(toRad(210));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ flexShrink: 0 }}>
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <line x1={c - r} y1={c} x2={c + r * 0.42} y2={c} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function BgCanvas() {
  useEffect(() => {
    const cv = document.getElementById("en-bg");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let raf, t = 0;
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      [[cv.width * 0.28, cv.height * 0.42, 360, "rgba(192,132,252,0.055)"],
       [cv.width * 0.72, cv.height * 0.58, 280, "rgba(96,216,250,0.04)"],
      ].forEach(([x, y, r, col]) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, col); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = "rgba(255,255,255,0.016)"; ctx.lineWidth = 1;
      for (let x = 0; x < cv.width; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,cv.height); ctx.stroke(); }
      for (let y = 0; y < cv.height; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(cv.width,y); ctx.stroke(); }
      t += 0.009; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas id="en-bg" />;
}

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!pass || pass.length < 6) e.pass = "Password must be 6+ characters";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  return (
    <>
      <style>{css}</style>
      <BgCanvas />
      <div className="layout">
        <div className="brand">
          <div className="brand-logo">
            <MarkE size={38} color="#c084fc" />
            <span className="brand-wordmark">eNative</span>
          </div>
          <div className="brand-headline">Your number.<br />Your identity.<br /><em>Forever.</em></div>
          <div className="brand-body">eNative gives students and young professionals across Africa a permanent eNumber — verified, spam-free, and carrier-independent.</div>
          <div className="brand-tags">
            <span className="tag tag-purple">Permanent eNumber</span>
            <span className="tag tag-green">AI Call Quality</span>
            <span className="tag tag-cyan">Verified Identity</span>
            <span className="tag tag-purple">No SIM Required</span>
            <span className="tag tag-green">54 African Nations</span>
          </div>
          <div><div className="nations-label">Live across Africa</div><div className="flags">🇳🇬 🇰🇪 🇬🇭 🇿🇦 🇪🇹 🇺🇬 🇹🇿 🇸🇳 🇨🇮 🇷🇼</div></div>
        </div>
        <div className="auth">
          <div className="auth-inner">
            <div className="auth-logo"><MarkE size={32} color="#c084fc" /><span className="auth-wordmark">eNative</span></div>
            {success ? (
              <div className="success">
                <div className="success-ring">✓</div>
                <div className="success-title">{mode === "login" ? "Welcome back." : "Welcome to eNative."}</div>
                <div className="success-sub">Redirecting to your dashboard...</div>
              </div>
            ) : (
              <>
                <div className="auth-heading">{mode === "login" ? "Sign in" : "Get started"}</div>
                <div className="auth-sub">{mode === "login" ? "Welcome back to eNative" : "Create your account · Claim your eNumber"}</div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className={errors.email ? "err" : ""} />
                  {errors.email && <div className="err-msg">{errors.email}</div>}
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} className={errors.pass ? "err" : ""} />
                  {errors.pass && <div className="err-msg">{errors.pass}</div>}
                </div>
                {mode === "login" && <span className="forgot">Forgot password?</span>}
                <button className="submit-btn" onClick={submit} disabled={loading}>
                  {loading && <span className="spinner" />}
                  {loading ? "Authenticating..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                </button>
                <div className="divider">or</div>
                <div className="toggle">
                  {mode === "login" ? <>No account? <span onClick={() => setMode("signup")}>Sign up free</span></> : <>Have an account? <span onClick={() => setMode("login")}>Sign in</span></>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
