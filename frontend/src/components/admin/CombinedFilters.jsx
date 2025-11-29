import React, { useRef, useEffect, useState } from 'react'
import { Filter, X } from 'lucide-react'

function CombinedFilters({
  filtersOpen,
  onToggle,
  filterValue,
  onFilterChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  letterFilter,
  onLetterChange,
  categories = [],
  filterOptions = [],
  onClearAll
}) {
  const hasActiveFilters = filterValue || categoryFilter || dateFilter || letterFilter
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current && filtersOpen) {
        const rect = containerRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY + 8,
          right: window.innerWidth - rect.right
        })
      }
    }

    if (filtersOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [filtersOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onToggle()
      }
    }

    if (filtersOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [filtersOpen, onToggle])

  return (
    <>
      <div className="admin-filters-container" ref={containerRef}>
        <button
          className="admin-filter-toggle"
          onClick={onToggle}
          aria-label="Toggle filters"
        >
          <Filter size={18} />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="filter-badge" />
          )}
        </button>
      </div>
      
      {filtersOpen && (
        <div 
          className="admin-filters-dropdown"
          ref={dropdownRef}
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`
          }}
        >
          <div className="admin-filters-combined">
          {filterOptions.length > 0 && (
            <div className="admin-filter-box">
              <label className="admin-filter-label">Status</label>
              <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
                className="admin-filter-select"
              >
                <option value="">All Status</option>
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {categories.length > 0 && (
            <div className="admin-filter-box">
              <label className="admin-filter-label">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="admin-filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="admin-filter-box">
            <label className="admin-filter-label">Date</label>
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="admin-filter-select"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="admin-filter-box">
            <label className="admin-filter-label">Letter (A-Z)</label>
            <select
              value={letterFilter}
              onChange={(e) => onLetterChange(e.target.value)}
              className="admin-filter-select"
            >
              <option value="">All Letters</option>
              {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(letter => (
                <option key={letter} value={letter}>{letter}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="btn btn-secondary btn-compact"
              style={{ alignSelf: 'flex-end' }}
            >
              <X size={16} />
              Clear All
            </button>
          )}
          </div>
        </div>
      )}
    </>
  )
}

export default CombinedFilters

