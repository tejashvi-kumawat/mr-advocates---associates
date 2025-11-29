import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, X } from 'lucide-react'
import api from '../../services/api'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ToastContainer from '../../components/admin/ToastContainer'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useToast } from '../../hooks/useToast'

function AdminSEO() {
  const [seoPages, setSeoPages] = useState([])
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
    fetchSEO()
  }, [])

  const fetchSEO = async () => {
    try {
      const response = await api.getAdminSEO()
      const data = response.data.results || response.data
      setSeoPages(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id, item) => {
    navigate(`/secret-admin-portal-2024/seo/edit/${id}`)
  }

  const handleView = (id, item) => {
    setSelectedItemDetails(item)
  }

  const filteredSEO = useMemo(() => {
    let filtered = seoPages

    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(item => 
        item.page_name?.toLowerCase().includes(searchLower) ||
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.keywords?.toLowerCase().includes(searchLower)
      )
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const filterDate = new Date(now)
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.updated_at || item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.updated_at || item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.updated_at || item.created_at)
          return itemDate >= filterDate
        })
      }
    }

    // Letter filter (A-Z)
    if (letterFilter) {
      filtered = filtered.filter(item => {
        const firstLetter = (item.page_name || item.title || '').charAt(0).toUpperCase()
        return firstLetter === letterFilter
      })
    }

    return filtered
  }, [seoPages, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

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
        await api.deleteAdminSEO(data.id)
        setSeoPages(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.deleteAdminSEO(id)))
        setSeoPages(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
      showSuccess('Item(s) deleted successfully')
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  const handleSelectAll = () => {
    selectAll(filteredSEO)
  }

  if (loading) return <div className="loading">Loading SEO metadata...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <button 
              onClick={() => navigate('/secret-admin-portal-2024/seo/create')}
              className="btn btn-primary btn-compact"
            >
              + Add Page SEO
            </button>
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredSEO.length > 0}
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
              filterOptions={[]}
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
                handleEdit(firstSelected, seoPages.find(s => s.id === firstSelected))
              }}
              onDelete={handleBulkDelete}
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, seoPages.find(s => s.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={seoPages.find(s => s.id === Array.from(selectedItems)[0])}
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
                <h2>SEO Metadata Details</h2>
                <button onClick={() => setSelectedItemDetails(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-card">
                  <div className="details-item">
                    <strong>Page Name:</strong>
                    <span>{selectedItemDetails.page_name}</span>
                  </div>
                  <div className="details-item">
                    <strong>Title:</strong>
                    <span>{selectedItemDetails.title}</span>
                  </div>
                  <div className="details-item">
                    <strong>Description:</strong>
                    <span>{selectedItemDetails.description}</span>
                  </div>
                  <div className="details-item">
                    <strong>Keywords:</strong>
                    <span>{selectedItemDetails.keywords || '-'}</span>
                  </div>
                  {selectedItemDetails.og_image_url && (
                    <div className="details-item">
                      <strong>OG Image:</strong>
                      <img 
                        src={selectedItemDetails.og_image_url} 
                        alt="OG Image" 
                        style={{ maxWidth: '300px', marginTop: 'var(--spacing-sm)' }}
                      />
                    </div>
                  )}
                  <div className="details-item">
                    <strong>Last Updated:</strong>
                    <span>{new Date(selectedItemDetails.updated_at).toLocaleString()}</span>
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
                <th>Page Name</th>
                <th>Title</th>
                <th>Description</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredSEO.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {seoPages.length === 0 ? 'No SEO metadata found. Add metadata for your pages.' : 'No SEO metadata match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredSEO.map(seo => (
                  <tr
                    key={seo.id}
                    className={`admin-table-row ${selectedItems.has(seo.id) ? 'row-selected' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    onMouseDown={() => handleLongPressStart(seo.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(seo.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => handleRowClick(seo.id, e)}
                  >
                    <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{seo.page_name}</td>
                    <td style={{ maxWidth: '250px' }}>{seo.title}</td>
                    <td style={{ maxWidth: '300px', fontSize: 'var(--font-size-small)' }}>
                      {seo.description && seo.description.length > 100 
                        ? `${seo.description.substring(0, 100)}...` 
                        : seo.description}
                    </td>
                    <td>{new Date(seo.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius-lg)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FileText size={24} /> SEO Best Practices
          </h3>
          <ul style={{ paddingLeft: 'var(--spacing-lg)', lineHeight: '1.8' }}>
            <li><strong>Title:</strong> Keep between 50-60 characters. Include main keyword.</li>
            <li><strong>Description:</strong> Keep between 150-160 characters. Include call-to-action.</li>
            <li><strong>Keywords:</strong> Use relevant keywords separated by commas.</li>
            <li><strong>OG Image:</strong> Use 1200x630px image for social media sharing.</li>
          </ul>
        </div>
        
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  )
}

export default AdminSEO
