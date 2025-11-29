import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function AdminCaseStudiesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    practice_area: '',
    challenge: '',
    solution: '',
    outcome: '',
    is_published: false,
    order: 0,
    image: null
  })
  const [practiceAreas, setPracticeAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPracticeAreas()
    if (isEdit) {
      fetchCaseStudy()
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

  const fetchCaseStudy = async () => {
    try {
      const response = await api.get(`/admin/case-studies/${id}/`)
      const data = response.data
      setFormData({
        title: data.title,
        client_name: data.client_name || '',
        practice_area: data.practice_area || '',
        challenge: data.challenge,
        solution: data.solution,
        outcome: data.outcome,
        is_published: data.is_published,
        order: data.order,
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
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'practice_area' && formData[key] === '') {
            // Skip empty practice_area
            return
          }
          data.append(key, formData[key])
        }
      })

      if (isEdit) {
        await api.updateAdminCaseStudy(id, data)
      } else {
        await api.createAdminCaseStudy(data)
      }

      navigate('/secret-admin-portal-2024/case-studies')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save case study')
      console.error('Error saving case study:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="admin-header">
          <h1>{isEdit ? 'Edit Case Study' : 'Add New Case Study'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">Case Information</h3>
            <div className="form-group">
              <label htmlFor="title" className="form-label required">Case Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter case study title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client_name" className="form-label">Client Name</label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Leave blank for confidentiality"
                />
                <span className="form-help">Optional - can be left anonymous</span>
              </div>

              <div className="form-group">
                <label htmlFor="practice_area" className="form-label">Practice Area</label>
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
            <h3 className="form-section-title">Case Details</h3>
            <div className="form-group">
              <label htmlFor="challenge" className="form-label required">The Challenge</label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Describe the legal challenge or problem faced by the client..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="solution" className="form-label required">Our Approach & Solution</label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Describe the legal strategy and approach we took to solve the challenge..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="outcome" className="form-label required">The Outcome</label>
              <textarea
                id="outcome"
                name="outcome"
                value={formData.outcome}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Describe the final result and benefits achieved for the client..."
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Media & Publishing</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="image" className="form-label">Featured Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  className="form-input"
                  accept="image/*"
                />
                <span className="form-help">Recommended: 1200x630px</span>
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

            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <label htmlFor="is_published" className="form-checkbox-label">
                Publish this case study on the website
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Case Study' : 'Create Case Study'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/case-studies')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminCaseStudiesForm
