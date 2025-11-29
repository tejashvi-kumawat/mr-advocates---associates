import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, CheckCircle2, GripVertical, Search, X } from 'lucide-react'
import StarRating from '../../components/StarRating'
import api from '../../services/api'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ToastContainer from '../../components/admin/ToastContainer'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useToast } from '../../hooks/useToast'

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [letterFilter, setLetterFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', data: null })
  const [selectedItemDetails, setSelectedItemDetails] = useState(null)
  const navigate = useNavigate()
  const { toasts, removeToast, error: showError, success: showSuccess } = useToast()

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

  const updateOrder = async (items) => {
    try {
      const updates = items.map((item, index) => 
        api.patch(`/admin/testimonials/${item.id}/`, { order: index + 1 })
      )
      await Promise.all(updates)
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  const { draggedItem, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop(
    testimonials,
    (updatedItems) => {
      setTestimonials(updatedItems)
      updateOrder(updatedItems)
    }
  )

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/admin/testimonials/')
      const sorted = response.data.sort((a, b) => (a.order || 0) - (b.order || 0))
      setTestimonials(sorted)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id, item) => {
    navigate(`/secret-admin-portal-2024/testimonials/edit/${id}`)
  }

  const handleView = (id, item) => {
    setSelectedItemDetails(item)
  }

  const filteredTestimonials = useMemo(() => {
    let filtered = testimonials

    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(item => 
        item.client_name?.toLowerCase().includes(searchLower) ||
        item.content?.toLowerCase().includes(searchLower) ||
        item.practice_area_name?.toLowerCase().includes(searchLower)
      )
    }

    if (filterValue) {
      if (filterValue === 'published') {
        filtered = filtered.filter(item => item.is_published)
      } else if (filterValue === 'hidden') {
        filtered = filtered.filter(item => !item.is_published)
      } else if (filterValue === 'featured') {
        filtered = filtered.filter(item => item.is_featured)
      }
    }

    // Category filter (practice area)
    if (categoryFilter) {
      filtered = filtered.filter(item => item.practice_area_name?.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const filterDate = new Date(now)
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.created_at)
          return itemDate >= filterDate
        })
      }
    }

    // Letter filter (A-Z)
    if (letterFilter) {
      filtered = filtered.filter(item => {
        const firstLetter = (item.client_name || '').charAt(0).toUpperCase()
        return firstLetter === letterFilter
      })
    }

    return filtered
  }, [testimonials, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

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
        await api.delete(`/admin/testimonials/${data.id}/`)
        setTestimonials(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.delete(`/admin/testimonials/${id}/`)))
        setTestimonials(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
      showSuccess('Item deleted successfully')
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  // Get unique practice areas for filter
  const practiceAreas = useMemo(() => {
    const areas = [...new Set(testimonials.map(item => item.practice_area_name).filter(Boolean))]
    return areas
  }, [testimonials])

  const handleSelectAll = () => {
    selectAll(filteredTestimonials)
  }

  if (loading) return <div className="loading">Loading testimonials...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <button
              onClick={() => navigate('/secret-admin-portal-2024/testimonials/create')}
              className="btn btn-primary btn-compact"
            >
              + Add New Testimonial
            </button>
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredTestimonials.length > 0}
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
              categories={practiceAreas}
              filterOptions={[
                { value: 'published', label: 'Published' },
                { value: 'hidden', label: 'Hidden' },
                { value: 'featured', label: 'Featured' }
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
              onEdit={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleEdit(firstSelected, testimonials.find(t => t.id === firstSelected))
              }}
              onDelete={handleBulkDelete}
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, testimonials.find(t => t.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={testimonials.find(t => t.id === Array.from(selectedItems)[0])}
              showEdit={true}
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

        {selectedItemDetails && (
          <div className="modal-overlay" onClick={() => setSelectedItemDetails(null)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Testimonial Details</h2>
                <button onClick={() => setSelectedItemDetails(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-card">
                  <div className="details-item">
                    <strong>Client Name:</strong>
                    <span>{selectedItemDetails.client_name}</span>
                  </div>
                  <div className="details-item">
                    <strong>Rating:</strong>
                    <span><StarRating rating={selectedItemDetails.rating} size={16} /></span>
                  </div>
                  <div className="details-item">
                    <strong>Practice Area:</strong>
                    <span>{selectedItemDetails.practice_area_name || '-'}</span>
                  </div>
                  <div className="details-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${selectedItemDetails.is_published ? 'completed' : 'pending'}`}>
                      {selectedItemDetails.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <div className="details-item">
                    <strong>Featured:</strong>
                    <span className={`status-badge ${selectedItemDetails.is_featured ? 'completed' : 'pending'}`}>
                      {selectedItemDetails.is_featured ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="details-item details-item-full">
                    <strong>Content:</strong>
                    <p>{selectedItemDetails.content}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    handleEdit(selectedItemDetails.id, selectedItemDetails)
                    setSelectedItemDetails(null)
                  }}
                  className="btn btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedItemDetails.id, selectedItemDetails)
                    setSelectedItemDetails(null)
                  }}
                  className="btn btn-danger"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedItemDetails(null)}
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
                <th style={{ width: '30px' }}></th>
                <th>Client Name</th>
                <th>Rating</th>
                <th>Practice Area</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {testimonials.length === 0 ? 'No testimonials found.' : 'No testimonials match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map(testimonial => (
                  <tr
                    key={testimonial.id}
                    className={`admin-table-row ${selectedItems.has(testimonial.id) ? 'row-selected' : ''} ${draggedItem?.id === testimonial.id ? 'dragging' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, testimonial)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, testimonial)}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleLongPressStart(testimonial.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(testimonial.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => handleRowClick(testimonial.id, e)}
                  >
                    <td className="drag-handle">
                      <GripVertical size={18} />
                    </td>
                    <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{testimonial.client_name}</td>
                    <td>
                      <StarRating rating={testimonial.rating} size={16} />
                    </td>
                    <td>{testimonial.practice_area_name || '-'}</td>
                    <td>{new Date(testimonial.created_at).toLocaleDateString()}</td>
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

export default AdminTestimonials
