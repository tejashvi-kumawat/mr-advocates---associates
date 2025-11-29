import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Mail, Calendar, Mailbox, Newspaper, FolderOpen, Star } from 'lucide-react'
import api from '../../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.getDashboardStats()
      setStats(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">

        </div>

        <div className="admin-stats">
          <Link to="/secret-admin-portal-2024/enquiries" className="stat-card">
            <div className="stat-card-icon">
              <Mail size={32} />
            </div>
            <div className="stat-card-value">{stats.total_enquiries}</div>
            <div className="stat-card-label">Total Enquiries</div>
            {stats.new_enquiries > 0 && (
              <div style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-small)', color: 'var(--color-warning)' }}>
                {stats.new_enquiries} new
              </div>
            )}
          </Link>

          <Link to="/secret-admin-portal-2024/appointments" className="stat-card">
            <div className="stat-card-icon">
              <Calendar size={32} />
            </div>
            <div className="stat-card-value">{stats.total_appointments}</div>
            <div className="stat-card-label">Total Appointments</div>
            {stats.pending_appointments > 0 && (
              <div style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-small)', color: 'var(--color-warning)' }}>
                {stats.pending_appointments} pending
              </div>
            )}
          </Link>

          <Link to="/secret-admin-portal-2024/subscribers" className="stat-card">
            <div className="stat-card-icon">
              <Mailbox size={32} />
            </div>
            <div className="stat-card-value">{stats.total_subscribers}</div>
            <div className="stat-card-label">Newsletter Subscribers</div>
          </Link>

          <Link to="/secret-admin-portal-2024/news" className="stat-card">
            <div className="stat-card-icon">
              <Newspaper size={32} />
            </div>
            <div className="stat-card-value">{stats.total_news}</div>
            <div className="stat-card-label">News Articles</div>
          </Link>

          <Link to="/secret-admin-portal-2024/case-studies" className="stat-card">
            <div className="stat-card-icon">
              <FolderOpen size={32} />
            </div>
            <div className="stat-card-value">{stats.total_case_studies}</div>
            <div className="stat-card-label">Case Studies</div>
          </Link>

          <Link to="/secret-admin-portal-2024/testimonials" className="stat-card">
            <div className="stat-card-icon">
              <Star size={32} />
            </div>
            <div className="stat-card-value">{stats.total_testimonials}</div>
            <div className="stat-card-label">Testimonials</div>
          </Link>
        </div>

        <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
          <div>
            <h2>Recent Enquiries</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_enquiries.map(enquiry => (
                    <tr key={enquiry.id}>
                      <td>{enquiry.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{enquiry.matter_type}</td>
                      <td><span className={`status-badge ${enquiry.status}`}>{enquiry.status.replace('_', ' ')}</span></td>
                      <td>{new Date(enquiry.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2>Recent Appointments</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_appointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.name}</td>
                      <td>{new Date(appointment.preferred_date).toLocaleDateString()}</td>
                      <td><span className={`status-badge ${appointment.status}`}>{appointment.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
