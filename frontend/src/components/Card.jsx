import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

function Card({ icon, title, description, link, linkText = "Learn more →" }) {
  // Check if icon is a Lucide icon name (string without emoji) or an emoji
  const isLucideIcon = icon && typeof icon === 'string' && !/[\u{1F300}-\u{1F9FF}]/u.test(icon)
  
  return (
    <div className="card">
      {icon && (
        <span className="card-icon">
          {isLucideIcon ? (
            <Icon name={icon} size={48} color="currentColor" />
          ) : (
            <span>{icon}</span>
          )}
        </span>
      )}
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      {link && <Link to={link} className="card-link">{linkText}</Link>}
    </div>
  )
}

export default Card
