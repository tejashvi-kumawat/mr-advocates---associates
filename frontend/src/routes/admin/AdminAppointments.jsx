import React, { useState, useEffect, useMemo } from 'react'
import { Search, X, Calendar } from 'lucide-react'
import api from '../../services/api'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ToastContainer from '../../components/admin/ToastContainer'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useToast } from '../../hooks/useToast'

function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [letterFilter, setLetterFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', data: null })
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' })

  const {
    selectedItems,
    selectionMode,
    handleLongPressStart,
    handleLongPressEnd,
    handleRowClick,
    handleSelectAll: selectAll,
    handleClearSelection,
    toggleSelectionMode,
    setSelectedItems
  } = useSelectionMode()

  const { toasts, removeToast, error: showError, success: showSuccess } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await api.getAdminAppointments()
      setAppointments(response.data.results || response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (id, item) => {
    setSelectedAppointment(item)
    setStatusUpdate({ status: item.status || '', notes: item.notes || '' })
  }

  const handleDelete = (id, item) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      data: { id, type: 'single' }
    })
  }

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return
    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      data: { count: selectedItems.size }
    })
  }

  const confirmDelete = async () => {
    const { type, data } = confirmDialog
    
    try {
      if (type === 'delete') {
        await api.delete(`/admin/appointments/${data.id}/`)
        setAppointments(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
        showSuccess('Appointment deleted successfully')
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.delete(`/admin/appointments/${id}/`)))
        setAppointments(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
        showSuccess(`${itemsToDelete.length} appointment(s) deleted successfully`)
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  const handleStatusUpdate = async (appointmentId) => {
    if (!statusUpdate.status) {
      showError('Please select a status')
      return
    }

    try {
      await api.updateAppointmentStatus(appointmentId, statusUpdate.status, statusUpdate.notes)
      fetchAppointments()
      setSelectedAppointment(null)
      setStatusUpdate({ status: '', notes: '' })
      showSuccess('Appointment status updated successfully')
    } catch (err) {
      showError('Failed to update: ' + err.message)
    }
  }

  const filteredAppointments = useMemo(() => {
    let filtered = appointments

    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.phone?.toLowerCase().includes(searchLower) ||
        item.matter_type?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter (using categoryFilter for status)
    if (categoryFilter) {
      filtered = filtered.filter(item => item.status === categoryFilter)
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const filterDate = new Date(now)
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.preferred_date || item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.preferred_date || item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.preferred_date || item.created_at)
          return itemDate >= filterDate
        })
      }
    }

    // Letter filter (A-Z)
    if (letterFilter) {
      filtered = filtered.filter(item => {
        const firstLetter = (item.name || '').charAt(0).toUpperCase()
        return firstLetter === letterFilter
      })
    }

    return filtered
  }, [appointments, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

  const handleSelectAll = () => {
    selectAll(filteredAppointments)
  }

  const matterTypes = ['civil', 'criminal', 'corporate', 'property', 'family', 'other']
  const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed']

  if (loading) return <div className="loading">Loading appointments...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredAppointments.length > 0}
            />
          </div>
          
          <div className="admin-search-box">
            <Search size={18} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="admin-search-input"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="admin-search-clear"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="admin-filters-wrapper">
            <CombinedFilters
              filtersOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
              filterValue={filterValue}
              onFilterChange={setFilterValue}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              letterFilter={letterFilter}
              onLetterChange={setLetterFilter}
              categories={statusOptions.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))}
              filterOptions={matterTypes.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))}
              onClearAll={() => {
                setSearchValue('')
                setFilterValue('')
                setCategoryFilter('')
                setDateFilter('')
                setLetterFilter('')
              }}
            />
          </div>
        </div>

        {selectedItems.size > 0 && (
          <div className="admin-bulk-actions">
            <span>{selectedItems.size} item(s) selected</span>
            <ActionsDropdown
              onDelete={handleBulkDelete}
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, appointments.find(a => a.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={appointments.find(a => a.id === Array.from(selectedItems)[0])}
              showEdit={false}
              showDelete={true}
              showView={true}
            />
          </div>
        )}

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, type: '', data: null })}
          onConfirm={confirmDelete}
          title={confirmDialog.type === 'bulk' ? 'Delete Selected Appointments' : 'Delete Appointment'}
          message={
            confirmDialog.type === 'bulk'
              ? `Are you sure you want to delete ${confirmDialog.data?.count || 0} selected appointment(s)? This action cannot be undone.`
              : 'Are you sure you want to delete this appointment? This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {selectedAppointment && (
          <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Appointment Details</h2>
                <button onClick={() => setSelectedAppointment(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="details-card">
                  <div className="details-item">
                    <strong>Name:</strong>
                    <span>{selectedAppointment.name}</span>
                  </div>
                  <div className="details-item">
                    <strong>Email:</strong>
                    <span>{selectedAppointment.email}</span>
                  </div>
                  <div className="details-item">
                    <strong>Phone:</strong>
                    <span>{selectedAppointment.phone}</span>
                  </div>
                  <div className="details-item">
                    <strong>Matter Type:</strong>
                    <span style={{ textTransform: 'capitalize' }}>{selectedAppointment.matter_type}</span>
                  </div>
                  <div className="details-item">
                    <strong>Preferred Date:</strong>
                    <span>{new Date(selectedAppointment.preferred_date).toLocaleDateString()}</span>
                  </div>
                  <div className="details-item">
                    <strong>Preferred Time:</strong>
                    <span>{selectedAppointment.preferred_time}</span>
                  </div>
                  {selectedAppointment.message && (
                    <div className="details-item">
                      <strong>Message:</strong>
                      <span>{selectedAppointment.message}</span>
                    </div>
                  )}
                  {selectedAppointment.notes && (
                    <div className="details-item">
                      <strong>Internal Notes:</strong>
                      <span>{selectedAppointment.notes}</span>
                    </div>
                  )}
                  <div className="details-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${selectedAppointment.status}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="details-item">
                    <strong>Created At:</strong>
                    <span>{new Date(selectedAppointment.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius-lg)' }}>
                  <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Update Status</h3>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                      placeholder="Add internal notes..."
                    />
                  </div>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppointment.id)}
                    className="btn btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => {
                    handleDelete(selectedAppointment.id, selectedAppointment)
                    setSelectedAppointment(null)
                  }}
                  className="btn btn-danger"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Matter Type</th>
                <th>Preferred Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {appointments.length === 0 ? 'No appointments found.' : 'No appointments match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(appointment => (
                  <tr
                    key={appointment.id}
                    className={`admin-table-row ${selectedItems.has(appointment.id) ? 'row-selected' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    onMouseDown={() => handleLongPressStart(appointment.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(appointment.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => handleRowClick(appointment.id, e)}
                  >
                    <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{appointment.name}</td>
                    <td>{appointment.email}</td>
                    <td>{appointment.phone}</td>
                    <td style={{ textTransform: 'capitalize' }}>{appointment.matter_type}</td>
                    <td>{new Date(appointment.preferred_date).toLocaleDateString()}</td>
                    <td>{appointment.preferred_time}</td>
                    <td>
                      <ActionsDropdown
                        onView={() => handleView(appointment.id, appointment)}
                        onDelete={() => handleDelete(appointment.id, appointment)}
                        itemId={appointment.id}
                        item={appointment}
                        showEdit={false}
                        showDelete={true}
                        showView={true}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  )
}

export default AdminAppointments
