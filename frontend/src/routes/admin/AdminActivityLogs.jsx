import React, { useState, useEffect } from 'react'
import { ClipboardList } from 'lucide-react'
import api from '../../services/api'

function AdminActivityLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await api.getAdminActivityLogs({ page_size: 50 })
      setLogs(response.data.results || response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading activity logs...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <ClipboardList size={32} /> Activity Logs
          </h1>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Model</th>
                <th>Object ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{log.username}</td>
                    <td>{log.action}</td>
                    <td>{log.model_name}</td>
                    <td>{log.object_id || '-'}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminActivityLogs
