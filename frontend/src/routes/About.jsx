import React from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { useSEO } from '../hooks/useSEO'

function About() {
  const [overviewRef, overviewVisible] = useScrollReveal({ once: true })
  const [visionRef, visionVisible] = useScrollReveal({ once: true })

  // SEO Optimization
  useSEO({
    title: 'About Us | Best Law Firm in Jaipur, Rajasthan',
    description: 'M.R. Advocates and Associates - Leading law firm in Jaipur with 25+ years of legal excellence. Expert lawyers providing comprehensive legal services.',
    keywords: 'about law firm Jaipur, legal services Rajasthan, experienced lawyers Jaipur, law firm history, legal expertise',
    canonical: 'https://www.mradvocates.in/about'
  })

  return (
    <div>
      <section className="section" ref={overviewRef}>
        <div className="container">
          <div className={`fade-in ${overviewVisible ? 'visible' : ''}`}>
            <h1 className="section-title">About M.R. Advocates and Associates</h1>
            <p style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', fontSize: 'var(--font-size-body)', lineHeight: '1.8' }}>
              M.R. Advocates and Associates is a premier law firm in Jaipur, Rajasthan, established with a vision to provide exemplary legal services rooted in integrity, professionalism, and client-centric approach. Our experienced lawyers in Jaipur have grown to become a trusted name in the legal community, serving individuals, businesses, and organizations across diverse legal domains including civil law, criminal law, corporate law, and family law.
            </p>
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
              <Link to="/practice-areas" className="btn btn-secondary" style={{ marginRight: 'var(--spacing-sm)' }}>Our Practice Areas</Link>
              <Link to="/services" className="btn btn-secondary">Our Legal Services</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--color-bg-alt)' }} ref={visionRef}>
        <div className="container">
          <div className={`grid grid-2 fade-in ${visionVisible ? 'visible' : ''}`}>
            <div className="card">
              <h2>Our Vision</h2>
              <p>To be recognized as the most trusted and respected law firm in Rajasthan, setting benchmarks in legal excellence, ethical practice, and client satisfaction.</p>
            </div>
            <div className="card">
              <h2>Our Mission</h2>
              <p>To provide comprehensive, efficient, and effective legal solutions that protect our clients' rights and interests while maintaining the highest standards of professional conduct.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
            <Link to="/team" className="btn btn-primary">Meet Our Team</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
