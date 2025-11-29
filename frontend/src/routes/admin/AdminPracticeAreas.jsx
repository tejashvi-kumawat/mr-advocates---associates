import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, GripVertical, Search, X } from 'lucide-react'
import api from '../../services/api'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ToastContainer from '../../components/admin/ToastContainer'
import Icon from '../../components/Icon'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useToast } from '../../hooks/useToast'

function AdminPracticeAreas() {
  const [areas, setAreas] = useState([])
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
        api.patch(`/admin/practice-areas/${item.id}/`, { order: index + 1 })
      )
      await Promise.all(updates)
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  const { draggedItem, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop(
    areas,
    (updatedItems) => {
      setAreas(updatedItems)
      updateOrder(updatedItems)
    }
  )

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await api.getAdminPracticeAreas()
      const sorted = response.data.sort((a, b) => (a.order || 0) - (b.order || 0))
      setAreas(sorted)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id, item) => {
    navigate(`/secret-admin-portal-2024/practice-areas/edit/${id}`)
  }

  const handleView = (id, item) => {
    setSelectedItemDetails(item)
  }

  const filteredAreas = useMemo(() => {
    let filtered = areas

    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.slug?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }

    if (filterValue) {
      if (filterValue === 'active') {
        filtered = filtered.filter(item => item.is_active)
      } else if (filterValue === 'inactive') {
        filtered = filtered.filter(item => !item.is_active)
      }
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
        const firstLetter = (item.title || '').charAt(0).toUpperCase()
        return firstLetter === letterFilter
      })
    }

    return filtered
  }, [areas, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

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
        await api.deleteAdminPracticeArea(data.id)
        setAreas(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.deleteAdminPracticeArea(id)))
        setAreas(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
      showSuccess('Item deleted successfully')
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  const handleSelectAll = () => {
    selectAll(filteredAreas)
  }

  if (loading) return <div className="loading">Loading practice areas...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <button
              onClick={() => navigate('/secret-admin-portal-2024/practice-areas/create')}
              className="btn btn-primary btn-compact"
            >
              + Create New Area
            </button>
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredAreas.length > 0}
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
              categories={[]}
              filterOptions={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
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
                handleEdit(firstSelected, areas.find(a => a.id === firstSelected))
              }}
              onDelete={handleBulkDelete}
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, areas.find(a => a.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={areas.find(a => a.id === Array.from(selectedItems)[0])}
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
                <h2>Practice Area Details</h2>
                <button onClick={() => setSelectedItemDetails(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-card">
                  <div className="details-item">
                    <strong>Title:</strong>
                    <span>{selectedItemDetails.title}</span>
                  </div>
                  <div className="details-item">
                    <strong>Slug:</strong>
                    <span>{selectedItemDetails.slug}</span>
                  </div>
                  <div className="details-item">
                    <strong>Icon:</strong>
                    <span>
                      {selectedItemDetails.icon && typeof selectedItemDetails.icon === 'string' && !/[\u{1F300}-\u{1F9FF}]/u.test(selectedItemDetails.icon) ? (
                        <Icon name={selectedItemDetails.icon} size={24} color="currentColor" />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>{selectedItemDetails.icon}</span>
                      )}
                    </span>
                  </div>
                  <div className="details-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${selectedItemDetails.is_active ? 'completed' : 'pending'}`}>
                      {selectedItemDetails.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {selectedItemDetails.description && (
                    <div className="details-item details-item-full">
                      <strong>Description:</strong>
                      <p>{selectedItemDetails.description}</p>
                    </div>
                  )}
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
                <th>Icon</th>
                <th>Title</th>
                <th>Slug</th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {areas.length === 0 ? 'No practice areas found.' : 'No practice areas match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredAreas.map(area => (
                  <tr
                    key={area.id}
                    className={`admin-table-row ${selectedItems.has(area.id) ? 'row-selected' : ''} ${draggedItem?.id === area.id ? 'dragging' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, area)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, area)}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleLongPressStart(area.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(area.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => handleRowClick(area.id, e)}
                  >
                    <td className="drag-handle">
                      <GripVertical size={18} />
                    </td>
                    <td>
                      {area.icon && typeof area.icon === 'string' && !/[\u{1F300}-\u{1F9FF}]/u.test(area.icon) ? (
                        <Icon name={area.icon} size={24} color="currentColor" />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>{area.icon}</span>
                      )}
                    </td>
                    <td>{area.title}</td>
                    <td>{area.slug}</td>
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

export default AdminPracticeAreas
