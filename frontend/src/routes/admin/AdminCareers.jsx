import React, { useState, useEffect } from 'react'
import { Briefcase, Eye, Download, X } from 'lucide-react'
import api from '../../services/api'

function AdminCareers() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await api.get('/admin/careers/')
      setApplications(response.data.results || response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading applications...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Briefcase size={32} /> Career Applications
          </h1>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map(application => (
                  <tr key={application.id}>
                    <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{application.name}</td>
                    <td>{application.email}</td>
                    <td>{application.position}</td>
                    <td>{application.experience_years} years</td>
                    <td>
                      <span className={`status-badge ${application.status}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>{new Date(application.created_at).toLocaleDateString()}</td>
                    <td className="admin-table-actions">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="btn-icon"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {application.resume_url && (
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="Download Resume"
                        >
                          <Download size={18} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedApplication && (
          <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>Application Details</h2>
                <button onClick={() => setSelectedApplication(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                  <div>
                    <p><strong>Name:</strong> {selectedApplication.name}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p><strong>Position:</strong> {selectedApplication.position}</p>
                    <p><strong>Experience:</strong> {selectedApplication.experience_years} years</p>
                    <p><strong>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h3>Education</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedApplication.education}</p>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h3>Cover Letter</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedApplication.cover_letter}</p>
                </div>

                {selectedApplication.resume_url && (
                  <div>
                    <a
                      href={selectedApplication.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                    >
                      <Download size={18} /> Download Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCareers
