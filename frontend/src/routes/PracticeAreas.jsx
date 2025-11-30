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
    title: 'Expert Practice Areas | Civil Case Expert | Revenue Case Expert | Best Advocates Jaipur | M.R. Advocates & Associates',
    description: 'Best advocate firm in Jaipur offering expert legal services: civil case expert, criminal case expert, corporate case expert, family case expert, property case expert, revenue case expert. Top lawyers in India.',
    keywords: 'civil case expert, revenue case expert, criminal case expert, property case expert, corporate case expert, family case expert, practice areas jaipur, best advocates jaipur, expert lawyers, top lawyer firm, best law firm india',
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
        <h1 className="section-title">Expert Practice Areas - Best Advocates in Jaipur</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          As one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>, we provide comprehensive legal services across diverse practice areas. Our <strong>expert lawyers</strong> include <strong>civil case experts</strong>, <strong>criminal case experts</strong>, <strong>corporate case experts</strong>, <strong>family case experts</strong>, <strong>property case experts</strong>, and <strong>revenue case experts</strong>. Each case receives personalized attention from our experienced lawyers committed to achieving the best possible outcomes. View our <Link to="/services" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>legal services</Link> or <Link to="/team" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>meet our expert team</Link>.
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
