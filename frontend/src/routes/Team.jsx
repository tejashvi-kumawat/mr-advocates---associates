import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'
import { User, Mail, Briefcase, ArrowRight } from 'lucide-react'

function Team() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  // SEO Optimization
  useSEO({
    title: 'Best Lawyers Team in Jaipur | Expert Advocates | M.R. Advocates & Associates',
    description: 'Meet our experienced team of best lawyers and advocates in Jaipur, India. Expert legal professionals including civil case expert, criminal case expert, corporate case expert, family case expert, property case expert, and revenue case expert.',
    keywords: 'best lawyers team jaipur, expert advocates team, best lawyers in india, civil case expert, criminal case expert, corporate case expert, family case expert, property case expert, revenue case expert, top lawyer firm team, best advocate firm team',
    canonical: 'https://www.mradvocates.in/team'
  })

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const response = await api.getTeamMembers()
      setTeam(response.data || [])
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'TM'
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="team-page">
        <div className="container">
          <div className="loading">Loading team...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="team-page">
      <div className="team-bg-layer"></div>
      <section className="team-section">
        <div className="container">
          <div className="team-header">
            <h1 className="team-page-title">Best Lawyers Team in Jaipur - Expert Advocates</h1>
            <p className="team-page-subtitle">
              Our team of <strong>best lawyers</strong> and <strong>expert advocates</strong> in Jaipur brings decades of combined legal expertise, 
              dedicated to serving our clients with integrity and excellence. As one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>, we specialize across all practice areas including 
              <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}> civil case expert</Link>, 
              <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}> criminal case expert</Link>, 
              <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}> corporate case expert</Link>, 
              <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}> family case expert</Link>, 
              <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}> property case expert</Link>, and 
              <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}> revenue case expert</Link>.
            </p>
          </div>
          
          {team.length === 0 ? (
            <div className="team-empty">
              <User size={64} />
              <p>No team members found.</p>
            </div>
          ) : (
            <div className="team-grid">
              {team.map((member, index) => (
                <div 
                  key={member.id} 
                  className="team-card-wrapper"
                >
                  <Link 
                    to={`/team/${member.slug}`}
                    className="team-card"
                  >
                    <div className="team-card-image-wrapper">
                      {member.image_url ? (
                        <img 
                          src={member.image_url} 
                          alt={`${member.name} - ${member.role ? member.role.replace(/_/g, ' ') : 'Lawyer'} at M.R. Advocates Jaipur`}
                          className="team-card-image"
                        />
                      ) : (
                        <div className="team-card-avatar">
                          <span className="team-card-initials">{getInitials(member.name)}</span>
                        </div>
                      )}
                      <div className="team-card-overlay"></div>
                    </div>
                    <div className="team-card-content">
                      <h3 className="team-card-name">{member.name}</h3>
                      <div className="team-card-role">
                        <Briefcase size={16} />
                        <span>{member.role ? member.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Team Member'}</span>
                      </div>
                      {member.specialization && (
                        <div className="team-card-specialization">{member.specialization}</div>
                      )}
                      {member.bio && (
                        <p className="team-card-bio">{member.bio.substring(0, 120)}...</p>
                      )}
                      {member.email && (
                        <div className="team-card-email">
                          <Mail size={14} />
                          <span>{member.email}</span>
                        </div>
                      )}
                      <div className="team-card-link">
                        View Profile
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <div className="team-card-shine"></div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Team
