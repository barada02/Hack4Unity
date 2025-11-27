// Artifact types matching backend models
export interface Artifact {
  _id: string
  artifactId: string
  userId: string
  title: string
  expression: string
  imageUrl?: string
  format: 'png' | 'gif'
  status: 'draft' | 'published'
  likes: string[]
  comments: Comment[]
  tags?: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  // Computed fields
  likesCount: number
  isLikedByUser?: boolean
  author?: {
    displayName: string
    avatarUrl?: string
  }
}

export interface Comment {
  _id: string
  userId: string
  userName: string
  comment: string
  createdAt: string
}

export interface ArtifactInput {
  title: string
  expression: string
  format?: 'png' | 'gif'
  tags?: string[]
}

export interface ArtifactGenerationResponse {
  success: boolean
  message: string
  data?: {
    artifactId: string
    imageUrl: string
    expression: string
    format: string
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
  pagination?: {
    page: number
    limit: number
    hasMore: boolean
  }
}