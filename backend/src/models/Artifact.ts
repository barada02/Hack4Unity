import { ObjectId } from 'mongodb'

export interface Artifact {
  _id?: ObjectId
  artifactId: string // unique identifier (mix of username + timestamp + random)
  userId: ObjectId
  title: string
  expression: string // Wolfram expression
  imageUrl?: string // Cloud storage URL
  format: 'png' | 'gif'
  status: 'draft' | 'published'
  likes: ObjectId[] // array of user IDs who liked
  comments: Comment[]
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface Comment {
  _id?: ObjectId
  userId: ObjectId
  userName: string // denormalized for performance
  comment: string
  createdAt: Date
}

export interface ArtifactInput {
  title: string
  expression: string
  format?: 'png' | 'gif'
  tags?: string[]
}

export interface ArtifactResponse {
  _id: string
  artifactId: string
  userId: string
  title: string
  expression: string
  imageUrl?: string
  format: string
  status: string
  likes: string[]
  comments: CommentResponse[]
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  // Additional computed fields for frontend
  likesCount: number
  isLikedByUser?: boolean
  author?: {
    displayName: string
    avatarUrl?: string
  }
}

export interface CommentResponse {
  _id: string
  userId: string
  userName: string
  comment: string
  createdAt: Date
}

export interface ArtifactGenerationRequest {
  expression: string
  format: 'png' | 'gif'
  artifact_id: string
}

export interface ArtifactGenerationResponse {
  success: boolean
  artifact_id: string
  expression: string
  format: string
  image_url?: string
  gcs_path?: string
  timestamp: string
  error?: string
}