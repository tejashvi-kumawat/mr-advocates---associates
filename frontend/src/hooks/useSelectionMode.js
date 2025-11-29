import { useState, useRef } from 'react'
import { useHapticFeedback } from './useHapticFeedback'

export function useSelectionMode() {
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [selectionMode, setSelectionMode] = useState(false)
  const longPressTimer = useRef(null)
  const { vibrate } = useHapticFeedback()

  const handleLongPressStart = (id) => {
    longPressTimer.current = setTimeout(() => {
      vibrate([10, 50, 10])
      setSelectionMode(true)
      setSelectedItems(prev => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleRowClick = (id, e, onRowClick) => {
    if (e.target.closest('.drag-handle') || e.target.closest('.actions-dropdown')) {
      return
    }
    
    if (selectionMode) {
      setSelectedItems(prev => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
          vibrate([5])
        }
        return next
      })
    } else if (onRowClick) {
      onRowClick(id, e)
    }
  }

  const handleSelectAll = (items) => {
    setSelectionMode(true)
    setSelectedItems(new Set(items.map(item => item.id)))
    vibrate([10, 50, 10])
  }

  const handleClearSelection = () => {
    setSelectedItems(new Set())
    setSelectionMode(false)
  }

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    if (!selectionMode) {
      vibrate([5])
    } else {
      setSelectedItems(new Set())
    }
  }

  return {
    selectedItems,
    selectionMode,
    handleLongPressStart,
    handleLongPressEnd,
    handleRowClick,
    handleSelectAll,
    handleClearSelection,
    toggleSelectionMode,
    setSelectedItems: (items) => {
      if (items instanceof Set) {
        setSelectedItems(items)
      } else if (Array.isArray(items)) {
        setSelectedItems(new Set(items))
      }
    }
  }
}

