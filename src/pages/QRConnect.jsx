import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../lib/supabase'
import BadgeIcon from '../components/BadgeIcon'

export default function QRConnect() {
  const [tab, setTab] = useState('my')
  const [profile, setProfile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scannedContact, setScannedContact] = useState(null)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const scannerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('*').eq('user_id', user.id).single()
        .then(({ data }) => setProfile(data))
    })
    return () => stopScanner()
  }, [])

  const startScanner = async () => {
    setError('')
    setScannedContact(null)
    setAdded(false)
    setScanning(true)
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (text) => {
            await stopScanner()
            try {
              const data = JSON.parse(text)
              if (data.enative) {
                const { data: contact } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('enumber', data.enumber)
                  .single()
                setScannedContact(contact || data)
              }
            } catch {
              setError('Invalid eNative QR code')
              setScanning(false)
            }
          },
          () => {}
        )
      } catch (err) {
        setError('Camera access denied. Please allow camera.')
        setScanning(false)
      }
    }, 300)
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch {}
      scannerRef.current = null
    }
    setScanning(false)
  }

  const addContact = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('contacts').insert({
      user_id: user.id,
      contact_enumber: scannedContact.enumber,
      contact_name: scannedContact.full_name,
    })
    setAdded(true)
  }

  const qrData = profile ? JSON.stringify({
    enative: true,
    enumber: profile.enumber,
    name: profile.full_name,
    badge: 'founder'
  }) : ''

  return (
    <div style={{minHeight:'100vh',background:'#050507',color:'rgba(255,255,255,0.93)',fontFamily:"'Exo 2',sans-serif",paddingBottom:'90px'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');`}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #111116',background:'#08090d'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div onClick={() => navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'8px',background:'#0c0d12',border:'1px solid #1a1a24',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>←</div>
          <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)'}}>QR CONNECT</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',margin:'20px 20px 0',background:'#08090d',borderRadius:'12px',border:'1px solid #111116',padding:'4px'}}>
        {[{id:'my',label:'MY QR CODE'},{id:'scan',label:'SCAN'}].map(t => (
          <div key={t.id} onClick={() => { setTab(t.id); if(t.id!=='scan') stopScanner() }} style={{flex:1,padding:'10px',textAlign:'center',borderRadius:'10px',cursor:'pointer',background: tab===t.id ? 'linear-gradient(135deg,rgba(192,132,252,0.2),rgba(96,216,250,0.1))' : 'transparent',border: tab===t.id ? '1px solid rgba(192,132,252,0.25)' : '1px solid transparent',fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.15em',color: tab===t.id ? '#c084fc' : 'rgba(255,255,255,0.3)',transition:'all 0.2s'}}>
            {t.label}
          </div>
        ))}
      </div>

      <div style={{maxWidth:'420px',margin:'0 auto',padding:'24px 20px'}}>

        {tab === 'my' && profile && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            {/* QR Card */}
            <div style={{background:'#08090d',border:'1px solid rgba(192,132,252,0.2)',borderRadius:'20px',padding:'28px 24px',width:'100%',display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'20px'}}>
              <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.25)',marginBottom:'20px'}}>SCAN TO CONNECT WITH ME</div>
              <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'20px'}}>
                <QRCodeSVG value={qrData} size={180} bgColor="#ffffff" fgColor="#050507" level="H"/>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <BadgeIcon type="founder" size={14}/>
                <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'11px',color:'#c084fc',letterSpacing:'0.1em'}}>{profile.enumber}</span>
              </div>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1.1rem',color:'rgba(255,255,255,0.9)'}}>{profile.full_name}</div>
            </div>
            <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.15em',color:'rgba(255,255,255,0.2)',textAlign:'center',lineHeight:'1.8'}}>
              Share this QR code with anyone.<br/>They scan it to instantly add you as a contact.
            </div>
          </div>
        )}

        {tab === 'scan' && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            {!scannedContact && (
              <>
                <div id="qr-reader" style={{width:'100%',borderRadius:'16px',overflow:'hidden',marginBottom:'16px',display: scanning ? 'block' : 'none'}}/>
                {!scanning && (
                  <div style={{width:'100%',background:'#08090d',border:'1px solid #111116',borderRadius:'20px',padding:'40px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',marginBottom:'16px'}}>
                    <div style={{fontSize:'3rem'}}>📷</div>
                    <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.25)',textAlign:'center'}}>POINT YOUR CAMERA AT<br/>AN ENATIVE QR CODE</div>
                  </div>
                )}
                {error && <div style={{color:'#ff5f7e',fontFamily:'Share Tech Mono,monospace',fontSize:'10px',marginBottom:'12px',textAlign:'center'}}>{error}</div>}
                <button onClick={scanning ? stopScanner : startScanner} style={{width:'100%',padding:'15px',background: scanning ? 'transparent' : 'linear-gradient(135deg,#c084fc,#60d8fa)',border: scanning ? '1px solid #ff5f7e' : 'none',borderRadius:'12px',color: scanning ? '#ff5f7e' : '#050507',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1rem',letterSpacing:'0.08em',cursor:'pointer'}}>
                  {scanning ? 'STOP SCANNING' : 'START SCANNING'}
                </button>
              </>
            )}

            {scannedContact && (
              <div style={{width:'100%',background:'#08090d',border:'1px solid rgba(192,132,252,0.2)',borderRadius:'20px',padding:'24px',display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}>
                <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.2em',color:'#6ee7b7'}}>✓ ENATIVE USER FOUND</div>
                <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'linear-gradient(135deg,#1a0a30,#0d0520)',border:'2px solid rgba(192,132,252,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'22px',color:'#c084fc'}}>
                  {scannedContact.full_name?.substring(0,2).toUpperCase()}
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1.2rem',marginBottom:'4px'}}>{scannedContact.full_name}</div>
                  <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',color:'#c084fc',letterSpacing:'0.1em'}}>{scannedContact.enumber}</div>
                </div>
                {!added ? (
                  <button onClick={addContact} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#c084fc,#60d8fa)',border:'none',borderRadius:'12px',color:'#050507',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1rem',cursor:'pointer'}}>
                    ADD TO CONTACTS
                  </button>
                ) : (
                  <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',color:'#6ee7b7',letterSpacing:'0.1em'}}>✓ CONTACT ADDED!</div>
                )}
                <div onClick={() => { setScannedContact(null); setAdded(false) }} style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,0.3)',cursor:'pointer',letterSpacing:'0.1em'}}>SCAN ANOTHER</div>
              </div>
            )}
          </div>
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
          <div key={n.label} onClick={() => navigate(n.path)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',cursor:'pointer',opacity:0.4}}>
            <span style={{fontSize:'1.1rem'}}>{n.icon}</span>
            <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'7px',letterSpacing:'0.1em',color:'rgba(255,255,255,0.5)'}}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
