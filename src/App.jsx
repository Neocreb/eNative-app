import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Contacts from './pages/Contacts'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Dialler from './pages/Dialler'
import Profile from './pages/Profile'
import Messages from './pages/Messages'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050507'}}>
      <div style={{fontFamily:'Rajdhani,sans-serif',color:'#c084fc',fontSize:'1.6rem',fontWeight:'800',letterSpacing:'0.1em'}}>eNative</div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/contacts" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/contacts" /> : <Login />} />
      <Route path="/setup" element={user ? <ProfileSetup /> : <Navigate to="/login" />} />
      <Route path="/contacts" element={user ? <Contacts /> : <Navigate to="/login" />} />
      <Route path="/dialler" element={user ? <Dialler /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
