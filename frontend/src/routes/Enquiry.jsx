import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'

function Enquiry() {
  // SEO Optimization
  useSEO({
    title: 'Legal Enquiry | Contact Lawyers | M.R. Advocates',
    description: 'Submit your legal enquiry to M.R. Advocates Jaipur. Get expert legal consultation for civil, criminal, corporate, family law matters. Quick response within 24 hours.',
    keywords: 'legal enquiry Jaipur, contact lawyers, legal consultation, submit enquiry, law firm contact',
    canonical: 'https://www.mradvocates.in/enquiry'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    matter_type: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }
    if (!formData.matter_type) newErrors.matter_type = 'Please select matter type'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setSubmitStatus(null)

    try {
      const result = await api.createEnquiry(formData)
      setSubmitStatus({ type: 'success', message: result.data.message })
      setFormData({
        name: '',
        email: '',
        phone: '',
        matter_type: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to submit enquiry. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <h1 className="section-title">Submit Your Legal Enquiry</h1>
        <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          Fill out the form below and our expert lawyers in Jaipur will get back to you within 24 hours. Need immediate assistance? <Link to="/contact" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Contact us directly</Link> or explore our <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>practice areas</Link>.
        </p>

        {submitStatus && (
          <div className={submitStatus.type}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label required">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label required">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label required">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="+91 XXXXX XXXXX"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="matter_type" className="form-label required">Type of Legal Matter</label>
            <select
              id="matter_type"
              name="matter_type"
              value={formData.matter_type}
              onChange={handleChange}
              className={`form-select ${errors.matter_type ? 'error' : ''}`}
            >
              <option value="">-- Select --</option>
              <option value="civil">Civil</option>
              <option value="criminal">Criminal</option>
              <option value="corporate">Corporate</option>
              <option value="property">Property</option>
              <option value="family">Family</option>
              <option value="other">Other</option>
            </select>
            {errors.matter_type && <span className="form-error">{errors.matter_type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label required">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`form-input ${errors.subject ? 'error' : ''}`}
              placeholder="Brief subject of your enquiry"
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label required">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`form-textarea ${errors.message ? 'error' : ''}`}
              placeholder="Please provide details about your legal matter..."
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>

          <button 
            type="submit" 
            className="form-submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Enquiry'}
          </button>
        </form>

        <p style={{ marginTop: 'var(--spacing-lg)', fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          By submitting this form, you agree to our terms and privacy policy. All communications are confidential.
        </p>
      </div>
    </section>
  )
}

export default Enquiry
