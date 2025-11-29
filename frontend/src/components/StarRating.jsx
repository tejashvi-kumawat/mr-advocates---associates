import React from 'react'
import { Star } from 'lucide-react'
import '../styles/star-rating.css'

/**
 * StarRating component to display ratings with SVG stars
 * Usage: <StarRating rating={5} size={20} />
 */
function StarRating({ rating, size = 20, showNumber = false, className = '' }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  return (
    <div className={`star-rating ${className}`}>
      <div className="star-rating-stars">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                size={size}
                className="star-rating-star star-rating-star-filled"
                fill="currentColor"
              />
            )
          } else if (index === fullStars && hasHalfStar) {
            return (
              <Star
                key={index}
                size={size}
                className="star-rating-star star-rating-star-half"
              />
            )
          } else {
            return (
              <Star
                key={index}
                size={size}
                className="star-rating-star star-rating-star-empty"
              />
            )
          }
        })}
      </div>
      {showNumber && <span className="star-rating-number">{rating}</span>}
    </div>
  )
}

export default StarRating

