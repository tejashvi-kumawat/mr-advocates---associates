import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Icon from '../components/Icon'
import { useSEO } from '../hooks/useSEO'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // SEO Optimization
  useSEO({
    title: 'Best Legal Services in Jaipur | Expert Lawyer Firm | M.R. Advocates & Associates',
    description: 'Best advocate firm in Jaipur offering comprehensive legal services: litigation, documentation, advisory, ADR, compliance. Expert lawyers including civil case expert, criminal case expert, corporate case expert, and revenue case expert.',
    keywords: 'best legal services jaipur, advocate firm services, lawyer firm services, expert legal services, civil case expert, criminal case expert, corporate case expert, revenue case expert, property case expert, family case expert, litigation expert, legal consultation expert',
    canonical: 'https://www.mradvocates.in/services'
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.getServices()
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading services...</div>

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Best Legal Services in Jaipur - Expert Lawyer Firm</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          As one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>, we provide comprehensive legal services tailored to meet your specific needs. Our <strong>expert lawyers</strong> include <strong>civil case experts</strong>, <strong>criminal case experts</strong>, <strong>corporate case experts</strong>, <strong>family case experts</strong>, <strong>property case experts</strong>, and <strong>revenue case experts</strong>. We are committed to delivering excellence in litigation, documentation, legal advisory, alternative dispute resolution (ADR), and compliance services. Explore our <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>practice areas</Link> or <Link to="/contact" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>contact us</Link> for expert legal consultation.
        </p>
        <div className="grid grid-3">
          {services.map((service, index) => {
            // Check if icon is a Lucide icon name (string without emoji) or an emoji
            const isLucideIcon = service.icon && typeof service.icon === 'string' && !/[\u{1F300}-\u{1F9FF}]/u.test(service.icon)
            
            return (
              <div key={service.id} className="card">
                <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-accent)', fontWeight: 'var(--font-weight-medium)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--spacing-xs)' }}>
                  {service.category}
                </div>
                <span className="card-icon">
                  {isLucideIcon ? (
                    <Icon name={service.icon} size={48} color="currentColor" />
                  ) : (
                    <span>{service.icon}</span>
                  )}
                </span>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services
