import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthService } from '../services/authService'
import type { User, LoginCredentials, RegisterData } from '../types/auth'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => Promise<void>
  deleteAccount: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and get profile
    const initializeAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const currentUser = await AuthService.getProfile()
          setUser(currentUser)
        } catch (error) {
          console.error('Failed to get user profile:', error)
          // Clear invalid tokens
          AuthService.logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const authResponse = await AuthService.login(credentials)
      setUser(authResponse.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      const newUser = await AuthService.register(data)
      // After registration, automatically log in
      await login({ email: data.email, password: data.password })
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await AuthService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user state even if logout request fails
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    try {
      const updatedUser = await AuthService.updateProfile(updates)
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      await AuthService.deleteAccount()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    loading,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}