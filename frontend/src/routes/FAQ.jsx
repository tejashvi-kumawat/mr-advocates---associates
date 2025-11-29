import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useSEO } from '../hooks/useSEO'

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)

  // SEO Optimization
  useSEO({
    title: 'Legal FAQ | Common Questions Answered | Jaipur Lawyers',
    description: 'Frequently asked questions about legal services in Jaipur. Get answers about our law firm, legal processes, and how we can help you.',
    keywords: 'legal FAQ Jaipur, law firm questions, legal consultation FAQ, lawyers FAQ Rajasthan',
    canonical: 'https://www.mradvocates.in/faq'
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await api.getFAQs()
      setFaqs(response.data)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (loading) return <div className="loading">Loading FAQs...</div>

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="section-title">Frequently Asked Questions About Legal Services</h1>
        <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          Find answers to common questions about our legal services in Jaipur, legal processes, and how our experienced lawyers can help you. Need more information? <Link to="/contact" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Contact our law firm</Link> or explore our <Link to="/practice-areas" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>practice areas</Link>.
        </p>
        {faqs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No FAQs available.</p>
        ) : (
          <div>
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className="faq-card"
                style={{
                  marginBottom: 'var(--spacing-md)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-lg)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)'
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    backgroundColor: openIndex === index ? 'var(--color-bg-alt)' : 'var(--color-bg)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-main)',
                    transition: 'background-color var(--transition-fast)'
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{ fontSize: '1.5rem' }}>{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-alt)' }}>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FAQ
