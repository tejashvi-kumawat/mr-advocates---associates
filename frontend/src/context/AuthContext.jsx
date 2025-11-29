import React, { createContext, useState, useEffect, useContext } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp > currentTime) {
          setUser(decoded)
        } else {
          refreshToken()
        }
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      const { access, refresh } = response.data
      
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
      
      const decoded = jwtDecode(access)
      setUser(decoded)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) {
      logout()
      return
    }

    try {
      const response = await api.post('/auth/refresh/', { refresh })
      const { access } = response.data
      
      localStorage.setItem('accessToken', access)
      const decoded = jwtDecode(access)
      setUser(decoded)
    } catch (error) {
      logout()
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
