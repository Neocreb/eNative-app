import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Contacts from './pages/Contacts'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Dialler from './pages/Dialler'

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', u.id).single()
        setProfile(data)
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', u.id).single()
        setProfile(data)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050507'}}>
      <div style={{fontFamily:'Rajdhani,sans-serif',color:'#c084fc',fontSize:'1.6rem',fontWeight:'800',letterSpacing:'0.1em'}}>eNative</div>
    </div>
  )

  const getHome = () => {
    if (!user) return <Navigate to="/login" />
    if (!profile?.full_name) return <Navigate to="/setup" />
    return <Navigate to="/contacts" />
  }

  return (
    <Routes>
      <Route path="/" element={getHome()} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/setup" element={user ? <ProfileSetup /> : <Navigate to="/login" />} />
      <Route path="/contacts" element={user ? <Contacts /> : <Navigate to="/login" />} />
      <Route path="/dialler" element={user ? <Dialler /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
