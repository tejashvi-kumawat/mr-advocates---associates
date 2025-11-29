import React, { useState, useEffect } from 'react'
import StarRating from '../components/StarRating'
import api from '../services/api'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

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
        <h1 className="section-title">Client Testimonials</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          Read what our clients have to say about their experience working with us.
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
