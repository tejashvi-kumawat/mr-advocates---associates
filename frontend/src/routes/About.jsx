import React from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'

function About() {
  const [overviewRef, overviewVisible] = useScrollReveal({ once: true })
  const [visionRef, visionVisible] = useScrollReveal({ once: true })

  return (
    <div>
      <section className="section" ref={overviewRef}>
        <div className="container">
          <div className={`fade-in ${overviewVisible ? 'visible' : ''}`}>
            <h1 className="section-title">About Us</h1>
            <p style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', fontSize: 'var(--font-size-body)', lineHeight: '1.8' }}>
              M.R. Advocates and Associates was established with a vision to provide exemplary legal services rooted in integrity, professionalism, and client-centric approach. Based in the heart of Jaipur, Rajasthan, our firm has grown to become a trusted name in the legal community, serving individuals, businesses, and organizations across diverse legal domains.
            </p>
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
