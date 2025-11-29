import React, { useState, useRef, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import { Search, ChevronDown, X } from 'lucide-react'

// Popular legal/business icons
const popularIcons = [
  'Scale', 'Gavel', 'Briefcase', 'FileText', 'Shield', 'Users', 'Award',
  'BookOpen', 'FileCheck', 'Lock', 'Globe', 'TrendingUp', 'Target', 'Zap',
  'CheckCircle', 'AlertCircle', 'Clock', 'Calendar', 'Mail', 'Phone',
  'MapPin', 'Building', 'User', 'UserCheck', 'FileSearch', 'PenTool',
  'ClipboardList', 'FolderOpen', 'Archive', 'Database', 'Layers', 'Settings',
  'BarChart', 'PieChart', 'DollarSign', 'CreditCard', 'Receipt', 'Wallet',
  'Handshake', 'Heart', 'Star', 'ThumbsUp', 'MessageSquare', 'Bell',
  'Home', 'Building2', 'Landmark', 'GraduationCap', 'Book', 'Library'
]

function IconPicker({ value, onChange, label = 'Icon', required = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredIcons = popularIcons.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedIcon = value ? LucideIcons[value] : null

  const handleSelect = (iconName) => {
    onChange({ target: { name: 'icon', value: iconName } })
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange({ target: { name: 'icon', value: '' } })
  }

  return (
    <div className="form-group icon-picker-group">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="icon-picker-wrapper" ref={dropdownRef}>
        <button
          type="button"
          className="icon-picker-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="icon-picker-selected">
            {selectedIcon ? (
              <>
                {React.createElement(selectedIcon, { size: 20 })}
                <span>{value}</span>
              </>
            ) : (
              <span className="icon-picker-placeholder">Select an icon...</span>
            )}
          </div>
          <ChevronDown size={18} className={`icon-picker-chevron ${isOpen ? 'open' : ''}`} />
          {value && (
            <button
              type="button"
              className="icon-picker-clear"
              onClick={handleClear}
              title="Clear selection"
            >
              <X size={14} />
            </button>
          )}
        </button>

        {isOpen && (
          <div className="icon-picker-dropdown">
            <div className="icon-picker-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="icon-picker-search-input"
                autoFocus
              />
            </div>
            <div className="icon-picker-grid">
              {filteredIcons.length > 0 ? (
                filteredIcons.map(iconName => {
                  const IconComponent = LucideIcons[iconName]
                  if (!IconComponent) return null
                  
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={`icon-picker-option ${value === iconName ? 'selected' : ''}`}
                      onClick={() => handleSelect(iconName)}
                      title={iconName}
                    >
                      <IconComponent size={24} />
                      <span className="icon-picker-option-name">{iconName}</span>
                    </button>
                  )
                })
              ) : (
                <div className="icon-picker-empty">
                  No icons found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="hidden"
        name="icon"
        value={value || ''}
      />
    </div>
  )
}

export default IconPicker

