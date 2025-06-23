'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/utils'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedUser = getLocalStorage('sumsip_user')
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // In a real app, you would verify credentials against a backend
    // For demo purposes, we'll just create a mock user
    const newUser = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      avatar: null
    }
    
    setUser(newUser)
    setLocalStorage('sumsip_user', newUser)
    return newUser
  }

  const signup = (email, password, name) => {
    // In a real app, you would create a user in your backend
    const newUser = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      avatar: null
    }
    
    setUser(newUser)
    setLocalStorage('sumsip_user', newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
    removeLocalStorage('sumsip_user')
  }

  const updateProfile = (data) => {
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    setLocalStorage('sumsip_user', updatedUser)
    return updatedUser
  }

  const authValues = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)