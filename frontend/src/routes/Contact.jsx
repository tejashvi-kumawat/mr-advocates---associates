import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

function Contact() {
  // SEO Optimization
  useSEO({
    title: 'Contact Best Advocates in Jaipur | Best Lawyer Firm | M.R. Advocates & Associates',
    description: 'Contact best advocate firm in Jaipur, Rajasthan. Get expert legal consultation from top lawyers in India. Phone: +91-9782828393. Email: info@mradvocates.in',
    keywords: 'contact best advocates jaipur, contact best lawyers india, advocate firm contact, lawyer firm contact, legal consultation expert, best law firm contact, top advocate firm jaipur',
    canonical: 'https://www.mradvocates.in/contact'
  })

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Contact Best Advocate Firm in Jaipur - Best Lawyers in India</h1>
        
        <div className="grid grid-2" style={{ gap: 'var(--spacing-2xl)' }}>
          <div className="contact-info">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Get in Touch</h2>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-info-content">
                <h4>Office Address</h4>
                <p>
                  M.R. Advocates and Associates<br />
                  Jaipur, Rajasthan<br />
                  India
                </p>
                <a 
                  href="https://maps.app.goo.gl/Ak53oHoddHGhCJTV8?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--color-accent)', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    marginTop: 'var(--spacing-xs)',
                    fontSize: 'var(--font-size-small)'
                  }}
                >
                  <Map size={16} />
                  <span>View on Google Maps</span>
                </a>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={24} />
              </div>
              <div className="contact-info-content">
                <h4>Phone</h4>
                <a href='tel:+919782828393'>Phone: +91 9782828393</a>
                <a href='tel:+919887555345'>Phone: +91 9887555345</a>
                <a href='tel:+919799548126'>Phone: +91 9799548126</a>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={24} />
              </div>
              <div className="contact-info-content">
                <h4>Email</h4>
                <a href='mailto:rakeshkumawat17011980@gmail.com'>rakeshkumawat17011980@gmail.com</a>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Clock size={24} />
              </div>
              <div className="contact-info-content">
                <h4>Working Hours</h4>
                <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Contact</h2>
            <div style={{ 
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--color-bg-alt)',
              borderRadius: 'var(--border-radius-lg)',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                Have a legal matter to discuss? Get in touch with us today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <Link to="/enquiry" className="btn btn-primary">Submit an Enquiry</Link>
                <Link to="/appointment" className="btn btn-secondary">Book an Appointment</Link>
              </div>
            </div>
            
            <div style={{ 
              marginTop: 'var(--spacing-xl)',
              width: '100%', 
              height: '400px', 
              borderRadius: 'var(--border-radius-lg)',
              overflow: 'hidden',
              border: '2px solid var(--color-border)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.747455!3d27.074699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDA0JzI4LjkiTiA3NcKwNDQnNTAuOCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=27.074699,75.747455"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="M.R. Advocates and Associates Location"
              ></iframe>
            </div>
            <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
              <a 
                href="https://maps.app.goo.gl/Ak53oHoddHGhCJTV8?g_st=aw" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--color-accent)', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  fontSize: 'var(--font-size-small)'
                }}
              >
                <Map size={16} />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
