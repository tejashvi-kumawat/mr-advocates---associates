import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import api from '../services/api'

function LegalNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [ref, visible] = useScrollReveal({ once: true })

  useEffect(() => {
    fetchNews()
  }, [category, search])

  const fetchNews = async () => {
    try {
      const params = {}
      if (category) params.category = category
      if (search) params.search = search
      
      const response = await api.getNews(params)
      setNews(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'civil', label: 'Civil Law' },
    { value: 'criminal', label: 'Criminal Law' },
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'property', label: 'Property Law' },
    { value: 'family', label: 'Family Law' },
    { value: 'tax', label: 'Tax Law' },
    { value: 'consumer', label: 'Consumer Law' },
    { value: 'banking', label: 'Banking & Finance' }
  ]

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <h1 className="section-title">Legal News & Updates</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          Stay informed about the latest developments in Indian law, judicial pronouncements, and legal reforms that may impact you.
        </p>

        <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            style={{ maxWidth: '250px' }}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: '300px' }}
          />
        </div>

        {loading ? (
          <div className="loading">Loading news...</div>
        ) : news.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No news articles found.</p>
        ) : (
          <div className={`grid grid-2 fade-in ${visible ? 'visible' : ''}`}>
            {news.map((article, index) => (
              <div key={article.id} className={`news-card card stagger-${(index % 2) + 1}`}>
                {article.image_url && (
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--border-radius)', marginBottom: 'var(--spacing-md)' }}
                  />
                )}
                <div className="news-card-header">
                  <span className="news-card-category">{article.category}</span>
                  <span className="news-card-date">{new Date(article.published_date).toLocaleDateString()}</span>
                </div>
                <h3 className="card-title">{article.title}</h3>
                <p className="news-card-summary card-description">{article.summary}</p>
                <Link to={`/legal-news/${article.slug}`} className="card-link">Read full article →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LegalNews
