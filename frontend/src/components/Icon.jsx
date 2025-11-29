import React from 'react'
import * as LucideIcons from 'lucide-react'

/**
 * Icon component wrapper for Lucide React icons
 * Usage: <Icon name="Search" size={24} color="currentColor" />
 */
function Icon({ name, size = 24, color = 'currentColor', className = '', strokeWidth = 2, ...props }) {
  const IconComponent = LucideIcons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`)
    return null
  }
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  )
}

export default Icon

