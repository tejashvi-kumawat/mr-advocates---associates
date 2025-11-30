import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
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

  const handleDropdownToggle = (dropdown, e) => {
    e.stopPropagation()
    // Toggle dropdown - if same dropdown is clicked, close it; otherwise open new one
    if (activeDropdown === dropdown) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(dropdown)
    }
  }

  const handleDropdownMouseEnter = (dropdown) => {
    // Only auto-open on hover for desktop (width > 768px)
    if (window.innerWidth > 768) {
      setActiveDropdown(dropdown)
    }
  }

  const handleDropdownMouseLeave = (e) => {
    // Only auto-close on hover for desktop
    if (window.innerWidth > 768) {
      const dropdown = e.currentTarget
      const relatedTarget = e.relatedTarget
      
      // If moving to a child element (dropdown menu), don't close
      if (relatedTarget && dropdown.contains(relatedTarget)) {
        return
      }
      
      // Add delay to allow moving to dropdown
      setTimeout(() => {
        const activeDropdownEl = dropdownRefs.current[activeDropdown]
        if (activeDropdownEl && !activeDropdownEl.matches(':hover')) {
          setActiveDropdown(null)
        }
      }, 200)
    }
  }

  // Close dropdown when clicking on a link
  const handleDropdownLinkClick = () => {
    setActiveDropdown(null)
    closeMenu()
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img 
            src="/logo.png" 
            alt="M.R. Advocates & Associates" 
            className="navbar-brand-logo"
          />
          <div className="navbar-brand-text">
            <div className="navbar-brand-main">
              <span className="navbar-brand-line1">M.R. Advocates</span>
              <span className="navbar-brand-line2">& Associates</span>
            </div>
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
              onClick={(e) => handleDropdownToggle('services', e)}
            >
              Services <ChevronDown size={16} />
            </button>
            <ul 
              className={`dropdown-menu ${activeDropdown === 'services' ? 'active' : ''}`}
              onMouseEnter={() => handleDropdownMouseEnter('services')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <li><Link to="/practice-areas" onClick={handleDropdownLinkClick}>Practice Areas</Link></li>
              <li><Link to="/services" onClick={handleDropdownLinkClick}>Our Services</Link></li>
              <li><Link to="/case-studies" onClick={handleDropdownLinkClick}>Case Studies</Link></li>
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
              onClick={(e) => handleDropdownToggle('about', e)}
            >
              About <ChevronDown size={16} />
            </button>
            <ul 
              className={`dropdown-menu ${activeDropdown === 'about' ? 'active' : ''}`}
              onMouseEnter={() => handleDropdownMouseEnter('about')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <li><Link to="/about" onClick={handleDropdownLinkClick}>About Us</Link></li>
              <li><Link to="/team" onClick={handleDropdownLinkClick}>Our Team</Link></li>
              <li><Link to="/testimonials" onClick={handleDropdownLinkClick}>Testimonials</Link></li>
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
