import React, { useState, useEffect } from 'react'
import api from '../services/api'
import Icon from '../components/Icon'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

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
        <h1 className="section-title">Our Services</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          We provide comprehensive legal services tailored to meet your specific needs. Our experienced advocates are committed to delivering excellence in every matter we handle.
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
