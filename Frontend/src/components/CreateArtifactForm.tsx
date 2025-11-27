import React, { useState } from 'react'
import { artifactApi } from '../services/artifactApi'
import type { ArtifactInput } from '../types/artifact'

interface CreateArtifactFormProps {
  onSuccess?: (artifactId: string) => void
  onCancel?: () => void
}

export const CreateArtifactForm: React.FC<CreateArtifactFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ArtifactInput>({
    title: '',
    expression: '',
    format: 'png',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [createdArtifactId, setCreatedArtifactId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleCreateArtifact = async () => {
    if (!formData.title.trim() || !formData.expression.trim()) {
      setError('Title and expression are required')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const response = await artifactApi.create(formData)
      
      if (response.success && response.data) {
        setCreatedArtifactId(response.data.artifactId)
        // Auto-generate the image
        await handleGenerateImage(response.data.artifactId)
      } else {
        setError(response.message || 'Failed to create artifact')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create artifact')
    } finally {
      setIsCreating(false)
    }
  }

  const handleGenerateImage = async (artifactId: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await artifactApi.generate(artifactId)
      
      if (response.success && response.data) {
        setGeneratedImage(response.data.imageUrl)
      } else {
        setError(response.message || 'Failed to generate image')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!createdArtifactId) return

    try {
      const response = await artifactApi.publish(createdArtifactId)
      
      if (response.success) {
        onSuccess?.(createdArtifactId)
      } else {
        setError(response.message || 'Failed to publish artifact')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish artifact')
    }
  }

  const handleReset = () => {
    setFormData({
      title: '',
      expression: '',
      format: 'png',
      tags: []
    })
    setTagInput('')
    setGeneratedImage(null)
    setCreatedArtifactId(null)
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Unity Artifact</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
            placeholder="e.g., 'Sine Wave Harmony' or 'Cultural Pattern'"
            disabled={isCreating || createdArtifactId !== null}
          />
        </div>

        {/* Expression */}
        <div>
          <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-1">
            Wolfram Expression *
          </label>
          <textarea
            id="expression"
            name="expression"
            value={formData.expression}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 resize-vertical"
placeholder="Enter Wolfram Language expression (e.g., Plot[Sin[x], {x, 0, 2 Pi}])"
            disabled={isCreating || createdArtifactId !== null}
          />
          <div className="text-xs text-gray-500 mt-2">
            <p className="font-medium mb-1">Examples:</p>
            <ul className="space-y-1 ml-2">
              <li>• Plot[Sin[x], &#123;x, 0, 2 Pi&#125;] - sine wave plot</li>
              <li>• ListPlot[RandomReal[1, 20]] - random data points</li>
              <li>• Graphics3D[Sphere[]] - 3D sphere</li>
              <li>• WordCloud[&#123;"unity", "peace", "harmony"&#125;] - word cloud</li>
            </ul>
          </div>
        </div>

        {/* Format */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
            Output Format
          </label>
          <select
            id="format"
            name="format"
            value={formData.format}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white cursor-pointer"
            disabled={isCreating || createdArtifactId !== null}
          >
            <option value="png">PNG Image</option>
            <option value="gif">GIF Animation</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              placeholder="Add tags (press Enter)"
              disabled={isCreating || createdArtifactId !== null}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!tagInput.trim() || isCreating || createdArtifactId !== null}
            >
              Add
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    disabled={createdArtifactId !== null}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!createdArtifactId ? (
            <>
              <button
                type="button"
                onClick={handleCreateArtifact}
                disabled={isCreating || !formData.title.trim() || !formData.expression.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  'Create & Generate'
                )}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isGenerating || !generatedImage}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Publish Artifact
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                Create Another
              </button>
            </>
          )}
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="inline-flex items-center text-blue-700">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="font-medium">Generating image with Wolfram...</span>
            </div>
            <p className="text-sm text-blue-600 mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Generated Image Preview */}
        {generatedImage && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Generated Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img
                src={generatedImage}
                alt="Generated artifact"
                className="max-w-full h-auto mx-auto rounded"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}