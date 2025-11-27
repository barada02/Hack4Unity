import { ArtifactGenerationRequest, ArtifactGenerationResponse } from '../models/Artifact'

export class CloudStorageService {
  private static cloudRunUrl = process.env.CLOUD_RUN_SERVICE_URL

  static async generateArtifact(
    expression: string, 
    format: 'png' | 'gif', 
    artifactId: string
  ): Promise<ArtifactGenerationResponse> {
    if (!this.cloudRunUrl) {
      throw new Error('CLOUD_RUN_SERVICE_URL environment variable not set')
    }

    const requestData: ArtifactGenerationRequest = {
      expression,
      format,
      artifact_id: artifactId
    }

    try {
      const response = await fetch(`${this.cloudRunUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
        // Timeout for Wolfram processing (2 minutes)
        signal: AbortSignal.timeout(120000)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json() as ArtifactGenerationResponse
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          throw new Error('Artifact generation timed out. Please try a simpler expression.')
        }
        throw error
      }
      throw new Error('Unknown error occurred during artifact generation')
    }
  }

  static generateArtifactId(userId: string, displayName?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const userPrefix = displayName 
      ? displayName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8)
      : userId.substring(0, 8)
    
    return `${userPrefix}_${timestamp}_${random}`
  }
}