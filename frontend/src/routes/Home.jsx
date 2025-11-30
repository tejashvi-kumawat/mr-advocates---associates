import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import StarRating from '../components/StarRating'
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import '../styles/homepage.css'

function Home() {
  const [practiceAreas, setPracticeAreas] = useState([])
  const [news, setNews] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState(new Set())
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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          setVisibleSections(prev => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('.homepage-section:not(.homepage-hero)')
    sections.forEach(section => observer.observe(section))

    return () => {
      sections.forEach(section => observer.unobserve(section))
    }
  }, [])

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

  const stats = [
    { label: 'Years Experience', value: '25+', icon: Clock },
    { label: 'Cases Won', value: '500+', icon: Award },
    { label: 'Happy Clients', value: '1000+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: TrendingUp }
  ]

  const features = [
    {
      icon: Shield,
      title: "Expert Legal Counsel",
      description: "Experienced advocates with deep knowledge across multiple practice areas"
    },
    {
      icon: Zap,
      title: "Lightning Fast Response",
      description: "Quick turnaround times without compromising on quality and thoroughness"
    },
    {
      icon: Target,
      title: "Strategic Approach",
      description: "Data-driven strategies tailored to achieve the best possible outcomes"
    }
  ]

  return (
    <div className="homepage">
      {/* Grid Background */}
      <div className="homepage-grid-bg"></div>
      
      {/* Hero Section */}
      <section className="homepage-hero homepage-section" id="hero">
        <div className="homepage-container">
          <div className="hero-content">
            <div className="hero-tagline">Justice, Integrity, Excellence</div>
            <h1 className="hero-title">M.R. Advocates and Associates</h1>
            <h2 className="hero-subtitle">Premier Legal Services in Jaipur, Rajasthan</h2>
            <p className="hero-description">
              With decades of combined experience, we provide exceptional legal representation across civil, criminal, corporate, and family law matters.
            </p>
            <div className="hero-cta">
              <Link to="/appointment" className="hero-btn hero-btn-primary">
                <span>Book a Consultation</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/practice-areas" className="hero-btn hero-btn-secondary">
                <span>View Practice Areas</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="homepage-section homepage-stats" id="stats">
        <div className="homepage-container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="stat-card">
                  <div className="stat-icon">
                    <IconComponent size={40} />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="homepage-section homepage-intro" id="intro">
        <div className="homepage-container">
          <div className="intro-content">
            <div className="intro-badge">
              <Gavel size={20} />
              <span>Trusted Legal Firm</span>
            </div>
            <h2 className="intro-title">
              Best Advocates in <span className="gradient-text">Jaipur</span> | Top Lawyers in India
            </h2>
            <div className="intro-text-wrapper">
              <div className="intro-text">
                <p>
                  M.R. Advocates and Associates is recognized as one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>. As a premier <strong>lawyer firm</strong> in Rajasthan, we are dedicated to delivering comprehensive legal solutions with unwavering commitment to our clients.
                </p>
                <p>
                  Our team of <strong>best lawyers</strong> includes <strong>civil case experts</strong>, <strong>criminal case experts</strong>, <strong>corporate case experts</strong>, <strong>family case experts</strong>, <strong>property case experts</strong>, and <strong>revenue case experts</strong>. We ensure that every client receives personalized attention and strategic representation tailored to their unique needs.
                </p>
                <div className="intro-features">
                  {['Expert Legal Team', 'Proven Track Record', 'Client-Focused Approach'].map((feature, idx) => (
                    <div key={idx} className="intro-feature">
                      <CheckCircle2 size={20} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="intro-visual">
                <div className="visual-card">
                  <div className="visual-icon">
                    <Scale size={64} />
                  </div>
                  <div className="visual-stats">
                    <div className="visual-stat">
                      <div className="visual-value">25+</div>
                      <div className="visual-label">Years</div>
                    </div>
                    <div className="visual-divider"></div>
                    <div className="visual-stat">
                      <div className="visual-value">1000+</div>
                      <div className="visual-label">Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="homepage-section homepage-features" id="features">
        <div className="homepage-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Advocate Firm - Best Lawyers in Jaipur</h2>
            <p className="section-subtitle">Excellence in every aspect of legal representation as one of the best advocates in India</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <IconComponent size={40} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="homepage-section homepage-practice-areas" id="areas">
        <div className="homepage-container">
          <div className="section-header">
            <div className="section-badge">
              <Scale size={24} />
            </div>
            <h2 className="section-title">Our Practice Areas</h2>
            <p className="section-subtitle">Comprehensive legal expertise across diverse domains</p>
          </div>
          <div className="practice-carousel-wrapper">
            <button 
              className="carousel-btn carousel-btn-prev"
              onClick={() => {
                if (practiceCarouselRef.current) {
                  const cardWidth = practiceCarouselRef.current.querySelector('.practice-card')?.offsetWidth || 320
                  practiceCarouselRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' })
                }
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="practice-carousel" ref={practiceCarouselRef}>
              {practiceAreas.map((area) => (
                <div key={area.id} className="practice-card">
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
              className="carousel-btn carousel-btn-next"
              onClick={() => {
                if (practiceCarouselRef.current) {
                  const cardWidth = practiceCarouselRef.current.querySelector('.practice-card')?.offsetWidth || 320
                  practiceCarouselRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' })
                }
              }}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="section-footer">
            <Link to="/practice-areas" className="homepage-btn homepage-btn-primary">
              <span>Explore All Practice Areas</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="homepage-section homepage-news" id="news">
        <div className="homepage-container">
          <div className="section-header">
            <div className="section-badge">
              <Newspaper size={24} />
            </div>
            <h2 className="section-title">Latest Legal News & Updates</h2>
            <p className="section-subtitle">Stay informed with the latest developments in law</p>
          </div>
          <div className="news-grid">
            {news.map((article) => (
              <article key={article.id} className="news-card">
                <div className="news-header">
                  <span className="news-badge">{article.category}</span>
                  <time className="news-date">{new Date(article.published_date).toLocaleDateString()}</time>
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-summary">{article.summary}</p>
                <Link to={`/legal-news/${article.slug}`} className="news-link">
                  Read Article
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/legal-news" className="homepage-btn homepage-btn-secondary">
              <span>View All News</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="homepage-section homepage-testimonials" id="testimonials">
          <div className="homepage-container">
            <div className="section-header">
              <div className="section-badge">
                <Star size={24} />
              </div>
              <h2 className="section-title">What Our Clients Say</h2>
              <p className="section-subtitle">Trusted by clients across Rajasthan</p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-rating">
                    <StarRating rating={testimonial.rating} size={20} />
                  </div>
                  <blockquote className="testimonial-quote">"{testimonial.content}"</blockquote>
                  <div className="testimonial-author">
                    <div className="testimonial-name">{testimonial.client_name}</div>
                    {testimonial.client_designation && (
                      <div className="testimonial-role">{testimonial.client_designation}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="section-footer">
              <Link to="/testimonials" className="homepage-btn homepage-btn-secondary">
                <span>Read All Testimonials</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="homepage-section homepage-cta" id="cta">
        <div className="homepage-container">
          <div className="cta-wrapper">
            <div className="cta-icon">
              <Sparkles size={72} />
            </div>
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Contact us today for a consultation. Our experienced advocates are ready to assist you 
              with your legal matters and provide the expert guidance you need.
            </p>
            <div className="cta-buttons">
              <Link to="/enquiry" className="homepage-btn homepage-btn-primary homepage-btn-large">
                <span>Submit an Enquiry</span>
              </Link>
              <Link to="/appointment" className="homepage-btn homepage-btn-secondary homepage-btn-large">
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
