import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function AdminTeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    role: 'associate',
    specialization: '',
    bio: '',
    education: '',
    email: '',
    phone: '',
    linkedin_url: '',
    order: 0,
    is_active: true,
    image: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const roles = [
    { value: 'founding_partner', label: 'Founding Partner' },
    { value: 'senior_partner', label: 'Senior Partner' },
    { value: 'partner', label: 'Partner' },
    { value: 'senior_associate', label: 'Senior Associate' },
    { value: 'associate', label: 'Associate' },
    { value: 'junior_associate', label: 'Junior Associate' }
  ]

  useEffect(() => {
    if (isEdit) {
      fetchMember()
    }
  }, [id])

  const fetchMember = async () => {
    try {
      const response = await api.getAdminTeamById(id)
      const member = response.data
      setFormData({
        name: member.name,
        role: member.role,
        specialization: member.specialization,
        bio: member.bio,
        education: member.education || '',
        email: member.email || '',
        phone: member.phone || '',
        linkedin_url: member.linkedin_url || '',
        order: member.order,
        is_active: member.is_active,
        image: null
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key])
        }
      })

      if (isEdit) {
        await api.updateAdminTeam(id, data)
      } else {
        await api.createAdminTeam(data)
      }

      navigate('/secret-admin-portal-2024/team')
    } catch (err) {
      // Better error handling
      if (err.message && err.message.includes('Session expired')) {
        setError('Your session has expired. Please login again.')
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please check if you are logged in as an admin user.')
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to perform this action.')
      } else {
        setError(err.message || 'Failed to save team member. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="admin-header">
          <h1>{isEdit ? 'Edit Team Member' : 'Add New Team Member'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label required">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label required">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialization" className="form-label required">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Civil Litigation, Criminal Defense"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Professional Details</h3>
            <div className="form-group">
              <label htmlFor="bio" className="form-label required">Biography</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
                placeholder="Write a brief biography about the team member..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="education" className="form-label">Education</label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="Educational qualifications and certifications"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="linkedin_url" className="form-label">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="form-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Media & Settings</h3>
            <div className="form-group">
              <label htmlFor="image" className="form-label">Profile Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                className="form-input"
                accept="image/*"
              />
              <span className="form-help">Recommended: Square image, minimum 400x400px</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="order" className="form-label">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                />
                <span className="form-help">Lower numbers appear first</span>
              </div>
            </div>

            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label htmlFor="is_active" className="form-checkbox-label">
                Make this member visible on the website
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Team Member' : 'Add Team Member'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/team')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminTeamForm
