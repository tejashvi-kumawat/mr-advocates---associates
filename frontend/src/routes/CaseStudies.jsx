import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function CaseStudies() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await api.getCaseStudies()
      setCases(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading case studies...</div>

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Case Studies</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          Explore our successful case studies showcasing our expertise and commitment to achieving favorable outcomes for our clients.
        </p>
        {cases.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No case studies available at the moment.</p>
        ) : (
          <div className="grid grid-2">
            {cases.map((caseStudy, index) => (
              <Link 
                to={`/case-studies/${caseStudy.slug}`}
                key={caseStudy.id}
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <h3 className="card-title">{caseStudy.title}</h3>
                {caseStudy.practice_area_name && (
                  <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-accent)', marginBottom: 'var(--spacing-sm)' }}>
                    {caseStudy.practice_area_name}
                  </div>
                )}
                <p className="card-description">{caseStudy.challenge.substring(0, 150)}...</p>
                <span className="card-link">Read case study →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CaseStudies
