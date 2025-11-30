import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import IconPicker from '../../components/admin/IconPicker'

function AdminServicesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    category: 'advisory',
    icon: 'ClipboardList',
    description: '',
    full_content: '',
    order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const categories = [
    { value: 'advisory', label: 'Advisory' },
    { value: 'litigation', label: 'Litigation' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'adr', label: 'Alternative Dispute Resolution' },
    { value: 'compliance', label: 'Compliance' }
  ]

  useEffect(() => {
    if (isEdit) {
      fetchService()
    }
  }, [id])

  const fetchService = async () => {
    try {
      const response = await api.get(`/admin/services/${id}/`)
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
        await api.put(`/admin/services/${id}/`, formData)
      } else {
        await api.post('/admin/services/', formData)
      }
      navigate('/secret-admin-portal-2024/services')
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
          <h1>{isEdit ? 'Edit Service' : 'Add New Service'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">Service Information</h3>
          <div className="form-row">
            <div className="form-group">
                <label htmlFor="title" className="form-label required">Service Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                  placeholder="Enter service title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label required">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
              <IconPicker
                value={formData.icon}
                onChange={handleChange}
                label="Icon"
              />

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

          <div className="form-group">
            <label htmlFor="description" className="form-label required">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
                placeholder="Brief description of the service..."
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
                placeholder="Detailed information about this service (optional)..."
            />
              <span className="form-help">This content will be displayed on the service detail page</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Status</h3>
            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label htmlFor="is_active" className="form-checkbox-label">
                Make this service visible on the website
            </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/services')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminServicesForm
