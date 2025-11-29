import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, GripVertical, Search, X } from 'lucide-react'
import api from '../../services/api'
import CombinedFilters from '../../components/admin/CombinedFilters'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ToastContainer from '../../components/admin/ToastContainer'
import { useSelectionMode } from '../../hooks/useSelectionMode'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useToast } from '../../hooks/useToast'

function AdminTeam() {
  const [team, setTeam] = useState([])
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

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const response = await api.getAdminTeam()
      // Sort by order
      const sorted = response.data.sort((a, b) => (a.order || 0) - (b.order || 0))
      setTeam(sorted)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrder = async (items) => {
    try {
      const updates = items.map((item, index) => 
        api.patch(`/admin/team/${item.id}/`, { order: index + 1 })
      )
      await Promise.all(updates)
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  const { draggedItem, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop(
    team,
    (updatedItems) => {
      setTeam(updatedItems)
      updateOrder(updatedItems)
    }
  )

  const filteredTeam = useMemo(() => {
    let filtered = team

    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.role?.toLowerCase().includes(searchLower) ||
        item.specialization?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filterValue) {
      if (filterValue === 'active') {
        filtered = filtered.filter(item => item.is_active)
      } else if (filterValue === 'inactive') {
        filtered = filtered.filter(item => !item.is_active)
      }
    }

    // Category filter (role)
    if (categoryFilter) {
      filtered = filtered.filter(item => item.role?.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const filterDate = new Date(now)
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.created_at || item.joined_date)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.created_at || item.joined_date)
          return itemDate >= filterDate
        })
      } else if (dateFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.created_at || item.joined_date)
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
  }, [team, searchValue, filterValue, categoryFilter, dateFilter, letterFilter])

  const handleEdit = (id, item) => {
    navigate(`/secret-admin-portal-2024/team/edit/${id}`)
  }

  const handleView = (id, item) => {
    setSelectedItemDetails(item)
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
        await api.deleteAdminTeam(data.id)
        setTeam(prev => prev.filter(item => item.id !== data.id))
        setSelectedItems(prev => {
          const next = new Set(prev)
          next.delete(data.id)
          return next
        })
      } else if (type === 'bulk') {
        const itemsToDelete = Array.from(selectedItems)
        await Promise.all(itemsToDelete.map(id => api.deleteAdminTeam(id)))
        setTeam(prev => prev.filter(item => !selectedItems.has(item.id)))
        setSelectedItems(new Set())
      }
      setConfirmDialog({ isOpen: false, type: '', data: null })
      showSuccess('Item deleted successfully')
    } catch (err) {
      showError('Failed to delete: ' + err.message)
      setConfirmDialog({ isOpen: false, type: '', data: null })
    }
  }

  // Get unique roles for filter
  const roles = useMemo(() => {
    const roleList = [...new Set(team.map(item => item.role).filter(Boolean))]
    return roleList
  }, [team])

  const handleSelectAll = () => {
    selectAll(filteredTeam)
  }

  if (loading) return <div className="loading">Loading team members...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-buttons">
            <button
              onClick={() => navigate('/secret-admin-portal-2024/team/create')}
              className="btn btn-primary btn-compact"
            >
              + Add Team Member
            </button>
            <SelectionModeControls
              selectionMode={selectionMode}
              onToggle={toggleSelectionMode}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              hasItems={filteredTeam.length > 0}
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
              categories={roles}
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
                handleEdit(firstSelected, team.find(t => t.id === firstSelected))
              }}
              onDelete={handleBulkDelete}
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, team.find(t => t.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={team.find(t => t.id === Array.from(selectedItems)[0])}
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
                <h2>Team Member Details</h2>
                <button onClick={() => setSelectedItemDetails(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-card">
                  <div className="details-item">
                    <strong>Name:</strong>
                    <span>{selectedItemDetails.name}</span>
                  </div>
                  <div className="details-item">
                    <strong>Email:</strong>
                    <span>{selectedItemDetails.email}</span>
                  </div>
                  <div className="details-item">
                    <strong>Role:</strong>
                    <span style={{ textTransform: 'capitalize' }}>{selectedItemDetails.role?.replace(/_/g, ' ') || '-'}</span>
                  </div>
                  <div className="details-item">
                    <strong>Specialization:</strong>
                    <span>{selectedItemDetails.specialization || '-'}</span>
                  </div>
                  <div className="details-item">
                    <strong>Phone:</strong>
                    <span>{selectedItemDetails.phone || '-'}</span>
                  </div>
                  <div className="details-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${selectedItemDetails.is_active ? 'completed' : 'pending'}`}>
                      {selectedItemDetails.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {selectedItemDetails.bio && (
                    <div className="details-item details-item-full">
                      <strong>Bio:</strong>
                      <p>{selectedItemDetails.bio}</p>
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
                <th>Name</th>
                <th>Role</th>
                <th>Specialization</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    {team.length === 0 ? 'No team members found.' : 'No team members match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredTeam.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`admin-table-row ${selectedItems.has(member.id) ? 'row-selected' : ''} ${draggedItem?.id === member.id ? 'dragging' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, member)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, member)}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleLongPressStart(member.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(member.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => handleRowClick(member.id, e)}
                  >
                    <td className="drag-handle">
                      <GripVertical size={18} />
                    </td>
                    <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{member.role?.replace(/_/g, ' ') || '-'}</td>
                    <td>{member.specialization || '-'}</td>
                    <td>{member.email || '-'}</td>
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

export default AdminTeam

