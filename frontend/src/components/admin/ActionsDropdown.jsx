import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react'

function ActionsDropdown({ onEdit, onDelete, onView, itemId, item, showEdit = true, showDelete = true, showView = true }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleAction = (action) => {
    setIsOpen(false)
    if (action === 'edit' && onEdit) {
      onEdit(itemId, item)
    } else if (action === 'delete' && onDelete) {
      onDelete(itemId, item)
    } else if (action === 'view' && onView) {
      onView(itemId, item)
    }
  }

  return (
    <div className="actions-dropdown" ref={dropdownRef}>
      <button
        className="actions-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Actions"
      >
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div className="actions-dropdown-menu">
          {showView && (
            <button
              className="actions-dropdown-item"
              onClick={() => handleAction('view')}
            >
              <Eye size={16} />
              <span>Details</span>
            </button>
          )}
          {showEdit && (
            <button
              className="actions-dropdown-item"
              onClick={() => handleAction('edit')}
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          )}
          {showDelete && (
            <button
              className="actions-dropdown-item actions-dropdown-item-danger"
              onClick={() => handleAction('delete')}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionsDropdown

