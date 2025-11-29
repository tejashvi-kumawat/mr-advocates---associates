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
    title: 'Legal Services in Jaipur | M.R. Advocates',
    description: 'Comprehensive legal services in Jaipur: litigation, documentation, advisory, ADR, compliance. Expert lawyers for all your legal needs.',
    keywords: 'legal services Jaipur, litigation services, legal documentation, legal advisory, ADR services, compliance services Rajasthan',
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
        <h1 className="section-title">Our Legal Services in Jaipur</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          We provide comprehensive legal services in Jaipur tailored to meet your specific needs. Our experienced lawyers and advocates are committed to delivering excellence in litigation, documentation, legal advisory, alternative dispute resolution (ADR), and compliance services. Explore our <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>practice areas</Link> or <Link to="/contact" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>contact us</Link> for expert legal consultation.
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
