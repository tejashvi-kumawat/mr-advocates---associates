import React from 'react'
import { CheckSquare, Square } from 'lucide-react'

function SelectionModeControls({ selectionMode, onToggle, onSelectAll, onClear, hasItems = true }) {
  return (
    <div className="selection-mode-controls">
      <button
        onClick={onToggle}
        className={`btn btn-compact ${selectionMode ? 'btn-primary' : 'btn-secondary'}`}
      >
        {selectionMode ? <CheckSquare size={16} /> : <Square size={16} />}
        <span>{selectionMode ? 'Selection Mode' : 'Select'}</span>
      </button>
      {selectionMode && hasItems && (
        <>
          <button onClick={onSelectAll} className="btn btn-secondary btn-compact">
            Select All
          </button>
          <button onClick={onClear} className="btn btn-secondary btn-compact">
            Clear
          </button>
        </>
      )}
    </div>
  )
}

export default SelectionModeControls

