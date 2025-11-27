// User types matching backend models
export interface User {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Profile {
  _id: string
  userId: string
  displayName: string
  bio?: string
  country?: string
  interests?: string[]
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

// Auth context types
export interface AuthContextType {
  user: User | null
  profile: Profile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (profileData: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}