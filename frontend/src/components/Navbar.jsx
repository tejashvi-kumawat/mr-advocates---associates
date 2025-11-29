import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Scale } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRefs = useRef({})

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setActiveDropdown(null)
        }
      })
    }

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown])

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const handleDropdownMouseEnter = (dropdown) => {
    if (window.innerWidth > 768) {
      setActiveDropdown(dropdown)
    }
  }

  const handleDropdownMouseLeave = (e) => {
    if (window.innerWidth > 768) {
      // Check if mouse is moving to dropdown menu
      const dropdown = e.currentTarget
      const relatedTarget = e.relatedTarget
      
      // If moving to a child element (dropdown menu), don't close
      if (relatedTarget && dropdown.contains(relatedTarget)) {
        return
      }
      
      // Add delay to allow moving to dropdown
      setTimeout(() => {
        // Double check if mouse is still not in dropdown area
        const activeDropdownEl = dropdownRefs.current[activeDropdown]
        if (activeDropdownEl && !activeDropdownEl.matches(':hover')) {
          setActiveDropdown(null)
        }
      }, 300)
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <Scale size={28} className="navbar-brand-icon" />
          <div className="navbar-brand-text">
            <span>M.R. Advocates </span>
            <span> & Associates</span>
            <span className="navbar-brand-subtitle">Jaipur, Rajasthan</span>
          </div>
        </Link>
        
        <button 
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li><NavLink to="/" className="navbar-link" onClick={closeMenu}>Home</NavLink></li>
          
          <li 
            className="navbar-dropdown"
            onMouseEnter={() => handleDropdownMouseEnter('services')}
            onMouseLeave={handleDropdownMouseLeave}
            ref={el => dropdownRefs.current.services = el}
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'services' ? 'active' : ''}`}
              onClick={() => handleDropdownToggle('services')}
            >
              Services <ChevronDown size={16} />
            </button>
            <ul 
              className={`dropdown-menu ${activeDropdown === 'services' ? 'active' : ''}`}
              onMouseEnter={() => handleDropdownMouseEnter('services')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <li><Link to="/practice-areas" onClick={closeMenu}>Practice Areas</Link></li>
              <li><Link to="/services" onClick={closeMenu}>Our Services</Link></li>
              <li><Link to="/case-studies" onClick={closeMenu}>Case Studies</Link></li>
            </ul>
          </li>

          <li 
            className="navbar-dropdown"
            onMouseEnter={() => handleDropdownMouseEnter('about')}
            onMouseLeave={handleDropdownMouseLeave}
            ref={el => dropdownRefs.current.about = el}
          >
            <button 
              className={`navbar-link dropdown-trigger ${activeDropdown === 'about' ? 'active' : ''}`}
              onClick={() => handleDropdownToggle('about')}
            >
              About <ChevronDown size={16} />
            </button>
            <ul 
              className={`dropdown-menu ${activeDropdown === 'about' ? 'active' : ''}`}
              onMouseEnter={() => handleDropdownMouseEnter('about')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/team" onClick={closeMenu}>Our Team</Link></li>
              <li><Link to="/testimonials" onClick={closeMenu}>Testimonials</Link></li>
            </ul>
          </li>

          <li><NavLink to="/legal-news" className="navbar-link" onClick={closeMenu}>News</NavLink></li>
          <li><NavLink to="/faq" className="navbar-link" onClick={closeMenu}>FAQ</NavLink></li>
          <li><NavLink to="/contact" className="navbar-link" onClick={closeMenu}>Contact</NavLink></li>
          <li className="navbar-theme-switcher"><ThemeSwitcher /></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
