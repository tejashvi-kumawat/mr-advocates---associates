import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function AdminNewsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    summary: '',
    content: '',
    is_published: false,
    image: null,
    author: ''
  })
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTeamMembers()
    if (isEdit) {
      fetchArticle()
    }
  }, [id])

  const fetchTeamMembers = async () => {
    try {
      const response = await api.getAdminTeam()
      setTeamMembers(response.data || [])
    } catch (err) {
      console.error('Failed to fetch team members:', err)
    }
  }

  const fetchArticle = async () => {
    try {
      const response = await api.getAdminNewsById(id)
      const article = response.data
      setFormData({
        title: article.title,
        category: article.category,
        summary: article.summary,
        content: article.content,
        is_published: article.is_published,
        image: null,
        author: article.author || ''
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
      data.append('title', formData.title)
      data.append('category', formData.category)
      data.append('summary', formData.summary)
      data.append('content', formData.content)
      data.append('is_published', formData.is_published)
      if (formData.author) {
        data.append('author', formData.author)
      }
      if (formData.image) {
        data.append('image', formData.image)
      }

      if (isEdit) {
        await api.updateAdminNews(id, data)
      } else {
        await api.createAdminNews(data)
      }

      navigate('/secret-admin-portal-2024/news')
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
          <h1>{isEdit ? 'Edit Article' : 'Create New Article'}</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-group">
              <label htmlFor="title" className="form-label required">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="form-row">
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
                  <option value="civil">Civil Law</option>
                  <option value="criminal">Criminal Law</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="property">Property Law</option>
                  <option value="family">Family Law</option>
                  <option value="tax">Tax Law</option>
                  <option value="consumer">Consumer Law</option>
                  <option value="banking">Banking & Finance</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="author" className="form-label">Author</label>
                <select
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Author</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} {member.role ? `(${member.role.replace(/_/g, ' ')})` : ''}
                    </option>
                  ))}
                </select>
                <span className="form-help">Select a team member as the author</span>
              </div>
            </div>

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
              <span className="form-help">Recommended: 1200x630px for best results</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Content</h3>
            <div className="form-group">
              <label htmlFor="summary" className="form-label required">Summary</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                maxLength="500"
                placeholder="Brief summary of the article (max 500 characters)"
                required
              />
              <div className="form-char-counter">
                <span className="form-char-counter-text">Character count</span>
                <span className={`form-char-counter-count ${formData.summary.length > 450 ? 'warning' : ''} ${formData.summary.length >= 500 ? 'error' : ''}`}>
                  {formData.summary.length}/500
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label required">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-textarea"
                rows="12"
                placeholder="Write the full article content here..."
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Publishing Options</h3>
            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <label htmlFor="is_published" className="form-checkbox-label">
                Publish this article immediately
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/secret-admin-portal-2024/news')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminNewsForm
