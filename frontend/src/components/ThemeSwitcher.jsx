import React from 'react'
import { Sun, Moon, Eye } from 'lucide-react'
import useTheme from '../hooks/useTheme'

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-switcher">
      <button 
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => setTheme('light')}
        aria-label="Light theme"
        title="Light theme"
      >
        <Sun size={18} />
      </button>
      <button 
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <Moon size={18} />
      </button>
      <button 
        className={`theme-btn ${theme === 'eye' ? 'active' : ''}`}
        onClick={() => setTheme('eye')}
        aria-label="Eye protection theme"
        title="Eye protection"
      >
        <Eye size={18} />
      </button>
    </div>
  )
}

export default ThemeSwitcher
