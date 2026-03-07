import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NAV = [
  { icon: "⊞", path: "/dashboard", label: "Dashboard" },
  { icon: "☎", path: "/dialler", label: "Calls" },
  { icon: "👥", path: "/contacts", label: "Contacts", active: true },
  { icon: "💬", path: "/messages", label: "Messages", dot: true },
  { icon: "🏅", path: "/badges", label: "Badge" },
  { icon: "⚙", path: "/settings", label: "Settings" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [avatar, setAvatar] = useState(null)
  const [initials, setInitials] = useState('EN')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, avatar_url').eq('user_id', user.id).single()
        .then(({ data }) => {
          if (data?.avatar_url) setAvatar(data.avatar_url)
          if (data?.full_name) setInitials(data.full_name.substring(0,2).toUpperCase())
        })
    })
  }, [])

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/")}>en</div>
      {NAV.map((n, i) => (
        <button
          key={i}
          className={`nav-btn${location.pathname === n.path ? " active" : ""}`}
          title={n.label}
          onClick={() => navigate(n.path)}
        >
          {n.icon}
          {n.dot && <span className="nav-dot" />}
        </button>
      ))}
      <div className="sidebar-bottom">
        <div
          className={`avatar${location.pathname === "/profile" ? " active" : ""}`}
          onClick={() => navigate("/profile")}
          title="Profile"
        >
          {avatar
            ? <img src={avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
            : initials
          }
        </div>
      </div>
    </div>
  );
}
