import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react'

function Contact() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        
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
                  Civil Lines<br />
                  Jaipur, Rajasthan 302006<br />
                  India
                </p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={24} />
              </div>
              <div className="contact-info-content">
                <h4>Phone</h4>
                <p>+91 141 XXX XXXX</p>
                <p>+91 98XXX XXXXX (Mobile)</p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={24} />
              </div>
              <div className="contact-info-content">
                <h4>Email</h4>
                <p>info@mradvocates.in</p>
                <p>enquiry@mradvocates.in</p>
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
              height: '300px', 
              backgroundColor: 'var(--color-bg-alt)', 
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--color-border)'
            }}>
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Map size={32} opacity={0.5} />
                <span>Map Placeholder</span>
                <small>Embed Google Maps iframe here</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
