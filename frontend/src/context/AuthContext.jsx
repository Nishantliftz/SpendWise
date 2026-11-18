import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        try {
          const res = await api.get('/users/profile')
          setUser(res.data.data)
          setToken(storedToken)
        } catch {
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          setToken(null)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await authService.login({ email, password })
    const { token: newToken, ...userData } = res.data.data
    localStorage.setItem('token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(userData)
    return res
  }

  const register = async (dataOrFullName, email, password) => {
    const payload = typeof dataOrFullName === 'object'
      ? dataOrFullName
      : { fullName: dataOrFullName, email, password }

    const res = await authService.register(payload)
    const { token: newToken, ...userData } = res.data.data
    localStorage.setItem('token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(userData)
    return res
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  const updateUser = (userData) => setUser(prev => ({ ...prev, ...userData }))

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
