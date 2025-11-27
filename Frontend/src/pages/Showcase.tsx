import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { artifactApi } from '../services/artifactApi'
import type { Artifact } from '../types/artifact'
import { useAuth } from '../contexts/AuthProvider'
import { ArtifactCard } from '../components/ArtifactCard'

export default function Showcase() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Show success message if redirected from create page
  const successMessage = location.state?.message

  useEffect(() => {
    fetchArtifacts()
  }, [])

  const fetchArtifacts = async () => {
    try {
      setLoading(true)
      const response = await artifactApi.getPublished()
      if (response.success && response.data) {
        setArtifacts(response.data)
      } else {
        setError(response.message || 'Failed to load artifacts')
      }
    } catch (err) {
      setError('Failed to load artifacts')
      console.error('Error fetching artifacts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleArtifactUpdate = (updatedArtifact: Artifact) => {
    setArtifacts(prevArtifacts => 
      prevArtifacts.map(artifact => 
        artifact._id === updatedArtifact._id ? updatedArtifact : artifact
      )
    )
  }

  const filteredArtifacts = artifacts.filter(artifact => {
    if (filter === 'all') return true
    if (filter === 'png') return artifact.format === 'png'
    if (filter === 'gif') return artifact.format === 'gif'
    return artifact.tags?.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    )
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Creative Showcase</h1>
          <p className="text-slate-400 text-lg">
            Discover unity artifacts created by our community
          </p>
        </div>
        {isAuthenticated && (
          <Link 
            to="/create"
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create Artifact
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all' 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'border border-slate-700 hover:border-slate-600'
          }`}
        >
          All ({artifacts.length})
        </button>
        <button 
          onClick={() => setFilter('png')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'png' 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'border border-slate-700 hover:border-slate-600'
          }`}
        >
          Images
        </button>
        <button 
          onClick={() => setFilter('gif')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'gif' 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'border border-slate-700 hover:border-slate-600'
          }`}
        >
          Animations
        </button>
        <button 
          onClick={() => setFilter('unity')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'unity' 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'border border-slate-700 hover:border-slate-600'
          }`}
        >
          Unity
        </button>
        <button 
          onClick={() => setFilter('peace')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'peace' 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'border border-slate-700 hover:border-slate-600'
          }`}
        >
          Peace
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-400">Loading artifacts...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            onClick={fetchArtifacts}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && artifacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">No artifacts yet</h3>
          <p className="text-slate-400 mb-6">Be the first to create and share a unity artifact!</p>
          {isAuthenticated && (
            <Link 
              to="/create"
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block"
            >
              Create First Artifact
            </Link>
          )}
        </div>
      )}

      {/* Artifact Grid */}
      {!loading && !error && filteredArtifacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtifacts.map((artifact) => (
            <ArtifactCard 
              key={artifact._id}
              artifact={artifact}
              onUpdate={handleArtifactUpdate}
            />
          ))}
        </div>
      )}

      {/* Filtered Empty State */}
      {!loading && !error && artifacts.length > 0 && filteredArtifacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No artifacts match this filter</h3>
          <p className="text-slate-400 mb-6">Try selecting a different filter or create a new artifact.</p>
          <button 
            onClick={() => setFilter('all')}
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            Show All Artifacts
          </button>
        </div>
      )}
    </div>
  )
}