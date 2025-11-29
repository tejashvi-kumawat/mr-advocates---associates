import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import api from '../services/api'
import Icon from '../components/Icon'
import { useSEO } from '../hooks/useSEO'

function PracticeAreaDetail() {
  const { slug } = useParams()
  const [area, setArea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchArea()
  }, [slug])

  const fetchArea = async () => {
    try {
      const response = await api.getPracticeArea(slug)
      setArea(response.data)
    } catch (error) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  // SEO Optimization
  useSEO(area ? {
    title: `${area.title} Lawyer in Jaipur | M.R. Advocates`,
    description: `Expert ${area.title} legal services in Jaipur, Rajasthan. Our experienced lawyers provide comprehensive legal solutions for ${area.title.toLowerCase()} matters.`,
    keywords: `${area.title} lawyer Jaipur, ${area.title} advocate Rajasthan, ${area.title} legal services, best ${area.title} lawyer`,
    canonical: `https://www.mradvocates.in/practice-areas/${slug}`
  } : {
    title: 'Practice Area | M.R. Advocates Jaipur',
    description: 'Expert legal services in Jaipur, Rajasthan',
    canonical: `https://www.mradvocates.in/practice-areas/${slug}`
  })

  if (loading) return <div className="loading">Loading...</div>
  if (notFound) return <Navigate to="/practice-areas" replace />

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/practice-areas" className="card-link" style={{ display: 'inline-block', marginBottom: 'var(--spacing-md)' }}>
          ← Back to Practice Areas
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {(() => {
              // Check if icon is a Lucide icon name (string without emoji) or an emoji
              const isLucideIcon = area.icon && typeof area.icon === 'string' && !/[\u{1F300}-\u{1F9FF}]/u.test(area.icon)
              return isLucideIcon ? (
                <Icon name={area.icon} size={64} color="var(--color-accent)" />
              ) : (
                <span style={{ fontSize: '4rem' }}>{area.icon}</span>
              )
            })()}
          </div>
          <h1>{area.title}</h1>
        </div>
        
        <div style={{ lineHeight: '1.8', fontSize: 'var(--font-size-body)' }}>
          <p>{area.description}</p>
          
          {area.full_content && (
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              {area.full_content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
          <h2>Need Legal Assistance in {area.title}?</h2>
          <p>Our experienced {area.title.toLowerCase()} lawyers in Jaipur are here to help you with your legal matters. Explore our <Link to="/services" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>legal services</Link> or <Link to="/team" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>meet our expert team</Link>.</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginTop: 'var(--spacing-md)' }}>
            <Link to="/enquiry" className="btn btn-primary">Contact Us</Link>
            <Link to="/appointment" className="btn btn-secondary">Book Appointment</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PracticeAreaDetail
