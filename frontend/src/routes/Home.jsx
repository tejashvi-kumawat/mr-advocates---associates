import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Card from '../components/Card'
import StarRating from '../components/StarRating'
import { useIsMobile } from '../hooks/useAppleScroll'
import { useSEO } from '../hooks/useSEO'
import api from '../services/api'
import { 
  Scale, 
  Newspaper, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Award,
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Gavel,
  Zap,
  Target,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

function Home() {
  const [practiceAreas, setPracticeAreas] = useState([])
  const [news, setNews] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [visibleSections, setVisibleSections] = useState(new Set())
  const [practiceAreaScroll, setPracticeAreaScroll] = useState(0)
  
  const isMobile = useIsMobile()
  
  // Refs for sections
  const statsRef = useRef(null)
  const introRef = useRef(null)
  const featuresRef = useRef(null)
  const areasRef = useRef(null)
  const newsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)
  const practiceCarouselRef = useRef(null)

  // SEO Optimization
  useSEO({
    title: 'Best Advocates in Jaipur | Best Lawyers in India | M.R. Advocates & Associates',
    description: 'Best advocate firm in Jaipur, Rajasthan. Top lawyers in India for civil case expert, criminal case expert, corporate case expert, family case expert, property case expert, and revenue case expert services. 25+ years experience.',
    keywords: 'best advocate in jaipur, best advocates in india, best advocates in rajasthan, advocate firm, lawyer firm, best lawyers, best lawyers in jaipur, best lawyers in india, best lawyers in rajasthan, civil case expert, revenue case expert, criminal case expert, property case expert, corporate case expert, family case expert, top advocate firm jaipur, leading lawyer firm rajasthan, expert advocates jaipur, best law firm india',
    canonical: 'https://www.mradvocates.in'
  })

  useEffect(() => {
    fetchHomeData()
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    const sections = [statsRef, introRef, featuresRef, areasRef, newsRef, testimonialsRef, ctaRef]
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [practiceAreas, news, testimonials])

  const fetchHomeData = async () => {
    try {
      const [areasRes, newsRes, testimonialRes] = await Promise.all([
        api.getPracticeAreas(),
        api.getNews({ page_size: 3 }),
        api.getTestimonials()
      ])

      setPracticeAreas(areasRes.data.slice(0, 6))
      setNews(newsRes.data.results || newsRes.data.slice(0, 3))
      setTestimonials(testimonialRes.data.filter(t => t.is_featured).slice(0, 3))
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const heroData = {
    tagline: "Justice, Integrity, Excellence",
    heroTitle: "M.R. Advocates and Associates",
    heroSubtitle: "Premier Legal Services in Jaipur, Rajasthan",
    heroDescription: "With decades of combined experience, we provide exceptional legal representation across civil, criminal, corporate, and family law matters.",
    ctaPrimary: "Book a Consultation",
    ctaSecondary: "View Practice Areas"
  }

  const stats = [
    { label: 'Years Experience', value: '25+', icon: Clock, color: 'var(--color-accent)' },
    { label: 'Cases Won', value: '500+', icon: Award, color: 'var(--color-accent-light)' },
    { label: 'Happy Clients', value: '1000+', icon: Users, color: 'var(--color-accent)' },
    { label: 'Success Rate', value: '95%', icon: TrendingUp, color: 'var(--color-accent-light)' }
  ]

  const features = [
    {
      icon: Shield,
      title: "Expert Legal Counsel",
      description: "Experienced advocates with deep knowledge across multiple practice areas",
      gradient: 'linear-gradient(135deg, rgba(201, 169, 97, 0.15), rgba(212, 184, 118, 0.08))'
    },
    {
      icon: Zap,
      title: "Lightning Fast Response",
      description: "Quick turnaround times without compromising on quality and thoroughness",
      gradient: 'linear-gradient(135deg, rgba(201, 169, 97, 0.12), rgba(212, 184, 118, 0.06))'
    },
    {
      icon: Target,
      title: "Strategic Approach",
      description: "Data-driven strategies tailored to achieve the best possible outcomes",
      gradient: 'linear-gradient(135deg, rgba(201, 169, 97, 0.15), rgba(212, 184, 118, 0.08))'
    }
  ]

  return (
    <div className="home-3d">
      {/* 3D Background Layers */}
      <div className="home-bg-3d">
        <div 
          className="home-bg-layer home-bg-1" 
          style={{ 
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px) rotate(${mousePos.x * 0.1}deg)`,
          }}
        />
        <div 
          className="home-bg-layer home-bg-2" 
          style={{ 
            transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px) rotate(${mousePos.y * 0.1}deg)`,
          }}
        />
        <div 
          className="home-bg-layer home-bg-3" 
        />
        {!isMobile && (
          <div 
            className="home-gradient-orb"
            style={{
              transform: `translate(calc(50% + ${mousePos.x}px), calc(50% + ${mousePos.y}px))`,
            }}
          />
        )}
      </div>
      
      <Hero data={heroData} />
      
      {/* Stats Section */}
      <section 
        id="stats"
        ref={statsRef}
        className={`home-section home-stats ${visibleSections.has('stats') ? 'visible' : ''}`}
      >
        <div className="home-container">
          <div className="home-stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div 
                  key={index} 
                  className="home-stat-card"
                  style={{ 
                    '--stat-color': stat.color,
                    '--stagger-delay': `${index * 0.1}s`
                  }}
                >
                  <div className="home-stat-icon-wrapper">
                    <IconComponent className="home-stat-icon" size={32} />
                  </div>
                  <div className="home-stat-value">{stat.value}</div>
                  <div className="home-stat-label">{stat.label}</div>
                  <div className="home-stat-glow"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section 
        id="intro"
        ref={introRef}
        className={`home-section home-intro ${visibleSections.has('intro') ? 'visible' : ''}`}
      >
        <div className="home-container">
          <div className="home-intro-wrapper">
            <div className="home-intro-badge">
              <Gavel size={18} />
              <span>Trusted Legal Firm</span>
            </div>
            <h1 className="home-intro-title">
              Best Advocates in <span className="home-gradient-text">Jaipur</span> | Top Lawyers in India | M.R. Advocates & Associates
            </h1>
            <div className="home-intro-content">
              <div className="home-intro-text">
                <p className="home-intro-para">
                  M.R. Advocates and Associates is recognized as one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>. As a premier <strong>lawyer firm</strong> in Rajasthan, we are dedicated to delivering comprehensive legal solutions with unwavering commitment to our clients.
                </p>
                <p className="home-intro-para">
                  Our team of <strong>best lawyers</strong> includes <strong>civil case experts</strong>, <strong>criminal case experts</strong>, <strong>corporate case experts</strong>, <strong>family case experts</strong>, <strong>property case experts</strong>, and <strong>revenue case experts</strong>. We ensure that every client receives personalized attention and strategic representation tailored to their unique needs.
                </p>
                <div className="home-intro-features">
                  {['Expert Legal Team', 'Proven Track Record', 'Client-Focused Approach'].map((feature, idx) => (
                    <div key={idx} className="home-intro-feature">
                      <CheckCircle2 size={20} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="home-intro-visual">
                <div className="home-visual-card">
                  <div className="home-visual-icon">
                    <Scale size={64} />
                  </div>
                  <div className="home-visual-stats">
                    <div className="home-visual-stat">
                      <div className="home-visual-value">25+</div>
                      <div className="home-visual-label">Years</div>
                    </div>
                    <div className="home-visual-divider"></div>
                    <div className="home-visual-stat">
                      <div className="home-visual-value">1000+</div>
                      <div className="home-visual-label">Clients</div>
                    </div>
                  </div>
                  <div className="home-visual-shine"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        ref={featuresRef}
        className={`home-section home-features ${visibleSections.has('features') ? 'visible' : ''}`}
      >
        <div className="home-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Why Choose Our Advocate Firm - Best Lawyers in Jaipur | M.R. Advocates & Associates</h2>
            <p className="home-section-subtitle">Excellence in every aspect of legal representation as one of the best advocates in India</p>
          </div>
          <div className="home-features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={index} 
                  className="home-feature-card"
                  style={{ 
                    '--feature-gradient': feature.gradient,
                    '--stagger-delay': `${index * 0.1}s`
                  }}
                >
                  <div className="home-feature-icon">
                    <IconComponent size={36} />
                  </div>
                  <h3 className="home-feature-title">{feature.title}</h3>
                  <p className="home-feature-desc">{feature.description}</p>
                  <div className="home-feature-glow"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section 
        id="areas"
        ref={areasRef}
        className={`home-section home-practice-areas ${visibleSections.has('areas') ? 'visible' : ''}`}
      >
        <div className="home-container">
          <div className="home-section-header">
            <div className="home-section-badge">
              <Scale size={20} />
            </div>
            <h2 className="home-section-title">Our Practice Areas</h2>
            <p className="home-section-subtitle">Comprehensive legal expertise across diverse domains</p>
          </div>
          <div className="home-practice-carousel-container">
            <button 
              className="home-carousel-btn home-carousel-btn-prev"
              onClick={() => {
                if (practiceCarouselRef.current) {
                  const cardWidth = practiceCarouselRef.current.querySelector('.home-practice-card')?.offsetWidth || 320
                  const gap = 24
                  const scrollAmount = cardWidth + gap
                  practiceCarouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
                }
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="home-practice-carousel" ref={practiceCarouselRef}>
              {practiceAreas.map((area, index) => (
                <div 
                  key={area.id} 
                  className="home-practice-card"
                  style={{ '--stagger-delay': `${index * 0.1}s` }}
                >
                  <Card
                    icon={area.icon}
                    title={area.title}
                    description={area.description.substring(0, 100) + '...'}
                    link={`/practice-areas/${area.slug}`}
                    linkText="Learn more"
                  />
                </div>
              ))}
            </div>
            <button 
              className="home-carousel-btn home-carousel-btn-next"
              onClick={() => {
                if (practiceCarouselRef.current) {
                  const cardWidth = practiceCarouselRef.current.querySelector('.home-practice-card')?.offsetWidth || 320
                  const gap = 24
                  const scrollAmount = cardWidth + gap
                  practiceCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
                }
              }}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="home-section-footer">
            <Link to="/practice-areas" className="home-btn home-btn-primary">
              <span>Explore All Practice Areas</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section 
        id="news"
        ref={newsRef}
        className={`home-section home-news ${visibleSections.has('news') ? 'visible' : ''}`}
      >
        <div className="home-container">
          <div className="home-section-header">
            <div className="home-section-badge">
              <Newspaper size={20} />
            </div>
            <h2 className="home-section-title">Latest Legal News & Updates</h2>
            <p className="home-section-subtitle">Stay informed with the latest developments in law</p>
          </div>
          <div className="home-news-grid">
            {news.map((article, index) => (
              <article 
                key={article.id} 
                className="home-news-card"
                style={{ '--stagger-delay': `${(index % 3) * 0.1}s` }}
              >
                <div className="home-news-header">
                  <span className="home-news-badge">{article.category}</span>
                  <time className="home-news-date">{new Date(article.published_date).toLocaleDateString()}</time>
                </div>
                <h3 className="home-news-title">{article.title}</h3>
                <p className="home-news-summary">{article.summary}</p>
                <Link to={`/legal-news/${article.slug}`} className="home-news-link">
                  Read Article
                  <ArrowRight size={16} />
                </Link>
                <div className="home-news-shine"></div>
              </article>
            ))}
          </div>
          <div className="home-section-footer">
            <Link to="/legal-news" className="home-btn home-btn-secondary">
              <span>View All News</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section 
          id="testimonials"
          ref={testimonialsRef}
          className={`home-section home-testimonials ${visibleSections.has('testimonials') ? 'visible' : ''}`}
        >
          <div className="home-container">
            <div className="home-section-header">
              <div className="home-section-badge">
                <Star size={20} />
              </div>
              <h2 className="home-section-title">What Our Clients Say</h2>
              <p className="home-section-subtitle">Trusted by clients across Rajasthan</p>
            </div>
            <div className="home-testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="home-testimonial-card"
                  style={{ '--stagger-delay': `${(index % 3) * 0.1}s` }}
                >
                  <div className="home-testimonial-rating">
                    <StarRating rating={testimonial.rating} size={20} />
                  </div>
                  <blockquote className="home-testimonial-quote">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="home-testimonial-author">
                    <div className="home-testimonial-name">{testimonial.client_name}</div>
                    {testimonial.client_designation && (
                      <div className="home-testimonial-role">{testimonial.client_designation}</div>
                    )}
                  </div>
                  <div className="home-testimonial-glow"></div>
                </div>
              ))}
            </div>
            <div className="home-section-footer">
              <Link to="/testimonials" className="home-btn home-btn-secondary">
                <span>Read All Testimonials</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        id="cta"
        ref={ctaRef}
        className={`home-section home-cta ${visibleSections.has('cta') ? 'visible' : ''}`}
      >
        <div className="home-container">
          <div className="home-cta-wrapper">
            <div className="home-cta-icon">
              <Sparkles size={72} />
            </div>
            <h2 className="home-cta-title">Ready to Get Started?</h2>
            <p className="home-cta-desc">
              Contact us today for a consultation. Our experienced advocates are ready to assist you 
              with your legal matters and provide the expert guidance you need.
            </p>
            <div className="home-cta-buttons">
              <Link to="/enquiry" className="home-btn home-btn-primary home-btn-large">
                <span>Submit an Enquiry</span>
              </Link>
              <Link to="/appointment" className="home-btn home-btn-secondary home-btn-large">
                <span>Book an Appointment</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
