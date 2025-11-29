import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StarRating from '../components/StarRating'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  // SEO Optimization
  useSEO({
    title: 'Client Testimonials | Reviews | M.R. Advocates Jaipur',
    description: 'Read client testimonials and reviews about M.R. Advocates law firm in Jaipur. Real feedback from satisfied clients about our legal services.',
    keywords: 'lawyer testimonials Jaipur, client reviews, law firm reviews Rajasthan, legal services feedback',
    canonical: 'https://www.mradvocates.in/testimonials'
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await api.getTestimonials()
      setTestimonials(response.data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading testimonials...</div>

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Client Testimonials and Reviews</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          Read what our clients have to say about their experience working with our law firm in Jaipur. Our satisfied clients share their feedback about our expert legal services. View our <Link to="/case-studies" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>case studies</Link> or <Link to="/team" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>meet our lawyers</Link>.
        </p>
        {testimonials.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No testimonials available.</p>
        ) : (
          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="card">
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <StarRating rating={testimonial.rating} size={20} />
                </div>
                <p className="card-description">"{testimonial.content}"</p>
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{testimonial.client_name}</div>
                  {testimonial.client_designation && (
                    <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                      {testimonial.client_designation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials
