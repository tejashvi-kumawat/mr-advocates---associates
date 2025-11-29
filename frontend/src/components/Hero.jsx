import React from 'react'
import { Link } from 'react-router-dom'

function Hero({ data }) {
  return (
    <section className="hero">
      <div className="hero-grid"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>
      
      <div className="container hero-content">
        <div className="hero-tagline">{data.tagline}</div>
        <h1 className="hero-title" data-text={data.heroTitle}>{data.heroTitle}</h1>
        <h2 className="hero-subtitle">{data.heroSubtitle}</h2>
        <p className="hero-description">{data.heroDescription}</p>
        <div className="hero-cta">
          <Link to="/appointment" className="btn btn-primary">
            <span>{data.ctaPrimary}</span>
          </Link>
          <Link to="/practice-areas" className="btn btn-secondary">
            <span>{data.ctaSecondary}</span>
          </Link>
        </div>
      </div>
      
      <div className="hero-scroll-indicator"></div>
    </section>
  )
}

export default Hero
