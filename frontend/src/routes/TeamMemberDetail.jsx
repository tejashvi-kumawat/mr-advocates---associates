import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import api from '../services/api'

function TeamMemberDetail() {
  const { slug } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchMember()
  }, [slug])

  const fetchMember = async () => {
    try {
      const response = await api.getTeamMember(slug)
      setMember(response.data)
    } catch (error) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (notFound) return <Navigate to="/team" replace />

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/team" className="card-link" style={{ display: 'inline-block', marginBottom: 'var(--spacing-lg)' }}>
          ← Back to Team
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            margin: '0 auto var(--spacing-lg)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'var(--color-bg-light)',
            fontWeight: 'var(--font-weight-bold)',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {member.image_url ? (
              <img 
                src={member.image_url} 
                alt={member.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
              />
            ) : (
              getInitials(member.name)
            )}
          </div>
          
          <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>{member.name}</h1>
          <div style={{ 
            fontSize: 'var(--font-size-body)', 
            color: 'var(--color-accent)', 
            fontWeight: 'var(--font-weight-semibold)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 'var(--spacing-sm)'
          }}>
            {member.role.replace(/_/g, ' ')}
          </div>
          <div style={{ 
            fontSize: 'var(--font-size-body)', 
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic'
          }}>
            {member.specialization}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr', 
          gap: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div>
            <div style={{ 
              backgroundColor: 'var(--color-bg-alt)', 
              padding: 'var(--spacing-lg)', 
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-h4)' }}>Contact</h3>
              
              {member.email && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    Email
                  </div>
                  <a href={`mailto:${member.email}`} style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {member.email}
                  </a>
                </div>
              )}
              
              {member.phone && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    Phone
                  </div>
                  <a href={`tel:${member.phone}`} style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {member.phone}
                  </a>
                </div>
              )}
              
              {member.linkedin_url && (
                <div>
                  <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    LinkedIn
                  </div>
                  <a 
                    href={member.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    View Profile →
                  </a>
                </div>
              )}
            </div>

            {member.education && (
              <div style={{ 
                backgroundColor: 'var(--color-bg-alt)', 
                padding: 'var(--spacing-lg)', 
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--color-border)',
                marginTop: 'var(--spacing-md)'
              }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-h4)' }}>Education</h3>
                <p style={{ lineHeight: '1.6', fontSize: 'var(--font-size-small)', margin: 0 }}>
                  {member.education}
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>About</h2>
            <div style={{ lineHeight: '1.8', fontSize: 'var(--font-size-body)' }}>
              {member.bio.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div style={{ 
              marginTop: 'var(--spacing-xl)', 
              padding: 'var(--spacing-lg)', 
              backgroundColor: 'var(--color-bg-alt)', 
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Areas of Expertise</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                {member.specialization}
              </p>
              <Link to="/enquiry" className="btn btn-primary">
                Request Consultation
              </Link>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
          <Link to="/team" className="btn btn-secondary">
            View All Team Members
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TeamMemberDetail
