import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import IconPicker from '../../components/admin/IconPicker'

function AdminPracticeAreasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    icon: 'Scale',
    description: '',
    full_content: '',
    order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchArea()
    }
  }, [id])

  const fetchArea = async () => {
    try {
      const response = await api.getAdminPracticeAreaById(id)
      setFormData(response.data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEdit) {
        await api.updateAdminPracticeArea(id, formData)
      } else {
        await api.createAdminPracticeArea(formData)
      }
      navigate('/secret-admin-portal-2024/practice-areas')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="admin-header">
          <h1>{isEdit ? 'Edit Practice Area' : 'Create New Practice Area'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title" className="form-label required">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter practice area title"
                  required
                />
              </div>

              <IconPicker
                value={formData.icon}
                onChange={handleChange}
                label="Icon"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label required">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Brief description of this practice area..."
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Detailed Content</h3>
            <div className="form-group">
              <label htmlFor="full_content" className="form-label">Full Content</label>
              <textarea
                id="full_content"
                name="full_content"
                value={formData.full_content}
                onChange={handleChange}
                className="form-textarea"
                rows="8"
                placeholder="Detailed information about this practice area (optional)..."
              />
              <span className="form-help">This content will be displayed on the practice area detail page</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Display Settings</h3>
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

            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label htmlFor="is_active" className="form-checkbox-label">
                Make this practice area visible on the website
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Practice Area' : 'Create Practice Area'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/practice-areas')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminPracticeAreasForm
