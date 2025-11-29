import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import api from '../services/api'

function NewsDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    try {
      const response = await api.getNewsArticle(slug)
      setArticle(response.data)
    } catch (error) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading article...</div>
  if (notFound) return <Navigate to="/legal-news" replace />

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/legal-news" className="card-link" style={{ display: 'inline-block', marginBottom: 'var(--spacing-md)' }}>
          ← Back to Legal News
        </Link>
        
        {article.image_url && (
          <img 
            src={article.image_url} 
            alt={article.title}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--border-radius-lg)', marginBottom: 'var(--spacing-lg)' }}
          />
        )}
        
        <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="news-card-category">{article.category}</span>
          <span className="news-card-date">{new Date(article.published_date).toLocaleDateString()}</span>
          <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
            👁️ {article.views} views
          </span>
        </div>
        
        <h1>{article.title}</h1>
        
        <p style={{ fontSize: 'var(--font-size-h4)', fontWeight: 'var(--font-weight-normal)', color: 'var(--color-text-main)', marginBottom: 'var(--spacing-xl)' }}>
          {article.summary}
        </p>
        
        <div style={{ lineHeight: '1.8', fontSize: 'var(--font-size-body)' }}>
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {article.author_name && (
          <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius)', fontSize: 'var(--font-size-small)' }}>
            Written by <strong>{article.author_name}</strong>
          </div>
        )}
        
        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius-lg)' }}>
          <h3>Need Legal Assistance?</h3>
          <p>If you have questions about this legal matter or require professional representation, our experienced advocates are here to help.</p>
          <Link to="/enquiry" className="btn btn-primary">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}

export default NewsDetail
