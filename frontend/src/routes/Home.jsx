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
  ChevronRight,
  BookOpen,
  Briefcase,
  FileText
} from 'lucide-react'
import '../styles/homepage.css'

function Home() {
  const [practiceAreas, setPracticeAreas] = useState([])
  const [news, setNews] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
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
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('.home-section')
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
    { label: 'Years Experience', value: '25+', icon: Clock, color: '#c9a961' },
    { label: 'Cases Won', value: '500+', icon: Award, color: '#d4b876' },
    { label: 'Happy Clients', value: '1000+', icon: Users, color: '#c9a961' },
    { label: 'Success Rate', value: '95%', icon: TrendingUp, color: '#d4b876' }
  ]

  const features = [
    {
      icon: Shield,
      title: "Expert Legal Counsel",
      description: "Experienced advocates with deep knowledge across multiple practice areas",
      gradient: 'linear-gradient(135deg, #c9a961 0%, #d4b876 100%)'
    },
    {
      icon: Zap,
      title: "Lightning Fast Response",
      description: "Quick turnaround times without compromising on quality and thoroughness",
      gradient: 'linear-gradient(135deg, #d4b876 0%, #c9a961 100%)'
    },
    {
      icon: Target,
      title: "Strategic Approach",
      description: "Data-driven strategies tailored to achieve the best possible outcomes",
      gradient: 'linear-gradient(135deg, #c9a961 0%, #d4b876 100%)'
    }
  ]

  const services = [
    { icon: BookOpen, title: 'Legal Consultation', desc: 'Expert advice on all legal matters' },
    { icon: Briefcase, title: 'Litigation Services', desc: 'Comprehensive court representation' },
    { icon: FileText, title: 'Documentation', desc: 'Legal document preparation & review' }
  ]

  return (
    <div className="home-page">
      {/* Grid Background */}
      <div className="home-grid-bg"></div>
      
      {/* Hero Section */}
      <section className="home-hero home-section">
        <div className="hero-background"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Gavel size={18} />
              <span>Justice, Integrity, Excellence</span>
            </div>
            <h1 className="hero-title">
              M.R. Advocates<br />
              <span className="hero-title-accent">& Associates</span>
            </h1>
            <h2 className="hero-subtitle">Premier Legal Services in Jaipur, Rajasthan</h2>
            <p className="hero-description">
              With decades of combined experience, we provide exceptional legal representation across civil, criminal, corporate, and family law matters.
            </p>
            <div className="hero-actions">
              <Link to="/appointment" className="btn-hero btn-hero-primary">
                <span>Book a Consultation</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/practice-areas" className="btn-hero btn-hero-outline">
                <span>View Practice Areas</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon">
                <Scale size={80} />
              </div>
              <div className="hero-card-stats">
                <div className="hero-stat">
                  <div className="hero-stat-value">25+</div>
                  <div className="hero-stat-label">Years</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <div className="hero-stat-value">1000+</div>
                  <div className="hero-stat-label">Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-section home-stats">
        <div className="container">
          <div className="stats-wrapper">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="stat-item" style={{ '--delay': `${index * 0.1}s` }}>
                  <div className="stat-icon-wrapper" style={{ '--stat-color': stat.color }}>
                    <IconComponent size={48} />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="home-section home-about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <div className="section-badge">
                <Gavel size={20} />
                <span>About Us</span>
              </div>
              <h2 className="section-title">
                Best Advocates in <span className="text-gradient">Jaipur</span> | Top Lawyers in India
              </h2>
              <div className="about-description">
                <p>
                  M.R. Advocates and Associates is recognized as one of the <strong>best advocate firms in Jaipur</strong> and among the <strong>best advocates in India</strong>. As a premier <strong>lawyer firm</strong> in Rajasthan, we are dedicated to delivering comprehensive legal solutions with unwavering commitment to our clients.
                </p>
                <p>
                  Our team of <strong>best lawyers</strong> includes <strong>civil case experts</strong>, <strong>criminal case experts</strong>, <strong>corporate case experts</strong>, <strong>family case experts</strong>, <strong>property case experts</strong>, and <strong>revenue case experts</strong>. We ensure that every client receives personalized attention and strategic representation tailored to their unique needs.
                </p>
              </div>
              <div className="about-features">
                {['Expert Legal Team', 'Proven Track Record', 'Client-Focused Approach'].map((feature, idx) => (
                  <div key={idx} className="about-feature">
                    <CheckCircle2 size={22} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-services">
              {services.map((service, idx) => {
                const IconComponent = service.icon
                return (
                  <div key={idx} className="service-card">
                    <div className="service-icon">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-desc">{service.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-section home-features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Advocate Firm</h2>
            <p className="section-subtitle">Excellence in every aspect of legal representation as one of the best advocates in India</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="feature-item" style={{ '--delay': `${index * 0.15}s` }}>
                  <div className="feature-icon" style={{ background: feature.gradient }}>
                    <IconComponent size={40} color="white" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-text">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="home-section home-practice">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Scale size={24} />
            </div>
            <h2 className="section-title">Our Practice Areas</h2>
            <p className="section-subtitle">Comprehensive legal expertise across diverse domains</p>
          </div>
          <div className="practice-wrapper">
            <button 
              className="carousel-nav carousel-prev"
              onClick={() => {
                if (practiceCarouselRef.current) {
                  const cardWidth = practiceCarouselRef.current.querySelector('.practice-item')?.offsetWidth || 320
                  practiceCarouselRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' })
                }
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="practice-carousel" ref={practiceCarouselRef}>
              {practiceAreas.map((area) => (
                <div key={area.id} className="practice-item">
                  <Card
                    icon={area.icon}
                    title={area.title}
                    description={area.description.substring(0, 120) + '...'}
                    link={`/practice-areas/${area.slug}`}
                    linkText="Learn more"
                  />
                </div>
              ))}
            </div>
            <button 
              className="carousel-nav carousel-next"
              onClick={() => {
                if (practiceCarouselRef.current) {
                  const cardWidth = practiceCarouselRef.current.querySelector('.practice-item')?.offsetWidth || 320
                  practiceCarouselRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' })
                }
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="section-footer">
            <Link to="/practice-areas" className="btn-link">
              <span>Explore All Practice Areas</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="home-section home-news">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Newspaper size={24} />
            </div>
            <h2 className="section-title">Latest Legal News & Updates</h2>
            <p className="section-subtitle">Stay informed with the latest developments in law</p>
          </div>
          <div className="news-grid">
            {news.map((article) => (
              <article key={article.id} className="news-item">
                <div className="news-meta">
                  <span className="news-category">{article.category}</span>
                  <time className="news-date">{new Date(article.published_date).toLocaleDateString()}</time>
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-excerpt">{article.summary}</p>
                <Link to={`/legal-news/${article.slug}`} className="news-link">
                  Read Article
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/legal-news" className="btn-link btn-link-secondary">
              <span>View All News</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="home-section home-testimonials">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <Star size={24} />
              </div>
              <h2 className="section-title">What Our Clients Say</h2>
              <p className="section-subtitle">Trusted by clients across Rajasthan</p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-item">
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
              <Link to="/testimonials" className="btn-link btn-link-secondary">
                <span>Read All Testimonials</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="home-section home-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">
              <Sparkles size={80} />
            </div>
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-text">
              Contact us today for a consultation. Our experienced advocates are ready to assist you 
              with your legal matters and provide the expert guidance you need.
            </p>
            <div className="cta-actions">
              <Link to="/enquiry" className="btn-hero btn-hero-primary btn-hero-large">
                <span>Submit an Enquiry</span>
              </Link>
              <Link to="/appointment" className="btn-hero btn-hero-outline btn-hero-large">
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
