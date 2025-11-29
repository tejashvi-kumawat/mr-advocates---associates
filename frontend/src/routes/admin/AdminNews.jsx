import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, GripVertical, Search, X } from 'lucide-react'
import api from '../../services/api'
import AdminTableControls from '../../components/admin/AdminTableControls'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ToastContainer from '../../components/admin/ToastContainer'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useToast } from '../../hooks/useToast'

function AdminNews() {
  const [news, setNews] = useState([])
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
        api.patch(`/admin/news/${item.id}/`, { order: index + 1 })
      )
      await Promise.all(updates)
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  const { draggedItem, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop(
    news,
    (updatedItems) => {
      setNews(updatedItems)
      updateOrder(updatedItems)
    }
  )

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await api.getAdminNews()
      const data = response.data.results || response.data
      const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0))
      setNews(sorted)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id, item) => {
    navigate(`/secret-admin-portal-2024/news/edit/${id}`)
  }

  const handleView = (id, item) => {
    setSelectedItemDetails(item)
  }

  const filteredNews = useMemo(() => {
    let filtered = news

    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.author_name?.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filterValue) {
      if (filterValue === 'published') {
        filtered = filtered.filter(item => item.is_published)
      } else if (filterValue === 'draft') {
        filtered = filtered.filter(item => !item.is_published)
      }
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category?.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const filterDate = new Date(now)
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.published_date || item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.published_date || item.created_at)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.published_date || item.created_at)
          return itemDate >= filterDate
        })
      }
    }

    // Letter filter (A-Z)
    if (letterFilter) {
      filtered = filtered.filter(item => {
        const firstLetter = (item.title || item.name || '').charAt(0).toUpperCase()
        return firstLetter === letterFilter
      })
    }

    return filtered
  }, [news, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

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
        await api.deleteAdminNews(data.id)
        setNews(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.deleteAdminNews(id)))
        setNews(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
      showSuccess('Item deleted successfully')
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(news.map(item => item.category).filter(Boolean))]
    return cats
  }, [news])

  const handleSelectAll = () => {
    selectAll(filteredNews)
  }

  if (loading) return <div className="loading">Loading news...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <button
              onClick={() => navigate('/secret-admin-portal-2024/news/create')}
              className="btn btn-primary btn-compact"
            >
              + Create New Article
            </button>
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredNews.length > 0}
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
              categories={categories}
              filterOptions={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' }
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
                handleEdit(firstSelected, news.find(n => n.id === firstSelected))
              }}
              onDelete={handleBulkDelete}
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, news.find(n => n.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={news.find(n => n.id === Array.from(selectedItems)[0])}
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
          title={confirmDialog.type === 'deleteAll' ? 'Delete All Items' : confirmDialog.type === 'bulk' ? 'Delete Selected Items' : 'Delete Item'}
          message={
            confirmDialog.type === 'deleteAll' 
              ? `Are you sure you want to delete all ${confirmDialog.data?.count || 0} filtered items? This action cannot be undone.`
              : confirmDialog.type === 'bulk'
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
                <h2>Article Details</h2>
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
                    <strong>Category:</strong>
                    <span style={{ textTransform: 'capitalize' }}>{selectedItemDetails.category}</span>
                  </div>
                  <div className="details-item">
                    <strong>Author:</strong>
                    <span>{selectedItemDetails.author_name || 'N/A'}</span>
                  </div>
                  <div className="details-item">
                    <strong>Views:</strong>
                    <span>{selectedItemDetails.views}</span>
                  </div>
                  <div className="details-item">
                    <strong>Published Date:</strong>
                    <span>{selectedItemDetails.published_date ? new Date(selectedItemDetails.published_date).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="details-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${selectedItemDetails.is_published ? 'completed' : 'pending'}`}>
                      {selectedItemDetails.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {selectedItemDetails.summary && (
                    <div className="details-item details-item-full">
                      <strong>Summary:</strong>
                      <p>{selectedItemDetails.summary}</p>
                    </div>
                  )}
                  {selectedItemDetails.content && (
                    <div className="details-item details-item-full">
                      <strong>Content:</strong>
                      <div dangerouslySetInnerHTML={{ __html: selectedItemDetails.content }} />
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
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Views</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {news.length === 0 ? 'No articles found. Create your first article!' : 'No articles match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredNews.map(article => (
                  <tr
                    key={article.id}
                    className={`admin-table-row ${selectedItems.has(article.id) ? 'row-selected' : ''} ${draggedItem?.id === article.id ? 'dragging' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, article)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, article)}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleLongPressStart(article.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(article.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => handleRowClick(article.id, e)}
                  >
                    <td className="drag-handle">
                      <GripVertical size={18} />
                    </td>
                    <td>{article.title}</td>
                    <td style={{ textTransform: 'capitalize' }}>{article.category}</td>
                    <td>{article.author_name || 'N/A'}</td>
                    <td>{article.views}</td>
                    <td>{article.published_date ? new Date(article.published_date).toLocaleDateString() : '-'}</td>
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

export default AdminNews
