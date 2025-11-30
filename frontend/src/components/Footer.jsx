import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const currentYear = new Date().getFullYear()

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setLoading(true)
    setMessage(null)

    try {
      const response = await api.subscribeNewsletter({ email: email.trim() })
      if (response.data && response.data.success) {
        setMessage({ type: 'success', text: response.data.message || 'Thank you for subscribing!' })
        setEmail('')
      } else {
        setMessage({ type: 'success', text: 'Thank you for subscribing!' })
        setEmail('')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.email?.[0] ||
                          error.message ||
                          'Subscription failed. You may already be subscribed.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>M.R. Advocates and Associates</h3>
            <p>
              Premier legal services in Jaipur, Rajasthan. Dedicated to providing exceptional legal representation with integrity and excellence.
            </p>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <h4>Subscribe to Newsletter</h4>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-sm)' }}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'var(--color-bg-light)',
                    fontSize: 'var(--font-size-small)'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: 'var(--spacing-xs) var(--spacing-md)',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-bg-light)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-sm)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </form>
              {message && (
                <p style={{ fontSize: 'var(--font-size-small)', marginTop: 'var(--spacing-xs)', color: message.type === 'success' ? '#a3d9a5' : '#f8d7da' }}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/practice-areas">Practice Areas</Link></li>
              <li><Link to="/team">Our Team</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/legal-news">Legal News</Link></li>
              <li><Link to="/case-studies">Case Studies</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal Services</h3>
            <ul>
              <li><Link to="/practice-areas">Civil Litigation</Link></li>
              <li><Link to="/practice-areas">Criminal Defense</Link></li>
              <li><Link to="/practice-areas">Corporate Law</Link></li>
              <li><Link to="/practice-areas">Property Law</Link></li>
              <li><Link to="/practice-areas">Family Law</Link></li>
              <li><Link to="/enquiry">Submit Enquiry</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>
              <strong>Address:</strong><br />
              <br />
              On Sikar Road, near Sunshine Resort &amp; Chirmi Dhaba,<br />
              Tantyawas, Jaipur, Rajasthan, India
            </p>
            <p>
              <strong>Phone:</strong><a href='tel:+919782828393'> +91 9782828393</a><br />
              <strong>Phone:</strong><a href='tel:+919887555345'> +91 9887555345</a><br />
              <strong>Phone:</strong><a href='tel:+919799548126'> +91 9799548126</a><br />
              <strong>Email:</strong><a href='mailto:rakeshkumawat17011980@gmail.com'> rakeshkumawat17011980@gmail.com</a>
            </p>
            <p>
              <strong>Hours:</strong><br />
              Mon-Fri: 10:00 AM - 6:00 PM<br />
              Sat: 10:00 AM - 2:00 PM
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} M.R. Advocates and Associates. All rights reserved. | <Link to="/faq" style={{ color: 'inherit' }}>FAQ</Link> | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
