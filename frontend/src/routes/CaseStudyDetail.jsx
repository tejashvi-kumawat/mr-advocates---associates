import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Target, Lightbulb, CheckCircle } from 'lucide-react'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'

function CaseStudyDetail() {
  const { slug } = useParams()
  const [caseStudy, setCaseStudy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchCaseStudy()
  }, [slug])

  const fetchCaseStudy = async () => {
    try {
      const response = await api.getCaseStudy(slug)
      setCaseStudy(response.data)
    } catch (error) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  // SEO Optimization
  useSEO(caseStudy ? {
    title: `${caseStudy.title} | Case Study | M.R. Advocates`,
    description: `Success story: ${caseStudy.title}. Learn how M.R. Advocates achieved favorable outcomes in ${caseStudy.practice_area_name || 'legal'} matters in Jaipur.`,
    keywords: `${caseStudy.title} case study, legal success story Jaipur, ${caseStudy.practice_area_name} lawyer, case study Rajasthan`,
    canonical: `https://www.mradvocates.in/case-studies/${slug}`
  } : {
    title: 'Case Study | M.R. Advocates Jaipur',
    description: 'Legal case studies and success stories from Jaipur',
    canonical: `https://www.mradvocates.in/case-studies/${slug}`
  })

  if (loading) return <div className="loading">Loading case study...</div>
  if (notFound) return <Navigate to="/case-studies" replace />

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/case-studies" className="card-link" style={{ display: 'inline-block', marginBottom: 'var(--spacing-md)' }}>
          ← Back to Case Studies
        </Link>
        
        {caseStudy.image_url && (
          <img 
            src={caseStudy.image_url} 
            alt={`${caseStudy.title} - Legal Case Study from M.R. Advocates Jaipur`}
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: 'var(--border-radius-lg)', 
              marginBottom: 'var(--spacing-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
        )}
        
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          {caseStudy.practice_area_name && (
            <span style={{ 
              fontSize: 'var(--font-size-small)', 
              color: 'var(--color-accent)', 
              fontWeight: 'var(--font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '4px 12px',
              backgroundColor: 'rgba(139, 115, 85, 0.1)',
              borderRadius: 'var(--border-radius-sm)',
              display: 'inline-block'
            }}>
              {caseStudy.practice_area_name}
            </span>
          )}
        </div>
        
        <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>{caseStudy.title}</h1>
        
        {caseStudy.client_name && (
          <div style={{ 
            fontSize: 'var(--font-size-body)', 
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xl)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-bg-alt)',
            borderRadius: 'var(--border-radius)',
            borderLeft: '4px solid var(--color-accent)'
          }}>
            <strong>Client:</strong> {caseStudy.client_name}
          </div>
        )}
        
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ 
            padding: 'var(--spacing-lg)', 
            backgroundColor: 'var(--color-bg-alt)', 
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-h3)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Target size={24} /> The Challenge
            </h2>
            <div style={{ lineHeight: '1.8', fontSize: 'var(--font-size-body)' }}>
              {caseStudy.challenge.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div style={{ 
            padding: 'var(--spacing-lg)', 
            backgroundColor: 'var(--color-bg-alt)', 
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-h3)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Lightbulb size={24} /> Our Approach
            </h2>
            <div style={{ lineHeight: '1.8', fontSize: 'var(--font-size-body)' }}>
              {caseStudy.solution.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div style={{ 
            padding: 'var(--spacing-lg)', 
            background: 'linear-gradient(135deg, rgba(26, 43, 74, 0.05) 0%, rgba(139, 115, 85, 0.05) 100%)',
            borderRadius: 'var(--border-radius-lg)',
            border: '2px solid var(--color-accent)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-h3)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <CheckCircle size={24} /> The Outcome
            </h2>
            <div style={{ lineHeight: '1.8', fontSize: 'var(--font-size-body)' }}>
              {caseStudy.outcome.split('\n').map((paragraph, index) => (
                <p key={index} style={{ fontWeight: index === 0 ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: 'var(--spacing-2xl)', 
          padding: 'var(--spacing-xl)', 
          backgroundColor: 'var(--color-bg-alt)', 
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Need Similar Legal Assistance?</h2>
          <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
            Our experienced lawyers in Jaipur are ready to help you navigate complex legal challenges and achieve favorable outcomes. Explore our <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>practice areas</Link> or <Link to="/team" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>meet our expert team</Link>.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/enquiry" className="btn btn-primary">Contact Us</Link>
            <Link to="/appointment" className="btn btn-secondary">Schedule Consultation</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <Link to="/case-studies" className="card-link">
            View More Case Studies →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CaseStudyDetail
