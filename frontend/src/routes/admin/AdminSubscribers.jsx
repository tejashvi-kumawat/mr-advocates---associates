import React, { useState, useEffect } from 'react'
import { Mailbox, Download, Users, CheckCircle2, BarChart3, Search, Trash2, Filter } from 'lucide-react'
import api from '../../services/api'
import AdminTableControls from '../../components/admin/AdminTableControls'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [allSubscribers, setAllSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, item: null })

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    filterSubscribers()
  }, [searchTerm, statusFilter, allSubscribers])

  const fetchSubscribers = async () => {
    try {
      const response = await api.getAdminSubscribers()
      const data = response.data.results || response.data
      setAllSubscribers(data)
      setSubscribers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterSubscribers = () => {
    let filtered = [...allSubscribers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(sub => sub.is_active)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(sub => !sub.is_active)
    }

    setSubscribers(filtered)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(subscribers.map(sub => sub.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteAdminSubscriber(id)
      await fetchSubscribers()
      setSelectedItems(prev => prev.filter(item => item !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete subscriber')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedItems.map(id => api.deleteAdminSubscriber(id)))
      await fetchSubscribers()
      setSelectedItems([])
      setConfirmDialog({ open: false, type: null, item: null })
    } catch (err) {
      setError(err.message || 'Failed to delete subscribers')
    }
  }

  const handleDeleteAll = async () => {
    try {
      const idsToDelete = subscribers.map(sub => sub.id)
      await Promise.all(idsToDelete.map(id => api.deleteAdminSubscriber(id)))
      await fetchSubscribers()
      setSelectedItems([])
      setConfirmDialog({ open: false, type: null, item: null })
    } catch (err) {
      setError(err.message || 'Failed to delete subscribers')
    }
  }

  const confirmDelete = (type, item = null) => {
    setConfirmDialog({ open: true, type, item })
  }

  const handleConfirm = () => {
    if (confirmDialog.type === 'delete') {
      handleDelete(confirmDialog.item)
    } else if (confirmDialog.type === 'bulk') {
      handleBulkDelete()
    } else if (confirmDialog.type === 'deleteAll') {
      handleDeleteAll()
    }
    setConfirmDialog({ open: false, type: null, item: null })
  }

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Name', 'Status', 'Subscribed Date'],
      ...subscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.is_active ? 'Active' : 'Inactive',
        new Date(sub.subscribed_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) return <div className="loading">Loading subscribers...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Mailbox size={32} /> Newsletter Subscribers
          </h1>
          <div className="admin-header-actions">
            <button onClick={exportToCSV} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        <div className="admin-stats" style={{ marginBottom: 'var(--spacing-md)' }}>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Users size={32} />
            </div>
            <div className="stat-card-value">{allSubscribers.length}</div>
            <div className="stat-card-label">Total Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <CheckCircle2 size={32} />
            </div>
            <div className="stat-card-value">{allSubscribers.filter(s => s.is_active).length}</div>
            <div className="stat-card-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <BarChart3 size={32} />
            </div>
            <div className="stat-card-value">
              {allSubscribers.length > 0 ? Math.round((allSubscribers.filter(s => s.is_active).length / allSubscribers.length) * 100) : 0}%
            </div>
            <div className="stat-card-label">Engagement Rate</div>
          </div>
        </div>

        <AdminTableControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ]}
          selectedCount={selectedItems.length}
          onDeleteSelected={() => confirmDelete('bulk')}
          onDeleteAll={() => confirmDelete('deleteAll')}
          showDateFilter={false}
        />

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={selectedItems.length === subscribers.length && subscribers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Subscribed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {searchTerm || statusFilter !== 'all' ? 'No subscribers match your filters.' : 'No subscribers found.'}
                  </td>
                </tr>
              ) : (
                subscribers.map(subscriber => (
                  <tr key={subscriber.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="admin-checkbox"
                        checked={selectedItems.includes(subscriber.id)}
                        onChange={() => handleSelectItem(subscriber.id)}
                      />
                    </td>
                    <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{subscriber.email}</td>
                    <td>{subscriber.name || '-'}</td>
                    <td>
                      <span className={`status-badge ${subscriber.is_active ? 'completed' : 'closed'}`}>
                        {subscriber.is_active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td>{new Date(subscriber.subscribed_at).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => confirmDelete('delete', subscriber.id)}
                          className="btn-icon btn-danger"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: null, item: null })}
        onConfirm={handleConfirm}
        type={confirmDialog.type}
        title={
          confirmDialog.type === 'delete' ? 'Delete Subscriber' :
          confirmDialog.type === 'bulk' ? 'Delete Selected Subscribers' :
          'Delete All Filtered Subscribers'
        }
        message={
          confirmDialog.type === 'delete' ? 'Are you sure you want to delete this subscriber?' :
          confirmDialog.type === 'bulk' ? `Are you sure you want to delete ${selectedItems.length} selected subscriber(s)?` :
          `Are you sure you want to delete all ${subscribers.length} filtered subscriber(s)?`
        }
      />
    </div>
  )
}

export default AdminSubscribers
