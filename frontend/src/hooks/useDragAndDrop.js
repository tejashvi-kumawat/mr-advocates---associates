import { useState } from 'react'

export function useDragAndDrop(items, updateOrderCallback) {
  const [draggedItem, setDraggedItem] = useState(null)

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetItem) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null)
      return
    }

    const newItems = [...items]
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id)
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id)

    newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    if (updateOrderCallback) {
      updateOrderCallback(updatedItems)
    }

    setDraggedItem(null)
    return updatedItems
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  }
}

