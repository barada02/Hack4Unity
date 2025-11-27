import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, User, Profile, LoginResponse } from '../types/auth'
import { AuthAPI } from '../services/authApi'

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('unity-hub-token')
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isAuthenticated = !!user && !!token

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('unity-hub-token')
      
      if (savedToken) {
        try {
          // Verify token and get user data
          const userResponse = await AuthAPI.getCurrentUser(savedToken)
          if (userResponse.success) {
            setUser(userResponse.data)
            setToken(savedToken)
            
            // Try to get profile
            try {
              const profileResponse = await AuthAPI.getProfile(savedToken)
              if (profileResponse.success) {
                setProfile(profileResponse.data)
              }
            } catch (error) {
              console.log('No profile found:', error)
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          // Clear invalid token
          localStorage.removeItem('unity-hub-token')
          setToken(null)
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await AuthAPI.login(email, password)
      
      if (response.success) {
        const { user, token }: LoginResponse = response.data
        
        setUser(user)
        setToken(token)
        localStorage.setItem('unity-hub-token', token)

        // Try to get profile
        try {
          const profileResponse = await AuthAPI.getProfile(token)
          if (profileResponse.success) {
            setProfile(profileResponse.data)
          }
        } catch (error) {
          console.log('No profile found for user:', error)
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await AuthAPI.register(email, password)
      
      if (response.success) {
        const { user, token }: LoginResponse = response.data
        
        setUser(user)
        setToken(token)
        localStorage.setItem('unity-hub-token', token)
        // Profile will be null for new users
        setProfile(null)
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = (): void => {
    setUser(null)
    setProfile(null)
    setToken(null)
    localStorage.removeItem('unity-hub-token')
  }

  const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const response = await AuthAPI.updateProfile(token, profileData)
      
      if (response.success) {
        setProfile(response.data)
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error) {
      throw error
    }
  }

  const refreshProfile = async (): Promise<void> => {
    if (!token) return

    try {
      const response = await AuthAPI.getProfile(token)
      if (response.success) {
        setProfile(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}