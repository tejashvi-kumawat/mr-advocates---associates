import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Target, Users, Scale } from 'lucide-react'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'

function Careers() {
  // SEO Optimization
  useSEO({
    title: 'Legal Careers | Join Our Team | M.R. Advocates',
    description: 'Join M.R. Advocates law firm in Jaipur. Career opportunities for lawyers, associates, and legal professionals. Apply now for legal positions.',
    keywords: 'legal careers Jaipur, lawyer jobs Rajasthan, law firm careers, legal associate jobs, advocate positions',
    canonical: 'https://www.mradvocates.in/careers'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience_years: '',
    education: '',
    cover_letter: '',
    resume: null
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const positions = [
    'Senior Associate',
    'Associate',
    'Junior Associate',
    'Legal Intern',
    'Paralegal',
    'Legal Researcher'
  ]

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'resume') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
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
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.position) newErrors.position = 'Please select a position'
    if (!formData.experience_years) newErrors.experience_years = 'Experience is required'
    if (!formData.education.trim()) newErrors.education = 'Education details are required'
    if (!formData.cover_letter.trim()) newErrors.cover_letter = 'Cover letter is required'
    if (!formData.resume) newErrors.resume = 'Please upload your resume'
    
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
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })

      const result = await api.applyCareer(data)
      setSubmitStatus({ type: 'success', message: result.data.message })
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience_years: '',
        education: '',
        cover_letter: '',
        resume: null
      })
      // Reset file input
      document.getElementById('resume').value = ''
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to submit application. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Join Our Legal Team in Jaipur</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          We're always looking for talented and passionate legal professionals to join our law firm in Jaipur. If you're committed to excellence and want to make a difference in the legal field, we'd love to hear from you. Learn more about our <Link to="/about" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>firm</Link> and <Link to="/team" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>team</Link>.
        </p>

        <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div className="card">
            <div className="card-icon">
              <Target size={32} />
            </div>
            <h3 className="card-title">Professional Growth</h3>
            <p className="card-description">Continuous learning opportunities and career advancement in a supportive environment.</p>
          </div>
          <div className="card">
            <div className="card-icon">
              <Users size={32} />
            </div>
            <h3 className="card-title">Collaborative Culture</h3>
            <p className="card-description">Work with experienced advocates and contribute to high-impact legal matters.</p>
          </div>
          <div className="card">
            <div className="card-icon">
              <Scale size={32} />
            </div>
            <h3 className="card-title">Diverse Practice</h3>
            <p className="card-description">Exposure to various practice areas and complex legal challenges.</p>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Apply for Legal Positions</h2>

          {submitStatus && (
            <div className={submitStatus.type} style={{ marginBottom: 'var(--spacing-lg)' }}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--spacing-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label htmlFor="name" className="form-label required">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Your full name"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label htmlFor="phone" className="form-label required">Phone</label>
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
                <label htmlFor="position" className="form-label required">Position</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`form-select ${errors.position ? 'error' : ''}`}
                >
                  <option value="">-- Select --</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && <span className="form-error">{errors.position}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="experience_years" className="form-label required">Experience (Years)</label>
                <input
                  type="number"
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className={`form-input ${errors.experience_years ? 'error' : ''}`}
                  placeholder="0"
                />
                {errors.experience_years && <span className="form-error">{errors.experience_years}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="education" className="form-label required">Education Qualification</label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={`form-textarea ${errors.education ? 'error' : ''}`}
                rows="3"
                placeholder="B.A. LL.B., LL.M., etc. with institution names and years"
              />
              {errors.education && <span className="form-error">{errors.education}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cover_letter" className="form-label required">Cover Letter</label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleChange}
                className={`form-textarea ${errors.cover_letter ? 'error' : ''}`}
                rows="6"
                placeholder="Tell us why you want to join our firm and what makes you a great fit..."
              />
              {errors.cover_letter && <span className="form-error">{errors.cover_letter}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="resume" className="form-label required">Resume/CV (PDF, DOC, DOCX - Max 5MB)</label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className={`form-input ${errors.resume ? 'error' : ''}`}
              />
              {errors.resume && <span className="form-error">{errors.resume}</span>}
            </div>

            <button 
              type="submit" 
              className="form-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>

          <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius-lg)' }}>
            <h3>What Happens Next?</h3>
            <ol style={{ paddingLeft: 'var(--spacing-lg)', lineHeight: '1.8' }}>
              <li>We'll review your application within 5-7 business days</li>
              <li>Shortlisted candidates will be contacted for an initial screening call</li>
              <li>Selected candidates will be invited for in-person interviews</li>
              <li>Final candidates may be asked to complete a legal research assignment</li>
              <li>We'll make our decision and extend offers to successful candidates</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Careers
