import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { artifactApi } from '../services/artifactApi'
import type { Artifact } from '../types/artifact'
import { useAuth } from '../contexts/AuthProvider'

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

  const filteredArtifacts = artifacts.filter(artifact => {
    if (filter === 'all') return true
    if (filter === 'png') return artifact.format === 'png'
    if (filter === 'gif') return artifact.format === 'gif'
    return artifact.tags?.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
            <div 
              key={artifact._id} 
              className="bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden bg-slate-900">
                {artifact.imageUrl ? (
                  <img 
                    src={artifact.imageUrl} 
                    alt={artifact.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                    <span className="text-4xl opacity-50">🎨</span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h4 className="text-white font-semibold mb-3">Wolfram Expression:</h4>
                  <div className="bg-slate-900/90 rounded-lg p-3 text-xs text-green-400 font-mono max-h-32 overflow-y-auto">
                    {artifact.expression}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-300">
                      Format: {artifact.format.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-300">
                      {formatDate(artifact.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                  {artifact.title}
                </h3>
                
                {/* Tags */}
                {artifact.tags && artifact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {artifact.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {artifact.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                        +{artifact.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {artifact.author?.displayName?.[0] || 'U'}
                    </div>
                    <span className="text-xs text-slate-400">
                      {artifact.author?.displayName || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="text-xs flex items-center">
                      ❤️ {artifact.likesCount || 0}
                    </span>
                    <span className="text-xs flex items-center">
                      💬 {artifact.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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