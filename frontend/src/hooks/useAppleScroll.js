import { useEffect, useRef, useState, useCallback } from 'react'

// Scroll progress for background
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafId = useRef(null)
  const lastProgress = useRef(0)

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      const maxScroll = documentHeight - windowHeight
      const rawProgress = maxScroll > 0 ? scrollTop / maxScroll : 0
      
      // Smooth progress changes
      const smoothedProgress = lastProgress.current * 0.9 + rawProgress * 0.1
      lastProgress.current = smoothedProgress
      
      setProgress(Math.min(Math.max(smoothedProgress, 0), 1))
      rafId.current = requestAnimationFrame(updateProgress)
    }

    rafId.current = requestAnimationFrame(updateProgress)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return progress
}

// Hard scroll reveal - appears, stays for 100vh, then fades out
export function useStickyReveal(options = {}) {
  const elementRef = useRef(null)
  const [opacity, setOpacity] = useState(0)
  const sectionStartRef = useRef(null)
  const rafId = useRef(null)

  const {
    delay = 0
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const updateVisibility = () => {
      if (!element) return

      const rect = element.getBoundingClientRect()
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Get section's initial position
      if (sectionStartRef.current === null) {
        sectionStartRef.current = rect.top + scrollY
      }
      
      const sectionStart = sectionStartRef.current
      const sectionEnd = sectionStart + windowHeight
      
      // Calculate scroll progress within the 100vh zone
      if (scrollY < sectionStart) {
        // Before section - invisible
        setOpacity(0)
      } else if (scrollY >= sectionStart && scrollY < sectionEnd) {
        // Within 100vh zone - calculate fade in/out
        const progress = (scrollY - sectionStart) / windowHeight
        
        // Fade in quickly (first 10% of scroll)
        if (progress < 0.1) {
          setOpacity(Math.min(progress / 0.1, 1))
        } 
        // Stay fully visible (10% to 90%)
        else if (progress >= 0.1 && progress < 0.9) {
          setOpacity(1)
        }
        // Fade out (last 10% of scroll)
        else {
          setOpacity(1 - ((progress - 0.9) / 0.1))
        }
      } else {
        // Past section - invisible
        setOpacity(0)
      }
    }

    const handleScroll = () => {
      if (rafId.current) return
      rafId.current = requestAnimationFrame(() => {
        updateVisibility()
        rafId.current = null
      })
    }

    // Initial check with delay
    const initTimeout = setTimeout(() => {
      updateVisibility()
    }, delay)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateVisibility, { passive: true })
    
    updateVisibility()

    return () => {
      clearTimeout(initTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateVisibility)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [delay])

  return [elementRef, opacity > 0.5, opacity]
}

// Sticky parallax - sticks for 100vh then moves
export function useStickyParallax(speed = 0.5) {
  const elementRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const rafId = useRef(null)
  const sectionStartRef = useRef(null)

  useEffect(() => {
    const updateParallax = () => {
      if (!elementRef.current) {
        rafId.current = requestAnimationFrame(updateParallax)
        return
      }

      const rect = elementRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Get section's initial position
      if (sectionStartRef.current === null) {
        sectionStartRef.current = rect.top + scrollY
      }
      
      const sectionStart = sectionStartRef.current
      const sectionEnd = sectionStart + windowHeight
      
      // Check if we're in the sticky zone (100vh)
      if (scrollY >= sectionStart && scrollY < sectionEnd) {
        // Section is stuck - no parallax
        setOffset(0)
      } else if (scrollY >= sectionEnd) {
        // Scrolled past sticky zone - apply parallax
        const scrolledPast = scrollY - sectionEnd
        setOffset(scrolledPast * speed)
      } else {
        // Before section - no offset
        setOffset(0)
      }
      
      rafId.current = requestAnimationFrame(updateParallax)
    }

    rafId.current = requestAnimationFrame(updateParallax)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [speed])

  return [elementRef, offset]
}

// Mobile detection hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
