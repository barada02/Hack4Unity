import { getAuthHeaders, getJsonHeaders } from './authApi'
import type { Artifact, ArtifactInput, ArtifactGenerationResponse, ApiResponse } from '../types/artifact'

const API_BASE_URL = 'http://localhost:3001'

export const artifactApi = {
  // Create a new artifact (draft)
  create: async (artifactData: ArtifactInput): Promise<ApiResponse<Artifact>> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts`, {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(artifactData)
    })
    return response.json()
  },

  // Generate image for an artifact
  generate: async (artifactId: string): Promise<ArtifactGenerationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts/${artifactId}/generate`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Publish an artifact
  publish: async (artifactId: string): Promise<ApiResponse<Artifact>> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts/${artifactId}/publish`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get user's artifacts
  getUserArtifacts: async (): Promise<ApiResponse<Artifact[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts/my-artifacts`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get published artifacts (showcase)
  getPublished: async (page = 1, limit = 10): Promise<ApiResponse<Artifact[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts/published?page=${page}&limit=${limit}`)
    return response.json()
  },

  // Like/unlike an artifact
  toggleLike: async (artifactId: string): Promise<ApiResponse<{ isLiked: boolean, likesCount: number }>> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts/${artifactId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Add comment to an artifact
  addComment: async (artifactId: string, comment: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/artifacts/${artifactId}/comments`, {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({ comment })
    })
    return response.json()
  }
}