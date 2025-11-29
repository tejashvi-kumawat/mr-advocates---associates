import { useEffect, useRef, useState } from 'react'

export function useParallax(speed = 0.5) {
  const elementRef = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return
      
      const rect = elementRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const elementTop = rect.top + scrollY
      const windowHeight = window.innerHeight
      
      // Calculate parallax offset
      const scrolled = scrollY + windowHeight
      const parallax = (scrolled - elementTop) * speed
      
      setOffset(parallax)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return [elementRef, offset]
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = scrolled / windowHeight
      setScrollProgress(Math.min(Math.max(progress, 0), 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}

export function useElementScrollProgress() {
  const elementRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height
      
      const elementTop = rect.top
      const elementBottom = rect.bottom
      
      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const scrolled = windowHeight - elementTop
      const total = windowHeight + elementHeight
      const progressValue = Math.min(Math.max(scrolled / total, 0), 1)
      
      setProgress(progressValue)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return [elementRef, progress]
}

