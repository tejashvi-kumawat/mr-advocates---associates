import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import api from '../services/api'

function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    matter_type: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

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
    if (!formData.preferred_date) newErrors.preferred_date = 'Please select a date'
    if (!formData.preferred_time) newErrors.preferred_time = 'Please select a time'
    
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
      const result = await api.createAppointment(formData)
      setSubmitStatus({ type: 'success', message: result.data.message })
      setFormData({
        name: '',
        email: '',
        phone: '',
        matter_type: '',
        preferred_date: '',
        preferred_time: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to book appointment. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <h1 className="section-title">Book an Appointment</h1>
        <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          Schedule a consultation with our experienced advocates. We'll confirm your appointment within 24 hours.
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
            <div className="form-group">
              <label htmlFor="preferred_date" className="form-label required">Preferred Date</label>
              <input
                type="date"
                id="preferred_date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                min={minDate}
                className={`form-input ${errors.preferred_date ? 'error' : ''}`}
              />
              {errors.preferred_date && <span className="form-error">{errors.preferred_date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="preferred_time" className="form-label required">Preferred Time</label>
              <select
                id="preferred_time"
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                className={`form-select ${errors.preferred_time ? 'error' : ''}`}
              >
                <option value="">-- Select --</option>
                <option value="10:00:00">10:00 AM</option>
                <option value="10:30:00">10:30 AM</option>
                <option value="11:00:00">11:00 AM</option>
                <option value="11:30:00">11:30 AM</option>
                <option value="12:00:00">12:00 PM</option>
                <option value="14:00:00">2:00 PM</option>
                <option value="14:30:00">2:30 PM</option>
                <option value="15:00:00">3:00 PM</option>
                <option value="15:30:00">3:30 PM</option>
                <option value="16:00:00">4:00 PM</option>
                <option value="16:30:00">4:30 PM</option>
                <option value="17:00:00">5:00 PM</option>
              </select>
              {errors.preferred_time && <span className="form-error">{errors.preferred_time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Additional Information (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Any specific details about your case or questions you'd like to discuss..."
            />
          </div>

          <button 
            type="submit" 
            className="form-submit"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius)', fontSize: 'var(--font-size-small)' }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <FileText size={16} /> Note:
          </strong>
          <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: 'var(--spacing-lg)' }}>
            <li>Appointments are subject to advocate availability</li>
            <li>We'll send a confirmation email within 24 hours</li>
            <li>For urgent matters, please call us directly</li>
            <li>Working hours: Monday-Friday (10 AM - 6 PM), Saturday (10 AM - 2 PM)</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Appointment
