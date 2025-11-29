import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react'
import api from '../../services/api'
import ToastContainer from '../../components/admin/ToastContainer'
import { useToast } from '../../hooks/useToast'

function AdminSEOForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    description: '',
    keywords: '',
    og_image: null
  })
  const [existingImage, setExistingImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toasts, removeToast, error: showError, success: showSuccess } = useToast()

  useEffect(() => {
    if (isEdit) {
      fetchSEO()
    }
  }, [id])

  const fetchSEO = async () => {
    try {
      const response = await api.getAdminSEOById(id)
      const data = response.data
      setFormData({
        page_name: data.page_name,
        title: data.title,
        description: data.description,
        keywords: data.keywords || '',
        og_image: null
      })
      if (data.og_image_url) {
        setExistingImage(data.og_image_url)
      }
    } catch (err) {
      setError(err.message)
      showError('Failed to load SEO metadata: ' + err.message)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
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
          if (key === 'og_image' && formData[key] instanceof File) {
            data.append(key, formData[key])
          } else if (key !== 'og_image') {
            data.append(key, formData[key])
          }
        }
      })

      if (isEdit) {
        await api.updateAdminSEO(id, data)
        showSuccess('SEO metadata updated successfully')
      } else {
        await api.createAdminSEO(data)
        showSuccess('SEO metadata created successfully')
      }

      setTimeout(() => {
        navigate('/secret-admin-portal-2024/seo')
      }, 1000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save SEO metadata'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="admin-header">
          <button
            onClick={() => navigate('/secret-admin-portal-2024/seo')}
            className="btn btn-secondary btn-compact"
          >
            <X size={18} />
            Back
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="page_name" className="form-label required">Page Name</label>
            <input
              type="text"
              id="page_name"
              name="page_name"
              value={formData.page_name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., home, about, contact"
              required
              disabled={isEdit}
            />
            <small>Unique identifier for the page (lowercase, no spaces)</small>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label required">Page Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="50-60 characters"
              maxLength="60"
              required
            />
            <small>{formData.title.length}/60 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label required">Meta Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="150-160 characters"
              maxLength="160"
              required
            />
            <small>{formData.description.length}/160 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="keywords" className="form-label">Keywords</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="form-input"
              placeholder="keyword1, keyword2, keyword3"
            />
            <small>Comma-separated keywords for SEO</small>
          </div>

          <div className="form-group">
            <label htmlFor="og_image" className="form-label">OG Image (1200x630px)</label>
            {existingImage && !formData.og_image && (
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <img 
                  src={existingImage} 
                  alt="Current OG Image" 
                  style={{ maxWidth: '300px', borderRadius: 'var(--border-radius)', marginBottom: 'var(--spacing-xs)' }}
                />
                <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                  Current image
                </p>
              </div>
            )}
            <input
              type="file"
              id="og_image"
              name="og_image"
              onChange={handleChange}
              className="form-input"
              accept="image/*"
            />
            <small>Image for social media sharing (Facebook, Twitter, LinkedIn). Leave empty to keep current image.</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update SEO' : 'Create SEO'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/seo')}
            >
              Cancel
            </button>
          </div>
        </form>
        
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  )
}

export default AdminSEOForm
