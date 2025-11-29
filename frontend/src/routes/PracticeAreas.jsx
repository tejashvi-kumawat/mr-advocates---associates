import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Icon from '../components/Icon'
import { useSEO } from '../hooks/useSEO'

function PracticeAreas() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)

  // SEO Optimization
  useSEO({
    title: 'Practice Areas | Civil, Criminal, Corporate Law Jaipur',
    description: 'Expert legal services in Jaipur: civil law, criminal law, corporate law, family law, property law. Specialized lawyers for all practice areas.',
    keywords: 'practice areas Jaipur, civil lawyer, criminal lawyer, corporate lawyer, family lawyer, property lawyer Rajasthan',
    canonical: 'https://www.mradvocates.in/practice-areas'
  })

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await api.getPracticeAreas()
      setAreas(response.data)
    } catch (error) {
      console.error('Error fetching practice areas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading practice areas...</div>

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Our Legal Practice Areas in Jaipur</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          Our law firm in Jaipur provides comprehensive legal services across diverse practice areas including civil law, criminal law, corporate law, family law, and property law. Each case receives personalized attention from our experienced lawyers committed to achieving the best possible outcomes. View our <Link to="/services" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>legal services</Link> or <Link to="/team" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>meet our expert team</Link>.
        </p>
        <div className="grid grid-3">
          {areas.map((area, index) => {
            // Check if icon is a Lucide icon name (string without emoji) or an emoji
            const isLucideIcon = area.icon && typeof area.icon === 'string' && !/[\u{1F300}-\u{1F9FF}]/u.test(area.icon)
            
            return (
              <Link 
                to={`/practice-areas/${area.slug}`} 
                key={area.id} 
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <span className="card-icon">
                  {isLucideIcon ? (
                    <Icon name={area.icon} size={48} color="currentColor" />
                  ) : (
                    <span>{area.icon}</span>
                  )}
                </span>
                <h3 className="card-title">{area.title}</h3>
                <p className="card-description">{area.description}</p>
                <span className="card-link">Learn more →</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PracticeAreas
