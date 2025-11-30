import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'

function CaseStudies() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  // SEO Optimization
  useSEO({
    title: 'Legal Case Studies | Best Advocates in Jaipur | Success Stories',
    description: 'Explore successful legal case studies from best advocate firm in Jaipur. Real cases showcasing expertise of best lawyers in India including civil case expert, criminal case expert, corporate case expert, and revenue case expert.',
    keywords: 'legal case studies best advocates jaipur, best lawyers success stories, advocate firm case studies, lawyer firm victories, civil case expert success, revenue case expert cases, top law firm india',
    canonical: 'https://www.mradvocates.in/case-studies'
  })

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
        <h1 className="section-title">Our Legal Case Studies and Success Stories</h1>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
          Explore our successful legal case studies from Jaipur showcasing our expertise and commitment to achieving favorable outcomes for our clients in civil law, criminal law, corporate law, and family law matters. Learn more about our <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>practice areas</Link> or <Link to="/testimonials" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>read client testimonials</Link>.
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
