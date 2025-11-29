import React, { useState, useEffect, useMemo } from 'react'
import { Mail, Eye, X, Search, Filter, Download, Calendar, Phone, User, FileText, MessageSquare } from 'lucide-react'
import api from '../../services/api'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ToastContainer from '../../components/admin/ToastContainer'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useToast } from '../../hooks/useToast'

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' })
  
  // Search and Filter States
  const [searchValue, setSearchValue] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [letterFilter, setLetterFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', data: null })

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

  const handleView = (id, item) => {
    setSelectedEnquiry(item)
    setStatusUpdate({ status: item.status || '', notes: item.notes || '' })
  }

  const handleSelectAll = () => {
    selectAll(filteredEnquiries)
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const response = await api.getAdminEnquiries()
      const data = response.data.results || response.data
      setEnquiries(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries

    // Search filter
    if (searchValue) {
      const query = searchValue.toLowerCase()
      filtered = filtered.filter(enquiry => 
        enquiry.name?.toLowerCase().includes(query) ||
        enquiry.email?.toLowerCase().includes(query) ||
        enquiry.phone?.toLowerCase().includes(query) ||
        enquiry.subject?.toLowerCase().includes(query) ||
        enquiry.message?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filterValue) {
      filtered = filtered.filter(enquiry => enquiry.status === filterValue)
    }

    // Matter type filter (category)
    if (categoryFilter) {
      filtered = filtered.filter(enquiry => enquiry.matter_type === categoryFilter)
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const filterDate = new Date(now)
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(enquiry => {
          const enquiryDate = new Date(enquiry.created_at)
          return enquiryDate >= filterDate
        })
      } else if (dateFilter === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(enquiry => {
          const enquiryDate = new Date(enquiry.created_at)
          return enquiryDate >= filterDate
        })
      } else if (dateFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(enquiry => {
          const enquiryDate = new Date(enquiry.created_at)
          return enquiryDate >= filterDate
        })
      }
    }

    // Letter filter (A-Z)
    if (letterFilter) {
      filtered = filtered.filter(enquiry => {
        const firstLetter = (enquiry.name || '').charAt(0).toUpperCase()
        return firstLetter === letterFilter
      })
    }

    return filtered
  }, [enquiries, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

  const handleStatusUpdate = async (enquiryId) => {
    if (!statusUpdate.status) {
      showError('Please select a status')
      return
    }

    try {
      await api.updateEnquiryStatus(enquiryId, statusUpdate.status, statusUpdate.notes)
      fetchEnquiries()
      setSelectedEnquiry(null)
      setStatusUpdate({ status: '', notes: '' })
      showSuccess('Status updated successfully')
    } catch (err) {
      showError('Failed to update: ' + err.message)
    }
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
        await api.delete(`/admin/enquiries/${data.id}/`)
        setEnquiries(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.delete(`/admin/enquiries/${id}/`)))
        setEnquiries(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
      showSuccess('Item(s) deleted successfully')
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  // Get unique matter types for filter
  const matterTypes = useMemo(() => {
    const types = [...new Set(enquiries.map(e => e.matter_type).filter(Boolean))]
    return types
  }, [enquiries])

  const exportEnquiries = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Matter Type', 'Subject', 'Status', 'Date', 'Message'].join(','),
      ...filteredEnquiries.map(e => [
        e.name,
        e.email,
        e.phone,
        e.matter_type,
        e.subject,
        e.status,
        new Date(e.created_at).toLocaleDateString(),
        e.message?.replace(/"/g, '""')
      ].map(field => `"${field || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }


  if (loading) return <div className="loading">Loading enquiries...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <button onClick={exportEnquiries} className="btn btn-secondary btn-compact" title="Export CSV">
              <Download size={18} />
              <span>Export</span>
            </button>
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredEnquiries.length > 0}
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
              categories={matterTypes}
              filterOptions={[
                { value: 'new', label: 'New' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' }
              ]}
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
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, filteredEnquiries.find(e => e.id === firstSelected))
              }}
              onDelete={handleBulkDelete}
              itemId={Array.from(selectedItems)[0]}
              item={filteredEnquiries.find(e => e.id === Array.from(selectedItems)[0])}
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
          title={confirmDialog.type === 'bulk' ? 'Delete Selected Items' : 'Delete Item'}
          message={
            confirmDialog.type === 'bulk'
              ? `Are you sure you want to delete ${confirmDialog.data?.count || 0} selected item(s)? This action cannot be undone.`
              : 'Are you sure you want to delete this item? This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />


        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Matter Type</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {enquiries.length === 0 ? 'No enquiries found.' : 'No enquiries match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map(enquiry => (
                  <tr
                    key={enquiry.id}
                    className={`admin-table-row ${selectedItems.has(enquiry.id) ? 'row-selected' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    onMouseDown={() => handleLongPressStart(enquiry.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(enquiry.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => {
                      handleRowClick(enquiry.id, e, () => handleView(enquiry.id, enquiry))
                    }}
                  >
                    <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.phone}</td>
                    <td style={{ textTransform: 'capitalize' }}>{enquiry.matter_type?.replace(/_/g, ' ')}</td>
                    <td>{enquiry.subject}</td>
                    <td>
                      <span className={`status-badge ${enquiry.status}`}>
                        {enquiry.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{new Date(enquiry.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Enquiry Details Modal */}
        {selectedEnquiry && (
          <div className="modal-overlay" onClick={() => setSelectedEnquiry(null)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Enquiry Details</h2>
                <button onClick={() => setSelectedEnquiry(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="enquiry-details-grid">
                  <div className="enquiry-detail-section">
                    <h3 className="enquiry-section-title">
                      <User size={20} />
                      Contact Information
                    </h3>
                    <div className="enquiry-detail-item">
                      <strong>Name:</strong>
                      <span>{selectedEnquiry.name}</span>
                    </div>
                    <div className="enquiry-detail-item">
                      <strong><Mail size={16} /> Email:</strong>
                      <span>{selectedEnquiry.email}</span>
                    </div>
                    <div className="enquiry-detail-item">
                      <strong><Phone size={16} /> Phone:</strong>
                      <span>{selectedEnquiry.phone}</span>
                    </div>
                    <div className="enquiry-detail-item">
                      <strong><Calendar size={16} /> Submitted:</strong>
                      <span>{new Date(selectedEnquiry.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="enquiry-detail-section">
                    <h3 className="enquiry-section-title">
                      <FileText size={20} />
                      Matter Details
                    </h3>
                    <div className="enquiry-detail-item">
                      <strong>Matter Type:</strong>
                      <span style={{ textTransform: 'capitalize' }}>
                        {selectedEnquiry.matter_type?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="enquiry-detail-item">
                      <strong>Subject:</strong>
                      <span>{selectedEnquiry.subject}</span>
                    </div>
                    <div className="enquiry-detail-item">
                      <strong>Current Status:</strong>
                      <span className={`status-badge ${selectedEnquiry.status}`}>
                        {selectedEnquiry.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="enquiry-message-section">
                  <h3 className="enquiry-section-title">
                    <MessageSquare size={20} />
                    Message
                  </h3>
                  <div className="enquiry-message-content">
                    {selectedEnquiry.message}
                  </div>
                </div>

                {selectedEnquiry.notes && (
                  <div className="enquiry-notes-section">
                    <h3 className="enquiry-section-title">Internal Notes</h3>
                    <div className="enquiry-notes-content">
                      {selectedEnquiry.notes}
                    </div>
                  </div>
                )}

                <div className="enquiry-update-section">
                  <h3 className="enquiry-section-title">Update Status</h3>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    >
                      <option value="">Select Status</option>
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Internal Notes</label>
                    <textarea
                      className="form-textarea"
                      rows="4"
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                      placeholder="Add internal notes about this enquiry..."
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      onClick={() => handleStatusUpdate(selectedEnquiry.id)}
                      className="btn btn-primary"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  )
}

export default AdminEnquiries
