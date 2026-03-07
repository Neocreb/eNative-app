import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgeIcon from '../components/BadgeIcon'

const KEYS = [
  ['1',''],['2','ABC'],['3','DEF'],
  ['4','GHI'],['5','JKL'],['6','MNO'],
  ['7','PQRS'],['8','TUV'],['9','WXYZ'],
  ['*',''],['0','+'],['#',''],
]

function useTimer(active) {
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    if (!active) { setSecs(0); return }
    const t = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [active])
  const m = String(Math.floor(secs / 60)).padStart(2,'0')
  const s = String(secs % 60).padStart(2,'0')
  return `${m}:${s}`
}

export default function Dialler() {
  const [dialVal, setDialVal] = useState('')
  const [calling, setCalling] = useState(false)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)
  const [recentCalls] = useState([
    {name:'Amara Kone',en:'E-0247',type:'outgoing',time:'2m ago',badge:'founder'},
    {name:'Zara Mensah',en:'E-1102',type:'incoming',time:'1h ago',badge:'verified'},
    {name:'Dev Patel',en:'E-2841',type:'missed',time:'3h ago',badge:'business'},
  ])
  const timer = useTimer(calling)
  const navigate = useNavigate()

  const pressKey = (k) => {
    if (calling) return
    if (k === '⌫') { setDialVal(v => v.slice(0,-1)); return }
    setDialVal(v => (v + k).slice(0,12))
  }

  const startCall = () => {
    if (!dialVal) return
    setCalling(true)
  }

  const endCall = () => {
    setCalling(false)
    setDialVal('')
    setMuted(false)
    setSpeaker(false)
  }

  const typeColor = (t) => t === 'missed' ? '#ff5f7e' : t === 'incoming' ? '#6ee7b7' : '#60d8fa'
  const typeIcon = (t) => t === 'missed' ? '↙' : t === 'incoming' ? '↙' : '↗'

  return (
    <div style={{minHeight:'100vh',background:'#050507',color:'rgba(255,255,255,0.93)',fontFamily:"'Exo 2',sans-serif",paddingBottom:'80px'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
      .key-btn{background:#0c0d12;border:1px solid #1a1a24;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;user-select:none;}
      .key-btn:active{background:#1a1a24;transform:scale(0.95);}
      .action-circle{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.2rem;transition:all 0.2s;}
      .action-circle:active{transform:scale(0.9);}
      `}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #111116',background:'#08090d'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#c084fc,#60d8fa)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'800',fontSize:'13px',color:'#fff'}}>en</div>
          <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)'}}>DIALLER</span>
        </div>
        <div onClick={() => navigate('/contacts')} style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.15em',color:'rgba(255,255,255,0.3)',cursor:'pointer',border:'1px solid #1a1a24',padding:'6px 12px',borderRadius:'20px'}}>CONTACTS</div>
      </div>

      <div style={{maxWidth:'420px',margin:'0 auto',padding:'24px 20px'}}>

        {/* Active Call Screen */}
        {calling ? (
          <div style={{textAlign:'center',padding:'32px 0'}}>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'linear-gradient(135deg,#1a0a30,#0d0520)',border:'2px solid rgba(192,132,252,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'28px',color:'#c084fc',margin:'0 auto 16px',boxShadow:'0 0 40px rgba(192,132,252,0.2)'}}>
              {dialVal.substring(0,2).toUpperCase()}
            </div>
            <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1.4rem',marginBottom:'6px'}}>{dialVal}</div>
            <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'11px',color:'#6ee7b7',letterSpacing:'0.1em',marginBottom:'8px'}}>● CONNECTED</div>
            <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'1.2rem',color:'rgba(255,255,255,0.6)',letterSpacing:'0.15em',marginBottom:'40px'}}>{timer}</div>

            {/* Call Controls */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'40px'}}>
              {[
                {icon: muted ? '🔇' : '🎙️', label: muted ? 'Unmute' : 'Mute', action: () => setMuted(!muted), active: muted},
                {icon:'⌨️',label:'Keypad',action:()=>{},active:false},
                {icon: speaker ? '🔊' : '🔈', label: speaker ? 'Speaker On' : 'Speaker', action: () => setSpeaker(!speaker), active: speaker},
              ].map(c => (
                <div key={c.label} onClick={c.action} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                  <div className="action-circle" style={{background: c.active ? 'rgba(192,132,252,0.2)' : '#0c0d12',border:`1px solid ${c.active ? 'rgba(192,132,252,0.4)' : '#1a1a24'}`}}>{c.icon}</div>
                  <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'8px',letterSpacing:'0.1em',color:'rgba(255,255,255,0.3)'}}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* End Call */}
            <div onClick={endCall} style={{width:'72px',height:'72px',borderRadius:'50%',background:'#ff5f7e',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',cursor:'pointer',fontSize:'1.6rem',boxShadow:'0 8px 32px rgba(255,95,126,0.4)',transition:'transform 0.2s'}}
              onTouchStart={e => e.currentTarget.style.transform='scale(0.92)'}
              onTouchEnd={e => e.currentTarget.style.transform='scale(1)'}>
              📵
            </div>
          </div>
        ) : (
          <>
            {/* Display */}
            <div style={{background:'#08090d',border:'1px solid #111116',borderRadius:'16px',padding:'20px 24px',marginBottom:'20px',minHeight:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              {dialVal ? (
                <>
                  <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'1.8rem',letterSpacing:'0.15em',color:'rgba(255,255,255,0.93)',marginBottom:'4px'}}>{dialVal}</div>
                  <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.25)'}}>ENUMBER</div>
                </>
              ) : (
                <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.2)'}}>ENTER ENUMBER TO CALL</div>
              )}
            </div>

            {/* Keypad */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'16px'}}>
              {KEYS.map(([num, alpha]) => (
                <div key={num} className="key-btn" style={{height:'64px'}} onClick={() => pressKey(num)}>
                  <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1.4rem',color:'rgba(255,255,255,0.93)',lineHeight:1}}>{num}</span>
                  {alpha && <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'8px',letterSpacing:'0.15em',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>{alpha}</span>}
                </div>
              ))}
            </div>

            {/* Bottom row: backspace, call, blank */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'28px'}}>
              <div/>
              <div onClick={startCall} style={{height:'64px',borderRadius:'50%',background: dialVal ? 'linear-gradient(135deg,#6ee7b7,#60d8fa)' : '#0c0d12',border:`1px solid ${dialVal ? 'transparent' : '#1a1a24'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor: dialVal ? 'pointer' : 'default',fontSize:'1.4rem',transition:'all 0.2s',boxShadow: dialVal ? '0 8px 32px rgba(110,231,183,0.3)' : 'none'}}>
                📞
              </div>
              <div className="key-btn" style={{height:'64px'}} onClick={() => pressKey('⌫')}>
                <span style={{fontSize:'1.2rem',color:'rgba(255,255,255,0.4)'}}>⌫</span>
              </div>
            </div>

            {/* Recent Calls */}
            <div style={{marginTop:'8px'}}>
              <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.25em',color:'rgba(255,255,255,0.25)',marginBottom:'12px'}}>RECENT CALLS</div>
              <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                {recentCalls.map((c,i) => (
                  <div key={i} onClick={() => setDialVal(c.en)} style={{background:'#08090d',border:'1px solid #111116',borderRadius:'12px',padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',transition:'border-color 0.2s'}}>
                    <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'linear-gradient(135deg,#1a0a30,#0d0520)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'13px',color:'#c084fc',flexShrink:0,position:'relative'}}>
                      {c.name.split(' ').map(n=>n[0]).join('')}
                      <div style={{position:'absolute',bottom:'-2px',right:'-2px'}}>
                        <BadgeIcon type={c.badge} size={10} />
                      </div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:'600',fontSize:'0.88rem',marginBottom:'2px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                      <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,0.3)',letterSpacing:'0.08em'}}>{c.en}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{color:typeColor(c.type),fontSize:'0.75rem',marginBottom:'2px'}}>{typeIcon(c.type)} {c.type}</div>
                      <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'8px',color:'rgba(255,255,255,0.2)'}}>{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#08090d',borderTop:'1px solid #111116',display:'flex',justifyContent:'space-around',padding:'12px 0 20px'}}>
        {[
          {icon:'⊞',label:'Home',path:'/dashboard'},
          {icon:'📞',label:'Dialler',path:'/dialler'},
          {icon:'👥',label:'Contacts',path:'/contacts'},
          {icon:'💬',label:'Messages',path:'/messages'},
          {icon:'👤',label:'Profile',path:'/profile'},
        ].map(n => (
          <div key={n.label} onClick={() => navigate(n.path)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',cursor:'pointer',opacity:n.path==='/dialler'?1:0.4}}>
            <span style={{fontSize:'1.1rem'}}>{n.icon}</span>
            <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'7px',letterSpacing:'0.1em',color:'rgba(255,255,255,0.5)'}}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
