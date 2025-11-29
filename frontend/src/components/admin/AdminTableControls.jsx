import React, { useState } from 'react'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

function AdminTableControls({ 
  searchValue, 
  onSearchChange, 
  filterValue, 
  onFilterChange, 
  filterOptions = [],
  selectedCount = 0,
  onSelectAll,
  onClearSelection,
  showSelect = true,
  onFiltersToggle
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const handleToggle = () => {
    const newState = !filtersOpen
    setFiltersOpen(newState)
    if (onFiltersToggle) {
      onFiltersToggle(newState)
    }
  }

  return (
    <div className="admin-table-controls">
      <div className="admin-controls-left">
        {showSelect && (
          <div className="admin-select-controls">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={selectedCount > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelectAll?.()
                  } else {
                    onClearSelection?.()
                  }
                }}
                className="admin-checkbox"
              />
              <span>Select All ({selectedCount})</span>
            </label>
          </div>
        )}
      </div>
      
      <div className="admin-controls-right">
        <div className="admin-search-box">
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="admin-search-input"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="admin-search-clear"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {filterOptions.length > 0 && (
          <>
            <button
              className="admin-filter-toggle"
              onClick={handleToggle}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
              {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <div className={`admin-filters-collapsible ${filtersOpen ? 'filters-open' : ''}`}>
              <div className="admin-filter-box">
                <Filter size={18} className="admin-filter-icon" />
                <select
                  value={filterValue}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="">All</option>
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminTableControls

