import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating'
import api from '../../services/api'

function AdminTestimonialsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    client_name: '',
    client_designation: '',
    content: '',
    rating: 5,
    practice_area: '',
    is_featured: false,
    is_published: true,
    order: 0,
    client_image: null
  })
  const [practiceAreas, setPracticeAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPracticeAreas()
    if (isEdit) {
      fetchTestimonial()
    }
  }, [id])

  const fetchPracticeAreas = async () => {
    try {
      const response = await api.getPracticeAreas()
      setPracticeAreas(response.data)
    } catch (err) {
      console.error('Failed to fetch practice areas:', err)
    }
  }

  const fetchTestimonial = async () => {
    try {
      const response = await api.get(`/admin/testimonials/${id}/`)
      const data = response.data
      setFormData({
        client_name: data.client_name,
        client_designation: data.client_designation || '',
        content: data.content,
        rating: data.rating,
        practice_area: data.practice_area || '',
        is_featured: data.is_featured,
        is_published: data.is_published,
        order: data.order,
        client_image: null
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
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'practice_area' && formData[key] === '') {
            // Skip empty practice_area
            return
          }
          if (key === 'rating') {
            data.append(key, parseInt(formData[key]))
          } else {
            data.append(key, formData[key])
          }
        }
      })

      if (isEdit) {
        await api.updateAdminTestimonial(id, data)
      } else {
        await api.createAdminTestimonial(data)
      }

      navigate('/secret-admin-portal-2024/testimonials')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save testimonial')
      console.error('Error saving testimonial:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="admin-header">
          <h1>{isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">Client Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client_name" className="form-label required">Client Name</label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter client's full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="client_designation" className="form-label">Designation/Company</label>
                <input
                  type="text"
                  id="client_designation"
                  name="client_designation"
                  value={formData.client_designation}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., CEO, ABC Company"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="client_image" className="form-label">Client Photo</label>
              <input
                type="file"
                id="client_image"
                name="client_image"
                onChange={handleChange}
                className="form-input"
                accept="image/*"
              />
              <span className="form-help">Optional - Recommended: Square image, 400x400px</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Testimonial Content</h3>
            <div className="form-group">
              <label htmlFor="content" className="form-label required">Testimonial</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
                placeholder="Enter the client's testimonial text..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rating" className="form-label required">Rating</label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'star' : 'stars'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="practice_area" className="form-label">Related Practice Area</label>
                <select
                  id="practice_area"
                  name="practice_area"
                  value={formData.practice_area}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Select Practice Area --</option>
                  {practiceAreas.map(area => (
                    <option key={area.id} value={area.id}>{area.title}</option>
                  ))}
                </select>
              </div>
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
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              <label htmlFor="is_featured" className="form-checkbox-label">
                Feature this testimonial on homepage
              </label>
            </div>

            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <label htmlFor="is_published" className="form-checkbox-label">
                Publish this testimonial on the website
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/testimonials')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminTestimonialsForm
