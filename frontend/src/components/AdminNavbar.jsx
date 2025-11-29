import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { User, Menu, X, LayoutDashboard, Newspaper, Scale, Users, ClipboardList, FolderOpen, Star, HelpCircle, Mail, Calendar, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function AdminNavbar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/secret-admin-portal-2024/login')
  }

  const navItems = [
    { path: '/secret-admin-portal-2024', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/secret-admin-portal-2024/news', label: 'News', icon: Newspaper },
    { path: '/secret-admin-portal-2024/practice-areas', label: 'Practice Areas', icon: Scale },
    { path: '/secret-admin-portal-2024/team', label: 'Team', icon: Users },
    { path: '/secret-admin-portal-2024/services', label: 'Services', icon: ClipboardList },
    { path: '/secret-admin-portal-2024/case-studies', label: 'Case Studies', icon: FolderOpen },
    { path: '/secret-admin-portal-2024/testimonials', label: 'Testimonials', icon: Star },
    { path: '/secret-admin-portal-2024/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/secret-admin-portal-2024/enquiries', label: 'Enquiries', icon: Mail },
    { path: '/secret-admin-portal-2024/appointments', label: 'Appointments', icon: Calendar },
    { path: '/secret-admin-portal-2024/seo', label: 'SEO', icon: Settings },
  ]

  return (
    <>
      {menuOpen && (
        <div 
          className="admin-navbar-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/secret-admin-portal-2024" className="admin-navbar-brand" onClick={() => setMenuOpen(false)}>
            Admin Panel
          </Link>
          
          <button 
            className="admin-navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className={`admin-navbar-menu ${menuOpen ? 'active' : ''}`}>
          {navItems.map(item => {
            const IconComponent = item.icon
            return (
              <NavLink 
                key={item.path}
                to={item.path} 
                end={item.end}
                className="admin-navbar-link"
                onClick={() => setMenuOpen(false)}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          
          <div className="admin-navbar-user">
            <span className="admin-navbar-user-info">
              <User size={16} /> 
              <span>{user?.username || 'Admin'}</span>
            </span>
            <button onClick={handleLogout} className="admin-navbar-logout">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}

export default AdminNavbar
