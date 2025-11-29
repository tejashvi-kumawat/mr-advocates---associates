import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function AdminFAQForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    is_published: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchFAQ()
    }
  }, [id])

  const fetchFAQ = async () => {
    try {
      const response = await api.get(`/admin/faqs/${id}/`)
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
        await api.put(`/admin/faqs/${id}/`, formData)
      } else {
        await api.post('/admin/faqs/', formData)
      }
      navigate('/secret-admin-portal-2024/faq')
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
          <h1>{isEdit ? 'Edit FAQ' : 'Add New FAQ'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">FAQ Content</h3>
            <div className="form-group">
              <label htmlFor="question" className="form-label required">Question</label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter the frequently asked question..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="answer" className="form-label required">Answer</label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="form-textarea"
                rows="6"
                placeholder="Provide a clear and detailed answer..."
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Organization</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., General, Services, Fees"
                />
                <span className="form-help">Group related FAQs together</span>
              </div>

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
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Publishing</h3>
            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <label htmlFor="is_published" className="form-checkbox-label">
                Publish this FAQ on the website
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/faq')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminFAQForm
