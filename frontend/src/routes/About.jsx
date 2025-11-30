import React from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { useSEO } from '../hooks/useSEO'

function About() {
  const [overviewRef, overviewVisible] = useScrollReveal({ once: true })
  const [visionRef, visionVisible] = useScrollReveal({ once: true })

  // SEO Optimization
  useSEO({
    title: 'About Best Advocate Firm in Jaipur | Best Lawyers in India',
    description: 'M.R. Advocates and Associates - Best advocate firm in Jaipur, Rajasthan with 25+ years of legal excellence. Top lawyers in India providing comprehensive legal services including civil case expert, criminal case expert, corporate case expert, and revenue case expert.',
    keywords: 'best advocate firm jaipur, best lawyers in india, best advocates in rajasthan, lawyer firm history, expert advocates, top law firm, leading advocate firm, experienced lawyers, legal expertise, civil case expert, revenue case expert',
    canonical: 'https://www.mradvocates.in/about'
  })

  return (
    <div>
      <section className="section" ref={overviewRef}>
        <div className="container">
          <div className={`fade-in ${overviewVisible ? 'visible' : ''}`}>
            <h1 className="section-title">About Best Advocate Firm in Jaipur - Best Lawyers in India</h1>
            <p style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', fontSize: 'var(--font-size-body)', lineHeight: '1.8' }}>
              M.R. Advocates and Associates is recognized as one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>. Established with a vision to provide exemplary legal services rooted in integrity, professionalism, and client-centric approach, our <strong>expert lawyers</strong> have grown to become a trusted name in the legal community. As a premier <strong>lawyer firm</strong> in Rajasthan, we serve individuals, businesses, and organizations across diverse legal domains. Our team includes <strong>civil case experts</strong>, <strong>criminal case experts</strong>, <strong>corporate case experts</strong>, <strong>family case experts</strong>, <strong>property case experts</strong>, and <strong>revenue case experts</strong>.
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
