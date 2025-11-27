import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Profile, AuthContextType, LoginResponse, ApiResponse } from '../types/auth'
import { AuthAPI } from '../services/authApi'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('unity-hub-token'))
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!token

  // Initialize auth state on app start
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
            
            // Try to get profile (might not exist yet)
            try {
              const profileResponse = await AuthAPI.getProfile(savedToken)
              if (profileResponse.success) {
                setProfile(profileResponse.data)
              }
            } catch (error) {
              // Profile doesn't exist yet, that's ok
              console.log('No profile found (this is normal for new users)')
            }
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('unity-hub-token')
            setToken(null)
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('unity-hub-token')
          setToken(null)
          console.error('Auth initialization error:', error)
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response: ApiResponse<LoginResponse> = await AuthAPI.login(email, password)
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data
        
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('unity-hub-token', userToken)
        
        // Try to get profile
        try {
          const profileResponse = await AuthAPI.getProfile(userToken)
          if (profileResponse.success) {
            setProfile(profileResponse.data)
          }
        } catch (error) {
          // Profile doesn't exist yet
          setProfile(null)
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response: ApiResponse<LoginResponse> = await AuthAPI.register(email, password)
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data
        
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('unity-hub-token', userToken)
        setProfile(null) // New user won't have profile yet
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
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
      const response: ApiResponse<Profile> = await AuthAPI.updateProfile(token, profileData)
      
      if (response.success && response.data) {
        setProfile(response.data)
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const refreshProfile = async (): Promise<void> => {
    if (!token) return

    try {
      const response: ApiResponse<Profile> = await AuthAPI.getProfile(token)
      if (response.success && response.data) {
        setProfile(response.data)
      }
    } catch (error) {
      console.error('Profile refresh error:', error)
      // Don't throw error for refresh failures
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
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}